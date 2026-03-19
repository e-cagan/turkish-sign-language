import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Predict from './pages/Predict'
import './index.css'

const NAV_LINKS = [
  { to: '/', label: 'Kamera', exact: true },
  { to: '/tahmin', label: 'Görüntü' },
  { to: '/hakkinda', label: 'Hakkında' },
]

function Navbar() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,10,10,0.92)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', height: '56px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 28, height: 28,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: '#fff',
          fontFamily: 'Syne, sans-serif',
        }}>TİD</div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '15px', letterSpacing: '-0.02em' }}>
          Türk İşaret Dili
        </span>
      </div>

      <nav style={{ display: 'flex', gap: '4px' }}>
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              padding: '6px 14px',
              fontSize: '13px',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.02em',
              color: isActive ? '#fff' : 'var(--text-muted)',
              background: isActive ? 'var(--bg-3)' : 'transparent',
              border: isActive ? '1px solid var(--border)' : '1px solid transparent',
              borderRadius: 'var(--radius)',
              transition: 'all 0.15s ease',
            })}
          >{label}</NavLink>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--success)',
          animation: 'pulse-dot 2s infinite',
        }} />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif' }}>
          Model Hazır
        </span>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '56px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tahmin" element={<Predict />} />
          <Route path="/hakkinda" element={<About />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}