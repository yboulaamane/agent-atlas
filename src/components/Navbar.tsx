import React from 'react';
import { LearningPath, LearningPathId } from '../types';
import { 
  Compass, MessageSquare, Code, Bot, 
  Map, List, Sun, Moon, Play, Pause, Gift, Layers
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
    <header className="sticky top-0 z-40 w-full apple-glass border-b transition-colors duration-300 bg-white/80 dark:bg-black/75 border-black/[0.06] dark:border-white/[0.12] px-4 sm:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Apple Wordmark */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
                  AI Playground
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-black/[0.04] text-black/60 dark:bg-white/[0.1] dark:text-white/70">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-[#86868b] dark:text-[#a1a1a6]">
                Interactive guide to agents, harnesses & MCP
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7]"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onOpenFreeApis}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/[0.04] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Free APIs</span>
            </button>
            <button
              onClick={() => onToggleView(activeView === 'map' ? 'list' : 'map')}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.1] text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              {activeView === 'map' ? <List className="w-3.5 h-3.5" /> : <Map className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Apple Segmented Pill Selector */}
        <div className="flex items-center p-1 rounded-full border bg-black/[0.03] dark:bg-white/[0.08] border-black/[0.05] dark:border-white/[0.08] overflow-x-auto max-w-full scrollbar-none">
          {learningPaths.map((path) => {
            const isSelected = selectedPathId === path.id;
            return (
              <button
                key={path.id}
                onClick={() => onSelectPath(path.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm font-semibold'
                    : 'text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
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

        {/* Right Controls: Apple Minimalist Toolset */}
        <div className="hidden md:flex items-center gap-2">
          {/* Free APIs Button */}
          <button
            onClick={onOpenFreeApis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-[#f5f5f7]"
          >
            <Gift className="w-3.5 h-3.5 text-[#34c759]" />
            <span>Free APIs</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold bg-black/10 dark:bg-white/15">$0</span>
          </button>

          {/* View Switcher Segment */}
          <div className="flex items-center p-0.5 rounded-full border bg-black/[0.03] dark:bg-white/[0.08] border-black/[0.05] dark:border-white/[0.08]">
            <button
              onClick={() => onToggleView('map')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeView === 'map'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Canvas
            </button>
            <button
              onClick={() => onToggleView('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeView === 'list'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-[#f5f5f7]"
            title={isDark ? "Switch to Light appearance" : "Switch to Dark appearance"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-[#ffd60a]" /> : <Moon className="w-3.5 h-3.5 text-[#1d1d1f]" />}
          </button>

          {/* Motion Toggle */}
          <button
            onClick={onToggleMotion}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[#86868b] dark:text-[#a1a1a6]"
            title={reducedMotion ? "Resume physics" : "Pause physics"}
          >
            {reducedMotion ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
