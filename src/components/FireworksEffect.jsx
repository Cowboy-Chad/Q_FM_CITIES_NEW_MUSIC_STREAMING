import React, { useEffect, useRef } from 'react'

// Firework colors: reds and oranges
const COLORS = [
  // Red family
  '#ff0000', '#ff1a1a', '#ff3333', '#ff4d4d', '#cc0000', '#e60000',
  // Orange family
  '#ff6600', '#ff7700', '#ff8800', '#ff9900', '#ffaa00', '#ff5500',
]

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

class Particle {
  constructor(x, y, color, speedX, speedY) {
    this.x = x
    this.y = y
    this.color = color
    this.speedX = speedX
    this.speedY = speedY
    this.alpha = 1
    this.size = randomBetween(1.5, 3.5)
    this.decay = randomBetween(0.008, 0.025)
    this.gravity = randomBetween(0.02, 0.06)
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY
    this.speedY += this.gravity
    this.speedX *= 0.99
    this.alpha -= this.decay
  }

  draw(ctx) {
    if (this.alpha <= 0) return
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.shadowBlur = 8
    ctx.shadowColor = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

class Rocket {
  constructor(canvasWidth) {
    this.x = randomBetween(canvasWidth * 0.25, canvasWidth * 0.75)
    this.y = 0 // start from the very top
    this.targetY = randomBetween(0, 0.35) // explode in upper portion as proportion
    this.speed = randomBetween(2.5, 5)
    this.color = randomColor()
    this.particles = []
    this.exploded = false
    this.trail = []
    this.canvasWidth = canvasWidth
  }

  update(canvasHeight) {
    if (!this.exploded) {
      this.trail.push({ x: this.x, y: this.y, alpha: 0.6 })
      if (this.trail.length > 12) this.trail.shift()
      // Fade trail
      this.trail.forEach(t => { t.alpha -= 0.05 })

      this.y += this.speed
      if (this.y <= canvasHeight * this.targetY) {
        this.explode()
      }
    }

    // Update particles
    this.particles.forEach(p => p.update())
    this.particles = this.particles.filter(p => p.alpha > 0)
  }

  explode() {
    this.exploded = true
    const count = Math.floor(randomBetween(40, 70))
    const angleStep = (Math.PI * 2) / count
    for (let i = 0; i < count; i++) {
      const angle = angleStep * i + randomBetween(-0.15, 0.15)
      const speed = randomBetween(1, 4)
      const p = new Particle(
        this.x,
        this.y,
        this.color,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      )
      this.particles.push(p)
    }
  }

  draw(ctx, canvasHeight) {
    // Draw trail
    this.trail.forEach(t => {
      if (t.alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = t.alpha
      ctx.fillStyle = '#ffcc66'
      ctx.shadowBlur = 6
      ctx.shadowColor = '#ffaa00'
      ctx.beginPath()
      ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    // Draw rocket head
    if (!this.exploded) {
      ctx.save()
      ctx.fillStyle = '#ffcc44'
      ctx.shadowBlur = 10
      ctx.shadowColor = '#ff8800'
      ctx.beginPath()
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // Draw particles
    this.particles.forEach(p => p.draw(ctx))
  }

  isDead() {
    return this.exploded && this.particles.length === 0
  }
}

export default function FireworksEffect() {
  const canvasRef = useRef(null)
  const rocketsRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let launchTimer = 0

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    function animate(timestamp) {
      ctx.clearRect(0, 0, width, height)

      // Auto-launch rockets periodically
      launchTimer++
      if (launchTimer > 35 && rocketsRef.current.length < 4) {
        rocketsRef.current.push(new Rocket(width))
        launchTimer = 0
      }

      // Update and draw rockets
      rocketsRef.current.forEach(r => r.update(height))
      rocketsRef.current.forEach(r => r.draw(ctx, height))
      rocketsRef.current = rocketsRef.current.filter(r => !r.isDead())

      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fireworks-canvas" />
}
