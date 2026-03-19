import { useEffect, useState } from 'react'

const API = 'http://localhost:8000'

export default function ModelInfo() {
  const [info, setInfo] = useState(null)
  const [classes, setClasses] = useState(null)

  useEffect(() => {
    fetch(`${API}/model/info`).then(r => r.json()).then(setInfo).catch(() => {})
    fetch(`${API}/classes`).then(r => r.json()).then(setClasses).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.4s ease' }}>
      {/* Model stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Model', value: info?.model || '—' },
          { label: 'Sınıf Sayısı', value: info?.classes || '—' },
          { label: 'Versiyon', value: `v${info?.version || '—'}` },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            padding: '20px', borderRadius: 'var(--radius-lg)',
          }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', letterSpacing: '0.1em', marginBottom: '8px' }}>{label.toUpperCase()}</p>
            <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Performance */}
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>PERFORMANS METRİKLERİ</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'mAP@50', value: 99.4, color: '#22c55e' },
            { label: 'Precision', value: 99.5, color: '#06b6d4' },
            { label: 'Recall', value: 99.8, color: '#a855f7' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontFamily: 'Syne, sans-serif', color: 'var(--text-dim)' }}>{label}</span>
                <span style={{ fontSize: '13px', fontFamily: 'Syne, sans-serif', fontWeight: 700, color }}>{value}%</span>
              </div>
              <div style={{ height: '4px', background: 'var(--bg-3)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '2px', transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classes */}
      {classes && (
        <div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>
            DESTEKLENEN KELİMELER ({Object.keys(classes).length})
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.values(classes).map((name, i) => (
              <span key={i} style={{
                padding: '6px 12px',
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 500,
                color: 'var(--text-dim)',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-dim)' }}
              >{name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}