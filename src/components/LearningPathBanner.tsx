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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border transition-colors bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 shadow-sm gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl border bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              Viewing All Concepts
              <span className="text-xs font-normal text-neutral-500">({totalCount} interconnected terms)</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Interactive floating graph showing how harnesses, MCP, RAG 2.0, swarms, and memory connect.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onSelectPath('chatbots')}
            className="px-3 py-1.5 rounded-xl border text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium"
          >
            Start with Chatbot Basics →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border transition-colors bg-neutral-50 dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 shadow-sm gap-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700">
              Curated Path
            </span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {currentPath.title}
            </h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            {currentPath.description} ({activeCount} concepts active).
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => onSelectPath('all')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all shadow-sm bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          <Compass className="w-3.5 h-3.5" />
          Explore Everything ({totalCount})
        </button>
      </div>
    </div>
  );
};
