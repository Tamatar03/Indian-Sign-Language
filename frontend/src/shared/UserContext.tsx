
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
    isAuthenticated: boolean;
    login: (name: string, email: string) => void;
    logout: () => void;
    markLessonComplete: (moduleId: string) => void;
    getModuleProgress: (moduleId: string) => number; // Returns count
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [progress, setProgress] = useState<Progress>({});

    // Load from LocalStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedProgress = localStorage.getItem('progress');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
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
        localStorage.removeItem('user');
        localStorage.removeItem('progress');
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

    const getModuleProgress = (moduleId: string) => {
        return progress[moduleId] || 0;
    };

    return (
        <UserContext.Provider
            value={{
                user,
                progress,
                isAuthenticated: !!user,
                login,
                logout,
                markLessonComplete,
                getModuleProgress
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
