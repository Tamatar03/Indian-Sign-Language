export interface FlashcardItem {
  id: string;
  label: string;
  category: string;
  gifUrl: string;
  videoUrl?: string;
}

// Helper to generate video path from label
// Example: "Good Morning" -> "/assets/videos/good-morning.mp4"
export const getVideoPath = (label: string): string => {
  const formattedLabel = label.toLowerCase().replace(/\s+/g, '-');
  return `/assets/videos/${formattedLabel}.mp4`;
};

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
    videoUrl: getVideoPath(String.fromCharCode(65 + i)),
  })),
};

// Module 2: Numbers (1-20, then 30, 40, 50, 60, 70, 80, 90, 100)
const numbersModule: Module = {
  id: 'numbers',
  name: 'Numbers',
  description: 'Learn ISL signs for numbers',
  icon: '🔢',
  items: [
    // 1-9
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => ({
      id: `number-${num}`,
      label: `${num}`,
      category: 'Numbers',
      gifUrl: `/gifs/numbers/${num}.gif`,
      videoUrl: getVideoPath(`${num}`),
    })),
    // 10, 20, 30...
    ...[10, 20, 30, 50, 60, 70, 100].map((num) => ({
      id: `number-${num}`,
      label: `${num}`,
      category: 'Numbers',
      gifUrl: `/gifs/numbers/${num}.gif`,
      videoUrl: getVideoPath(`${num}`),
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
    // Action Verbs
    { id: 'verb-1', label: 'Running', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/running.gif', videoUrl: getVideoPath('Running') },
    { id: 'verb-3', label: 'Eating', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/eating.gif', videoUrl: '/assets/videos/eat.mp4' },
    { id: 'verb-6', label: 'Walking', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/walking.gif', videoUrl: '/assets/videos/walk.mp4' },
    { id: 'verb-9', label: 'Writing', category: 'Greetings & Verbs', gifUrl: '/gifs/verbs/writing.gif', videoUrl: '/assets/videos/write.mp4' },
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
    { id: 'emergency-3', label: 'Police', category: 'Emergency', gifUrl: '/gifs/emergency/police.gif', videoUrl: getVideoPath('Police') },
    { id: 'emergency-6', label: 'Fire', category: 'Emergency', gifUrl: '/gifs/emergency/fire.gif', videoUrl: getVideoPath('Fire') },
    // Healthcare/Medical
    { id: 'emergency-10', label: 'Doctor', category: 'Emergency', gifUrl: '/gifs/emergency/doctor.gif', videoUrl: getVideoPath('Doctor') },
    { id: 'emergency-11', label: 'Medicine', category: 'Emergency', gifUrl: '/gifs/emergency/medicine.gif', videoUrl: getVideoPath('Medicine') },
    { id: 'emergency-12', label: 'Pain', category: 'Emergency', gifUrl: '/gifs/emergency/pain.gif', videoUrl: getVideoPath('Pain') },
    { id: 'emergency-14', label: 'Ambulance', category: 'Emergency', gifUrl: '/gifs/emergency/ambulance.gif', videoUrl: getVideoPath('Ambulance') },
  ],
};

// Module 5: Emotions
const emotionsModule: Module = {
  id: 'emotions',
  name: 'Emotions',
  description: 'Express feelings and emotions',
  icon: '😊',
  items: [
    { id: 'emotion-2', label: 'Sad', category: 'Emotions', gifUrl: '/gifs/emotions/sad.gif', videoUrl: getVideoPath('Sad') },
    { id: 'emotion-3', label: 'Angry', category: 'Emotions', gifUrl: '/gifs/emotions/angry.gif', videoUrl: getVideoPath('Angry') },
    { id: 'emotion-6', label: 'Scared', category: 'Emotions', gifUrl: '/gifs/emotions/scared.gif', videoUrl: '/assets/videos/fear.mp4' },
    { id: 'emotion-11', label: 'Calm', category: 'Emotions', gifUrl: '/gifs/emotions/calm.gif', videoUrl: getVideoPath('Calm') },
    { id: 'emotion-13', label: 'Proud', category: 'Emotions', gifUrl: '/gifs/emotions/proud.gif', videoUrl: getVideoPath('Proud') },
  ],
};

// Module 6: Weeks
const weeksModule: Module = {
  id: 'weeks',
  name: 'Weeks',
  description: 'Days of the week',
  icon: '📅',
  items: [
    { id: 'week-1', label: 'Monday', category: 'Weeks', gifUrl: '/gifs/weeks/monday.gif', videoUrl: getVideoPath('Monday') },
    { id: 'week-2', label: 'Tuesday', category: 'Weeks', gifUrl: '/gifs/weeks/tuesday.gif', videoUrl: getVideoPath('Tuesday') },
    { id: 'week-3', label: 'Wednesday', category: 'Weeks', gifUrl: '/gifs/weeks/wednesday.gif', videoUrl: getVideoPath('Wednesday') },
    { id: 'week-4', label: 'Thursday', category: 'Weeks', gifUrl: '/gifs/weeks/thursday.gif', videoUrl: getVideoPath('Thursday') },
    { id: 'week-5', label: 'Friday', category: 'Weeks', gifUrl: '/gifs/weeks/friday.gif', videoUrl: getVideoPath('Friday') },
    { id: 'week-6', label: 'Saturday', category: 'Weeks', gifUrl: '/gifs/weeks/saturday.gif', videoUrl: getVideoPath('Saturday') },
    { id: 'week-7', label: 'Sunday', category: 'Weeks', gifUrl: '/gifs/weeks/sunday.gif', videoUrl: getVideoPath('Sunday') },
  ],
};

// Module 7: Months
const monthsModule: Module = {
  id: 'months',
  name: 'Months',
  description: 'Months of the year',
  icon: '🗓️',
  items: [
    { id: 'month-1', label: 'January', category: 'Months', gifUrl: '/gifs/months/january.gif', videoUrl: getVideoPath('January') },
    { id: 'month-2', label: 'February', category: 'Months', gifUrl: '/gifs/months/february.gif', videoUrl: getVideoPath('February') },
    { id: 'month-3', label: 'March', category: 'Months', gifUrl: '/gifs/months/march.gif', videoUrl: getVideoPath('March') },
    { id: 'month-4', label: 'April', category: 'Months', gifUrl: '/gifs/months/april.gif', videoUrl: getVideoPath('April') },
    { id: 'month-5', label: 'May', category: 'Months', gifUrl: '/gifs/months/may.gif', videoUrl: getVideoPath('May') },
    { id: 'month-6', label: 'June', category: 'Months', gifUrl: '/gifs/months/june.gif', videoUrl: getVideoPath('June') },
    { id: 'month-7', label: 'July', category: 'Months', gifUrl: '/gifs/months/july.gif', videoUrl: getVideoPath('July') },
    { id: 'month-8', label: 'August', category: 'Months', gifUrl: '/gifs/months/august.gif', videoUrl: getVideoPath('August') },
    { id: 'month-9', label: 'September', category: 'Months', gifUrl: '/gifs/months/september.gif', videoUrl: getVideoPath('September') },
    { id: 'month-10', label: 'October', category: 'Months', gifUrl: '/gifs/months/october.gif', videoUrl: getVideoPath('October') },
    { id: 'month-11', label: 'November', category: 'Months', gifUrl: '/gifs/months/november.gif', videoUrl: getVideoPath('November') },
    { id: 'month-12', label: 'December', category: 'Months', gifUrl: '/gifs/months/december.gif', videoUrl: getVideoPath('December') },
    // General Time Terms
    { id: 'time-1', label: 'Year', category: 'Months', gifUrl: '/gifs/months/year.gif', videoUrl: getVideoPath('Year') },
    { id: 'time-2', label: 'Month', category: 'Months', gifUrl: '/gifs/months/month.gif', videoUrl: getVideoPath('Month') },
  ],
};

// Export all modules
export const modules: Module[] = [
  alphabetsModule,
  numbersModule,
  greetingsVerbsModule,
  emergencyModule,
  emotionsModule,
  weeksModule,
  monthsModule,
];

// Helper function to get all items across all modules (for dictionary)
export const getAllItems = (): FlashcardItem[] => {
  return modules.flatMap((module) => module.items);
};

// Helper function to get a module by ID
export const getModuleById = (id: string): Module | undefined => {
  return modules.find((module) => module.id === id);
};
