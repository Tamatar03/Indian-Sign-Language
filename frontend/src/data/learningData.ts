export interface FlashcardItem {
  id: string;
  label: string;
  category: string;
  gifUrl: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: FlashcardItem[];
}

// Module 1: Alphabets (A-Z)
const alphabetsModule: Module = {
  id: 'alphabets',
  name: 'Alphabets',
  description: 'Learn ISL signs for A to Z',
  icon: '🔤',
  items: Array.from({ length: 26 }, (_, i) => ({
    id: `alphabet-${i}`,
    label: String.fromCharCode(65 + i),
    category: 'Alphabets',
    gifUrl: `/gifs/alphabets/${String.fromCharCode(65 + i).toLowerCase()}.gif`,
  })),
};

// Module 2: Numbers (1-20, then 30, 40, 50, 60, 70, 80, 90, 100)
const numbersModule: Module = {
  id: 'numbers',
  name: 'Numbers',
  description: 'Learn ISL signs for numbers',
  icon: '🔢',
  items: [
    ...Array.from({ length: 20 }, (_, i) => ({
      id: `number-${i + 1}`,
      label: `${i + 1}`,
      category: 'Numbers',
      gifUrl: `/gifs/numbers/${i + 1}.gif`,
    })),
    ...[30, 40, 50, 60, 70, 80, 90, 100].map((num) => ({
      id: `number-${num}`,
      label: `${num}`,
      category: 'Numbers',
      gifUrl: `/gifs/numbers/${num}.gif`,
    })),
  ],
};

