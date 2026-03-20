import { useEffect, useRef, useState, useCallback } from 'react'

const WS_URL = 'ws://localhost:8000/ws'
const COLORS = ['#ff4d1c', '#06b6d4', '#a855f7', '#22c55e', '#f59e0b', '#ec4899']

function getColor(label) {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default function Camera() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const wsRef = useRef(null)
  const animRef = useRef(null)
  const detectionRef = useRef([])

  const [status, setStatus] = useState('disconnected')
  const [fps, setFps] = useState(0)
  const [detections, setDetections] = useState([])
  const [frameCount, setFrameCount] = useState(0)
  const fpsTimer = useRef(null)
  const frameCounter = useRef(0)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    const ws = new WebSocket(WS_URL)
    ws.binaryType = 'arraybuffer'
    ws.onopen = () => setStatus('connected')
    ws.onclose = () => { setStatus('disconnected'); setTimeout(connect, 3000) }
    ws.onerror = () => setStatus('error')
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        detectionRef.current = data
        setDetections(data)
        frameCounter.current++
      } catch {}
    }
    wsRef.current = ws
  }, [])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
    connect()

    fpsTimer.current = setInterval(() => {
      setFps(frameCounter.current)
      frameCounter.current = 0
    }, 1000)

    return () => {
      wsRef.current?.close()
      cancelAnimationFrame(animRef.current)
      clearInterval(fpsTimer.current)
    }
  }, [connect])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')

    const draw = () => {
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      ctx.drawImage(video, 0, 0)

      // Send frame
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        canvas.toBlob(blob => {
          if (blob) blob.arrayBuffer().then(buf => wsRef.current?.send(buf))
        }, 'image/jpeg', 0.7)
      }

      // Draw detections
      const dets = detectionRef.current
      if (Array.isArray(dets)) {
        dets.forEach(det => {
          const { box, name, confidence } = det
          if (!box) return
          const { x1, y1, x2, y2 } = box
          const color = getColor(name)
          const w = x2 - x1, h = y2 - y1

          // Corner brackets
          const cSize = 16
          ctx.strokeStyle = color
          ctx.lineWidth = 2.5

          // TL
          ctx.beginPath(); ctx.moveTo(x1 + cSize, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + cSize); ctx.stroke()
          // TR
          ctx.beginPath(); ctx.moveTo(x2 - cSize, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y1 + cSize); ctx.stroke()
          // BL
          ctx.beginPath(); ctx.moveTo(x1 + cSize, y2); ctx.lineTo(x1, y2); ctx.lineTo(x1, y2 - cSize); ctx.stroke()
          // BR
          ctx.beginPath(); ctx.moveTo(x2 - cSize, y2); ctx.lineTo(x2, y2); ctx.lineTo(x2, y2 - cSize); ctx.stroke()

          // Label background
          const label = `${name}  ${(confidence * 100).toFixed(0)}%`
          ctx.font = '600 13px Syne, sans-serif'
          const tw = ctx.measureText(label).width
          ctx.fillStyle = color
          ctx.fillRect(x1, y1 - 26, tw + 16, 24)

          // Label text
          ctx.fillStyle = '#fff'
          ctx.fillText(label, x1 + 8, y1 - 8)
        })
      }

      animRef.current = requestAnimationFrame(draw)
    }

    video.addEventListener('loadedmetadata', () => {
      animRef.current = requestAnimationFrame(draw)
    })

    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const statusColor = { connected: '#22c55e', disconnected: '#ef4444', error: '#f59e0b' }[status]
  const statusLabel = { connected: 'Bağlı', disconnected: 'Bağlantı kesildi', error: 'Hata' }[status]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.4s ease' }}>
      {/* Camera feed */}
      <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#000', border: '1px solid var(--border)' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            opacity: 0,
          }}
        />
        <canvas ref={canvasRef} style={{ width: '100%', display: 'block', aspectRatio: '4/3' }} />

        {/* Scan line overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(transparent 49%, rgba(255,77,28,0.03) 50%, transparent 51%)',
        }} />

        {/* Top status bar */}
        <div style={{
          position: 'absolute', top: 12, left: 12, right: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)',
            padding: '5px 10px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, animation: status === 'connected' ? 'pulse-dot 2s infinite' : 'none' }} />
            <span style={{ fontSize: '11px', fontFamily: 'Syne, sans-serif', color: statusColor, fontWeight: 600, letterSpacing: '0.05em' }}>{statusLabel.toUpperCase()}</span>
          </div>

          <div style={{
            background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)',
            padding: '5px 10px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            fontSize: '11px', fontFamily: 'Syne, sans-serif', color: 'var(--text-muted)', fontWeight: 500,
          }}>
            {fps} FPS
          </div>
        </div>

        {/* No detection overlay */}
        {detections.length === 0 && status === 'connected' && (
          <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)',
            padding: '8px 16px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif',
            whiteSpace: 'nowrap',
          }}>
            Kameraya elinizi gösterin
          </div>
        )}
      </div>

      {/* Detection cards */}
      {detections.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {detections.map((det, i) => {
            const color = getColor(det.name)
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'var(--bg-2)', border: `1px solid ${color}40`,
                borderLeft: `3px solid ${color}`,
                padding: '10px 14px', borderRadius: 'var(--radius)',
                animation: 'fadeIn 0.2s ease',
              }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', color: '#fff' }}>{det.name}</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '12px', color, fontWeight: 600 }}>
                  {(det.confidence * 100).toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}