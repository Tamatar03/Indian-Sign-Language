from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from inference import SignLanguageDetector
import os

app = Flask(__name__)
CORS(app)

# Initialize Detector Global
# Adjust path relative to where you run the server
CHECKPOINT_PATH = os.path.join(os.path.dirname(__file__), "checkpoints", "104_model.pt")
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json") # Optional if you have it
detector = None

try:
    print(f"Loading model from {CHECKPOINT_PATH}...")
    detector = SignLanguageDetector(checkpoint_path=CHECKPOINT_PATH, confidence_threshold=0.8)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Failed to load model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    if detector is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        image_data = data.get('image')
        
        if not image_data:
            return jsonify({'error': 'No image provided'}), 400

        # Decode base64
        # Format usually: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        if ',' in image_data:
            header, encoded = image_data.split(',', 1)
        else:
            encoded = image_data
            
        nparr = np.frombuffer(base64.b64decode(encoded), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
             return jsonify({'error': 'Failed to decode image'}), 400

        results = detector.predict(img)
        return jsonify(results)

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'model_loaded': detector is not None})

if __name__ == '__main__':
    # Run a simple threaded server
    app.run(host='0.0.0.0', port=5000, debug=True)