// Module 3: Common Greetings & Verbs (20 terms)
const greetingsVerbsModule: Module = {
  id: 'greetings-verbs',
  name: 'Greetings & Verbs',
  description: 'Common greetings and action verbs',
  icon: '👋',
  items: [
    // Greetings
    { id: 'greet-1', label: 'Hello', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/hello.gif' },
    { id: 'greet-2', label: 'Good Morning', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/good-morning.gif' },
    { id: 'greet-3', label: 'Good Evening', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/good-evening.gif' },
    { id: 'greet-4', label: 'Good Night', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/good-night.gif' },
    { id: 'greet-5', label: 'Goodbye', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/goodbye.gif' },
    { id: 'greet-6', label: 'Thank You', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/thank-you.gif' },
    { id: 'greet-7', label: 'Please', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/please.gif' },
    { id: 'greet-8', label: 'Sorry', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/sorry.gif' },
    { id: 'greet-9', label: 'Welcome', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/welcome.gif' },
    { id: 'greet-10', label: 'Yes', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/yes.gif' },
    { id: 'greet-11', label: 'No', category: 'Greetings & Verbs', gifUrl: '/gifs/greetings/no.gif' },
    // Action Verbs
    { id: 'verb-1', label: 'Running', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/running.gif' },
    { id: 'verb-2', label: 'Climbing', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/climbing.gif' },
    { id: 'verb-3', label: 'Eating', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/eating.gif' },
    { id: 'verb-4', label: 'Drinking', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/drinking.gif' },
    { id: 'verb-5', label: 'Sleeping', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/sleeping.gif' },
    { id: 'verb-6', label: 'Walking', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/walking.gif' },
    { id: 'verb-7', label: 'Sitting', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/sitting.gif' },
    { id: 'verb-8', label: 'Standing', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/standing.gif' },
    { id: 'verb-9', label: 'Writing', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/writing.gif' },
  ],
};

// Module 4: Emergency Signs (Police, Healthcare/Medical, Safety)
const emergencyModule: Module = {
  id: 'emergency',
  name: 'Emergency Signs',
  description: 'Essential signs for emergencies',
  icon: '🚨',
  items: [
    // Police & Safety
    { id: 'emergency-1', label: 'Help', category: 'Emergency', gifUrl: '/gifs/emergency/help.gif' },
    { id: 'emergency-2', label: 'Emergency', category: 'Emergency', gifUrl: '/gifs/emergency/emergency.gif' },
    { id: 'emergency-3', label: 'Police', category: 'Emergency', gifUrl: '/gifs/emergency/police.gif' },
    { id: 'emergency-4', label: 'Danger', category: 'Emergency', gifUrl: '/gifs/emergency/danger.gif' },
    { id: 'emergency-5', label: 'Stop', category: 'Emergency', gifUrl: '/gifs/emergency/stop.gif' },
    { id: 'emergency-6', label: 'Fire', category: 'Emergency', gifUrl: '/gifs/emergency/fire.gif' },
    { id: 'emergency-7', label: 'Accident', category: 'Emergency', gifUrl: '/gifs/emergency/accident.gif' },
    { id: 'emergency-8', label: 'Safe', category: 'Emergency', gifUrl: '/gifs/emergency/safe.gif' },
    // Healthcare/Medical
    { id: 'emergency-9', label: 'Hospital', category: 'Emergency', gifUrl: '/gifs/emergency/hospital.gif' },
    { id: 'emergency-10', label: 'Doctor', category: 'Emergency', gifUrl: '/gifs/emergency/doctor.gif' },
    { id: 'emergency-11', label: 'Medicine', category: 'Emergency', gifUrl: '/gifs/emergency/medicine.gif' },
    { id: 'emergency-12', label: 'Pain', category: 'Emergency', gifUrl: '/gifs/emergency/pain.gif' },
    { id: 'emergency-13', label: 'Sick', category: 'Emergency', gifUrl: '/gifs/emergency/sick.gif' },
    { id: 'emergency-14', label: 'Ambulance', category: 'Emergency', gifUrl: '/gifs/emergency/ambulance.gif' },
    { id: 'emergency-15', label: 'Injury', category: 'Emergency', gifUrl: '/gifs/emergency/injury.gif' },
  ],
};

// Module 5: Emotions
const emotionsModule: Module = {
  id: 'emotions',
  name: 'Emotions',
  description: 'Express feelings and emotions',
  icon: '😊',
  items: [
    { id: 'emotion-1', label: 'Happy', category: 'Emotions', gifUrl: '/gifs/emotions/happy.gif' },
    { id: 'emotion-2', label: 'Sad', category: 'Emotions', gifUrl: '/gifs/emotions/sad.gif' },
    { id: 'emotion-3', label: 'Angry', category: 'Emotions', gifUrl: '/gifs/emotions/angry.gif' },
    { id: 'emotion-4', label: 'Excited', category: 'Emotions', gifUrl: '/gifs/emotions/excited.gif' },
    { id: 'emotion-5', label: 'Worried', category: 'Emotions', gifUrl: '/gifs/emotions/worried.gif' },
    { id: 'emotion-6', label: 'Scared', category: 'Emotions', gifUrl: '/gifs/emotions/scared.gif' },
    { id: 'emotion-7', label: 'Surprised', category: 'Emotions', gifUrl: '/gifs/emotions/surprised.gif' },
    { id: 'emotion-8', label: 'Confused', category: 'Emotions', gifUrl: '/gifs/emotions/confused.gif' },
    { id: 'emotion-9', label: 'Tired', category: 'Emotions', gifUrl: '/gifs/emotions/tired.gif' },
    { id: 'emotion-10', label: 'Bored', category: 'Emotions', gifUrl: '/gifs/emotions/bored.gif' },
    { id: 'emotion-11', label: 'Calm', category: 'Emotions', gifUrl: '/gifs/emotions/calm.gif' },
    { id: 'emotion-12', label: 'Nervous', category: 'Emotions', gifUrl: '/gifs/emotions/nervous.gif' },
    { id: 'emotion-13', label: 'Proud', category: 'Emotions', gifUrl: '/gifs/emotions/proud.gif' },
    { id: 'emotion-14', label: 'Embarrassed', category: 'Emotions', gifUrl: '/gifs/emotions/embarrassed.gif' },
    { id: 'emotion-15', label: 'Lonely', category: 'Emotions', gifUrl: '/gifs/emotions/lonely.gif' },
  ],
};

// Export all modules
export const modules: Module[] = [
  alphabetsModule,
  numbersModule,
  greetingsVerbsModule,
  emergencyModule,
  emotionsModule,
];

// Helper function to get all items across all modules (for dictionary)
export const getAllItems = (): FlashcardItem[] => {
  return modules.flatMap((module) => module.items);
};

// Helper function to get a module by ID
export const getModuleById = (id: string): Module | undefined => {
  return modules.find((module) => module.id === id);
};
