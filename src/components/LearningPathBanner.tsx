import React from 'react';
import { LearningPath, LearningPathId } from '../types';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

interface Props {
  currentPath: LearningPath;
  onSelectPath: (pathId: LearningPathId) => void;
  activeCount: number;
  totalCount: number;
}

export const LearningPathBanner: React.FC<Props> = ({
  currentPath,
  onSelectPath,
  activeCount,
  totalCount,
}) => {
  if (currentPath.id === 'all') {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Viewing Full AI Universe
              <span className="text-xs font-normal text-slate-400">({totalCount} interconnected concepts)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Floating bubbles show how modern agent harnesses, MCP, RAG 2.0, swarms, and safety layers link together.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onSelectPath('chatbots')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Start with Chatbot Basics →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-900/60 px-2 py-0.5 rounded-full border border-cyan-700">
              Guided Path Active
            </span>
            <h3 className="text-sm font-bold text-white">
              {currentPath.title}
            </h3>
          </div>
          <p className="text-xs text-cyan-100/80 mt-0.5">
            {currentPath.description} ({activeCount} curated concepts highlighted).
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => onSelectPath('all')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20"
        >
          <Compass className="w-3.5 h-3.5" />
          Explore Everything ({totalCount} concepts)
        </button>
      </div>
    </div>
  );
};
