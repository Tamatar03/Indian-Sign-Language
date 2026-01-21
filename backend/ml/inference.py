
import torch
import torch.nn as nn
from torchvision.models import resnet50, ResNet50_Weights
import cv2
import numpy as np
import albumentations as A
from albumentations.pytorch import ToTensorV2
import math
import os
import json

# -----------------------------------------------------------------------------
# Model Architecture (DETR)
# -----------------------------------------------------------------------------

def _get_1d_sincos_pos_embed(length: int, dim: int, temperature: float = 10000.0, device=None):
    assert dim % 2 == 0
    position = torch.arange(length, device=device, dtype=torch.float32).unsqueeze(1)
    div_term = torch.exp(torch.arange(0, dim, 2, device=device, dtype=torch.float32) * (-math.log(temperature) / dim))
    pe = torch.zeros(length, dim, device=device, dtype=torch.float32)
    pe[:, 0::2] = torch.sin(position * div_term)
    pe[:, 1::2] = torch.cos(position * div_term)
    return pe

def build_2d_sincos_position_embedding(height: int, width: int, dim: int, device=None):
    assert dim % 2 == 0, "positional dim must be even"
    dim_half = dim // 2
    pe_y = _get_1d_sincos_pos_embed(height, dim_half, device=device)
    pe_x = _get_1d_sincos_pos_embed(width, dim_half, device=device)
    pos = torch.zeros(height, width, dim, device=device, dtype=torch.float32)
    pos[:, :, :dim_half] = pe_y[:, None, :].expand(-1, width, -1)
    pos[:, :, dim_half:] = pe_x[None, :, :].expand(height, -1, -1)
    pos = pos.view(1, height * width, dim)
    return pos

class DETR(nn.Module):
    def __init__(self, num_classes, hidden_dim=256, nheads=8,
                 num_encoder_layers=1, num_decoder_layers=1, num_queries=25):
        super().__init__()
        self.backbone = resnet50(weights=ResNet50_Weights.IMAGENET1K_V1)
        self.backbone.fc = nn.Identity()
        self.conv = nn.Conv2d(2048, hidden_dim, 1)
        self.transformer = nn.Transformer(
            hidden_dim, nheads, num_encoder_layers, num_decoder_layers, batch_first=True, dropout=0.1)
        self.linear_class = nn.Linear(hidden_dim, num_classes + 1)
        self.linear_bbox = nn.Linear(hidden_dim, 4)
        self.num_queries = num_queries
        self.query_pos = nn.Parameter(torch.randn(self.num_queries, hidden_dim))
        self.norm_src = nn.LayerNorm(hidden_dim)
        self.norm_tgt = nn.LayerNorm(hidden_dim)

    def forward(self, inputs):
        x = self.backbone.conv1(inputs)
        x = self.backbone.bn1(x)
        x = self.backbone.relu(x)
        x = self.backbone.maxpool(x)
        x = self.backbone.layer1(x)
        x = self.backbone.layer2(x)
        x = self.backbone.layer3(x)
        x = self.backbone.layer4(x)
        feat = self.conv(x)
        bsz, d_model, Hf, Wf = feat.shape
        src = feat.flatten(2).permute(0, 2, 1)
        pos = build_2d_sincos_position_embedding(Hf, Wf, d_model, device=feat.device)
        src = self.norm_src(src + pos)
        tgt = torch.zeros(bsz, self.num_queries, d_model, device=feat.device)
        query_pos = self.query_pos.unsqueeze(0).expand(bsz, -1, -1)
        tgt = self.norm_tgt(tgt + query_pos)
        hs = self.transformer(src=src, tgt=tgt)
        return {
            'pred_logits': self.linear_class(hs),
            'pred_boxes': self.linear_bbox(hs).sigmoid()
        }

# -----------------------------------------------------------------------------
# Box Utilities
# -----------------------------------------------------------------------------

def box_cxcywh_to_xyxy(x):
    x_c, y_c, w, h = x.unbind(-1)
    b = [(x_c - 0.5 * w), (y_c - 0.5 * h),
         (x_c + 0.5 * w), (y_c + 0.5 * h)]
    return torch.stack(b, dim=-1)

def rescale_bboxes(out_bbox, size):
    img_w, img_h = size
    b = box_cxcywh_to_xyxy(out_bbox)
    b = b * torch.tensor([img_w, img_h, img_w, img_h], dtype=torch.float32)
    return b

