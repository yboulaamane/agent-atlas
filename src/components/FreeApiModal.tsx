import React from 'react';
import { X, ExternalLink, Zap, Gift, ShieldCheck, Key, Laptop, Sparkles, Check } from 'lucide-react';

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
    freeLimit: '15 Requests Per Minute (RPM), 1M tokens/min, 1,500 requests/day',
    creditCardRequired: false,
    bestFor: 'Multimodal apps, reading full PDFs, huge 1-million-token contexts',
    url: 'https://aistudio.google.com/',
    steps: [
      'Go to aistudio.google.com and sign in with your Google account',
      'Click "Get API Key" in the top-left sidebar',
      'Click "Create API Key in new project" (Takes 5 seconds, no credit card)'
    ]
  },
  {
    name: 'Groq Cloud',
    tagline: 'World-record inference speed (500+ tokens/sec) on LPUs',
    models: 'Llama 3.3 70B Versatile, Mixtral 8x7B, Gemma 2',
    freeLimit: 'Generous free developer tier with high RPM and sub-second latency',
    creditCardRequired: false,
    bestFor: 'Real-time conversational agents, high-speed coding assistants',
    url: 'https://console.groq.com/',
    steps: [
      'Go to console.groq.com and register with GitHub or Google',
      'Navigate to API Keys > "Create API Key"',
      'Use the OpenAI-compatible endpoint `https://api.groq.com/openai/v1`'
    ]
  },
  {
    name: 'OpenRouter (Free Catalog)',
    tagline: 'Unified gateway providing zero-cost open models',
    models: 'DeepSeek R1, Llama 3.3 70B, Mistral Nemo (all with `:free` tag)',
    freeLimit: 'Free tier with community rate limits, zero balance required',
    creditCardRequired: false,
    bestFor: 'Trying 50+ different models with one single API key',
    url: 'https://openrouter.ai/models?max_price=0',
    steps: [
      'Sign up at openrouter.ai using your Google or GitHub account',
      'Go to Keys and create a key with $0 balance',
      'Select any model ending in `:free` (e.g. `deepseek/deepseek-r1:free`)'
    ]
  },
  {
    name: 'GitHub Models',
    tagline: 'Free developer sandbox hosted directly inside GitHub',
    models: 'GPT-4o, Claude 3.5 Sonnet, Llama 3.3, Mistral Large',
    freeLimit: 'Free prototyping tier for all GitHub accounts (50-150 requests/day)',
    creditCardRequired: false,
    bestFor: 'Testing frontier commercial models (GPT-4o/Claude) without paying upfront',
    url: 'https://github.com/marketplace/models',
    steps: [
      'Visit github.com/marketplace/models while logged in',
      'Pick a model (like GPT-4o or Llama 3.3) and click "Playground"',
      'Generate a free GitHub Personal Access Token (PAT) to call it from code'
    ]
  },
  {
    name: 'Ollama (Local & Offline)',
    tagline: '100% free, private, offline AI running on your own computer',
    models: 'Llama 3, DeepSeek, Mistral, Qwen, Phi-3',
    freeLimit: 'Unlimited forever! Runs completely on your laptop CPU/GPU',
    creditCardRequired: false,
    bestFor: 'Total data privacy, zero internet reliance, offline agent development',
    url: 'https://ollama.com/',
    steps: [
      'Download Ollama from ollama.com for Mac, Windows, or Linux',
      'Open terminal and type: `ollama run llama3`',
      'It automatically exposes an OpenAI-compatible API at `http://localhost:11434/v1`'
    ]
  },
  {
    name: 'Hugging Face Serverless Inference',
    tagline: 'Free access to thousands of open-source community checkpoints',
    models: 'Over 100,000 text, audio, and vision checkpoints',
    freeLimit: 'Free rate-limited community tier for hobbyists',
    creditCardRequired: false,
    bestFor: 'Niche models, custom fine-tunes, non-English language specialists',
    url: 'https://huggingface.co/docs/api-inference/',
    steps: [
      'Create a free account at huggingface.co',
      'Go to Settings > Access Tokens > "Create New Token"',
      'Call the Hugging Face Inference API directly using `hf_...` token'
    ]
  }
];

export const FreeApiModal: React.FC<Props> = ({ isOpen, onClose, onOpenConcept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Gift className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Free AI APIs & Starter Tiers
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  $0.00 Cost
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Top verified providers that let you build AI projects without entering a credit card.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onOpenConcept(); }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 transition-colors"
            >
              <span>View API Concept Bubble</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Quick Notice Banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-cyan-300 block mb-0.5">How do "Free Tiers" work?</strong>
              AI companies provide free rate-limited quotas (e.g. 15 requests/minute or 500k tokens/day) to help developers experiment, build prototypes, and learn. As long as you stay within the free requests per minute, you will never be billed.
            </div>
          </div>

          {/* Grid of Free Providers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FREE_PROVIDERS.map((prov) => (
              <div 
                key={prov.name} 
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                      {prov.name}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      No Card Needed
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 italic mb-3">
                    "{prov.tagline}"
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Available Models:</span>
                      <span className="text-cyan-300 font-mono text-[11px]">{prov.models}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Free Limit:</span>
                      <span className="text-emerald-300 text-[11px]">{prov.freeLimit}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Quick Setup (30 seconds):
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
                      {prov.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Best for: <strong className="text-slate-300">{prov.bestFor}</strong>
                  </span>
                  <a
                    href={prov.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Golden Rules for API Keys */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <span className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Two Golden Security Rules for Free AI APIs
            </span>
            <ul className="text-xs text-amber-100/90 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong>Never commit your API keys to public GitHub:</strong> Add your `.env` file to `.gitignore` so automated bots cannot scrape your keys and exhaust your quotas.
              </li>
              <li>
                <strong>Set spending alerts at $0.00:</strong> If a provider does require a payment method later, always enable hard spending caps at $0 or $5 to avoid surprise bills.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
