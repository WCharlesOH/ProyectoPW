import { Routes, Route, NavLink, Link } from 'react-router-dom'

// === Páginas ===
import Home from './pages/Home'
import Explorar from './pages/Explorar'
import Perfil from './pages/Perfil'
import Login from './pages/Login'
import Registro from './pages/Registro'
import LiveStart from './pages/LiveStart'
import Nosotros from './pages/Nosotros'
import Terminos from './pages/Terminos'
import NotFound from './pages/NotFound'

// === Navbar simple ===
function Navbar() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#00b7ff' : '#fff',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
  })

  return (
    <header
      style={{
        backgroundColor: '#0e0e10',
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: '#00b7ff', textDecoration: 'none' }}>
          Streams
        </Link>
      </h2>

      <nav style={{ display: 'flex', gap: '18px' }}>
        <NavLink to="/" style={linkStyle}>
          Inicio
        </NavLink>
        <NavLink to="/explorar" style={linkStyle}>
          Explorar
        </NavLink>
        <NavLink to="/live" style={linkStyle}>
          Iniciar Live
        </NavLink>
        <NavLink to="/nosotros" style={linkStyle}>
          Nosotros
        </NavLink>
        <NavLink to="/terminos" style={linkStyle}>
          Términos
        </NavLink>
        <NavLink to="/login" style={linkStyle}>
          Login
        </NavLink>
      </nav>
    </header>
  )
}

// === App principal ===
export default function App() {
  return (
    <div style={{ backgroundColor: '#18181b', minHeight: '100vh', color: 'white' }}>
      <Navbar />

      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          {/* Páginas principales */}
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/perfil/:username" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/live" element={<LiveStart />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/terminos" element={<Terminos />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer
        style={{
          backgroundColor: '#0e0e10',
          color: '#aaa',
          textAlign: 'center',
          padding: '12px',
          marginTop: '32px',
        }}
      >
        © {new Date().getFullYear()} — Proyecto PW
      </footer>
    </div>
  )
}