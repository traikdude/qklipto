
import React from 'react';
import { CategoryFilter } from '../types';

interface SidebarProps {
  activeFilter: CategoryFilter | 'untagged' | 'recycle';
  onFilterChange: (filter: CategoryFilter | 'untagged' | 'recycle') => void;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenSkillRunes?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeFilter, onFilterChange, isOpen, onClose, onOpenSkillRunes }) => {
  const sections = [
    {
      title: 'NOTES',
      items: [
        { id: 'all', label: 'All', count: '160 / 300', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
        { id: 'favorites', label: 'Starred', count: '48', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
        { id: 'recycle', label: 'Recycle Bin', count: '0 / 5000', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
        { id: 'untagged', label: 'Untagged', count: '13', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
        { id: 'text', label: 'Clipboard', count: '13', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { id: 'code', label: 'Snippets', count: '4', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      ]
    },
    { title: 'TAGS', count: 17, items: [
      { id: 'tag-code', label: '<CODE>', count: '18', color: 'text-indigo-400' },
      { id: 'tag-learn', label: 'LEARN 🧑‍🏫', count: '3', color: 'text-emerald-400' },
      { id: 'tag-search', label: 'SEARCH 🔍', count: '10', color: 'text-sky-400' },
      { id: 'tag-emojis', label: 'EMOJIS 😆', count: '3', color: 'text-yellow-400' }
    ]},
    { title: 'FOLDERS', count: 0, items: [] },
    { title: 'FILTERS', count: 0, items: [] },
    { title: 'SNIPPET KITS', count: 2, items: [
      { id: 'snippet-1', label: 'SNIPPETZ 🧬', count: '1', color: 'text-rose-400' }
    ]}
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] border-r border-[#2a2a2a] h-screen transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex flex-col`}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-[#fbc02d] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#fbc02d]"></div>
            </div>
            <span className="font-bold text-sm text-slate-100 uppercase tracking-tighter">Clipto</span>
          </div>
          <button onClick={onOpenSkillRunes} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
        </div>

        {/* Scroller */}
        <div className="flex-1 overflow-y-auto py-2">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-2">
              <div className="px-4 py-3 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{section.title} ({section.count || section.items.length})</span>
                </div>
                {section.title !== 'NOTES' && (
                  <button className="text-slate-500 hover:text-white transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                  </button>
                )}
              </div>
              <div className="flex flex-col">
                {section.items.map((item) => (
                  <div key={item.id} onClick={() => onFilterChange(item.id as any)} className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${activeFilter === item.id ? 'bg-[#333] text-white' : 'text-slate-400 hover:bg-[#252525] hover:text-slate-100'}`}>
                    <div className="flex items-center gap-4 pl-6">
                      {item.icon && item.icon.length > 2 ? (
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                      ) : <span className="w-4 text-center text-sm">{item.icon}</span>}
                      <span className={`text-[12px] font-medium ${item.color || ''}`}>{item.label}</span>
                    </div>
                    <span className="text-[9px] opacity-40 font-bold">({item.count})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-[#2a2a2a] bg-[#1a1a1a]">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#fbc02d]/10 text-[#fbc02d] text-xs font-bold rounded uppercase tracking-widest hover:bg-[#fbc02d]/20 transition-all mb-2">
            Public Library
          </button>
          <div className="flex items-center justify-between px-4 py-2 text-[10px] font-bold text-slate-600 uppercase">
             <button className="hover:text-slate-400">App Guide</button>
             <span className="opacity-50">7.3.8-release</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
