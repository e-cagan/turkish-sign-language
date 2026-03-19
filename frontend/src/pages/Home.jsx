import Camera from '../components/Camera'

export default function Home() {
  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '3px', height: '24px', background: 'var(--accent)', borderRadius: '2px' }} />
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '26px', letterSpacing: '-0.03em' }}>
            Gerçek Zamanlı Tanıma
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', paddingLeft: '13px' }}>
          Kameranıza elinizi gösterin. Model Türk İşaret Dili işaretlerini anlık olarak tanır.
        </p>
      </div>
      <Camera />
    </div>
  )
}