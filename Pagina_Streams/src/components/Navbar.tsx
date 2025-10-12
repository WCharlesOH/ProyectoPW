import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#00b7ff' : '#fff',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal'
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
        zIndex: 10
      }}
    >
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: '#00b7ff', textDecoration: 'none' }}>
          Stream
        </Link>
      </h2>
      <nav style={{ display: 'flex', gap: '18px' }}>
        <NavLink to="/" style={linkStyle}>Inicio</NavLink>
        <NavLink to="/explorar" style={linkStyle}>Explorar</NavLink>
        <NavLink to="/live" style={linkStyle}>Iniciar Live</NavLink>
        <NavLink to="/nosotros" style={linkStyle}>Nosotros</NavLink>
        <NavLink to="/terminos" style={linkStyle}>Términos</NavLink>
        <NavLink to="/login" style={linkStyle}>Login</NavLink>
      </nav>
    </header>
  )
}