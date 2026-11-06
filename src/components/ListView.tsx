import React, { useState, useMemo } from 'react';
import { Concept, ClusterId } from '../types';
import { CLUSTERS } from '../data/clustersData';
import { Search, ArrowRight, X } from 'lucide-react';

interface Props {
  concepts: Concept[];
  onSelectConcept: (concept: Concept) => void;
  masteredIds: string[];
  challengeSolvedIds: string[];
}

export const ListView: React.FC<Props> = ({
  concepts,
  onSelectConcept,
  masteredIds,
  challengeSolvedIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<ClusterId | 'all'>('all');

  // Filtered concepts
  const filteredConcepts = useMemo(() => {
    return concepts.filter((c) => {
      const matchesSearch = 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.plainExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCluster = selectedCluster === 'all' || c.cluster === selectedCluster;

      return matchesSearch && matchesCluster;
    });
  }, [concepts, searchQuery, selectedCluster]);

  // Group by Cluster
  const groupedConcepts = useMemo(() => {
    const groups: { clusterId: ClusterId; items: Concept[] }[] = [];
    const clusterOrder: ClusterId[] = [
      'start-here',
      'agent-architecture',
      'instructions-context',
      'tools-connections',
      'knowledge-memory',
      'agent-teamwork',
      'model-adaptation',
      'reliability-safety',
      'deployment-efficiency',
    ];

    for (const cid of clusterOrder) {
      const items = filteredConcepts.filter((c) => c.cluster === cid);
      if (items.length > 0) {
        groups.push({ clusterId: cid, items });
      }
    }

    return groups;
  }, [filteredConcepts]);

  return (
    <div className="w-full space-y-6">
      {/* Search & Island Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 rounded-3xl border transition-colors bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts by keyword (e.g. MCP, Harness, RAG)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl border text-sm transition-colors bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Island Filter Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCluster('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCluster === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Islands ({concepts.length})
          </button>
        </div>
      </div>

      {/* Cluster Filter Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(Object.keys(CLUSTERS) as ClusterId[]).map((cid) => {
          const info = CLUSTERS[cid];
          const isSelected = selectedCluster === cid;
          return (
            <button
              key={cid}
              onClick={() => setSelectedCluster(isSelected ? 'all' : cid)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap ${
                isSelected 
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white font-bold shadow-sm'
                  : 'bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
              {info.name}
            </button>
          );
        })}
      </div>

      {/* Grouped Results */}
      {groupedConcepts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 text-neutral-400">
          <p className="text-base font-semibold text-neutral-800 dark:text-neutral-200">No concepts found matching "{searchQuery}"</p>
          <p className="text-xs text-neutral-500 mt-1">Try searching for terms like "Harness", "MCP", or "Agent".</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedConcepts.map(({ clusterId, items }) => {
            const cluster = CLUSTERS[clusterId];
            return (
              <div key={clusterId} className="space-y-3">
                {/* Island Section Header */}
                <div className="flex items-center justify-between border-b pb-2 border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: cluster.color }} 
                    />
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                      {cluster.name}
                    </h3>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">
                      ({items.length})
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 hidden sm:inline">
                    {cluster.tagline}
                  </span>
                </div>

                {/* Grid of Concept Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {items.map((concept) => {
                    const isMastered = masteredIds.includes(concept.id);
                    const isSolved = challengeSolvedIds.includes(concept.id);

                    return (
                      <div
                        key={concept.id}
                        onClick={() => onSelectConcept(concept)}
                        className="group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white hover:bg-neutral-50/80 border-neutral-200 hover:border-neutral-300 dark:bg-[#121214] dark:hover:bg-[#161619] dark:border-neutral-800 dark:hover:border-neutral-700 shadow-sm hover:shadow"
                      >
                        <div>
                          {/* Card Top Badges */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span 
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cluster.badgeBg}`}
                            >
                              {cluster.name}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {concept.isImageOriginal && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded border font-mono bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800">
                                  2026 Core
                                </span>
                              )}
                              {isMastered && (
                                <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold" title="Mastered">
                                  ✓
                                </span>
                              )}
                              {isSolved && (
                                <span className="text-amber-500 text-xs font-bold" title="Challenge Solved">
                                  ★
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Concept Title */}
                          <h4 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors flex items-center justify-between">
                            <span>{concept.title}</span>
                            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-all" />
                          </h4>

                          {/* Plain-Language 2-Sentence Preview */}
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                            {concept.plainExplanation}
                          </p>

                          {/* Analogy Hook */}
                          <div className="mt-3 p-2 rounded-xl border text-[11px] italic bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                            💡 "{concept.analogy.headline}"
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-[11px] text-neutral-400">
                          <span className="truncate max-w-[200px]">{concept.practicalRelevance.whereEncountered.split(',')[0]}</span>
                          <span className="font-semibold text-neutral-900 dark:text-white group-hover:underline">
                            Inspect →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
