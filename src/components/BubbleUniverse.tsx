import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Concept } from '../types';
import { CLUSTERS } from '../data/clustersData';

interface Props {
  concepts: Concept[];
  selectedConcept: Concept | null;
  onSelectConcept: (concept: Concept) => void;
  activePathConceptIds: string[];
  reducedMotion: boolean;
  masteredIds: string[];
  challengeSolvedIds: string[];
  theme: 'dark' | 'light';
}

interface Node {
  concept: Concept;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  clusterName: string;
}

export const BubbleUniverse: React.FC<Props> = ({
  concepts,
  selectedConcept,
  onSelectConcept,
  activePathConceptIds,
  reducedMotion,
  masteredIds,
  challengeSolvedIds,
  theme,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const hoveredNodeRef = useRef<Node | null>(null);
  const draggedNodeRef = useRef<Node | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const [hoveredConcept, setHoveredConcept] = useState<Concept | null>(null);

  const isDark = theme === 'dark';

  // Initialize or update nodes based on concepts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width || 1200;
    const height = canvas.height || 750;

    const clusterCenters: Record<string, { x: number; y: number }> = {
      'start-here': { x: width * 0.22, y: height * 0.28 },
      'agent-architecture': { x: width * 0.50, y: height * 0.40 },
      'instructions-context': { x: width * 0.30, y: height * 0.62 },
      'tools-connections': { x: width * 0.72, y: height * 0.35 },
      'knowledge-memory': { x: width * 0.25, y: height * 0.82 },
      'agent-teamwork': { x: width * 0.52, y: height * 0.74 },
      'model-adaptation': { x: width * 0.82, y: height * 0.65 },
      'reliability-safety': { x: width * 0.44, y: height * 0.16 },
      'deployment-efficiency': { x: width * 0.78, y: height * 0.85 },
    };

    const existingMap = new Map(nodesRef.current.map((n) => [n.concept.id, n]));

    const newNodes: Node[] = concepts.map((c, i) => {
      const existing = existingMap.get(c.id);
      const center = clusterCenters[c.cluster] || { x: width * 0.5, y: height * 0.5 };
      const cluster = CLUSTERS[c.cluster];

      const angle = (i % 5) * (Math.PI * 2 / 5) + (Math.random() * 0.3 - 0.15);
      const dist = 52 + (i % 3) * 32;
      const initialX = existing ? existing.x : center.x + Math.cos(angle) * dist;
      const initialY = existing ? existing.y : center.y + Math.sin(angle) * dist;

      const baseR = c.isImageOriginal ? 36 : c.isBeginnerPrereq ? 33 : 34;

      return {
        concept: c,
        x: initialX,
        y: initialY,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: baseR,
        baseRadius: baseR,
        color: cluster ? cluster.color : '#71717a',
        clusterName: cluster ? cluster.name : '',
      };
    });

    nodesRef.current = newNodes;
  }, [concepts]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.012;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const hovered = hoveredNodeRef.current;

      // 1. UPDATE PHYSICS
      if (!reducedMotion) {
        for (let i = 0; i < nodes.length; i++) {
          const n1 = nodes[i];
          if (draggedNodeRef.current === n1) continue;

          // Gentle minimal floating oscillation
          n1.x += n1.vx + Math.sin(time + i * 1.4) * 0.12;
          n1.y += n1.vy + Math.cos(time + i * 1.1) * 0.12;

          // Boundary constraints
          const padding = n1.radius + 15;
          if (n1.x < padding) { n1.x = padding; n1.vx *= -0.6; }
          if (n1.x > width - padding) { n1.x = width - padding; n1.vx *= -0.6; }
          if (n1.y < padding) { n1.y = padding; n1.vy *= -0.6; }
          if (n1.y > height - padding) { n1.y = height - padding; n1.vy *= -0.6; }

          // Repulsion
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 1;
            const minDist = n1.radius + n2.radius + 16;

            if (dist < minDist) {
              const force = (minDist - dist) / dist * 0.06;
              const fx = dx * force;
              const fy = dy * force;
              if (draggedNodeRef.current !== n1) { n1.x -= fx; n1.y -= fy; }
              if (draggedNodeRef.current !== n2) { n2.x += fx; n2.y += fy; }
            }
          }
        }
      }

      // 2. DRAW CONNECTING EDGES (Minimalist hairline paths)
      const nodeMap = new Map(nodes.map((n) => [n.concept.id, n]));

      for (const n of nodes) {
        const isDimmed = !activePathConceptIds.includes(n.concept.id);
        const isHovered = hovered === n;

        for (const targetId of n.concept.connectedConceptIds) {
          const target = nodeMap.get(targetId);
          if (!target) continue;

          const targetDimmed = !activePathConceptIds.includes(target.concept.id);
          const isLinkActive = (isHovered || hovered === target) && !isDimmed && !targetDimmed;

          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(target.x, target.y);

          if (isLinkActive) {
            ctx.strokeStyle = isDark ? '#ffffff' : '#09090b';
            ctx.lineWidth = 1.8;
            ctx.globalAlpha = 0.75;
            ctx.setLineDash([]);
          } else {
            ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
            ctx.lineWidth = isDimmed || targetDimmed ? 0.5 : 0.9;
            ctx.globalAlpha = isDimmed || targetDimmed ? (isDark ? 0.04 : 0.04) : (isDark ? 0.12 : 0.10);
            ctx.setLineDash([3, 4]);
          }

          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1.0;
        }
      }

      // 3. DRAW NODES (Minimalist Matte Aesthetics)
      for (const n of nodes) {
        const isDimmed = !activePathConceptIds.includes(n.concept.id);
        const isHovered = hovered === n;
        const isSelected = selectedConcept?.id === n.concept.id;
        const isMastered = masteredIds.includes(n.concept.id);

        const targetRadius = isHovered ? n.baseRadius + 4 : isSelected ? n.baseRadius + 3 : n.baseRadius;
        n.radius += (targetRadius - n.radius) * 0.25;

        ctx.save();
        ctx.globalAlpha = isDimmed ? (isDark ? 0.20 : 0.25) : 1.0;

        // Subtle Drop Shadow (Light mode) or Soft Matte Ring (Dark mode)
        if (!isDimmed) {
          if (!isDark) {
            ctx.shadowColor = isHovered ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.05)';
            ctx.shadowBlur = isHovered ? 12 : 5;
            ctx.shadowOffsetY = isHovered ? 4 : 2;
          }
        }

        // Main Node Circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        if (isDark) {
          ctx.fillStyle = isDimmed ? '#111113' : isHovered ? '#1c1c1f' : '#141417';
        } else {
          ctx.fillStyle = isDimmed ? '#f4f4f5' : isHovered ? '#ffffff' : '#ffffff';
        }
        ctx.fill();

        // Hairline Ring
        ctx.lineWidth = isHovered ? 2 : isSelected ? 2.5 : 1.2;
        if (isHovered || isSelected) {
          ctx.strokeStyle = isDark ? '#ffffff' : '#09090b';
        } else {
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.10)';
        }
        ctx.stroke();

        // Category Accent Dot (Minimalist 3.5px indicator)
        if (!isDimmed) {
          ctx.beginPath();
          ctx.arc(n.x, n.y - n.radius * 0.52, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();
        }

        // Clean Typographic Label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDimmed
          ? (isDark ? '#52525b' : '#a1a1aa')
          : (isDark ? '#f4f4f5' : '#18181b');
        ctx.font = `600 ${n.radius > 35 ? '11px' : '10.5px'} -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif`;

        const words = n.concept.shortLabel.split(' ');
        if (words.length > 1 && n.concept.shortLabel.length > 9) {
          ctx.fillText(words[0], n.x, n.y + 1);
          ctx.fillText(words.slice(1).join(' '), n.x, n.y + 13);
        } else {
          ctx.fillText(n.concept.shortLabel, n.x, n.y + 5);
        }

        // Mastered Check Badge
        if (!isDimmed && isMastered) {
          ctx.beginPath();
          ctx.arc(n.x + n.radius * 0.72, n.y - n.radius * 0.72, 6, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? '#10b981' : '#059669';
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText('✓', n.x + n.radius * 0.72, n.y - n.radius * 0.72 + 0.5);
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion, activePathConceptIds, selectedConcept, masteredIds, challengeSolvedIds, isDark]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(640, window.innerHeight - 220);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse Interaction handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };

    if (isDraggingRef.current && draggedNodeRef.current) {
      draggedNodeRef.current.x = x;
      draggedNodeRef.current.y = y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    let found: Node | null = null;
    for (const n of nodesRef.current) {
      const dist = Math.hypot(n.x - x, n.y - y);
      if (dist <= n.radius + 3) {
        found = n;
        break;
      }
    }

    hoveredNodeRef.current = found;
    setHoveredConcept(found ? found.concept : null);
    canvas.style.cursor = found ? 'pointer' : 'default';
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const n of nodesRef.current) {
      const dist = Math.hypot(n.x - x, n.y - y);
      if (dist <= n.radius) {
        isDraggingRef.current = true;
        draggedNodeRef.current = n;
        break;
      }
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current && hoveredNodeRef.current) {
      onSelectConcept(hoveredNodeRef.current.concept);
    }
    isDraggingRef.current = false;
    draggedNodeRef.current = null;
  }, [onSelectConcept]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (const n of nodesRef.current) {
      const dist = Math.hypot(n.x - x, n.y - y);
      if (dist <= n.radius + 3) {
        onSelectConcept(n.concept);
        break;
      }
    }
  }, [onSelectConcept]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-[640px] rounded-3xl overflow-hidden border transition-colors duration-200 ${
        isDark 
          ? 'bg-[#09090b] border-neutral-800/80 bg-dots-dark' 
          : 'bg-[#fafafa] border-neutral-200/90 bg-dots-light shadow-sm'
      }`}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        className="w-full h-full relative z-10 block touch-none"
      />

      {/* Minimalist Floating Tooltip */}
      {hoveredConcept && (
        <div 
          className={`absolute z-20 pointer-events-none p-3.5 rounded-2xl border shadow-xl max-w-xs transition-opacity duration-150 backdrop-blur-md ${
            isDark 
              ? 'bg-neutral-900/95 border-neutral-700/80 text-neutral-100' 
              : 'bg-white/95 border-neutral-200/90 text-neutral-900 shadow-neutral-200/50'
          }`}
          style={{
            left: Math.min(mousePosRef.current.x + 16, (canvasRef.current?.width || 800) - 280),
            top: Math.max(16, mousePosRef.current.y - 40),
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: CLUSTERS[hoveredConcept.cluster]?.color || '#71717a' }} 
            />
            <span className="text-xs font-bold tracking-tight">{hoveredConcept.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed line-clamp-2 text-neutral-500 dark:text-neutral-400">
            {hoveredConcept.plainExplanation}
          </p>
          <div className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
            <span>Click to inspect</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-200">{CLUSTERS[hoveredConcept.cluster]?.name}</span>
          </div>
        </div>
      )}

      {/* Clean Minimalist Legend Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className={`px-3 py-1.5 rounded-full border text-[11px] pointer-events-auto backdrop-blur-md ${
          isDark 
            ? 'bg-neutral-900/80 border-neutral-800 text-neutral-400' 
            : 'bg-white/80 border-neutral-200 text-neutral-600 shadow-sm'
        }`}>
          <span>Click any bubble to open • Drag to play</span>
        </div>

        <div className={`hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full border text-[11px] pointer-events-auto backdrop-blur-md ${
          isDark 
            ? 'bg-neutral-900/80 border-neutral-800 text-neutral-400' 
            : 'bg-white/80 border-neutral-200 text-neutral-600 shadow-sm'
        }`}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Start Here
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Agents
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Tools & MCP
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Memory & RAG
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Safety
          </span>
        </div>
      </div>
    </div>
  );
};
