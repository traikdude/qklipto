import React from 'react';
import { Sidebar } from './Sidebar';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full min-w-0 bg-gray-950">
                {children}
            </main>
        </div>
    );
};
