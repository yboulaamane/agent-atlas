import React, { useState, useEffect } from 'react';
import { CONCEPTS } from './data/conceptsData';
import { LEARNING_PATHS, CLUSTERS } from './data/clustersData';
import { Concept, LearningPathId } from './types';
import { Navbar } from './components/Navbar';
import { LearningPathBanner } from './components/LearningPathBanner';
import { BubbleUniverse } from './components/BubbleUniverse';
import { ListView } from './components/ListView';
import { ConceptModal } from './components/ConceptModal';
import { FreeApiModal } from './components/FreeApiModal';
import { RefreshCw, Gift } from 'lucide-react';

export function App() {
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<LearningPathId>('all');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isFreeApiModalOpen, setIsFreeApiModalOpen] = useState<boolean>(false);

  // Local storage state for progress tracking
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ai_glossary_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [challengeSolvedIds, setChallengeSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ai_glossary_solved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ai_glossary_mastered', JSON.stringify(masteredIds));
    } catch {
      // ignore
    }
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_glossary_solved', JSON.stringify(challengeSolvedIds));
    } catch {
      // ignore
    }
  }, [challengeSolvedIds]);

  // Current learning path
  const currentPath = LEARNING_PATHS.find((p) => p.id === selectedPathId) || LEARNING_PATHS[0];
  const activePathConceptIds = currentPath.conceptIds;

  // Toggle mastered status
  const handleToggleMastered = (id: string) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Mark challenge solved
  const handleMarkChallengeSolved = (id: string) => {
    setChallengeSolvedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Reset progress helper
  const handleResetProgress = () => {
    if (window.confirm('Reset all learned concepts and quiz progress?')) {
      setMasteredIds([]);
      setChallengeSolvedIds([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header */}
      <Navbar
        activeView={activeView}
        onToggleView={setActiveView}
        learningPaths={LEARNING_PATHS}
        selectedPathId={selectedPathId}
        onSelectPath={setSelectedPathId}
        reducedMotion={reducedMotion}
        onToggleMotion={() => setReducedMotion(!reducedMotion)}
        masteredCount={masteredIds.length}
        totalConcepts={CONCEPTS.length}
        solvedCount={challengeSolvedIds.length}
        onOpenFreeApis={() => setIsFreeApiModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Guided Learning Path Banner */}
        <LearningPathBanner
          currentPath={currentPath}
          onSelectPath={setSelectedPathId}
          activeCount={activePathConceptIds.length}
          totalCount={CONCEPTS.length}
        />

        {/* View Switcher Container */}
        {activeView === 'map' ? (
          <div className="space-y-4">
            <BubbleUniverse
              concepts={CONCEPTS}
              selectedConcept={selectedConcept}
              onSelectConcept={setSelectedConcept}
              activePathConceptIds={activePathConceptIds}
              reducedMotion={reducedMotion}
              masteredIds={masteredIds}
              challengeSolvedIds={challengeSolvedIds}
            />

            {/* Quick helper banner below bubble map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <span className="font-bold text-cyan-300 block mb-0.5">🫧 Click any floating bubble</span>
                Opens a 5-part lesson card: plain language explanation, relatable analogy, animated demo, practical touchpoint & quick challenge.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <span className="font-bold text-violet-300 block mb-0.5">⚙️ "Find It In My Tool"</span>
                Switch between Claude, Cursor/Codex, ChatGPT, Grok, and Open Source to see how each concept is named and configured.
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
                <span className="font-bold text-emerald-300 block mb-0.5">🔒 100% Client-Side & Fast</span>
                Runs completely in your browser with zero logins, no live API keys needed, and ready for instant GitHub + Vercel deployment.
              </div>
            </div>
          </div>
        ) : (
          <ListView
            concepts={CONCEPTS}
            onSelectConcept={setSelectedConcept}
            masteredIds={masteredIds}
            challengeSolvedIds={challengeSolvedIds}
          />
        )}
      </main>

      {/* Modal / Card overlay if concept is selected */}
      {selectedConcept && (
        <ConceptModal
          concept={selectedConcept}
          allConcepts={CONCEPTS}
          onClose={() => setSelectedConcept(null)}
          onSelectConcept={setSelectedConcept}
          isMastered={masteredIds.includes(selectedConcept.id)}
          onToggleMastered={handleToggleMastered}
          isChallengeSolved={challengeSolvedIds.includes(selectedConcept.id)}
          onMarkChallengeSolved={handleMarkChallengeSolved}
        />
      )}

      {/* Free APIs Modal Guide */}
      <FreeApiModal
        isOpen={isFreeApiModalOpen}
        onClose={() => setIsFreeApiModalOpen(false)}
        onOpenConcept={() => {
          const c = CONCEPTS.find((item) => item.id === 'ai-apis');
          if (c) setSelectedConcept(c);
        }}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="text-base">🔮</span>
            <div>
              <p className="text-slate-300 font-semibold">
                AI Concept Playground • Designed for normal users & builders
              </p>
              <p className="text-[11px] text-slate-500">
                Covering the complete 2026 landscape: Harnesses, MCP, Loop Engineering, Swarms, RAG 2.0 & beyond.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFreeApiModalOpen(true)}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <Gift className="w-3.5 h-3.5" />
              Free AI APIs Guide
            </button>
            <span className="text-slate-700">|</span>
            {(masteredIds.length > 0 || challengeSolvedIds.length > 0) && (
              <>
                <button
                  onClick={handleResetProgress}
                  className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
                  title="Reset localStorage progress"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Progress
                </button>
                <span className="text-slate-700">|</span>
              </>
            )}
            <span>Reviewed November 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
