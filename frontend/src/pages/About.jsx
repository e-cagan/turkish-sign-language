import ModelInfo from '../components/ModelInfo'

export default function About() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '3px', height: '24px', background: 'var(--accent)', borderRadius: '2px' }} />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', letterSpacing: '-0.03em' }}>
            Model Hakkında
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', paddingLeft: '13px' }}>
          YOLOv8s mimarisi ile eğitilmiş Türk İşaret Dili tanıma modeli.
        </p>
      </div>

      {/* Tech stack */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px', paddingLeft: '13px' }}>
        {['YOLOv8s', 'FastAPI', 'React', 'WebSocket', 'ONNX'].map(tag => (
          <span key={tag} style={{
            padding: '4px 10px',
            background: 'var(--accent-dim)', border: '1px solid var(--accent)',
            borderRadius: 'var(--radius)',
            fontFamily: 'Syne, sans-serif', fontSize: '11px', fontWeight: 700,
            color: 'var(--accent)', letterSpacing: '0.05em',
          }}>{tag}</span>
        ))}
      </div>

      <ModelInfo />
    </div>
  )
}