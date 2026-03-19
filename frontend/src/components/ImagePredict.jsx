import { useState, useRef } from 'react'

const API = 'http://localhost:8000'

export default function ImagePredict() {
  const [preview, setPreview] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [fbSent, setFbSent] = useState(false)
  const fileRef = useRef()
  const canvasRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setResults(null); setError(null); setFbSent(false); setFeedback(null)
    const url = URL.createObjectURL(file)
    setPreview({ url, file })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const predict = async () => {
    if (!preview) return
    setLoading(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('file', preview.file)
      const res = await fetch(`${API}/predict/image`, { method: 'POST', body: fd })
      const data = await res.json()
      setResults(data)
      drawBoxes(data)
    } catch (e) {
      setError('Sunucuya bağlanılamadı.')
    } finally {
      setLoading(false)
    }
  }

  const drawBoxes = (dets) => {
    const canvas = canvasRef.current
    const img = new Image()
    img.src = preview.url
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      if (!Array.isArray(dets)) return
      dets.forEach(det => {
        const { box, name, confidence } = det
        if (!box) return
        const { x1, y1, x2, y2 } = box
        ctx.strokeStyle = '#ff4d1c'; ctx.lineWidth = 2
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)
        const label = `${name} ${(confidence * 100).toFixed(0)}%`
        ctx.font = '600 14px Syne, sans-serif'
        const tw = ctx.measureText(label).width
        ctx.fillStyle = '#ff4d1c'
        ctx.fillRect(x1, y1 - 28, tw + 16, 26)
        ctx.fillStyle = '#fff'
        ctx.fillText(label, x1 + 8, y1 - 8)
      })
    }
  }

  const sendFeedback = async () => {
    if (!feedback || !results?.[0]) return
    try {
      await fetch(`${API}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predicted: results[0].name,
          correct: feedback,
          confidence: results[0].confidence,
        })
      })
      setFbSent(true)
    } catch {}
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' }}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${preview ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          background: preview ? 'var(--accent-dim)' : 'var(--bg-2)',
          transition: 'all 0.2s ease',
          minHeight: '120px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        <div style={{ fontSize: '28px' }}>🖼️</div>
        <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: preview ? 'var(--accent)' : 'var(--text-dim)' }}>
          {preview ? preview.file.name : 'Görüntü sürükleyin veya tıklayın'}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PNG, JPG, WEBP</p>
      </div>

      {/* Canvas preview */}
      {preview && (
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <canvas ref={canvasRef} style={{ width: '100%', display: results ? 'block' : 'none' }} />
          {!results && <img src={preview.url} style={{ width: '100%', display: 'block' }} alt="preview" />}
        </div>
      )}

      {/* Predict button */}
      {preview && !loading && (
        <button onClick={predict} style={{
          background: 'var(--accent)', color: '#fff',
          padding: '12px 24px', borderRadius: 'var(--radius)',
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14px',
          letterSpacing: '0.05em', transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          TAHMİN ET
        </button>
      )}

      {loading && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', fontSize: '13px' }}>
          Tahmin yapılıyor...
        </div>
      )}

      {error && <div style={{ color: '#ef4444', fontFamily: 'Syne, sans-serif', fontSize: '13px' }}>{error}</div>}

      {/* Results */}
      {Array.isArray(results) && results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>SONUÇLAR</h3>
          {results.map((det, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderLeft: '3px solid var(--accent)',
              padding: '12px 16px', borderRadius: 'var(--radius)',
            }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px' }}>{det.name}</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>
                {(det.confidence * 100).toFixed(1)}%
              </span>
            </div>
          ))}

          {/* Feedback */}
          {!fbSent ? (
            <div style={{ marginTop: '8px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontFamily: 'Syne, sans-serif' }}>Tahmin yanlışsa doğru kelimeyi girin:</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={feedback || ''}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Doğru kelime..."
                  style={{
                    flex: 1, background: 'var(--bg-3)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '8px 12px',
                    color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button onClick={sendFeedback} style={{
                  background: 'var(--bg-3)', border: '1px solid var(--border)',
                  padding: '8px 14px', borderRadius: 'var(--radius)',
                  color: 'var(--text-dim)', fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 600,
                }}>Gönder</button>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--success)', fontFamily: 'Syne, sans-serif' }}>✓ Geri bildirim gönderildi</p>
          )}
        </div>
      )}

      {Array.isArray(results) && results.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', fontSize: '13px' }}>Görüntüde işaret tespit edilemedi.</p>
      )}
    </div>
  )
}