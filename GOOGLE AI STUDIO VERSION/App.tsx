
import React, { useState, useMemo } from 'react';
import { Clip, ClipType, CategoryFilter } from './types';
import Sidebar from './components/Sidebar';
import ClipCard from './components/ClipCard';
import NewClipModal from './components/NewClipModal';
import ClipDetailsModal from './components/ClipDetailsModal';
import SkillRunes from './components/SkillRunes';

const App: React.FC = () => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter | 'untagged' | 'recycle'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSkillRunesOpen, setIsSkillRunesOpen] = useState(false);
  const [isFABMenuOpen, setIsFABMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  const filteredClips = useMemo(() => {
    return clips.filter(clip => {
      const matchesSearch = (clip.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (clip.content || '').toLowerCase().includes(searchQuery.toLowerCase());
      let matchesFilter = activeFilter === 'all';
      if (activeFilter === 'favorites') matchesFilter = clip.isFavorite;
      else if (activeFilter === 'text') matchesFilter = clip.type === ClipType.TEXT;
      else if (activeFilter === 'code') matchesFilter = clip.type === ClipType.CODE;
      else if (activeFilter === 'image') matchesFilter = clip.type === ClipType.IMAGE;
      else if (activeFilter === 'untagged') matchesFilter = clip.tags.length === 0;
      return matchesSearch && matchesFilter;
    });
  }, [clips, searchQuery, activeFilter]);

  const fabMenuGroups = [
    {
      title: 'Create notes',
      items: [
        { label: 'New Note', desc: 'Save important text information and access it instantly at any time on any device', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', color: 'text-emerald-500' },
        { label: 'Scan Barcode', desc: 'Scan links or text and save it as a note (most standard barcode formats are supported)', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4', color: 'text-yellow-500' },
        { label: 'Copy from Clipboard', desc: 'Take the current text from the clipboard and save it as a note', icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1', color: 'text-orange-500' },
        { label: 'Import from File', desc: 'Create a note with text from a file (max. file size 128 KB)', icon: 'M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12', color: 'text-sky-500' },
      ]
    },
    {
      title: 'Add files',
      items: [
        { label: 'Choose File', desc: 'Add any file (photo, video, pdf, etc.) of max. 300 MB', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', color: 'text-indigo-400' },
        { label: 'Take Photo', desc: 'Take a photo and save it to a note', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z', color: 'text-emerald-400' },
        { label: 'Record Video', desc: 'Record a video and save it to a note (max. video size 300 MB)', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', color: 'text-rose-400' },
      ]
    },
    {
      title: 'Organize data',
      items: [
        { label: 'New tag', desc: 'Create a tag to organize your notes and files so they are easier to find', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', color: 'text-emerald-500' },
        { label: 'New folder', desc: 'Create a folder to structure your notes and files in a familiar hierarchical way', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z', color: 'text-orange-500' },
        { label: 'New filter', desc: 'Create a filter to find the information you want faster by using ready-made search templates', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z', color: 'text-sky-500' },
      ]
    },
    {
      title: 'Reduce repetitive typing',
      items: [
        { label: 'New snippet', desc: 'Create reusable text template to avoid repetitive typing and mistakes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: 'text-emerald-500' },
        { label: 'New snippet kit', desc: 'Create a kit of snippets to find common ones faster', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: 'text-yellow-500' },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#212121] text-slate-300 overflow-hidden relative">
      <Sidebar 
        activeFilter={activeFilter as any} 
        onFilterChange={(f) => { setActiveFilter(f as any); setIsSkillRunesOpen(false); }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenSkillRunes={() => { setIsSkillRunesOpen(true); setIsSidebarOpen(false); }}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden border-l border-[#2a2a2a]">
        {isSkillRunesOpen ? (
          <SkillRunes onBack={() => setIsSkillRunesOpen(false)} />
        ) : (
          <>
            <header className="bg-[#212121] border-b border-[#2a2a2a] px-4 py-3 flex items-center justify-between">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
              <div className="flex-1 max-w-md relative mx-4">
                <input type="text" placeholder="Search your notes" className="w-full pl-4 pr-10 py-2.5 bg-[#2a2a2a] border border-[#2a2a2a] rounded-lg text-sm outline-none focus:bg-[#252525] transition-all text-slate-200" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button className="absolute inset-y-0 right-0 px-3 text-slate-500"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
              </div>
              <button className="p-2 text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg></button>
            </header>

            <div className="flex-1 overflow-y-auto relative bg-[#212121] flex flex-col p-4 md:p-8">
              {filteredClips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredClips.map(clip => (<ClipCard key={clip.id} clip={clip} onClick={setSelectedClip} onToggleFavorite={() => {}} />))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
                   <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-6 text-slate-600"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></div>
                   <h2 className="text-2xl font-bold text-slate-100 mb-2 capitalize">{activeFilter}</h2>
                   <p className="text-slate-500 max-w-sm text-sm">General category. Displays all notes without filtering.</p>
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="h-16 border-t border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-between px-6 relative">
               <button onClick={() => setIsSettingsOpen(true)} className="text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  Settings
               </button>
               
               {/* PRIMARY FAB: Centered at bottom */}
               <button onClick={() => setIsFABMenuOpen(true)} className="w-14 h-14 bg-[#fbc02d] rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all absolute left-1/2 -translate-x-1/2 -top-7 border-4 border-[#212121]">
                 <svg className="w-7 h-7 text-[#212121]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
               </button>

               <button className="text-slate-500 hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  Sort
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18v2H3V4zm3 7h12v2H6v-2zm3 7h6v2H9v-2z"/></svg>
               </button>
            </div>
          </>
        )}
      </main>

      {/* FAB Fullscreen Overlay Menu */}
      {isFABMenuOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col justify-end" onClick={() => setIsFABMenuOpen(false)}>
          <div className="bg-[#262626] rounded-t-3xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300" onClick={e => e.stopPropagation()}>
             <div className="sticky top-0 bg-[#262626] p-6 flex items-center justify-between border-b border-[#333] z-10">
                <h3 className="text-lg font-bold text-slate-100">Create notes</h3>
                <button onClick={() => setIsFABMenuOpen(false)} className="p-2 text-slate-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
             </div>
             <div className="p-6 space-y-8">
                {fabMenuGroups.map((group, gIdx) => (
                  <div key={gIdx}>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">{group.title}</h4>
                    <div className="space-y-1">
                      {group.items.map((item, i) => (
                        <button key={i} className="flex items-start gap-4 w-full p-4 hover:bg-white/5 rounded-2xl transition-all text-left group">
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

      {/* Settings/Style Bottom Sheet */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end" onClick={() => setIsSettingsOpen(false)}>
          <div className="bg-[#262626] p-6 rounded-t-3xl animate-in slide-in-from-bottom-full duration-300" onClick={e => e.stopPropagation()}>
             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">List Style</h3>
             <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                {['Default', 'Grid', 'Comfortable', 'Condensed', 'Preview'].map(style => (
                  <button key={style} className={`px-5 py-2.5 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${style === 'Default' ? 'bg-[#fbc02d] text-black border-[#fbc02d] shadow-lg shadow-yellow-900/20' : 'bg-[#333] text-slate-400 border-[#444] hover:border-slate-500'}`}>{style}</button>
                ))}
             </div>
             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Sort By</h3>
             <div className="grid grid-cols-3 gap-2">
                {['Create date', 'Edit date', 'Usage date', 'Title', 'Size', 'Characters'].map(sort => (
                  <button key={sort} className="px-3 py-3 bg-[#333] rounded-xl text-[10px] font-bold text-slate-400 border border-[#444] hover:bg-[#3a3a3a] transition-colors">{sort}</button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
