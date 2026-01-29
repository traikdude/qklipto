
import React from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useSettingsStore } from '../../stores/settingsStore';

export const NavigationDrawer: React.FC = () => {
    const { currentView, setView, drawerOpen, setDrawerOpen } = useUIStore();

    // Map currentView to the ID used in the sidebar logic
    const activeId = currentView;

    const navItems = [
        {
            title: 'NOTES',
            items: [
                { id: 'clips', label: 'All', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', count: 'ALL' },
                { id: 'favorites', label: 'Starred', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', count: '' },
                { id: 'trash', label: 'Recycle Bin', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', count: '' },
            ]
        },
        {
            title: 'TAGS',
            items: [
                { id: 'tags', label: 'Manage Tags', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', count: '' }
            ]
        },
        {
            title: 'SETTINGS',
            items: [
                { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', count: '' }
            ]
        }
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* Main Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-clipto-surface border-r border-clipto-divider h-screen 
                transition-transform duration-300 transform 
                ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:static md:flex flex-col shadow-2xl md:shadow-none
            `}>
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-clipto-divider h-16 bg-clipto-surface">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-clipto-primary flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-clipto-primary animate-pulse"></div>
                        </div>
                        <span className="font-bold text-lg text-slate-100 uppercase tracking-tighter">QKlipto</span>
                    </div>
                </div>

                {/* Scroller */}
                <div className="flex-1 overflow-y-auto py-2 scrollbar-clipto">
                    {navItems.map((section, idx) => (
                        <div key={idx} className="mb-4">
                            <div className="px-6 py-2 flex items-center justify-between group cursor-pointer mb-1">
                                <span className="text-[10px] font-extrabold text-[#555] uppercase tracking-[0.2em]">{section.title}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                {section.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setView(item.id as any)}
                                        className={`
                                            flex items-center justify-between px-6 py-3 cursor-pointer transition-all border-l-4
                                            ${activeId === item.id
                                                ? 'bg-[#252525] text-white border-clipto-primary'
                                                : 'border-transparent text-slate-400 hover:bg-[#202020] hover:text-slate-200'}
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <svg className={`w-5 h-5 flex-shrink-0 ${activeId === item.id ? 'text-clipto-primary' : 'opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                            </svg>
                                            <span className="text-[13px] font-medium tracking-wide">{item.label}</span>
                                        </div>
                                        {item.count && (
                                            <span className="text-[10px] opacity-30 font-bold bg-black/20 px-2 py-0.5 rounded">{item.count}</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer User Profile / Sync Status */}
                <div className="p-4 border-t border-clipto-divider bg-[#151515]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                            U
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">Guest User</span>
                            <span className="text-[10px] text-slate-500">Sync Active</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
