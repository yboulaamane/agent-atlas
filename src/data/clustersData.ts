import { ClusterId, ClusterInfo, LearningPath } from '../types';

export const CLUSTERS: Record<ClusterId, ClusterInfo> = {
  'start-here': {
    id: 'start-here',
    name: 'Start Here',
    tagline: 'The foundational building blocks everyone should know',
    color: '#06b6d4', // Cyan
    glowColor: 'rgba(6, 182, 212, 0.4)',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    iconName: 'Sparkles',
  },
  'agent-architecture': {
    id: 'agent-architecture',
    name: 'Agent Architecture',
    tagline: 'How autonomous AI agents think, act, and maintain control',
    color: '#8b5cf6', // Violet
    glowColor: 'rgba(139, 92, 246, 0.4)',
    badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    iconName: 'Cpu',
  },
  'instructions-context': {
    id: 'instructions-context',
    name: 'Instructions & Context',
    tagline: 'Shaping what the AI knows and how it behaves',
    color: '#3b82f6', // Blue
    glowColor: 'rgba(59, 130, 246, 0.4)',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    iconName: 'FileText',
  },
  'tools-connections': {
    id: 'tools-connections',
    name: 'Tools & Connections',
    tagline: 'Empowering models to interact with APIs, databases, and apps',
    color: '#10b981', // Emerald
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    iconName: 'Wrench',
  },
  'knowledge-memory': {
    id: 'knowledge-memory',
    name: 'Knowledge & Memory',
    tagline: 'Remembering facts, searching vast documents, and recalling past chats',
    color: '#f59e0b', // Amber
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    iconName: 'Database',
  },
  'agent-teamwork': {
    id: 'agent-teamwork',
    name: 'Agent Teamwork',
    tagline: 'Orchestrating squads of specialized agents working together',
    color: '#ec4899', // Pink
    glowColor: 'rgba(236, 72, 153, 0.4)',
    badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    iconName: 'Users',
  },
  'model-adaptation': {
    id: 'model-adaptation',
    name: 'Model Adaptation',
    tagline: 'Customizing, teaching, and shrinking models for specific tasks',
    color: '#6366f1', // Indigo
    glowColor: 'rgba(99, 102, 241, 0.4)',
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    iconName: 'Sliders',
  },
  'reliability-safety': {
    id: 'reliability-safety',
    name: 'Reliability & Safety',
    tagline: 'Making sure AI is truthful, safe, monitored, and tested',
    color: '#ef4444', // Red
    glowColor: 'rgba(239, 68, 68, 0.4)',
    badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
    iconName: 'ShieldCheck',
  },
  'deployment-efficiency': {
    id: 'deployment-efficiency',
    name: 'Deployment & Efficiency',
    tagline: 'Routing traffic, cutting costs, and speeding up response times',
    color: '#14b8a6', // Teal
    glowColor: 'rgba(20, 184, 166, 0.4)',
    badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    iconName: 'Zap',
  },
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'all',
    title: 'Explore Everything',
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
      'ai-gateways', 'cost-optimization'
    ],
  },
  {
    id: 'chatbots',
    title: 'I Use Chatbots',
    description: 'Essential concepts for daily users of ChatGPT, Claude, and Gemini.',
    icon: 'MessageSquare',
    conceptIds: ['models', 'prompts-tokens', 'context-window', 'hallucinations', 'rag-2', 'memory-layers', 'guardrails', 'prompt-optimization'],
  },
  {
    id: 'coding-assistants',
    title: 'I Use Coding Assistants',
    description: 'Master how tools like Cursor, GitHub Copilot, Codex, and Claude Code operate under the hood.',
    icon: 'Code',
    conceptIds: ['context-engineering', 'skills', 'tool-use', 'function-calling', 'mcp', 'harness', 'observability'],
  },
  {
    id: 'agents',
    title: 'I Want to Understand Agents',
    description: 'Demystify autonomous agent loops, graphs, harnesses, swarms, and stateless MCP.',
    icon: 'Bot',
    conceptIds: ['agentic-ai', 'harness', 'loop-engineering', 'graph-engineering', 'mcp', 'stateless-mcp', 'multi-agent-systems', 'swarms'],
  },
];
