import React from 'react';
import { X, ExternalLink, Gift, ShieldCheck, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenConcept: () => void;
}

interface FreeProvider {
  name: string;
  tagline: string;
  models: string;
  freeLimit: string;
  creditCardRequired: boolean;
  bestFor: string;
  url: string;
  steps: string[];
}

const FREE_PROVIDERS: FreeProvider[] = [
  {
    name: 'Google AI Studio (Gemini)',
    tagline: 'The most generous official free tier from a frontier lab',
    models: 'Gemini 1.5 Flash & Gemini 1.5 Pro',
    freeLimit: '15 Requests Per Minute (RPM), 1M context, 1,500 req/day',
    creditCardRequired: false,
    bestFor: 'Multimodal apps, reading full PDFs, huge 1M contexts',
    url: 'https://aistudio.google.com/',
    steps: [
      'Sign in at aistudio.google.com with your Google account',
      'Click "Get API Key" in the left sidebar',
      'Click "Create API Key" (Takes 5 seconds, no credit card)'
    ]
  },
  {
    name: 'Groq Cloud',
    tagline: 'Record-setting inference speed (500+ tokens/sec) on LPUs',
    models: 'Llama 3.3 70B, Mixtral 8x7B, Gemma 2',
    freeLimit: 'Generous free developer quota with sub-second latency',
    creditCardRequired: false,
    bestFor: 'Real-time conversational agents, high-speed coding',
    url: 'https://console.groq.com/',
    steps: [
      'Sign up at console.groq.com with GitHub or Google',
      'Navigate to API Keys > "Create API Key"',
      'Use the OpenAI-compatible endpoint `https://api.groq.com/openai/v1`'
    ]
  },
  {
    name: 'OpenRouter (Free Catalog)',
    tagline: 'Unified gateway providing zero-cost open models',
    models: 'DeepSeek R1, Llama 3.3 70B, Mistral (`:free` models)',
    freeLimit: 'Free tier on all models tagged `:free` with zero balance',
    creditCardRequired: false,
    bestFor: 'Trying dozens of open-weights models with 1 API key',
    url: 'https://openrouter.ai/models?max_price=0',
    steps: [
      'Sign up at openrouter.ai using Google or GitHub',
      'Go to Keys and generate a key with $0 balance',
      'Select any model ending in `:free` (e.g. `deepseek/deepseek-r1:free`)'
    ]
  },
  {
    name: 'GitHub Models',
    tagline: 'Free developer sandbox hosted directly in GitHub',
    models: 'GPT-4o, Claude 3.5 Sonnet, Llama 3.3',
    freeLimit: 'Free prototyping tier (50-150 requests/day per account)',
    creditCardRequired: false,
    bestFor: 'Testing commercial models without paying upfront',
    url: 'https://github.com/marketplace/models',
    steps: [
      'Visit github.com/marketplace/models while logged in',
      'Pick a model (like GPT-4o) and click "Playground"',
      'Generate a free GitHub Personal Access Token to call it via code'
    ]
  },
  {
    name: 'Ollama (Local & Offline)',
    tagline: '100% free, private, offline AI running on your laptop',
    models: 'Llama 3, DeepSeek, Mistral, Qwen, Phi-3',
    freeLimit: 'Unlimited forever! Runs locally on your CPU/GPU',
    creditCardRequired: false,
    bestFor: 'Total data privacy, zero internet requirement, offline agents',
    url: 'https://ollama.com/',
    steps: [
      'Download Ollama from ollama.com for Mac, Windows, or Linux',
      'Open your terminal and type: `ollama run llama3`',
      'Access the local OpenAI-compatible API at `http://localhost:11434/v1`'
    ]
  },
  {
    name: 'Hugging Face Inference',
    tagline: 'Free access to thousands of open-source community checkpoints',
    models: 'Over 100,000 text, audio, and vision checkpoints',
    freeLimit: 'Free community rate-limited tier',
    creditCardRequired: false,
    bestFor: 'Niche domain models and custom fine-tunes',
    url: 'https://huggingface.co/docs/api-inference/',
    steps: [
      'Create a free account at huggingface.co',
      'Go to Settings > Access Tokens > "Create New Token"',
      'Call the serverless API directly using your token'
    ]
  }
];

