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

  // Layout cluster anchors
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 1200;
    const height = Math.max(640, window.innerHeight - 200);

    const clusterCenters: Record<string, { x: number; y: number }> = {
      'start-here': { x: width * 0.22, y: height * 0.28 },
      'agent-architecture': { x: width * 0.50, y: height * 0.38 },
      'instructions-context': { x: width * 0.30, y: height * 0.60 },
      'tools-connections': { x: width * 0.72, y: height * 0.34 },
      'knowledge-memory': { x: width * 0.24, y: height * 0.82 },
      'agent-teamwork': { x: width * 0.52, y: height * 0.74 },
      'model-adaptation': { x: width * 0.82, y: height * 0.64 },
      'reliability-safety': { x: width * 0.44, y: height * 0.16 },
      'deployment-efficiency': { x: width * 0.78, y: height * 0.86 },
    };

    const existingMap = new Map(nodesRef.current.map((n) => [n.concept.id, n]));

    const newNodes: Node[] = concepts.map((c, i) => {
      const existing = existingMap.get(c.id);
      const center = clusterCenters[c.cluster] || { x: width * 0.5, y: height * 0.5 };
      const cluster = CLUSTERS[c.cluster];

      const angle = (i % 5) * (Math.PI * 2 / 5) + (Math.random() * 0.2 - 0.1);
      const dist = 54 + (i % 3) * 30;
      const initialX = existing ? existing.x : center.x + Math.cos(angle) * dist;
      const initialY = existing ? existing.y : center.y + Math.sin(angle) * dist;

      const baseR = c.isImageOriginal ? 36 : c.isBeginnerPrereq ? 33 : 34;

      return {
        concept: c,
        x: initialX,
        y: initialY,
        vx: 0,
        vy: 0,
        radius: baseR,
        baseRadius: baseR,
        color: cluster ? cluster.color : '#0071e3',
        clusterName: cluster ? cluster.name : '',
      };
    });

    nodesRef.current = newNodes;
  }, [concepts]);

  // Main Canvas Render Loop (Apple Damped Spring Physics + Retina DPI)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.01;
      const width = container.clientWidth;
      const height = Math.max(640, window.innerHeight - 200);

      // Retina scaling
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const hovered = hoveredNodeRef.current;

      // 1. Apple Velvety Damped Physics
      if (!reducedMotion) {
        for (let i = 0; i < nodes.length; i++) {
          const n1 = nodes[i];
          if (draggedNodeRef.current === n1) continue;

          // Subtle organic float
          n1.x += Math.sin(time + i * 1.6) * 0.14;
          n1.y += Math.cos(time + i * 1.3) * 0.14;

          // Boundary constraints with gentle elastic damp
          const padding = n1.radius + 20;
          if (n1.x < padding) n1.x += (padding - n1.x) * 0.1;
          if (n1.x > width - padding) n1.x -= (n1.x - (width - padding)) * 0.1;
          if (n1.y < padding) n1.y += (padding - n1.y) * 0.1;
          if (n1.y > height - padding) n1.y -= (n1.y - (height - padding)) * 0.1;

          // Soft repulsive spacing
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 1;
            const minDist = n1.radius + n2.radius + 18;

            if (dist < minDist) {
              const force = (minDist - dist) / dist * 0.05;
              const fx = dx * force;
              const fy = dy * force;
              if (draggedNodeRef.current !== n1) { n1.x -= fx; n1.y -= fy; }
              if (draggedNodeRef.current !== n2) { n2.x += fx; n2.y += fy; }
            }
          }
        }
      }

      // 2. Draw Connectors (Apple Subtle Neural Strands)
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
            ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
            ctx.lineWidth = 1.6;
            ctx.globalAlpha = isDark ? 0.8 : 0.6;
            ctx.setLineDash([]);
          } else {
            ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
            ctx.lineWidth = isDimmed || targetDimmed ? 0.5 : 0.8;
            ctx.globalAlpha = isDimmed || targetDimmed ? 0.03 : (isDark ? 0.10 : 0.08);
            ctx.setLineDash([3, 4]);
          }

          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1.0;
        }
      }

      // 3. Draw Nodes (Apple Frosted Glass Squircle / Pebble)
      for (const n of nodes) {
        const isDimmed = !activePathConceptIds.includes(n.concept.id);
        const isHovered = hovered === n;
        const isSelected = selectedConcept?.id === n.concept.id;
        const isMastered = masteredIds.includes(n.concept.id);

        // Spring scale on hover
        const targetRadius = isHovered ? n.baseRadius + 4 : isSelected ? n.baseRadius + 2 : n.baseRadius;
        n.radius += (targetRadius - n.radius) * 0.25;

        ctx.save();
        ctx.globalAlpha = isDimmed ? (isDark ? 0.22 : 0.28) : 1.0;

        // Diffuse Apple drop shadow
        if (!isDimmed) {
          if (!isDark) {
            ctx.shadowColor = isHovered ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.06)';
            ctx.shadowBlur = isHovered ? 16 : 8;
            ctx.shadowOffsetY = isHovered ? 6 : 3;
          } else {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = isHovered ? 20 : 10;
            ctx.shadowOffsetY = 4;
          }
        }

        // Pebble body
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        if (isDark) {
          ctx.fillStyle = isDimmed ? '#161618' : isHovered ? '#2c2c2e' : '#1c1c1e';
        } else {
          ctx.fillStyle = isDimmed ? '#e5e5ea' : isHovered ? '#ffffff' : '#ffffff';
        }
        ctx.fill();

        // Apple Hairline Border
        ctx.lineWidth = isHovered ? 2 : isSelected ? 2 : 1;
        if (isHovered || isSelected) {
          ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
        } else {
          ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
        }
        ctx.stroke();

        // Minimalist Category Pill Indicator
        if (!isDimmed) {
          ctx.beginPath();
          ctx.arc(n.x, n.y - n.radius * 0.52, 3, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.fill();
        }

        // San Francisco Typography
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDimmed
          ? (isDark ? '#636366' : '#8e8e93')
          : (isDark ? '#f5f5f7' : '#1d1d1f');
        ctx.font = `600 ${n.radius > 35 ? '11px' : '10.5px'} -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;

        const words = n.concept.shortLabel.split(' ');
        if (words.length > 1 && n.concept.shortLabel.length > 9) {
          ctx.fillText(words[0], n.x, n.y + 1);
          ctx.fillText(words.slice(1).join(' '), n.x, n.y + 13);
        } else {
          ctx.fillText(n.concept.shortLabel, n.x, n.y + 5);
        }

        // Mastered Badge
        if (!isDimmed && isMastered) {
          ctx.beginPath();
          ctx.arc(n.x + n.radius * 0.72, n.y - n.radius * 0.72, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#34c759';
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px -apple-system, sans-serif';
          ctx.fillText('✓', n.x + n.radius * 0.72, n.y - n.radius * 0.72 + 0.5);
        }

        ctx.restore();
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion, activePathConceptIds, selectedConcept, masteredIds, challengeSolvedIds, isDark]);

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
      className={`relative w-full h-[640px] rounded-[32px] overflow-hidden border transition-colors duration-300 ${
        isDark 
          ? 'apple-bg-dark border-white/[0.08]' 
          : 'apple-bg-light border-black/[0.06] shadow-sm'
      }`}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        className="w-full h-full relative z-10 block touch-none"
      />

      {/* Apple-style Frosted Tooltip */}
      {hoveredConcept && (
        <div 
          className={`absolute z-20 pointer-events-none p-4 rounded-2xl border apple-glass max-w-xs transition-opacity duration-150 ${
            isDark 
              ? 'apple-card-dark text-[#f5f5f7]' 
              : 'apple-card-light text-[#1d1d1f]'
          }`}
          style={{
            left: Math.min(mousePosRef.current.x + 16, (containerRef.current?.clientWidth || 800) - 280),
            top: Math.max(16, mousePosRef.current.y - 40),
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: CLUSTERS[hoveredConcept.cluster]?.color || '#0071e3' }} 
            />
            <span className="text-xs font-semibold tracking-tight">{hoveredConcept.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed line-clamp-2 text-[#86868b] dark:text-[#a1a1a6]">
            {hoveredConcept.plainExplanation}
          </p>
          <div className="mt-2.5 pt-2 border-t border-black/[0.06] dark:border-white/[0.1] flex items-center justify-between text-[10px] font-medium text-[#86868b]">
            <span>Click to expand</span>
            <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{CLUSTERS[hoveredConcept.cluster]?.name}</span>
          </div>
        </div>
      )}

      {/* Apple Clean Pill Overlay at Bottom */}
      <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className={`px-4 py-1.5 rounded-full border text-xs font-medium pointer-events-auto apple-glass ${
          isDark 
            ? 'bg-black/60 border-white/[0.1] text-[#a1a1a6]' 
            : 'bg-white/80 border-black/[0.06] text-[#6e6e73] shadow-sm'
        }`}>
          <span>Click any pebble to explore • Drag with inertia</span>
        </div>

        <div className={`hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full border text-xs font-medium pointer-events-auto apple-glass ${
          isDark 
            ? 'bg-black/60 border-white/[0.1] text-[#a1a1a6]' 
            : 'bg-white/80 border-black/[0.06] text-[#6e6e73] shadow-sm'
        }`}>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" /> Basics
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#af52de]" /> Agents
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" /> Tools & MCP
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff9500]" /> Memory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d55]" /> Safety
          </span>
        </div>
      </div>
    </div>
  );
};
