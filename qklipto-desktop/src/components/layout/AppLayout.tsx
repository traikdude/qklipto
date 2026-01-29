
import React, { useState } from 'react';
import { NavigationDrawer } from './NavigationDrawer';
import { useUIStore } from '../../stores/uiStore';
import { Search } from 'lucide-react';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { searchQuery, setSearchQuery, isSearchFocused, setSearchFocused, toggleDrawer } = useUIStore();
    const [isFABMenuOpen, setIsFABMenuOpen] = useState(false);

    // FAB Menu Items Configuration
    const fabMenuGroups = [
        {
            title: 'Create notes',
            items: [
                { label: 'New Note', desc: 'Save important text information and access it instantly at any time on any device', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'text-emerald-500' },
                { label: 'Scan Barcode', desc: 'Scan links or text and save it as a note', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4', color: 'text-yellow-500' },
                { label: 'Copy from Clipboard', desc: 'Take the current text from the clipboard', icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1', color: 'text-orange-500' },
            ]
        },
        {
            title: 'Organize data',
            items: [
                { label: 'New tag', desc: 'Create a tag to organize your notes', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', color: 'text-emerald-500' },
                { label: 'New folder', desc: 'Create a folder to structure your notes', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'text-orange-500' },
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-clipto-background text-clipto-text overflow-hidden relative">
            <NavigationDrawer />

            <main className="flex-1 flex flex-col h-full overflow-hidden border-l border-clipto-divider relative">
                {/* Header */}
                <header className="bg-clipto-background border-b border-clipto-divider px-4 py-3 flex items-center justify-between shrink-0 h-16">
                    <button onClick={toggleDrawer} className="p-2 text-slate-400 hover:text-white md:hidden">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>

                    <div className="flex-1 max-w-2xl relative mx-4">
                        <input
                            type="text"
                            placeholder="Search your notes"
                            className="w-full pl-4 pr-10 py-2.5 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm outline-none focus:bg-[#252525] transition-all text-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                        <button className="absolute inset-y-0 right-0 px-3 text-slate-500">
                            <Search size={18} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <div className="flex-1 overflow-y-auto relative bg-clipto-background p-4 md:p-8 scrollbar-clipto">
                    {children}
                </div>

                {/* Sticky Bottom Actions */}
                <div className="h-16 border-t border-clipto-divider bg-clipto-surface flex items-center justify-between px-6 relative shrink-0 z-10">
                    <button className="text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        Settings
                    </button>

                    {/* PRIMARY FAB: Centered at bottom */}
                    <button
                        onClick={() => setIsFABMenuOpen(true)}
                        className="w-14 h-14 bg-clipto-primary rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all absolute left-1/2 -translate-x-1/2 -top-7 border-4 border-clipto-background group"
                    >
                        <svg className="w-7 h-7 text-[#212121] transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>

                    <button className="text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                        Sort
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18v2H3V4zm3 7h12v2H6v-2zm3 7h6v2H9v-2z" /></svg>
                    </button>
                </div>
            </main>

            {/* FAB Fullscreen Overlay Menu */}
            {isFABMenuOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end" onClick={() => setIsFABMenuOpen(false)}>
                    <div className="bg-[#262626] rounded-t-3xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-20 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-[#262626] p-6 flex items-center justify-between border-b border-[#333] z-10">
                            <h3 className="text-lg font-bold text-slate-100">Create notes</h3>
                            <button onClick={() => setIsFABMenuOpen(false)} className="p-2 text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="p-6 space-y-8 pb-10">
                            {fabMenuGroups.map((group, gIdx) => (
                                <div key={gIdx}>
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">{group.title}</h4>
                                    <div className="space-y-1">
                                        {group.items.map((item, i) => (
                                            <button key={i} className="flex items-start gap-4 w-full p-4 hover:bg-white/5 rounded-2xl transition-all text-left group" onClick={() => {
                                                // Handle actions here, for now just close
                                                setIsFABMenuOpen(false);
                                                if (item.label === 'New Note') {
                                                    useUIStore.getState().openEditor();
                                                }
                                            }}>
                                                <div className={`w-12 h-12 bg-[#333] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#3a3a3a] transition-colors ${item.color}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg></div>
                                                <div>
                                                    <p className="text-slate-100 font-bold text-sm mb-0.5">{item.label}</p>
                                                    <p className="text-slate-500 text-[11px] leading-snug">{item.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
