export function fireWaterDroplets(options = {}) {
  const {
    count = 40,
    originX = 0.5,
    originY = 0.4,
    milestone = false,
  } = options

  const canvas = document.createElement('canvas')
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 9999;
  `
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const dropCount = milestone ? 80 : count
  const drops = []

  for (let i = 0; i < dropCount; i++) {
    const angle = (Math.random() * 160 + 10) * (Math.PI / 180)
    const speed = Math.random() * (milestone ? 14 : 10) + 4
    const size = Math.random() * (milestone ? 14 : 10) + 5

    // Color palette: blues + teals + light greens
    const colors = [
      '#378ADD', '#85B7EB', '#B5D4F4',
      '#1D9E75', '#5DCAA5', '#9FE1CB',
      '#E6F1FB', '#E1F5EE'
    ]

    drops.push({
      x: canvas.width * originX,
      y: canvas.height * originY,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -Math.sin(angle) * speed,
      gravity: 0.35 + Math.random() * 0.2,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.08 + 0.04,
    })
  }

  function drawDrop(ctx, drop) {
    ctx.save()
    ctx.globalAlpha = drop.opacity
    ctx.translate(drop.x, drop.y)
    ctx.rotate(drop.rotation)

    // Draw teardrop / water drop shape
    ctx.beginPath()
    const r = drop.size / 2
    // Teardrop: circle bottom + pointed top
    ctx.arc(0, r * 0.4, r, 0, Math.PI)               // bottom half circle
    ctx.bezierCurveTo(-r, -r * 0.2, -r * 0.3, -r * 1.6, 0, -r * 1.8)  // left curve to tip
    ctx.bezierCurveTo( r * 0.3, -r * 1.6,  r, -r * 0.2,  r,  r * 0.4) // right curve from tip
    ctx.closePath()

    ctx.fillStyle = drop.color
    ctx.fill()

    // Shine highlight
    ctx.beginPath()
    ctx.arc(-r * 0.25, -r * 0.3, r * 0.22, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.55)'
    ctx.fill()

    ctx.restore()
  }

  let frame = 0
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let alive = false
    for (const drop of drops) {
      if (drop.opacity <= 0) continue
      alive = true

      drop.wobble += drop.wobbleSpeed
      drop.x += drop.vx + Math.sin(drop.wobble) * 0.6
      drop.vy += drop.gravity
      drop.y += drop.vy
      drop.rotation += drop.rotationSpeed
      drop.opacity -= 0.018

      drawDrop(ctx, drop)
    }

    frame++
    if (alive) {
      requestAnimationFrame(animate)
    } else {
      canvas.remove()
    }
  }

  requestAnimationFrame(animate)
}
