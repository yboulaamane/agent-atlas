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
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 rounded-[28px] border transition-colors bg-white dark:bg-[#1c1c1e] border-black/[0.06] dark:border-white/[0.08] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts (e.g. MCP, Harness, RAG)..."
            className="w-full pl-11 pr-10 py-2.5 rounded-full border text-sm transition-colors bg-black/[0.03] dark:bg-white/[0.06] border-black/[0.04] dark:border-white/[0.06] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-none focus:border-black/20 dark:focus:border-white/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter All Pill */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCluster('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCluster === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                : 'bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            All Islands ({concepts.length})
          </button>
        </div>
      </div>

      {/* Cluster Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(Object.keys(CLUSTERS) as ClusterId[]).map((cid) => {
          const info = CLUSTERS[cid];
          const isSelected = selectedCluster === cid;
          return (
            <button
              key={cid}
              onClick={() => setSelectedCluster(isSelected ? 'all' : cid)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                isSelected 
                  ? 'bg-black text-white dark:bg-white dark:text-black border-transparent font-semibold shadow-sm'
                  : 'bg-white dark:bg-[#1c1c1e] border-black/[0.06] dark:border-white/[0.08] text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
              {info.name}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {groupedConcepts.length === 0 ? (
        <div className="p-12 text-center rounded-[28px] border bg-white dark:bg-[#1c1c1e] border-black/[0.06] dark:border-white/[0.08] text-[#86868b]">
          <p className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">No matching concepts</p>
          <p className="text-xs text-[#86868b] mt-1">Try searching for terms like "Harness", "MCP", or "Agent".</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedConcepts.map(({ clusterId, items }) => {
            const cluster = CLUSTERS[clusterId];
            return (
              <div key={clusterId} className="space-y-3.5">
                {/* Island Section Header */}
                <div className="flex items-center justify-between border-b pb-2.5 border-black/[0.06] dark:border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: cluster.color }} 
                    />
                    <h3 className="text-base font-bold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                      {cluster.name}
                    </h3>
                    <span className="text-xs text-[#86868b]">
                      ({items.length})
                    </span>
                  </div>
                  <span className="text-xs text-[#86868b] hidden sm:inline">
                    {cluster.tagline}
                  </span>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((concept) => {
                    const isMastered = masteredIds.includes(concept.id);
                    const isSolved = challengeSolvedIds.includes(concept.id);

                    return (
                      <div
                        key={concept.id}
                        onClick={() => onSelectConcept(concept)}
                        className="group p-5 rounded-[24px] border transition-all duration-300 cursor-pointer flex flex-col justify-between bg-white hover:bg-black/[0.01] border-black/[0.06] hover:border-black/[0.12] dark:bg-[#1c1c1e] dark:hover:bg-[#252528] dark:border-white/[0.08] dark:hover:border-white/[0.16] shadow-sm hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div>
                          {/* Card Badges */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span 
                              className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${cluster.badgeBg}`}
                            >
                              {cluster.name}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {concept.isImageOriginal && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] dark:text-[#a1a1a6]">
                                  2026 Core
                                </span>
                              )}
                              {isMastered && (
                                <span className="text-[#34c759] text-xs font-bold" title="Mastered">
                                  ✓
                                </span>
                              )}
                              {isSolved && (
                                <span className="text-[#ff9500] text-xs font-bold" title="Challenge Solved">
                                  ★
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="text-base font-bold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0071e3] transition-colors flex items-center justify-between">
                            <span>{concept.title}</span>
                            <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:translate-x-1 transition-all" />
                          </h4>

                          {/* Plain-Language 2-Sentence Preview */}
                          <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mt-2 line-clamp-3 leading-relaxed">
                            {concept.plainExplanation}
                          </p>

                          {/* Analogy Hook */}
                          <div className="mt-3 p-2.5 rounded-xl border text-[11px] italic bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.06] text-[#86868b] dark:text-[#a1a1a6]">
                            💡 "{concept.analogy.headline}"
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-[#86868b]">
                          <span className="truncate max-w-[200px]">{concept.practicalRelevance.whereEncountered.split(',')[0]}</span>
                          <span className="font-semibold text-[#0071e3] group-hover:underline">
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
