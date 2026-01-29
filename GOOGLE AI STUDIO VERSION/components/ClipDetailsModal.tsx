
import React, { useState } from 'react';
import { Clip, ClipType } from '../types';
import { analyzeContent, analyzeImage } from '../services/geminiService';

interface ClipDetailsModalProps {
  clip: Clip;
  onClose: () => void;
  onUpdate: (updatedClip: Clip) => void;
}

const ClipDetailsModal: React.FC<ClipDetailsModalProps> = ({ clip, onClose, onUpdate }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAction = async () => {
    setIsAnalyzing(true);
    try {
      let analysis;
      if (clip.type === ClipType.IMAGE && clip.metadata?.imageSrc) {
        analysis = await analyzeImage(clip.metadata.imageSrc);
      } else {
        analysis = await analyzeContent(clip.content, clip.type);
      }
      onUpdate({ ...clip, aiAnalysis: analysis });
    } catch (error) {
      alert("Failed to analyze content. Please check your API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-0 md:p-6">
      <div className="bg-editor rounded-none md:rounded-lg shadow-2xl w-full max-w-6xl h-full md:h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-800 rounded text-accent">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
             </div>
             <h2 className="text-xl font-bold text-white">{clip.title || 'Untitled Clip'}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col bg-sidebar">
            <div className="mb-4">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Editor Content</p>
               <div className="text-slate-500 text-sm mb-4 cursor-pointer hover:text-slate-300">tap here to add a tag</div>
            </div>

            <div className="flex-1">
              {clip.type === ClipType.IMAGE && clip.metadata?.imageSrc ? (
                <div className="w-full h-full flex items-center justify-center bg-black/20 rounded">
                  <img src={clip.metadata.imageSrc} className="max-h-full object-contain" />
                </div>
              ) : (
                <textarea 
                  className={`w-full h-full bg-transparent border-none focus:ring-0 resize-none text-slate-200 text-base leading-relaxed ${clip.type === ClipType.CODE ? 'font-mono' : ''}`}
                  value={clip.content}
                  readOnly
                  placeholder="tap here to add text"
                />
              )}
            </div>
          </div>

          {/* AI Insights Pane */}
          <div className="w-full md:w-96 bg-editor border-t md:border-t-0 md:border-l border-subtle p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-slate-900">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              </div>
              <h3 className="font-bold text-white tracking-tight">AI Insights</h3>
            </div>

            {clip.aiAnalysis ? (
              <div className="space-y-6">
                <section>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">AI Summary</label>
                  <p className="text-sm text-slate-300 bg-slate-800/40 p-3 rounded leading-relaxed">{clip.aiAnalysis.summary}</p>
                </section>
                
                <section>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Category Tag</label>
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded text-xs font-bold">{clip.aiAnalysis.category}</span>
                </section>

                <section>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Key Takeaways</label>
                  <ul className="space-y-2">
                    {clip.aiAnalysis.keyPoints.map((point, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </section>

                {clip.aiAnalysis.explanation && (
                  <section>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Technical Breakdown</label>
                    <p className="text-sm text-slate-500 italic border-l-2 border-slate-700 pl-3 leading-relaxed">{clip.aiAnalysis.explanation}</p>
                  </section>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                 <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <p className="text-sm mb-6">Enhance this note with Gemini's advanced intelligence.</p>
                 <button 
                  onClick={handleAIAction}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-xl shadow-indigo-900/20 disabled:opacity-40 transition-all flex items-center justify-center gap-3"
                 >
                   {isAnalyzing ? <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Processing...</> : 'Analyze with AI'}
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Bottom Tabs */}
        <div className="p-2 border-t border-subtle flex items-center justify-start gap-6 bg-main px-6 overflow-x-auto">
          <button className="py-2 text-xs font-bold text-accent border-b-2 border-accent uppercase tracking-widest whitespace-nowrap">General</button>
          <button className="py-2 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest whitespace-nowrap">Attributes</button>
          <button className="py-2 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest whitespace-nowrap">Attachments</button>
          <button className="py-2 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest whitespace-nowrap">Sharing</button>
        </div>
      </div>
    </div>
  );
};

export default ClipDetailsModal;
