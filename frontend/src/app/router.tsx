import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Layout } from '../ui/Layout';
import { Dashboard } from '../modules/learn/Dashboard';
import { Dictionary } from '../modules/learn/Dictionary';
import { Practice } from '../modules/learn/Practice';
import { Profile } from '../modules/learn/Profile';
import { Player } from '../modules/interpreter-video/Player';
import { LandingPage } from '../modules/landing/LandingPage';
import { LoginPage } from '../modules/auth/LoginPage';
import { useAuthStore } from '../shared/authStore';

// Protected Route Guard
const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Public Only Guard (prevents logged in users from seeing landing/login)
const PublicRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return !isAuthenticated ? <Outlet /> : <Navigate to="/app" replace />;
};

const router = createBrowserRouter([
    // Public Routes (Landing, Login)
    {
        element: <PublicRoute />,
        children: [
            {
                path: '/',
                element: <LandingPage />,
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
        ]
    },
    // Protected Application Routes
    {
        path: '/app',
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        index: true, // /app
                        element: <Dashboard />,
                    },
                    {
                        path: 'dictionary', // /app/dictionary
                        element: <Dictionary />,
                    },
                    {
                        path: 'practice', // /app/practice
                        element: <Practice />,
                    },
                    {
                        path: 'profile', // /app/profile
                        element: <Profile />,
                    },
                ],
            },
            {
                path: 'learn/:lessonId', // /app/learn/:id
                element: <Player />,
            }
        ]
    },
    // Catch all
    {
        path: '*',
        element: <Navigate to="/" replace />,
    }
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
