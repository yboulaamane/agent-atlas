import React, { useState, useEffect } from 'react';
import { CONCEPTS } from './data/conceptsData';
import { LEARNING_PATHS } from './data/clustersData';
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

  // Theme state: dark or light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('agentatlas_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('agentatlas_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Local storage state for progress tracking
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('agentatlas_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [challengeSolvedIds, setChallengeSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('agentatlas_solved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('agentatlas_mastered', JSON.stringify(masteredIds));
    } catch {
      // ignore
    }
  }, [masteredIds]);

  useEffect(() => {
    try {
      localStorage.setItem('agentatlas_solved', JSON.stringify(challengeSolvedIds));
    } catch {
      // ignore
    }
  }, [challengeSolvedIds]);

  const currentPath = LEARNING_PATHS.find((p) => p.id === selectedPathId) || LEARNING_PATHS[0];
  const activePathConceptIds = currentPath.conceptIds;

  const handleToggleMastered = (id: string) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMarkChallengeSolved = (id: string) => {
    setChallengeSolvedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all learned concepts and quiz progress?')) {
      setMasteredIds([]);
      setChallengeSolvedIds([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-[#fafafa] text-neutral-900 dark:bg-[#09090b] dark:text-neutral-100 selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
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
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Curated Learning Path Banner */}
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
              theme={theme}
            />

            {/* Minimalist Cards Below Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl border transition-colors bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 shadow-sm">
                <span className="font-bold text-neutral-900 dark:text-white block mb-0.5">Explore Floating Nodes</span>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Click any bubble to view 5-part cards: plain-language explanation, everyday analogy, animated demo, real-world context, and challenge.
                </p>
              </div>
              <div className="p-4 rounded-2xl border transition-colors bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 shadow-sm">
                <span className="font-bold text-neutral-900 dark:text-white block mb-0.5">Tool Comparison Engine</span>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Switch between Claude, Cursor/Codex, ChatGPT, Grok, and Open Source to see how each tool exposes the underlying concept.
                </p>
              </div>
              <div className="p-4 rounded-2xl border transition-colors bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 shadow-sm">
                <span className="font-bold text-neutral-900 dark:text-white block mb-0.5">Zero Cost & Client-Side</span>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  100% private, runs offline in your browser without requiring logins, accounts, or live API keys.
                </p>
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

      {/* Modal / Card overlay */}
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
      <footer className="mt-12 border-t transition-colors bg-white dark:bg-[#09090b] border-neutral-200 dark:border-neutral-850 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm">▲</span>
            <div>
              <p className="font-semibold text-neutral-900 dark:text-white">
                AgentAtlas • Interactive visual playground for modern AI & autonomous systems
              </p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Covering the complete 2026 landscape: Harnesses, MCP, Loop Engineering, Swarms, RAG 2.0 & Free APIs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFreeApiModalOpen(true)}
              className="font-medium text-neutral-900 dark:text-white hover:underline transition-colors flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5" />
              Free APIs Guide
            </button>
            <span className="text-neutral-300 dark:text-neutral-800">|</span>
            {(masteredIds.length > 0 || challengeSolvedIds.length > 0) && (
              <>
                <button
                  onClick={handleResetProgress}
                  className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                  title="Reset localStorage progress"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Progress
                </button>
                <span className="text-neutral-300 dark:text-neutral-800">|</span>
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
