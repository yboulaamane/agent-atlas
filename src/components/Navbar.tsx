import React from 'react';
import { LearningPath, LearningPathId } from '../types';
import { 
  Compass, MessageSquare, Code, Bot, 
  Map, List, Sun, Moon, Play, Pause, Sparkles, CheckCircle2, Gift 
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
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
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
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200 bg-white/80 dark:bg-[#09090b]/80 border-neutral-200/80 dark:border-neutral-800/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Wordmark */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm shadow-sm">
              ▲
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white">
                  AgentAtlas
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Interactive visual playground for AI & agents
              </p>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
              title="Toggle dark/light mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenFreeApis}
              className="px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Free APIs</span>
            </button>
            <button
              onClick={() => onToggleView(activeView === 'map' ? 'list' : 'map')}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
            >
              {activeView === 'map' ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Minimalist Learning Path Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl border overflow-x-auto max-w-full scrollbar-none bg-neutral-100/80 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800">
          {learningPaths.map((path) => {
            const isSelected = selectedPathId === path.id;
            return (
              <button
                key={path.id}
                onClick={() => onSelectPath(path.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-semibold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
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

        {/* Right Action Controls: Dark/White Toggle, Free APIs, View Switcher & Motion */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Free APIs Button */}
          <button
            onClick={onOpenFreeApis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-200"
          >
            <Gift className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Free APIs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">$0</span>
          </button>

          {/* Map vs List Switcher */}
          <div className="flex items-center p-0.5 rounded-xl border bg-neutral-100/80 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => onToggleView('map')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeView === 'map'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
            <button
              onClick={() => onToggleView('list')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeView === 'list'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border transition-colors bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-300"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Motion Toggle Button */}
          <button
            onClick={onToggleMotion}
            className="p-2 rounded-xl border transition-colors bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-300"
            title={reducedMotion ? "Resume float motion" : "Pause float motion"}
          >
            {reducedMotion ? <Play className="w-3.5 h-3.5 text-neutral-500" /> : <Pause className="w-3.5 h-3.5 text-neutral-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
