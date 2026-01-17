export enum Handedness {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

export enum CourseLevel {
    BEGINNER = 'BEGINNER',
    DAILY = 'DAILY',
    EMERGENCY = 'EMERGENCY',
}

export interface User {
    id: number;
    handedness: Handedness;
    dailyGoalMinutes: number;
    streak: number;
}

export interface Course {
    id: number;
    title: string;
    level: CourseLevel;
    progress: number; // 0-100
    totalLessons: number;
    completedLessons: number;
}

export interface Lesson {
    id: number;
    courseId: number;
    title: string;
    order: number;
    isLocked: boolean;
    score?: number;
}

export interface Sign {
    id: number;
    word: string;
    videoUrl: string;
    duration: number;
}
