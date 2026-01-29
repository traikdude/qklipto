
import React, { useState } from 'react';

interface RuneDetail {
  id: string;
  name: string;
  description: string;
  points?: string[];
  icon: string;
  color: string;
  type: 'settings' | 'themes' | 'swipes' | 'toggles' | 'links' | 'clipboard' | 'generic';
}

const runeDetails: Record<string, RuneDetail> = {
  '1': {
    id: '1',
    name: 'Astral Sync',
    description: 'The rune opens an opportunity:',
    points: ['automatically save all data in the cloud;', 'instantly access it on any other device;', 'save not only text notes, but also files of any format;'],
    icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
    color: 'text-sky-400',
    type: 'settings'
  },
  '12': {
    id: '12',
    name: 'Iron Shield',
    description: 'The rune allows you to protect access to the application with a password. When activated, access will be blocked after 2 minutes of inactivity.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    color: 'text-slate-400',
    type: 'toggles'
  },
  '3': {
    id: '3',
    name: 'Clipboard',
    description: 'The rune allows the app to monitor the clipboard and automatically create notes from text copied to the Clipboard.',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    color: 'text-orange-400',
    type: 'clipboard'
  },
  '14': {
    id: '14',
    name: 'Swipe Power',
    description: 'With this rune, in the list of notes, you can set up actions with them, applied to swipe gestures.',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
    color: 'text-yellow-500',
    type: 'swipes'
  },
  '15': {
    id: '15',
    name: 'Inspiring Support',
    description: 'Without your support and feedback, the product will not evolve in the right direction for users.',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    color: 'text-rose-400',
    type: 'links'
  },
  '2': {
    id: '2',
    name: 'Chameleon Skin',
    description: 'Change the theme and appearance of the application dynamically.',
    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    color: 'text-emerald-400',
    type: 'generic'
  },
  '4': {
    id: '4',
    name: 'The Oculus',
    description: 'Enable advanced link previews and media content analysis within your notes.',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    color: 'text-sky-500',
    type: 'generic'
  },
  '13': {
    id: '13',
    name: 'Keyboard Companion',
    description: 'Adds a persistent toolbar for quick access to your snippets across other apps.',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    color: 'text-orange-500',
    type: 'generic'
  }
};

