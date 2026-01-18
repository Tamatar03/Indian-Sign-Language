
import { Outlet } from 'react-router-dom';
import { StickyHeader } from './StickyHeader';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

export function Layout() {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full w-full overflow-hidden">

                {/* Header (Shows on mobile & desktop, but sidebar replaces brand on desktop ideally. 
                    For now, we keep header for streak/profile, but might need to hide brand on desktop if sidebar has it. 
                    Let's keep it simple first.) 
                */}
                <StickyHeader streak={12} />

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 pb-24 md:pb-8">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Bottom Nav (Mobile Only - logic inside component) */}
            <BottomNav />
        </div>
    );
}
