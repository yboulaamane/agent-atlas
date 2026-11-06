import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Concept, ToolExample } from '../types';
import { CLUSTERS } from '../data/clustersData';
import { ConceptVisualDemo } from './visuals/ConceptVisualDemo';
import { 
  X, ChevronRight, ChevronLeft, ExternalLink, 
  Lightbulb, CheckCircle2, AlertTriangle, ArrowRight, 
  Calendar, Layers, BookOpen, Wrench, Shield, Check, HelpCircle
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#06b6d4', '#10b981', '#8b5cf6']
      });
    }
  };

  // Find related concepts
  const connectedConcepts = allConcepts.filter((c) =>
    concept.connectedConceptIds.includes(c.id)
  );

  // Find current tool example
  const activeToolExample = concept.toolExamples.find(
    (t) => t.platform === selectedTool
  ) || concept.toolExamples[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span 
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${cluster.badgeBg}`}
            >
              {cluster.name}
            </span>
            {concept.isImageOriginal && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800 font-mono">
                2026 Core
              </span>
            )}
            {concept.isBeginnerPrereq && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                Beginner Essential
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleMastered(concept.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isMastered 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-400' : 'text-slate-400'}`} />
              {isMastered ? 'Mastered' : 'Mark as Learned'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-6 flex-1">
          {/* Title & Tagline */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              {concept.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Part of <span className="text-slate-200 font-medium">{cluster.name}</span> • {cluster.tagline}
            </p>
          </div>

          {/* Tab Switcher: "Understand It" vs "Find It In My Tool" */}
          <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('understand')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'understand'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              1. Understand It (Platform Neutral)
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'tools'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-4 h-4" />
              2. Find It In My Tool (Product Picker)
            </button>
          </div>

          {activeTab === 'understand' ? (
            <div className="space-y-6">
              {/* Part 1: Plain-Language Explanation */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Plain-Language Explanation
                </span>
                <p className="text-base text-slate-100 leading-relaxed font-normal">
                  {concept.plainExplanation}
                </p>
              </div>

              {/* Part 2: Relatable Analogy */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">💡</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Relatable Analogy: {concept.analogy.headline}
                  </span>
                </div>
                <p className="text-sm text-amber-100/90 leading-relaxed italic pl-7">
                  "{concept.analogy.story}"
                </p>
              </div>

              {/* Part 3: Tiny Animated Visual Demonstration */}
              <div>
                <ConceptVisualDemo 
                  type={concept.visualType} 
                  conceptTitle={concept.title} 
                />
              </div>

              {/* Part 4: Practical Relevance */}
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  Practical Relevance: Where would I encounter this?
                </span>
                <p className="text-sm font-semibold text-blue-200">
                  {concept.practicalRelevance.whereEncountered}
                </p>
                <p className="text-xs text-slate-300 mt-2 bg-slate-950/50 p-2.5 rounded-xl border border-blue-500/20">
                  <span className="text-blue-300 font-bold">Real-world scenario:</span> {concept.practicalRelevance.realWorldExample}
                </p>
              </div>

              {/* Part 5: Quick Challenge / Mini-Quiz */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Quick Challenge
                  </span>
                  {isChallengeSolved && (
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-semibold">
                      Solved! 🎉
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-2 italic">
                  Scenario: {concept.quickChallenge.scenario}
                </p>
                <p className="text-sm font-bold text-slate-100 mb-3">
                  {concept.quickChallenge.question}
                </p>

                <div className="space-y-2">
                  {concept.quickChallenge.options.map((option, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    let optionStyle = 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500';

                    if (isQuizSubmitted) {
                      if (option.isCorrect) {
                        optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-medium';
                      } else if (isSelected && !option.isCorrect) {
                        optionStyle = 'bg-red-950/80 border-red-500 text-red-200';
                      }
                    }

                    return (
                      <div key={idx} className="space-y-1">
                        <button
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${optionStyle}`}
                        >
                          <span className="font-mono text-slate-400 font-bold">{String.fromCharCode(65 + idx)}.</span>
                          <span className="flex-1">{option.text}</span>
                        </button>
                        {isQuizSubmitted && isSelected && (
                          <div className={`text-[11px] p-2.5 rounded-lg border ${option.isCorrect ? 'bg-emerald-900/30 text-emerald-300 border-emerald-800' : 'bg-red-900/30 text-red-300 border-red-800'}`}>
                            {option.isCorrect ? '✅ ' : '❌ '} {option.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* "Go Deeper" Collapsible Drawer */}
              <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setIsGoDeeperOpen(!isGoDeeperOpen)}
                  className="w-full flex items-center justify-between p-4 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    "Go Deeper": Technical Details, Nuances & Sources
                  </span>
                  <span className="text-cyan-400 text-xs font-mono">
                    {isGoDeeperOpen ? '▲ Hide' : '▼ Expand'}
                  </span>
                </button>

                {isGoDeeperOpen && (
                  <div className="p-4 pt-0 space-y-4 text-xs border-t border-slate-800/80 mt-2">
                    <div>
                      <h4 className="font-bold text-slate-200 mb-1">Technical Architecture Summary:</h4>
                      <p className="text-slate-400 leading-relaxed font-mono text-[11px]">
                        {concept.goDeeper.technicalSummary}
                      </p>
                    </div>

                    {concept.goDeeper.nuanceOrAmbiguity && (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Nuance & Ambiguity Note:
                        </span>
                        <p className="text-amber-200/90 text-[11px]">
                          {concept.goDeeper.nuanceOrAmbiguity}
                        </p>
                      </div>
                    )}

                    {concept.goDeeper.architectureNotes && (
                      <div>
                        <h4 className="font-bold text-slate-300 mb-1">Implementation Components:</h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                          {concept.goDeeper.architectureNotes.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-slate-300 mb-1">Foundational Sources & Specifications:</h4>
                      <div className="space-y-1.5">
                        {concept.goDeeper.sources.map((src, i) => (
                          <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px]">
                            <span className="font-semibold text-cyan-300">{src.title}</span>
                            {src.description && <p className="text-slate-400 text-[10px]">{src.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-2 border-t border-slate-900">
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
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Platform Comparison
                </span>
                <p className="text-xs text-slate-300">
                  See how <strong className="text-white">{concept.title}</strong> is named, exposed, or configured across different tools. If a product does not have an exact equivalent, we state it explicitly.
                </p>
              </div>

              {/* Product Tabs */}
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
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-base mb-0.5">{p.icon}</div>
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Active Product Details */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">
                      {activeToolExample.platformName}
                    </span>
                    <span className="text-xs text-slate-400">→ Feature:</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      {activeToolExample.featureName}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                    activeToolExample.status === 'supported'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : activeToolExample.status === 'partial'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {activeToolExample.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeToolExample.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold block mb-1">📍 Where to find it in the UI / Code:</span>
                  <code className="text-cyan-300 font-mono text-[11px]">
                    {activeToolExample.howToFind}
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Connected Concepts Links */}
          {connectedConcepts.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                🔗 Connected Concepts (Explore Next):
              </span>
              <div className="flex flex-wrap gap-2">
                {connectedConcepts.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectConcept(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs text-slate-200 transition-all hover:scale-105"
                  >
                    <span>{item.shortLabel}</span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
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
