import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Concept, ToolExample } from '../types';
import { CLUSTERS } from '../data/clustersData';
import { ConceptVisualDemo } from './visuals/ConceptVisualDemo';
import { 
  X, Lightbulb, CheckCircle2, AlertTriangle, ArrowRight, 
  Calendar, BookOpen, Wrench, Check
} from 'lucide-react';

interface Props {
  concept: Concept;
  allConcepts: Concept[];
  onClose: () => void;
  onSelectConcept: (concept: Concept) => void;
  isMastered: boolean;
  onToggleMastered: (id: string) => void;
  isChallengeSolved: boolean;
  onMarkChallengeSolved: (id: string) => void;
}

export const ConceptModal: React.FC<Props> = ({
  concept,
  allConcepts,
  onClose,
  onSelectConcept,
  isMastered,
  onToggleMastered,
  isChallengeSolved,
  onMarkChallengeSolved,
}) => {
  const [activeTab, setActiveTab] = useState<'understand' | 'tools'>('understand');
  const [selectedTool, setSelectedTool] = useState<ToolExample['platform']>('claude');
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [isGoDeeperOpen, setIsGoDeeperOpen] = useState<boolean>(false);

  const cluster = CLUSTERS[concept.cluster];

  const handleSelectOption = (index: number) => {
    setSelectedQuizOption(index);
    setIsQuizSubmitted(true);
    if (concept.quickChallenge.options[index].isCorrect) {
      onMarkChallengeSolved(concept.id);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
      });
    }
  };

  const connectedConcepts = allConcepts.filter((c) =>
    concept.connectedConceptIds.includes(c.id)
  );

  const activeToolExample = concept.toolExamples.find(
    (t) => t.platform === selectedTool
  ) || concept.toolExamples[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-[32px] border overflow-hidden transition-all duration-300 bg-white dark:bg-[#1c1c1e] border-black/[0.08] dark:border-white/[0.12] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Apple Sheet Header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-[#1c1c1e]/80 sticky top-0 z-20 apple-glass">
          <div className="flex items-center gap-2.5">
            <span 
              className={`px-3 py-1 rounded-full text-xs font-medium border ${cluster.badgeBg}`}
            >
              {cluster.name}
            </span>
            {concept.isImageOriginal && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-mono bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b] dark:text-[#a1a1a6]">
                2026 Core
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleMastered(concept.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isMastered 
                  ? 'bg-[#34c759] text-white shadow-sm'
                  : 'bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-[#1d1d1f] dark:text-[#f5f5f7]'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${isMastered ? 'text-white' : 'text-[#86868b]'}`} />
              {isMastered ? 'Mastered' : 'Mark Learned'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-black/[0.05] hover:bg-black/[0.1] dark:bg-white/[0.1] dark:hover:bg-white/[0.18] text-[#86868b] dark:text-[#a1a1a6]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Apple Sheet Content */}
        <div className="overflow-y-auto px-7 py-6 space-y-6 flex-1">
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
              {concept.title}
            </h2>
            <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mt-1">
              Part of {cluster.name} • {cluster.tagline}
            </p>
          </div>

          {/* Apple Segmented Pill Controller */}
          <div className="flex p-1 rounded-full border bg-black/[0.03] dark:bg-white/[0.08] border-black/[0.04] dark:border-white/[0.06]">
            <button
              onClick={() => setActiveTab('understand')}
              className={`flex-1 py-1.5 px-4 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'understand'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              Understand Concept
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 py-1.5 px-4 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'tools'
                  ? 'bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white shadow-sm font-semibold'
                  : 'text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Find In My Tool (Claude, Cursor, etc.)
            </button>
          </div>

          {activeTab === 'understand' ? (
            <div className="space-y-6">
              {/* Part 1: Plain-Language Explanation */}
              <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#a1a1a6] block mb-1.5">
                  Overview
                </span>
                <p className="text-base text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed font-normal">
                  {concept.plainExplanation}
                </p>
              </div>

              {/* Part 2: Apple Spotlight Analogy */}
              <div className="p-5 rounded-2xl bg-amber-500/[0.05] dark:bg-amber-500/[0.08] border border-amber-500/15">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">💡</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                    Analogy: {concept.analogy.headline}
                  </span>
                </div>
                <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed italic pl-6 border-l-2 border-amber-500/30">
                  "{concept.analogy.story}"
                </p>
              </div>

              {/* Part 3: Interactive Demo Widget */}
              <div>
                <ConceptVisualDemo 
                  type={concept.visualType} 
                  conceptTitle={concept.title} 
                />
              </div>

              {/* Part 4: Practical Relevance */}
              <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#a1a1a6] block mb-1">
                  Where You Encounter This
                </span>
                <p className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {concept.practicalRelevance.whereEncountered}
                </p>
                <div className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] mt-2.5 p-3 rounded-xl bg-white dark:bg-[#161618] border border-black/[0.05] dark:border-white/[0.08]">
                  <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">Real-world scenario:</strong> {concept.practicalRelevance.realWorldExample}
                </div>
              </div>

              {/* Part 5: Apple Settings-style Challenge */}
              <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#34c759] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Quick Challenge
                  </span>
                  {isChallengeSolved && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-medium bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20">
                      Solved! ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#86868b] dark:text-[#a1a1a6] mb-1.5 italic">
                  Scenario: {concept.quickChallenge.scenario}
                </p>
                <p className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">
                  {concept.quickChallenge.question}
                </p>

                <div className="space-y-2">
                  {concept.quickChallenge.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    let optionStyle = 'bg-white dark:bg-[#161618] border-black/[0.06] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 text-[#1d1d1f] dark:text-[#f5f5f7]';

                    if (isQuizSubmitted) {
                      if (option.isCorrect) {
                        optionStyle = 'bg-[#34c759]/10 border-[#34c759]/40 text-[#1d1d1f] dark:text-[#f5f5f7] font-medium';
                      } else if (isSelected && !option.isCorrect) {
                        optionStyle = 'bg-[#ff3b30]/10 border-[#ff3b30]/40 text-[#ff3b30]';
                      }
                    }

                    return (
                      <div key={idx} className="space-y-1">
                        <button
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3 shadow-sm ${optionStyle}`}
                        >
                          <span className="font-mono text-[#86868b] font-semibold">{String.fromCharCode(65 + idx)}.</span>
                          <span className="flex-1">{option.text}</span>
                        </button>
                        {isQuizSubmitted && isSelected && (
                          <div className={`text-[11px] p-2.5 rounded-xl border ${option.isCorrect ? 'bg-[#34c759]/10 text-[#34c759] border-[#34c759]/20' : 'bg-[#ff3b30]/10 text-[#ff3b30] border-[#ff3b30]/20'}`}>
                            {option.isCorrect ? '✓ ' : '✕ '} {option.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Apple Disclosure Accordion (Go Deeper) */}
              <div className="border rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.05] dark:border-white/[0.06]">
                <button
                  onClick={() => setIsGoDeeperOpen(!isGoDeeperOpen)}
                  className="w-full flex items-center justify-between p-4 text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#86868b]" />
                    Technical Details & Sources
                  </span>
                  <span className="text-[#86868b] text-xs font-mono">
                    {isGoDeeperOpen ? 'Hide' : 'Expand'}
                  </span>
                </button>

                {isGoDeeperOpen && (
                  <div className="p-4 pt-0 space-y-4 text-xs border-t border-black/[0.05] dark:border-white/[0.06] mt-2">
                    <div>
                      <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Architecture Summary:</h4>
                      <p className="text-[#86868b] dark:text-[#a1a1a6] leading-relaxed font-mono text-[11px]">
                        {concept.goDeeper.technicalSummary}
                      </p>
                    </div>

                    {concept.goDeeper.nuanceOrAmbiguity && (
                      <div className="p-3 rounded-xl border bg-amber-500/[0.05] border-amber-500/20">
                        <span className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Nuance Note:
                        </span>
                        <p className="text-amber-900 dark:text-amber-200/90 text-[11px]">
                          {concept.goDeeper.nuanceOrAmbiguity}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-1">Foundational Sources:</h4>
                      <div className="space-y-1.5">
                        {concept.goDeeper.sources.map((src, i) => (
                          <div key={i} className="p-2.5 rounded-xl border bg-white dark:bg-[#161618] border-black/[0.05] dark:border-white/[0.08] text-[11px]">
                            <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{src.title}</span>
                            {src.description && <p className="text-[#86868b] dark:text-[#a1a1a6] text-[10px] mt-0.5">{src.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#86868b] pt-2 border-t border-black/[0.04] dark:border-white/[0.06]">
                      <Calendar className="w-3 h-3" />
                      <span>Last reviewed: {concept.goDeeper.lastReviewed}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* TAB 2: FIND IT IN MY TOOL */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#a1a1a6] block mb-1">
                  Platform Comparison
                </span>
                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                  See how <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">{concept.title}</strong> is named, exposed, or configured across different tools.
                </p>
              </div>

              {/* Product Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'claude', name: 'Claude', icon: '🟣' },
                  { id: 'cursor', name: 'Cursor', icon: '🔵' },
                  { id: 'chatgpt', name: 'ChatGPT', icon: '🟢' },
                  { id: 'grok', name: 'Grok', icon: '🟠' },
                  { id: 'opensource', name: 'Open Source', icon: '⚪' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedTool(p.id as ToolExample['platform'])}
                    className={`p-3 rounded-2xl border text-center transition-all text-xs font-medium ${
                      selectedTool === p.id
                        ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                        : 'bg-white dark:bg-[#161618] border-black/[0.06] dark:border-white/[0.08] text-[#86868b] dark:text-[#a1a1a6] hover:text-[#1d1d1f] dark:hover:text-white'
                    }`}
                  >
                    <div className="text-base mb-1">{p.icon}</div>
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Active Product Details */}
              <div className="p-5 rounded-2xl border bg-white dark:bg-[#161618] border-black/[0.06] dark:border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {activeToolExample.platformName}
                    </span>
                    <span className="text-xs text-[#86868b]">→ Feature:</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full border bg-black/[0.04] dark:bg-white/[0.08] border-black/[0.06] dark:border-white/[0.08]">
                      {activeToolExample.featureName}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium uppercase ${
                    activeToolExample.status === 'supported'
                      ? 'bg-[#34c759]/15 text-[#34c759]'
                      : activeToolExample.status === 'partial'
                      ? 'bg-[#ff9500]/15 text-[#ff9500]'
                      : 'bg-black/[0.04] dark:bg-white/[0.08] text-[#86868b]'
                  }`}>
                    {activeToolExample.status}
                  </span>
                </div>

                <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
                  {activeToolExample.description}
                </p>

                <div className="p-3 rounded-xl border bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.06] text-xs">
                  <span className="text-[#86868b] font-medium block mb-1">📍 Where to find it:</span>
                  <code className="text-[#1d1d1f] dark:text-[#f5f5f7] font-mono text-[11px]">
                    {activeToolExample.howToFind}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Connected Concepts */}
          {connectedConcepts.length > 0 && (
            <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
              <span className="text-xs font-medium text-[#86868b] block mb-2">
                Connected Concepts:
              </span>
              <div className="flex flex-wrap gap-2">
                {connectedConcepts.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectConcept(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all bg-black/[0.02] hover:bg-black/[0.06] dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border-black/[0.05] dark:border-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]"
                  >
                    <span>{item.shortLabel}</span>
                    <ArrowRight className="w-3 h-3 text-[#86868b]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
