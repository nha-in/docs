import React, {useEffect, useRef} from 'react';

type Node = {x: number; y: number; vx: number; vy: number};

const DENSITY = 3200; // one node per this many square pixels
const MAX_NODES = 340;
const LINK = 210; // px: two nodes closer than this are joined
const DRIFT = 0.1; // px per frame
const LINE_WIDTH = 1.6; // px, heavier than a hairline so the mesh reads under the veil

/**
 * The network under the landing copy, revealed by the cursor.
 *
 * Two layers. The canvas draws the whole web at full strength. Over it sits a
 * veil painted in the page colour, so the page reads as flat until the pointer
 * moves. A radial mask follows the pointer and cuts a hole in that veil, so
 * the reader lights the part of the network they are over. The mechanic is the
 * one beckn.io uses on its hero; what is underneath is ours.
 *
 * The mask is moved by writing two custom properties, so a pointer move costs
 * a style recalculation rather than a React render. The veil takes no pointer
 * events, so nothing underneath becomes harder to click.
 */
export default function NetworkWeb(): React.ReactNode {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!wrap || !canvas || !context) {
      return undefined;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;

    const read = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const measure = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(
        MAX_NODES,
        Math.max(30, Math.round((width * height) / DENSITY)),
      );
      nodes = Array.from({length: count}, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * DRIFT * 2,
        vy: (Math.random() - 0.5) * DRIFT * 2,
      }));
    };

    const draw = () => {
      const accent = read('--accent') || '#3d714e';
      context.clearRect(0, 0, width, height);

      if (!reduced.matches) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
      }

      context.strokeStyle = accent;
      context.lineWidth = LINE_WIDTH;
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK) {
            continue;
          }
          context.globalAlpha = (1 - distance / LINK) * 0.55;
          context.beginPath();
          context.moveTo(nodes[i].x, nodes[i].y);
          context.lineTo(nodes[j].x, nodes[j].y);
          context.stroke();
        }
      }

      context.fillStyle = accent;
      for (const node of nodes) {
        context.globalAlpha = 0.85;
        context.beginPath();
        context.arc(node.x, node.y, 2, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const loop = () => {
      draw();
      frame = window.requestAnimationFrame(loop);
    };

    // The torch: two custom properties the mask reads.
    const onPointerMove = (event: PointerEvent) => {
      const box = wrap.getBoundingClientRect();
      wrap.style.setProperty('--reveal-x', `${event.clientX - box.left}px`);
      wrap.style.setProperty('--reveal-y', `${event.clientY - box.top}px`);
      wrap.style.setProperty('--reveal-r', '190px');
    };
    const onPointerLeave = () => wrap.style.setProperty('--reveal-r', '0px');
    const onResize = () => {
      measure();
      if (reduced.matches) draw();
    };

    measure();
    if (reduced.matches) {
      draw();
    } else {
      frame = window.requestAnimationFrame(loop);
    }

    window.addEventListener('pointermove', onPointerMove, {passive: true});
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="network-web" ref={wrapRef} aria-hidden="true">
      <canvas className="network-web__canvas" ref={canvasRef} />
      <div className="network-web__veil" />
    </div>
  );
}
