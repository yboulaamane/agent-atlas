import React from 'react';
import { LearningPath, LearningPathId } from '../types';
import { Sparkles, Compass } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-[28px] border transition-colors bg-white dark:bg-[#1c1c1e] border-black/[0.06] dark:border-white/[0.08] shadow-sm gap-3">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]">
            <Compass className="w-4 h-4 text-[#0071e3]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2">
              All Concepts
              <span className="text-xs font-normal text-[#86868b]">({totalCount} interconnected terms)</span>
            </h3>
            <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
              Interactive canvas illustrating how harnesses, MCP, RAG 2.0, swarms, and memory layers relate.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onSelectPath('chatbots')}
            className="px-4 py-1.5 rounded-full border transition-colors font-medium bg-black/[0.03] hover:bg-black/[0.06] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]"
          >
            Start with Chatbots →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-[28px] border transition-colors bg-white dark:bg-[#1c1c1e] border-black/[0.06] dark:border-white/[0.08] shadow-sm gap-3">
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#0071e3]/10 text-[#0071e3]">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3]">
              Curated Path
            </span>
            <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
              {currentPath.title}
            </h3>
          </div>
          <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-0.5">
            {currentPath.description} ({activeCount} active).
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => onSelectPath('all')}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold transition-all shadow-sm bg-[#0071e3] hover:bg-[#0077ed] text-white"
        >
          <Compass className="w-3.5 h-3.5" />
          Explore All ({totalCount})
        </button>
      </div>
    </div>
  );
};
