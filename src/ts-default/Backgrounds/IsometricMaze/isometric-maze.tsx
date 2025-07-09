import type React from "react"
import { useEffect, useRef } from "react"

interface ColorScheme {
  primary: string
  secondary: string
  accent: string
  highlight: string
}

interface IsometricMazeProps {
  speed?: number
  colorScheme?: ColorScheme
}

const IsometricMaze: React.FC<IsometricMazeProps> = ({ 
  speed = 1,
  colorScheme = {
    primary: "0,255,255",
    secondary: "255,0,255", 
    accent: "255,255,0",
    highlight: "255,255,255"
  }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      draw()
    }

    const draw = () => {
      if (!canvas || !ctx) return
      
      const cellSize = Math.min(canvas.width, canvas.height) / 15
      const gridWidth = Math.ceil(canvas.width / cellSize) * 2
      const gridHeight = Math.ceil(canvas.height / (cellSize * 0.5)) * 2
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      for (let y = -gridHeight; y < gridHeight; y++) {
        for (let x = -gridWidth; x < gridWidth; x++) {
          const screenX = centerX + ((x - y) * cellSize) / 2
          const screenY = centerY + ((x + y) * cellSize) / 4
          const distance = Math.sqrt(x * x + y * y)
          const maxDistance = Math.sqrt(gridWidth * gridWidth + gridHeight * gridHeight)
          const distanceRatio = 1 - distance / maxDistance
          const height = cellSize * distanceRatio * Math.abs(Math.sin(distance * 0.5 + timeRef.current))

          // Draw main face
          ctx.beginPath()
          ctx.moveTo(screenX, screenY - height)
          ctx.lineTo(screenX + cellSize / 2, screenY - cellSize / 2 - height)
          ctx.lineTo(screenX + cellSize, screenY - height)
          ctx.lineTo(screenX + cellSize, screenY)
          ctx.lineTo(screenX + cellSize / 2, screenY + cellSize / 2)
          ctx.lineTo(screenX, screenY)
          ctx.closePath()

          const gradient = ctx.createLinearGradient(screenX, screenY - height, screenX + cellSize, screenY)
          gradient.addColorStop(0, `rgba(${colorScheme.primary}, 0.8)`)
          gradient.addColorStop(1, `rgba(${colorScheme.secondary}, 0.8)`)
          ctx.fillStyle = gradient
          ctx.fill()
          ctx.strokeStyle = `rgba(${colorScheme.accent}, 0.5)`
          ctx.stroke()

          // Draw vertical lines
          ctx.beginPath()
          ctx.moveTo(screenX, screenY)
          ctx.lineTo(screenX, screenY - height)
          ctx.moveTo(screenX + cellSize, screenY)
          ctx.lineTo(screenX + cellSize, screenY - height)
          ctx.moveTo(screenX + cellSize / 2, screenY + cellSize / 2)
          ctx.lineTo(screenX + cellSize / 2, screenY - cellSize / 2 - height)
          ctx.strokeStyle = `rgba(${colorScheme.highlight}, 0.3)`
          ctx.stroke()
        }
      }
    }

    const animate = () => {
      if (!canvas || !ctx) return
      
      ctx.fillStyle = "rgba(0,0,0,0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      draw()
      
      timeRef.current += 0.05 * speed
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resize)
    resize()
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [speed, colorScheme])

  return <canvas ref={canvasRef} className="block" />
}

export default IsometricMaze