export const FreeApiModal: React.FC<Props> = ({ isOpen, onClose, onOpenConcept }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[32px] border overflow-hidden transition-all duration-300 bg-white dark:bg-[#1c1c1e] border-black/[0.08] dark:border-white/[0.12] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Apple Header */}
        <div className="flex items-center justify-between px-7 py-4 border-b border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-[#1c1c1e]/80 sticky top-0 z-20 apple-glass">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full flex items-center justify-center bg-[#34c759]/15 text-[#34c759]">
              <Gift className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
                Free AI APIs & Starter Tiers
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-[#34c759]/15 text-[#34c759]">
                  $0.00 Cost
                </span>
              </h2>
              <p className="text-xs text-[#86868b] dark:text-[#a1a1a6]">
                Verified zero-cost providers that allow you to build without entering a credit card.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onOpenConcept(); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors bg-black/[0.03] hover:bg-black/[0.06] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] border-black/[0.06] dark:border-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]"
            >
              <span>View API Bubble</span>
              <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
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

        {/* Content */}
        <div className="overflow-y-auto p-7 space-y-5 flex-1">
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl border text-xs leading-relaxed bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.06] text-[#6e6e73] dark:text-[#a1a1a6]">
            <strong className="text-[#1d1d1f] dark:text-white block mb-0.5">How do Free Tiers work?</strong>
            AI providers give developers free rate-limited quotas (e.g. 15 requests/minute or 500k tokens/day) to build prototypes and learn. As long as you stay within the rate limit, you are never billed.
          </div>

          {/* Grid of Providers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FREE_PROVIDERS.map((prov) => (
              <div 
                key={prov.name} 
                className="p-5 rounded-[24px] border flex flex-col justify-between space-y-4 transition-all bg-white hover:bg-black/[0.01] border-black/[0.06] hover:border-black/[0.12] dark:bg-[#161618] dark:hover:bg-[#1a1a1d] dark:border-white/[0.08] dark:hover:border-white/[0.14] shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">
                      {prov.name}
                    </h3>
                    <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#34c759]/15 text-[#34c759]">
                      No Card Needed
                    </span>
                  </div>

                  <p className="text-xs text-[#86868b] italic mb-3">
                    "{prov.tagline}"
                  </p>

                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="p-2.5 rounded-xl border bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.04] dark:border-white/[0.06]">
                      <span className="text-[#86868b] font-medium block text-[10px] uppercase">Models:</span>
                      <span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-mono text-[11px]">{prov.models}</span>
                    </div>

                    <div className="p-2.5 rounded-xl border bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.04] dark:border-white/[0.06]">
                      <span className="text-[#86868b] font-medium block text-[10px] uppercase">Free Limit:</span>
                      <span className="text-[#34c759] font-medium text-[11px]">{prov.freeLimit}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-medium text-[#6e6e73] dark:text-[#a1a1a6] block mb-1">
                      Quick Setup:
                    </span>
                    <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-[#86868b]">
                      {prov.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-[#86868b]">
                    Best for: <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">{prov.bestFor}</strong>
                  </span>
                  <a
                    href={prov.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold transition-all bg-[#0071e3] hover:bg-[#0077ed] text-white shadow-sm"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Security Rules */}
          <div className="p-4 rounded-2xl border text-xs space-y-1.5 bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.06]">
            <span className="font-semibold text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#34c759]" />
              API Security Best Practice
            </span>
            <p className="text-[#6e6e73] dark:text-[#a1a1a6] leading-relaxed">
              Never commit your API keys to public GitHub repositories. Save them in a local <code className="px-1.5 py-0.5 rounded-md border bg-white dark:bg-black border-black/[0.06] dark:border-white/[0.08] font-mono text-[11px]">.env</code> file that is listed in your <code className="px-1.5 py-0.5 rounded-md border bg-white dark:bg-black border-black/[0.06] dark:border-white/[0.08] font-mono text-[11px]">.gitignore</code> so bots cannot steal your quotas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
