
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
    name: string;
    email: string;
}

interface Progress {
    [moduleId: string]: number; // Tracks number of lessons completed per module
}

interface UserContextType {
    user: User | null;
    progress: Progress;
    quizScores: Record<string, number>;
    isAuthenticated: boolean;
    login: (name: string, email: string) => void;
    logout: () => void;
    markLessonComplete: (moduleId: string) => void;
    getModuleProgress: (moduleId: string) => number; // Returns count
    saveQuizScore: (moduleId: string, score: number) => void;
    getQuizScore: (moduleId: string) => number;
    resetQuizScore: (moduleId: string) => void;
    // New Learning Stats
    learnedItems: Record<string, string[]>;
    markItemAsViewed: (moduleId: string, itemId: string) => void;
    getLearningProgress: (moduleId: string, totalItems: number) => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [progress, setProgress] = useState<Progress>({});
    const [quizScores, setQuizScores] = useState<Record<string, number>>({});
    const [learnedItems, setLearnedItems] = useState<Record<string, string[]>>({}); // moduleId -> [itemIds]

    // Load from LocalStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedProgress = localStorage.getItem('progress');
        const storedQuizScores = localStorage.getItem('quiz_scores');
        const storedLearnedItems = localStorage.getItem('learned_items');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        }
        if (storedQuizScores) {
            setQuizScores(JSON.parse(storedQuizScores));
        }
        if (storedLearnedItems) {
            setLearnedItems(JSON.parse(storedLearnedItems));
        }
    }, []);

    // Persist changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('progress', JSON.stringify(progress));
    }, [progress]);

    useEffect(() => {
        localStorage.setItem('quiz_scores', JSON.stringify(quizScores));
    }, [quizScores]);

    useEffect(() => {
        localStorage.setItem('learned_items', JSON.stringify(learnedItems));
    }, [learnedItems]);

    const login = (name: string, email: string) => {
        setUser({ name, email });
        // Initialize progress if empty (optional)
        if (Object.keys(progress).length === 0) {
            setProgress({});
        }
    };

    const logout = () => {
        setUser(null);
        setProgress({});
        setQuizScores({});
        setLearnedItems({});
        localStorage.removeItem('user');
        localStorage.removeItem('progress');
        localStorage.removeItem('quiz_scores');
        localStorage.removeItem('learned_items');
    };

    const markLessonComplete = (moduleId: string) => {
        setProgress((prev) => {
            const currentCount = prev[moduleId] || 0;
            return {
                ...prev,
                [moduleId]: currentCount + 1,
            };
        });
    };

    // --- New Functionality: Track Viewed Items ---
    const markItemAsViewed = (moduleId: string, itemId: string) => {
        setLearnedItems((prev) => {
            const currentModuleItems = prev[moduleId] || [];
            if (currentModuleItems.includes(itemId)) return prev; // Already viewed

            return {
                ...prev,
                [moduleId]: [...currentModuleItems, itemId]
            };
        });
    };

    const getLearningProgress = (moduleId: string, totalItems: number) => {
        const viewedCount = (learnedItems[moduleId] || []).length;
        if (totalItems === 0) return 0;
        return Math.min(100, Math.round((viewedCount / totalItems) * 100));
    };

    const saveQuizScore = (moduleId: string, score: number) => {
        setQuizScores((prev) => {
            const currentBest = prev[moduleId] || 0;
            // Only update if the new score is better
            if (score > currentBest) {
                return {
                    ...prev,
                    [moduleId]: score,
                };
            }
            return prev;
        });
    };

    const getModuleProgress = (moduleId: string) => {
        return progress[moduleId] || 0;
    };

    const getQuizScore = (moduleId: string) => {
        return quizScores[moduleId] || 0;
    };

    const resetQuizScore = (moduleId: string) => {
        setQuizScores((prev) => {
            const newScores = { ...prev };
            delete newScores[moduleId]; // or set to 0, but deleting works too
            return newScores;
        });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                progress,
                quizScores,
                learnedItems,
                isAuthenticated: !!user,
                login,
                logout,
                markLessonComplete,
                getModuleProgress,
                saveQuizScore,
                getQuizScore,
                resetQuizScore,
                markItemAsViewed,
                getLearningProgress
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
