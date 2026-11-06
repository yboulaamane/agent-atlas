# 🔮 AgentAtlas (2026 Edition)

The interactive, visual AI playground for normal users and builders—not another wall-of-text documentation website. 

Explore **harnesses, MCP, context engineering, swarms, RAG 2.0, memory layers, guardrails, and loop engineering** through floating organic bubbles, 5-part lesson cards, animated interactive mini-simulations, relatable analogies, and tool-by-tool comparisons.

---

## 🌟 What This Feels Like

- **Floating Bubble Universe**: Gently drifting connected bubbles arranged into thematic learning islands. Drag them around, hover to see architecture links, or toggle reduced motion.
- **The 5-Part Lesson Format** (teach what a concept *helps you do* before its architecture):
  1. **Plain-Language Explanation**: 2–3 sentences with zero unexplained jargon.
  2. **Relatable Analogy**: Everyday metaphors (e.g. "A chef's specialty recipe card", "A universal USB-C cable for AI", "The airplane flight data recorder").
  3. **Interactive Mini-Demonstration**: Animated, step-by-step interactive visuals right inside the card (e.g., skill pack execution, MCP universal socket, ReAct loop stepper, swarm handoffs, guardrail scanner, AI gateway router).
  4. **Practical Relevance**: "Where would I encounter this in my AI tool?" with real-world touchpoints.
  5. **Quick Challenge**: Scenario-based question with instant explanations and celebratory confetti!
- **"Go Deeper" Collapsible Drawer**: Technical architecture summary, source papers (RFCs, arXiv, Anthropic/OpenAI specs), implementation notes, nuance/ambiguity notes, and last-reviewed date.
- **"Find It in My Tool" Product Picker**: Switch between Claude, Cursor / Codex, ChatGPT, Grok, and Open Source to see how each tool names, exposes, or configures the concept.
- **Guided Learning Paths**:
  - 💬 **I Use Chatbots** (ChatGPT, Claude, Gemini casual users)
  - 💻 **I Use Coding Assistants** (Cursor, Copilot, Codex, Claude Code)
  - 🤖 **I Want to Understand Agents** (Autonomous loops, graphs, harnesses, swarms, stateless MCP)
  - 🧭 **Explore Everything** (All 28 concepts active)
- **Searchable Island Directory**: Full list view grouped by island for quick reference, mobile accessibility, and keyword search.
- **Local Progress Tracking**: Tracks mastered concepts and solved challenges in your browser's local storage.

---

## 🗺️ Scope of Concepts Included (All 22 from Image + Additions)

| Learning Island | Included Bubbles |
| :--- | :--- |
| **Start Here (Prerequisites)** | Foundation Models, Prompts & Tokens, Context Window, Hallucinations |
| **Agent Architecture** | Harness, Agentic AI, Loop Engineering, Graph Engineering |
| **Instructions & Context** | Context Engineering, Skills, Prompt Optimization |
| **Tools & Connections** | Tool Use, Function Calling, MCP, Stateless MCP |
| **Knowledge & Memory** | RAG 2.0, Memory Layers, Vector DBs |
| **Agent Teamwork** | Multi-Agent Systems, Swarms |
| **Model Adaptation** | Fine-Tuning, Synthetic Data, Distillation |
| **Reliability & Safety** | Evaluation Frameworks, Guardrails, Observability |
| **Deployment & Efficiency** | AI Gateways, Cost Optimization |

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🚢 Deploy to GitHub & Vercel in 2 Minutes

1. **Push this repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Concept Playground"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ai-concept-playground.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository (`ai-concept-playground`).
   - Vercel automatically detects **Vite**.
   - Click **Deploy**!
   - Every subsequent Git push will automatically trigger instant preview and production deployments.

---

## ✏️ How to Edit or Add Concepts

All content lives cleanly inside structured TypeScript files—**no interface code rewrites required**:
- `src/data/conceptsData.ts`: Holds explanations, analogies, challenges, tool examples, and Go Deeper drawers.
- `src/data/clustersData.ts`: Holds island definitions and guided paths.
- `src/types.ts`: TypeScript definitions ensuring strong type safety.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS + Custom Glassmorphism & Cyber Halos
- **Icons**: Lucide Icons
- **Animation & Physics**: HTML5 Canvas Spring & Force Repulsion Simulation
- **Effects**: Canvas Confetti
