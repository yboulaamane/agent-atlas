import { ClusterId, ClusterInfo, LearningPath } from '../types';

export const CLUSTERS: Record<ClusterId, ClusterInfo> = {
  'start-here': {
    id: 'start-here',
    name: 'Start Here',
    tagline: 'The foundational building blocks everyone should know',
    color: '#0284c7', // Sky
    glowColor: 'rgba(2, 132, 199, 0.15)',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800/50',
    iconName: 'Sparkles',
  },
  'agent-architecture': {
    id: 'agent-architecture',
    name: 'Agent Architecture',
    tagline: 'How autonomous AI agents think, act, and maintain control',
    color: '#7c3aed', // Violet
    glowColor: 'rgba(124, 58, 237, 0.15)',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800/50',
    iconName: 'Cpu',
  },
  'instructions-context': {
    id: 'instructions-context',
    name: 'Instructions & Context',
    tagline: 'Shaping what the AI knows and how it behaves',
    color: '#2563eb', // Blue
    glowColor: 'rgba(37, 99, 235, 0.15)',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50',
    iconName: 'FileText',
  },
  'tools-connections': {
    id: 'tools-connections',
    name: 'Tools & Connections',
    tagline: 'Empowering models to interact with APIs, databases, and apps',
    color: '#059669', // Emerald
    glowColor: 'rgba(5, 150, 105, 0.15)',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50',
    iconName: 'Wrench',
  },
  'knowledge-memory': {
    id: 'knowledge-memory',
    name: 'Knowledge & Memory',
    tagline: 'Remembering facts, searching vast documents, and recalling past chats',
    color: '#d97706', // Amber
    glowColor: 'rgba(217, 119, 6, 0.15)',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50',
    iconName: 'Database',
  },
  'agent-teamwork': {
    id: 'agent-teamwork',
    name: 'Agent Teamwork',
    tagline: 'Orchestrating squads of specialized agents working together',
    color: '#db2777', // Pink
    glowColor: 'rgba(219, 39, 119, 0.15)',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-800/50',
    iconName: 'Users',
  },
  'model-adaptation': {
    id: 'model-adaptation',
    name: 'Model Adaptation',
    tagline: 'Customizing, teaching, and shrinking models for specific tasks',
    color: '#4f46e5', // Indigo
    glowColor: 'rgba(79, 70, 229, 0.15)',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/50',
    iconName: 'Sliders',
  },
  'reliability-safety': {
    id: 'reliability-safety',
    name: 'Reliability & Safety',
    tagline: 'Making sure AI is truthful, safe, monitored, and tested',
    color: '#e11d48', // Rose
    glowColor: 'rgba(225, 29, 72, 0.15)',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800/50',
    iconName: 'ShieldCheck',
  },
  'deployment-efficiency': {
    id: 'deployment-efficiency',
    name: 'Deployment & Efficiency',
    tagline: 'Routing traffic, cutting costs, and speeding up response times',
    color: '#0d9488', // Teal
    glowColor: 'rgba(13, 148, 136, 0.15)',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-800/50',
    iconName: 'Zap',
  },
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'all',
    title: 'Explore All',
    description: 'Every modern AI concept, from basic prompts to autonomous agent harnesses and swarms.',
    icon: 'Compass',
    conceptIds: [
      'models', 'prompts-tokens', 'context-window', 'hallucinations',
      'harness', 'agentic-ai', 'loop-engineering', 'graph-engineering',
      'context-engineering', 'skills', 'prompt-optimization',
      'tool-use', 'function-calling', 'mcp', 'stateless-mcp',
      'rag-2', 'memory-layers', 'vector-dbs',
      'multi-agent-systems', 'swarms',
      'fine-tuning', 'synthetic-data', 'distillation',
      'eval-frameworks', 'guardrails', 'observability',
      'ai-gateways', 'cost-optimization', 'ai-apis'
    ],
  },
  {
    id: 'chatbots',
    title: 'Chatbots',
    description: 'Essential concepts for daily users of ChatGPT, Claude, and Gemini.',
    icon: 'MessageSquare',
    conceptIds: ['models', 'prompts-tokens', 'context-window', 'hallucinations', 'rag-2', 'memory-layers', 'guardrails', 'prompt-optimization', 'ai-apis'],
  },
  {
    id: 'coding-assistants',
    title: 'Coding Assistants',
    description: 'Master how tools like Cursor, Copilot, Codex, and Claude Code operate under the hood.',
    icon: 'Code',
    conceptIds: ['context-engineering', 'skills', 'tool-use', 'function-calling', 'mcp', 'harness', 'ai-apis', 'observability'],
  },
  {
    id: 'agents',
    title: 'Agents & Loops',
    description: 'Demystify autonomous agent loops, graphs, harnesses, swarms, and stateless MCP.',
    icon: 'Bot',
    conceptIds: ['agentic-ai', 'harness', 'loop-engineering', 'graph-engineering', 'mcp', 'stateless-mcp', 'multi-agent-systems', 'swarms'],
  },
];
