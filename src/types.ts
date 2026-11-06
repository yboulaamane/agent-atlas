export type ClusterId = 
  | 'start-here'
  | 'agent-architecture'
  | 'instructions-context'
  | 'tools-connections'
  | 'knowledge-memory'
  | 'agent-teamwork'
  | 'model-adaptation'
  | 'reliability-safety'
  | 'deployment-efficiency';

export interface ClusterInfo {
  id: ClusterId;
  name: string;
  tagline: string;
  color: string; // tailwind color or hex
  glowColor: string;
  badgeBg: string;
  iconName: string;
}

export type LearningPathId = 'all' | 'chatbots' | 'coding-assistants' | 'agents';

export interface LearningPath {
  id: LearningPathId;
  title: string;
  description: string;
  icon: string;
  conceptIds: string[];
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizChallenge {
  question: string;
  scenario: string;
  options: QuizOption[];
}

export interface ToolExample {
  platform: 'claude' | 'cursor' | 'chatgpt' | 'grok' | 'opensource';
  platformName: string;
  featureName: string;
  status: 'supported' | 'partial' | 'not-applicable';
  description: string;
  howToFind: string;
}

export interface GoDeeper {
  technicalSummary: string;
  nuanceOrAmbiguity?: string;
  architectureNotes?: string[];
  sources: { title: string; url?: string; description?: string }[];
  lastReviewed: string; // e.g. "November 2026"
}

export type VisualDemoType = 
  | 'skills-pack'
  | 'harness-rig'
  | 'mcp-plug'
  | 'stateless-mcp'
  | 'agent-loop'
  | 'graph-flow'
  | 'rag-pipeline'
  | 'memory-layers'
  | 'tool-call'
  | 'swarm-network'
  | 'guardrail-scanner'
  | 'ai-gateway'
  | 'context-window'
  | 'vector-space'
  | 'fine-tune'
  | 'distillation'
  | 'cost-optimizer'
  | 'observability-trace'
  | 'eval-benchmark'
  | 'multi-agent-collab'
  | 'synthetic-data'
  | 'generic-flow';

export interface Concept {
  id: string;
  title: string;
  shortLabel: string;
  cluster: ClusterId;
  isImageOriginal: boolean; // One of the 22 from the image
  isBeginnerPrereq?: boolean;
  order: number;
  // 5 core pieces:
  plainExplanation: string;
  analogy: {
    headline: string;
    story: string;
  };
  visualType: VisualDemoType;
  practicalRelevance: {
    whereEncountered: string;
    realWorldExample: string;
  };
  quickChallenge: QuizChallenge;
  // Extra features:
  goDeeper: GoDeeper;
  toolExamples: ToolExample[];
  connectedConceptIds: string[];
  tags: string[];
}
