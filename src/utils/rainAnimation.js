// Rain animation that falls from the top of the screen
export function fireRainEffect(duration = 2500) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 9999;
  `;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const drops = [];
  const maxDrops = 120;
  const startTime = Date.now();

  const colors = [
    'rgba(55, 138, 221, 0.7)',
    'rgba(133, 183, 235, 0.6)',
    'rgba(181, 212, 244, 0.5)',
    'rgba(29, 158, 117, 0.5)',
    'rgba(93, 202, 165, 0.4)',
    'rgba(159, 225, 203, 0.35)',
  ];

  function spawnDrop() {
    return {
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 40,
      speed: 4 + Math.random() * 8,
      length: 15 + Math.random() * 25,
      width: 1 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: (Math.random() - 0.5) * 0.8,
      // splash properties
      splashed: false,
      splashX: 0,
      splashY: 0,
      splashFrame: 0,
    };
  }

  // Initial batch
  for (let i = 0; i < 60; i++) {
    const d = spawnDrop();
    d.y = Math.random() * canvas.height * 0.5; // stagger initial positions
    drops.push(d);
  }

  function drawSplash(ctx, x, y, frame) {
    const progress = frame / 12;
    if (progress > 1) return;
    const alpha = 1 - progress;
    const radius = 3 + progress * 12;

    // Small circle ripple
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(133, 183, 235, ${alpha * 0.5})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tiny droplets splashing outward
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI / 4) + (i * Math.PI / 3);
      const dist = progress * 15;
      const dx = x + Math.cos(angle) * dist;
      const dy = y - Math.sin(angle) * dist * 0.6;
      ctx.beginPath();
      ctx.arc(dx, dy, 1.5 * (1 - progress), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(181, 212, 244, ${alpha * 0.6})`;
      ctx.fill();
    }
  }

  let animFrame;
  function animate() {
    const elapsed = Date.now() - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new drops during first portion
    if (elapsed < duration * 0.7 && drops.length < maxDrops) {
      for (let i = 0; i < 3; i++) {
        drops.push(spawnDrop());
      }
    }

    let alive = false;
    for (const drop of drops) {
      if (drop.splashed && drop.splashFrame > 12) continue;
      alive = true;

      if (!drop.splashed) {
        // Move drop down
        drop.y += drop.speed;
        drop.x += drop.drift;

        // Draw raindrop streak
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - drop.drift * 2, drop.y - drop.length);
        ctx.strokeStyle = drop.color;
        ctx.lineWidth = drop.width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw a tiny bright dot at the tip
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.width, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220, 240, 255, 0.6)';
        ctx.fill();

        // Check if hit bottom
        if (drop.y > canvas.height - 20 + Math.random() * 20) {
          drop.splashed = true;
          drop.splashX = drop.x;
          drop.splashY = drop.y;
          drop.splashFrame = 0;
        }
      } else {
        // Draw splash animation
        drawSplash(ctx, drop.splashX, drop.splashY, drop.splashFrame);
        drop.splashFrame++;
      }
    }

    if (alive || elapsed < duration) {
      animFrame = requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  animFrame = requestAnimationFrame(animate);

  // Safety cleanup
  setTimeout(() => {
    cancelAnimationFrame(animFrame);
    canvas.remove();
  }, duration + 1000);
}
