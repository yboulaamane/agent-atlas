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

  // Handle quiz option selection
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#121214]/95 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span 
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cluster.badgeBg}`}
            >
              {cluster.name}
            </span>
            {concept.isImageOriginal && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 font-mono">
                2026 Core
              </span>
            )}
            {concept.isBeginnerPrereq && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60">
                Essential
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleMastered(concept.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isMastered 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-300'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400'}`} />
              {isMastered ? 'Mastered' : 'Mark Learned'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">
          {/* Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {concept.title}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Island: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{cluster.name}</span> • {cluster.tagline}
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="flex p-1 rounded-2xl border bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab('understand')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'understand'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-bold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              1. Understand Concept
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'tools'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-bold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              2. Find In My Tool (Claude, Cursor, etc.)
            </button>
          </div>

          {activeTab === 'understand' ? (
            <div className="space-y-6">
              {/* Part 1: Plain-Language Explanation */}
              <div className="p-4 rounded-2xl border bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                  Plain-Language Explanation
                </span>
                <p className="text-base text-neutral-900 dark:text-neutral-100 leading-relaxed font-normal">
                  {concept.plainExplanation}
                </p>
              </div>

              {/* Part 2: Relatable Analogy */}
              <div className="p-4 rounded-2xl border bg-amber-500/[0.04] border-amber-500/20 dark:bg-amber-500/[0.06] dark:border-amber-500/25">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">💡</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Analogy: {concept.analogy.headline}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic pl-6 border-l-2 border-amber-500/30">
                  "{concept.analogy.story}"
                </p>
              </div>

              {/* Part 3: Animated Visual Demonstration */}
              <div>
                <ConceptVisualDemo 
                  type={concept.visualType} 
                  conceptTitle={concept.title} 
                />
              </div>

              {/* Part 4: Practical Relevance */}
              <div className="p-4 rounded-2xl border bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                  Practical Relevance
                </span>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                  {concept.practicalRelevance.whereEncountered}
                </p>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 p-3 rounded-xl border bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800">
                  <strong className="text-neutral-900 dark:text-neutral-200">Real-world scenario:</strong> {concept.practicalRelevance.realWorldExample}
                </div>
              </div>

              {/* Part 5: Quick Challenge */}
              <div className="p-5 rounded-2xl border bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Quick Challenge
                  </span>
                  {isChallengeSolved && (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold border bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                      Solved! ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 italic">
                  Scenario: {concept.quickChallenge.scenario}
                </p>
                <p className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
                  {concept.quickChallenge.question}
                </p>

                <div className="space-y-2">
                  {concept.quickChallenge.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    let optionStyle = 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-600';

                    if (isQuizSubmitted) {
                      if (option.isCorrect) {
                        optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 font-medium';
                      } else if (isSelected && !option.isCorrect) {
                        optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <div key={idx} className="space-y-1">
                        <button
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${optionStyle}`}
                        >
                          <span className="font-mono text-neutral-400 font-bold">{String.fromCharCode(65 + idx)}.</span>
                          <span className="flex-1">{option.text}</span>
                        </button>
                        {isQuizSubmitted && isSelected && (
                          <div className={`text-[11px] p-2.5 rounded-lg border ${option.isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'}`}>
                            {option.isCorrect ? '✓ ' : '✕ '} {option.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* "Go Deeper" Collapsible Drawer */}
              <div className="border rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-950/60 border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => setIsGoDeeperOpen(!isGoDeeperOpen)}
                  className="w-full flex items-center justify-between p-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-neutral-500" />
                    "Go Deeper": Technical Details, Nuance & Sources
                  </span>
                  <span className="text-neutral-500 text-xs font-mono">
                    {isGoDeeperOpen ? '▲ Hide' : '▼ Expand'}
                  </span>
                </button>

                {isGoDeeperOpen && (
                  <div className="p-4 pt-0 space-y-4 text-xs border-t border-neutral-200 dark:border-neutral-800 mt-2">
                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-200 mb-1">Architecture Summary:</h4>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono text-[11px]">
                        {concept.goDeeper.technicalSummary}
                      </p>
                    </div>

                    {concept.goDeeper.nuanceOrAmbiguity && (
                      <div className="p-3 rounded-xl border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40">
                        <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Nuance & Ambiguity Note:
                        </span>
                        <p className="text-amber-900 dark:text-amber-200/90 text-[11px]">
                          {concept.goDeeper.nuanceOrAmbiguity}
                        </p>
                      </div>
                    )}

                    {concept.goDeeper.architectureNotes && (
                      <div>
                        <h4 className="font-bold text-neutral-900 dark:text-neutral-300 mb-1">Implementation Components:</h4>
                        <ul className="list-disc list-inside space-y-1 text-neutral-600 dark:text-neutral-400 text-[11px]">
                          {concept.goDeeper.architectureNotes.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-neutral-900 dark:text-neutral-300 mb-1">Foundational Sources:</h4>
                      <div className="space-y-1.5">
                        {concept.goDeeper.sources.map((src, i) => (
                          <div key={i} className="p-2 rounded-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-[11px]">
                            <span className="font-semibold text-neutral-900 dark:text-white">{src.title}</span>
                            {src.description && <p className="text-neutral-500 dark:text-neutral-400 text-[10px]">{src.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-800">
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
              <div className="p-4 rounded-2xl border bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                  Platform Comparison
                </span>
                <p className="text-xs text-neutral-600 dark:text-neutral-300">
                  See how <strong className="text-neutral-900 dark:text-white">{concept.title}</strong> is named, exposed, or configured across different tools.
                </p>
              </div>

              {/* Product Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'claude', name: 'Claude', icon: '🟣' },
                  { id: 'cursor', name: 'Cursor / Codex', icon: '🔵' },
                  { id: 'chatgpt', name: 'ChatGPT', icon: '🟢' },
                  { id: 'grok', name: 'Grok', icon: '🟠' },
                  { id: 'opensource', name: 'Open Source', icon: '⚪' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedTool(p.id as ToolExample['platform'])}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-medium ${
                      selectedTool === p.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-sm'
                        : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="text-base mb-0.5">{p.icon}</div>
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Active Product Details */}
              <div className="p-5 rounded-2xl border bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-neutral-900 dark:text-white">
                      {activeToolExample.platformName}
                    </span>
                    <span className="text-xs text-neutral-400">→ Feature:</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border bg-neutral-100 text-neutral-800 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800">
                      {activeToolExample.featureName}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase border ${
                    activeToolExample.status === 'supported'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                      : activeToolExample.status === 'partial'
                      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
                  }`}>
                    {activeToolExample.status}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {activeToolExample.description}
                </p>

                <div className="p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 font-semibold block mb-1">📍 Where to find it:</span>
                  <code className="text-neutral-900 dark:text-neutral-100 font-mono text-[11px]">
                    {activeToolExample.howToFind}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Connected Concepts */}
          {connectedConcepts.length > 0 && (
            <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 block mb-2">
                Connected Concepts:
              </span>
              <div className="flex flex-wrap gap-2">
                {connectedConcepts.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectConcept(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-300"
                  >
                    <span>{item.shortLabel}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-400" />
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
