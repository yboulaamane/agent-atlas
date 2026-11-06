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
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const hoveredNodeRef = useRef<Node | null>(null);
  const draggedNodeRef = useRef<Node | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const [hoveredConcept, setHoveredConcept] = useState<Concept | null>(null);

  // Initialize or update nodes based on concepts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width || 1200;
    const height = canvas.height || 800;

    // Cluster Centers layout
    const clusterCenters: Record<string, { x: number; y: number }> = {
      'start-here': { x: width * 0.22, y: height * 0.28 },
      'agent-architecture': { x: width * 0.50, y: height * 0.42 },
      'instructions-context': { x: width * 0.32, y: height * 0.60 },
      'tools-connections': { x: width * 0.72, y: height * 0.35 },
      'knowledge-memory': { x: width * 0.25, y: height * 0.80 },
      'agent-teamwork': { x: width * 0.52, y: height * 0.75 },
      'model-adaptation': { x: width * 0.82, y: height * 0.65 },
      'reliability-safety': { x: width * 0.42, y: height * 0.16 },
      'deployment-efficiency': { x: width * 0.78, y: height * 0.84 },
    };

    // Keep existing coordinates if node already exists
    const existingMap = new Map(nodesRef.current.map((n) => [n.concept.id, n]));

    const newNodes: Node[] = concepts.map((c, i) => {
      const existing = existingMap.get(c.id);
      const center = clusterCenters[c.cluster] || { x: width * 0.5, y: height * 0.5 };
      const cluster = CLUSTERS[c.cluster];

      // Jitter around cluster center
      const angle = (i % 5) * (Math.PI * 2 / 5) + (Math.random() * 0.4 - 0.2);
      const dist = 55 + (i % 3) * 35;
      const initialX = existing ? existing.x : center.x + Math.cos(angle) * dist;
      const initialY = existing ? existing.y : center.y + Math.sin(angle) * dist;

      const baseR = c.isImageOriginal ? 38 : c.isBeginnerPrereq ? 34 : 36;

      return {
        concept: c,
        x: initialX,
        y: initialY,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: baseR,
        baseRadius: baseR,
        color: cluster ? cluster.color : '#06b6d4',
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
      time += 0.015;
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

          // Gentle floating oscillation
          n1.x += n1.vx + Math.sin(time + i * 1.5) * 0.15;
          n1.y += n1.vy + Math.cos(time + i * 1.2) * 0.15;

          // Boundary friction
          const padding = n1.radius + 15;
          if (n1.x < padding) { n1.x = padding; n1.vx *= -0.7; }
          if (n1.x > width - padding) { n1.x = width - padding; n1.vx *= -0.7; }
          if (n1.y < padding) { n1.y = padding; n1.vy *= -0.7; }
          if (n1.y > height - padding) { n1.y = height - padding; n1.vy *= -0.7; }

          // Repulsion between overlapping bubbles
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 1;
            const minDist = n1.radius + n2.radius + 18;

            if (dist < minDist) {
              const force = (minDist - dist) / dist * 0.08;
              const fx = dx * force;
              const fy = dy * force;
              if (draggedNodeRef.current !== n1) { n1.x -= fx; n1.y -= fy; }
              if (draggedNodeRef.current !== n2) { n2.x += fx; n2.y += fy; }
            }
          }
        }
      }

      // 2. DRAW CONNECTING EDGES (Spring Links)
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
            ctx.strokeStyle = n.color;
            ctx.lineWidth = 2.5;
            ctx.globalAlpha = 0.85;
            ctx.setLineDash([]);
          } else {
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = isDimmed || targetDimmed ? 0.6 : 1.2;
            ctx.globalAlpha = isDimmed || targetDimmed ? 0.15 : 0.45;
            ctx.setLineDash([4, 4]);
          }

          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1.0;
        }
      }

      // 3. DRAW BUBBLE NODES
      for (const n of nodes) {
        const isDimmed = !activePathConceptIds.includes(n.concept.id);
        const isHovered = hovered === n;
        const isSelected = selectedConcept?.id === n.concept.id;
        const isMastered = masteredIds.includes(n.concept.id);
        const isChallengeSolved = challengeSolvedIds.includes(n.concept.id);

        // Smooth radius expansion on hover
        const targetRadius = isHovered ? n.baseRadius + 6 : isSelected ? n.baseRadius + 4 : n.baseRadius;
        n.radius += (targetRadius - n.radius) * 0.2;

        ctx.save();
        ctx.globalAlpha = isDimmed ? 0.22 : 1.0;

        // Outer Glow / Halo
        if (!isDimmed && (isHovered || isSelected)) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 14, 0, Math.PI * 2);
          const glowGrad = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, n.radius + 16);
          glowGrad.addColorStop(0, n.color + '66');
          glowGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // Main Bubble Fill
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        // Radial gradient for 3D glass sphere effect
        const grad = ctx.createRadialGradient(
          n.x - n.radius * 0.35, 
          n.y - n.radius * 0.35, 
          n.radius * 0.1, 
          n.x, 
          n.y, 
          n.radius
        );

        if (isDimmed) {
          grad.addColorStop(0, '#1e293b');
          grad.addColorStop(1, '#0f172a');
        } else {
          grad.addColorStop(0, n.color + '40');
          grad.addColorStop(0.7, '#0f172a');
          grad.addColorStop(1, '#020617');
        }

        ctx.fillStyle = grad;
        ctx.fill();

        // Border
        ctx.lineWidth = isHovered ? 2.5 : isSelected ? 3 : 1.5;
        ctx.strokeStyle = isDimmed ? '#334155' : isHovered ? '#ffffff' : n.color;
        ctx.stroke();

        // Specular highlight gleam on top-left of glass bubble
        if (!isDimmed) {
          ctx.beginPath();
          ctx.ellipse(
            n.x - n.radius * 0.3,
            n.y - n.radius * 0.35,
            n.radius * 0.3,
            n.radius * 0.15,
            -Math.PI / 4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.fill();
        }

        // Concept Text Label
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = isDimmed ? '#64748b' : isHovered ? '#ffffff' : '#f1f5f9';
        ctx.font = `600 ${n.radius > 36 ? '11px' : '10px'} 'Plus Jakarta Sans', sans-serif`;

        // Wrap label if multiple words
        const words = n.concept.shortLabel.split(' ');
        if (words.length > 1 && n.concept.shortLabel.length > 9) {
          ctx.fillText(words[0], n.x, n.y - 6);
          ctx.fillText(words.slice(1).join(' '), n.x, n.y + 7);
        } else {
          ctx.fillText(n.concept.shortLabel, n.x, n.y);
        }

        // Mastered Badge or Solved Star
        if (!isDimmed && (isMastered || isChallengeSolved)) {
          ctx.beginPath();
          ctx.arc(n.x + n.radius * 0.72, n.y - n.radius * 0.72, 7, 0, Math.PI * 2);
          ctx.fillStyle = isMastered ? '#10b981' : '#f59e0b';
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText(isMastered ? '✓' : '★', n.x + n.radius * 0.72, n.y - n.radius * 0.72 + 0.5);
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
  }, [reducedMotion, activePathConceptIds, selectedConcept, masteredIds, challengeSolvedIds]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = Math.max(680, window.innerHeight - 200);
      }
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

    // Check hit test for hover
    let found: Node | null = null;
    for (const n of nodesRef.current) {
      const dist = Math.hypot(n.x - x, n.y - y);
      if (dist <= n.radius + 4) {
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

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
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
      if (dist <= n.radius + 4) {
        onSelectConcept(n.concept);
        break;
      }
    }
  }, [onSelectConcept]);

  return (
    <div className="relative w-full h-[680px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl">
      {/* Background Subtle Grid & Ambient Halos */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        className="w-full h-full relative z-10 block touch-none"
      />

      {/* Floating Tooltip when hovering a bubble */}
      {hoveredConcept && (
        <div 
          className="absolute z-20 pointer-events-none p-3 rounded-2xl glass-panel shadow-2xl border border-slate-700/80 max-w-xs transition-opacity duration-150"
          style={{
            left: Math.min(mousePosRef.current.x + 16, (canvasRef.current?.width || 800) - 280),
            top: Math.max(20, mousePosRef.current.y - 40),
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: CLUSTERS[hoveredConcept.cluster]?.color || '#06b6d4' }} 
            />
            <span className="text-xs font-bold text-white">{hoveredConcept.title}</span>
          </div>
          <p className="text-[11px] text-slate-300 line-clamp-2">
            {hoveredConcept.plainExplanation}
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] text-cyan-400 font-semibold">
            <span>Click to open lesson card →</span>
            <span>{CLUSTERS[hoveredConcept.cluster]?.name}</span>
          </div>
        </div>
      )}

      {/* Quick Legend & Controls Overlay at Bottom */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-[11px] text-slate-300 pointer-events-auto">
          <span>✨ <strong>Tip:</strong> Drag bubbles to play or click to open.</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">Connected lines show architecture relationships</span>
        </div>

        <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full glass-panel text-[11px] text-slate-400 pointer-events-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> Start Here
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-400" /> Agents
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Tools & MCP
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Memory & RAG
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-400" /> Swarms
          </span>
        </div>
      </div>
    </div>
  );
};
