import React from 'react';
import { Outlet } from 'react-router-dom';
import { StickyHeader } from './StickyHeader';
import { BottomNav } from './BottomNav';

export function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-surface-gray">
            {/* 
        Ideally, we would fetch the user's streak from a store here.
        Passing a dummy value '12' for now.
      */}
            <StickyHeader streak={12} />

            <main className="flex-1 w-full max-w-md mx-auto pb-20 pt-4 px-4">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
}
