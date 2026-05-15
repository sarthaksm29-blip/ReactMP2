import { useState, useEffect } from 'react';

export function useNumberCounter(endValue, durationMs = 600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrameId;

    // Easing function (easeOutQuad)
    const easeOutQuad = (t) => t * (2 - t);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressRatio = Math.min(progress / durationMs, 1);
      const easedProgress = easeOutQuad(progressRatio);
      
      setValue(Math.floor(easedProgress * endValue));

      if (progress < durationMs) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setValue(endValue); // Ensure exact final value
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [endValue, durationMs]);

  return value;
}
