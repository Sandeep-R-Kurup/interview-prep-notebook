import { useRef } from 'react';

// Horizontal swipe detection for touch screens. Vertical scrolling stays native.
// Swipes that start inside code blocks or other horizontally scrollable areas are ignored.
export default function useSwipe({ onLeft, onRight, threshold = 80 }) {
  const start = useRef(null);

  const onTouchStart = (e) => {
    if (e.touches.length !== 1 || e.target.closest('pre, .overflow-x-auto, input, textarea, select')) {
      start.current = null;
      return;
    }
    start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e) => {
    if (!start.current) return;
    const dx = e.changedTouches[0].clientX - start.current.x;
    const dy = e.changedTouches[0].clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 2) return;
    if (dx < 0) onLeft?.();
    else onRight?.();
  };

  return { onTouchStart, onTouchEnd };
}
