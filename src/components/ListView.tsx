import React, { useState, useMemo } from 'react';
import { Concept, ClusterId } from '../types';
import { CLUSTERS } from '../data/clustersData';
import { Search, CheckCircle2, ArrowRight, Sparkles, Filter, X } from 'lucide-react';

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
      {/* Search & Cluster Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search concepts by name, keyword, or analogy (e.g. MCP, Harness, RAG)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Cluster Filter Pill */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCluster('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCluster === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
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
                  ? `${info.badgeBg} font-bold shadow-md`
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
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
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
          <p className="text-base font-semibold text-slate-300">No concepts found matching "{searchQuery}"</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or searching for terms like "Harness", "MCP", or "Agent".</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedConcepts.map(({ clusterId, items }) => {
            const cluster = CLUSTERS[clusterId];
            return (
              <div key={clusterId} className="space-y-3">
                {/* Island Section Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3 h-3 rounded-full shadow-lg" 
                      style={{ backgroundColor: cluster.color, boxShadow: `0 0 12px ${cluster.color}` }} 
                    />
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {cluster.name}
                    </h3>
                    <span className="text-xs text-slate-500">
                      ({items.length} {items.length === 1 ? 'concept' : 'concepts'})
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 hidden sm:inline">
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
                        className="group p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <div>
                          {/* Card Top Badges */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span 
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                              style={{ 
                                borderColor: `${cluster.color}40`, 
                                color: cluster.color,
                                backgroundColor: `${cluster.color}15`
                              }}
                            >
                              {cluster.name}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {concept.isImageOriginal && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono">
                                  2026 Core
                                </span>
                              )}
                              {isMastered && (
                                <span className="text-emerald-400 text-xs" title="Mastered">
                                  ✓
                                </span>
                              )}
                              {isSolved && (
                                <span className="text-amber-400 text-xs" title="Challenge Solved">
                                  ★
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Concept Title */}
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                            <span>{concept.title}</span>
                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                          </h4>

                          {/* Plain-Language 2-Sentence Preview */}
                          <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                            {concept.plainExplanation}
                          </p>

                          {/* Analogy Hook */}
                          <div className="mt-3 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-amber-200/90 italic">
                            💡 "{concept.analogy.headline}"
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{concept.practicalRelevance.whereEncountered.split(',')[0]}</span>
                          <span className="font-semibold text-cyan-400 group-hover:underline">
                            Explore →
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