const skills = [
  { id: '1', name: 'Astral Sync', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
  { id: '12', name: 'Iron Shield', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: '2', name: 'Chameleon Skin', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
  { id: '3', name: 'Clipboard', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { id: '4', name: 'The Oculus', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { id: '13', name: 'Keyboard Companion', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id: '5', name: 'Blowing Copy', icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' },
  { id: '14', name: 'Swipe Power', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { id: '6', name: 'Point of No Return', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { id: '7', name: 'Shifted Focus', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: '11', name: 'Tentative Steps', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: '8', name: 'Revive', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { id: '16', name: 'Time Machine', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: '15', name: 'Inspiring Support', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
];

interface SkillRunesProps {
  onBack: () => void;
}

const SkillRunes: React.FC<SkillRunesProps> = ({ onBack }) => {
  const [selectedRuneId, setSelectedRuneId] = useState<string | null>(null);
  const detail = selectedRuneId ? runeDetails[selectedRuneId] : null;

  const Toggle = ({ active }: { active: boolean }) => (
    <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${active ? 'bg-[#fbc02d]' : 'bg-[#333]'}`}>
      <div className={`w-3.5 h-3.5 bg-white rounded-full ${active ? 'ml-auto' : ''}`}></div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#212121] animate-in fade-in duration-300 overflow-hidden">
      <div className="h-16 border-b border-[#333] flex items-center justify-between px-6 bg-[#262626] flex-shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={() => selectedRuneId ? setSelectedRuneId(null) : onBack()} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h2 className="text-xl font-medium text-slate-100">{detail ? detail.name : 'Skill Runes'}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!selectedRuneId ? (
          <div className="p-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {skills.map((skill) => (
              <div key={skill.id} onClick={() => setSelectedRuneId(skill.id)} className="flex flex-col items-center gap-3 cursor-pointer group">
                <div className="w-20 h-20 bg-[#2a2a2a] rounded-[2rem] flex items-center justify-center border border-[#333] group-hover:border-slate-500 transition-all shadow-lg active:scale-95 group-hover:bg-[#333]">
                  <svg className="w-9 h-9 text-slate-400 group-hover:text-slate-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={skill.icon} /></svg>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase text-center tracking-tight leading-tight group-hover:text-slate-300">{skill.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto p-6 md:p-12 animate-in slide-in-from-bottom-4 duration-300">
             <div className="flex flex-col items-center mb-10">
                <div className={`w-20 h-20 flex items-center justify-center ${detail?.color}`}>
                   <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d={detail?.icon} /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mt-4 tracking-tight">{detail?.name}</h3>
             </div>

             <div className="space-y-4">
                <div className="bg-[#2a2a2a] p-8 rounded-[2rem] border border-[#333] shadow-2xl">
                   <p className="text-slate-300 text-sm leading-relaxed mb-6">{detail?.description}</p>
                   {detail?.points && (
                     <div className="space-y-3 mb-6">
                        {detail.points.map((p, i) => <div key={i} className="flex gap-3 text-sm text-slate-400"><span className="text-[#fbc02d] font-black">•</span>{p}</div>)}
                     </div>
                   )}

                   {detail?.type === 'settings' && (
                     <div className="pt-6 border-t border-[#333] space-y-4">
                        <div className="p-4 bg-[#212121] rounded-2xl flex items-center justify-between border border-[#333]">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-[#fbc02d]"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
                              <div><p className="text-xs font-bold text-slate-100">Encrypted Cipher (...)</p><p className="text-[10px] text-slate-500">300</p></div>
                           </div>
                           <button className="px-4 py-1.5 bg-[#fbc02d] text-black text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-yellow-900/20 active:scale-95 transition-all">Upgrade</button>
                        </div>
                        <div className="flex items-center justify-between p-2"><span className="text-xs text-slate-300">Sync notes automatically</span><Toggle active={true}/></div>
                        <div className="flex items-center justify-between p-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors text-slate-300"><span className="text-xs">Sign out</span><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg></div>
                     </div>
                   )}

                   {detail?.type === 'clipboard' && (
                     <div className="space-y-3 pt-4">
                        {['Notes from Clipboard', 'Universal Clipboard', 'Run at Startup', 'Do not display changed notes'].map((item, i) => (
                          <div key={item} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <span className="text-xs text-slate-300">{item}</span>
                            <Toggle active={i < 3} />
                          </div>
                        ))}
                        <div className="pt-6 mt-4 border-t border-[#333]">
                           <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest"><span>Limit</span><span className="text-[#fbc02d]">∞</span></div>
                           <input type="range" className="w-full h-1 bg-slate-800 accent-[#fbc02d] rounded-full appearance-none cursor-pointer" />
                        </div>
                     </div>
                   )}

                   {detail?.type === 'swipes' && (
                     <div className="grid grid-cols-1 gap-4 pt-4">
                        <div className="p-4 bg-[#212121] rounded-2xl border border-[#333] flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-emerald-600/20 text-emerald-500 rounded-xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></div>
                              <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Right Swipe</p><p className="text-slate-100 font-bold">Copy</p></div>
                           </div>
                           <button className="text-[#fbc02d] text-[10px] font-bold uppercase tracking-widest hover:text-[#ffd54f]">Change</button>
                        </div>
                        <div className="p-4 bg-[#212121] rounded-2xl border border-[#333] flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-rose-600/20 text-rose-500 rounded-xl flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></div>
                              <div><p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Left Swipe</p><p className="text-slate-100 font-bold">Delete</p></div>
                           </div>
                           <button className="text-[#fbc02d] text-[10px] font-bold uppercase tracking-widest hover:text-[#ffd54f]">Change</button>
                        </div>
                     </div>
                   )}

                   {detail?.type === 'links' && (
                     <div className="grid grid-cols-1 gap-3 pt-4">
                        {['Rate Us on Google Play', 'Help Us with translation', 'Report an issue', 'Share App Link'].map(link => (
                          <button key={link} className="w-full py-4 bg-[#333] hover:bg-[#3a3a3a] text-[11px] font-bold text-slate-200 rounded-2xl transition-all active:scale-[0.98] border border-[#444]">{link}</button>
                        ))}
                        <div className="flex justify-center gap-6 py-6 border-t border-[#333] mt-4">
                           <div className="p-4 bg-[#333] rounded-full text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-[#444]"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></div>
                           <div className="p-4 bg-[#333] rounded-full text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-[#444]"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg></div>
                           <div className="p-4 bg-[#333] rounded-full text-slate-400 hover:text-white transition-all cursor-pointer hover:bg-[#444]"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg></div>
                        </div>
                     </div>
                   )}

                   {detail?.type === 'toggles' && (
                     <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors"><span className="text-xs text-slate-300">Passcode Lock</span><Toggle active={false}/></div>
                        <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors"><span className="text-xs text-slate-300">Unlock with Fingerprint</span><Toggle active={false}/></div>
                     </div>
                   )}
                </div>
                <div className="p-6 text-center">
                   <p className="text-[10px] text-slate-500 leading-relaxed italic opacity-70">Once you activate this rune, its effects will be applied globally across all synced devices. You can manage individual note behaviors in the note editor.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillRunes;
