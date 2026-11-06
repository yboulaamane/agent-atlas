import React from 'react';
import { LearningPath, LearningPathId } from '../types';
import { 
  Compass, MessageSquare, Code, Bot, 
  Map, List, Moon, Play, Pause, Sparkles, CheckCircle2, Gift 
} from 'lucide-react';

interface Props {
  activeView: 'map' | 'list';
  onToggleView: (view: 'map' | 'list') => void;
  learningPaths: LearningPath[];
  selectedPathId: LearningPathId;
  onSelectPath: (pathId: LearningPathId) => void;
  reducedMotion: boolean;
  onToggleMotion: () => void;
  masteredCount: number;
  totalConcepts: number;
  solvedCount: number;
  onOpenFreeApis: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeView,
  onToggleView,
  learningPaths,
  selectedPathId,
  onSelectPath,
  reducedMotion,
  onToggleMotion,
  masteredCount,
  totalConcepts,
  solvedCount,
  onOpenFreeApis,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-extrabold text-lg">
              🔮
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                AI Concept Playground
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  2026 Interactive Edition
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Playful visual explainer for agents, harnesses, MCP, swarms & modern AI
              </p>
            </div>
          </div>

          {/* Mobile view toggle & Free APIs */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenFreeApis}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free APIs</span>
            </button>
            <button
              onClick={() => onToggleView(activeView === 'map' ? 'list' : 'map')}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              {activeView === 'map' ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Guided Learning Path Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-x-auto max-w-full scrollbar-none">
          {learningPaths.map((path) => {
            const isSelected = selectedPathId === path.id;
            return (
              <button
                key={path.id}
                onClick={() => onSelectPath(path.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {path.id === 'all' && <Compass className="w-3.5 h-3.5" />}
                {path.id === 'chatbots' && <MessageSquare className="w-3.5 h-3.5" />}
                {path.id === 'coding-assistants' && <Code className="w-3.5 h-3.5" />}
                {path.id === 'agents' && <Bot className="w-3.5 h-3.5" />}
                {path.title}
              </button>
            );
          })}
        </div>

        {/* Right Action Controls: Stats, View Switcher & Motion Toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Free APIs Button */}
          <button
            onClick={onOpenFreeApis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
          >
            <Gift className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free APIs</span>
            <span className="text-[10px] bg-emerald-950 px-1.5 py-0.2 rounded font-mono text-emerald-400 border border-emerald-800">$0</span>
          </button>

          {/* Progress Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-medium text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {masteredCount}/{totalConcepts}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">★ {solvedCount} Quizzes</span>
          </div>

          {/* Map vs List Switcher */}
          <div className="flex items-center p-0.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              onClick={() => onToggleView('map')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'map'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Bubble Map
            </button>
            <button
              onClick={() => onToggleView('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'list'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Directory
            </button>
          </div>

          {/* Motion Toggle Button */}
          <button
            onClick={onToggleMotion}
            className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
              reducedMotion
                ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title={reducedMotion ? "Motion paused (Reduced motion mode)" : "Pause floating bubble motion"}
          >
            {reducedMotion ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
