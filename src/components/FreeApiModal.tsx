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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden bg-white dark:bg-[#121214] border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#121214]/95 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl border bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Gift className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                Free AI APIs & Starter Tiers
                <span className="text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800">
                  $0.00 Cost
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Verified zero-cost providers that allow you to build without entering a credit card.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onOpenConcept(); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-200"
            >
              <span>View API Bubble</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl border text-xs leading-relaxed bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
            <strong className="text-neutral-900 dark:text-white block mb-0.5">How do Free Tiers work?</strong>
            AI providers give developers free rate-limited quotas (e.g. 15 requests/minute or 500k tokens/day) to build prototypes and learn. As long as you stay within the rate limit, you are never billed.
          </div>

          {/* Grid of Providers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {FREE_PROVIDERS.map((prov) => (
              <div 
                key={prov.name} 
                className="p-5 rounded-2xl border flex flex-col justify-between space-y-3.5 transition-all bg-white hover:bg-neutral-50/60 border-neutral-200 dark:bg-[#151518] dark:hover:bg-[#18181c] dark:border-neutral-800 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {prov.name}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:border-neutral-800">
                      No Card Needed
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 italic mb-3">
                    "{prov.tagline}"
                  </p>

                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="p-2 rounded-xl border bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-400 font-semibold block text-[10px] uppercase">Models:</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-mono text-[11px]">{prov.models}</span>
                    </div>

                    <div className="p-2 rounded-xl border bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
                      <span className="text-neutral-400 font-semibold block text-[10px] uppercase">Free Limit:</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px]">{prov.freeLimit}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                      Quick Setup:
                    </span>
                    <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-neutral-500">
                      {prov.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    Best for: <strong className="text-neutral-700 dark:text-neutral-300">{prov.bestFor}</strong>
                  </span>
                  <a
                    href={prov.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-sm"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Security Rules */}
          <div className="p-4 rounded-2xl border text-xs space-y-1.5 bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800">
            <span className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              API Security Best Practice
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Never commit your API keys to public GitHub repositories. Save them in a local <code className="px-1 rounded border bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">.env</code> file that is listed in your <code className="px-1 rounded border bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">.gitignore</code> so bots cannot steal your quotas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