# -----------------------------------------------------------------------------
# Inference Wrapper
# -----------------------------------------------------------------------------

class SignLanguageDetector:
    def __init__(self, checkpoint_path, config=None, device='cpu', confidence_threshold=0.8):
        """
        Args:
            checkpoint_path (str): Path to the model .pt file.
            config (dict or str, optional): Configuration dict or path to JSON. Defaults to simple 3 classes.
            device (str): 'cpu' or 'cuda'.
            confidence_threshold (float): Minimum confidence to report a detection.
        """
        self.device = torch.device(device)
        self.confidence_threshold = confidence_threshold
        
        # Load Config
        if config is None:
             self.classes = ["hello", "iloveyou", "thankyou"]
        elif isinstance(config, str) and os.path.exists(config):
            with open(config, 'r') as f:
                c = json.load(f)
                self.classes = c.get('classes', ["hello", "iloveyou", "thankyou"])
        elif isinstance(config, dict):
            self.classes = config.get('classes', ["hello", "iloveyou", "thankyou"])
        else:
            self.classes = ["hello", "iloveyou", "thankyou"]

        num_classes = len(self.classes)
        
        # Initialize Model
        self.model = DETR(num_classes=num_classes)
        self.model.to(self.device)
        self.model.eval()
        
        # Load Weights
        if os.path.exists(checkpoint_path):
            try:
                state_dict = torch.load(checkpoint_path, map_location=self.device)
                self.model.load_state_dict(state_dict)
                print(f"Model loaded successfully from {checkpoint_path}")
            except Exception as e:
                print(f"Error loading model: {e}")
                raise
        else:
             raise FileNotFoundError(f"Checkpoint not found at {checkpoint_path}")

        # Transforms
        self.transforms = A.Compose([
            A.Resize(224, 224),
            A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ToTensorV2()
        ])

    def predict(self, image_source):
        """
        Run inference on an image.
        Args:
            image_source (str or np.ndarray): File path or numpy image (BGR or RGB).
                                              Note: If numpy, assume BGR (cv2 default) if not specified, 
                                              but code converts to RGB.
        Returns:
            list of dicts: [{'label': 'hello', 'confidence': 0.95, 'box': [x1, y1, x2, y2]}]
        """
        # Load Image
        if isinstance(image_source, str):
            image = cv2.imread(image_source)
            if image is None:
                raise ValueError(f"Could not read image from {image_source}")
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        elif isinstance(image_source, np.ndarray):
             # Assume input is BGR (from cv2)
            image = cv2.cvtColor(image_source, cv2.COLOR_BGR2RGB)
        else:
            raise ValueError("Unsupported image source type")

        # Get original dimensions
        original_height, original_width = image.shape[:2]

        # Preprocess
        transformed = self.transforms(image=image)
        img_tensor = transformed['image'].unsqueeze(0).to(self.device)

        # Inference
        with torch.no_grad():
            outputs = self.model(img_tensor)

        # Post-process
        probas = outputs['pred_logits'].softmax(-1)[0, :, :-1]
        keep = probas.max(-1).values > self.confidence_threshold
        
        if not keep.any():
            return []

        # Convert boxes
        bboxes_scaled = rescale_bboxes(outputs['pred_boxes'][0, keep], (original_width, original_height))
        probas = probas[keep]
        
        results = []
        for prob, box in zip(probas, bboxes_scaled):
            cl = prob.argmax()
            results.append({
                'label': self.classes[cl.item()],
                'confidence': prob[cl].item(),
                'box': box.tolist() # [x1, y1, x2, y2]
            })
            
        return results

if __name__ == "__main__":
    # Example usage
    # Ensure you have a checkpoint at 'checkpoints/104_model.pt' or adjust path
    checkpoint = "checkpoints/104_model.pt"
    if os.path.exists(checkpoint):
        detector = SignLanguageDetector(checkpoint_path=checkpoint)
        # Dummy image for testing
        dummy_img = np.zeros((480, 640, 3), dtype=np.uint8)
        print("Running dummy prediction...")
        detections = detector.predict(dummy_img)
        print("Detections:", json.dumps(detections, indent=2))
    else:
        print(f"Checkpoint {checkpoint} not found. Please provide path.")
