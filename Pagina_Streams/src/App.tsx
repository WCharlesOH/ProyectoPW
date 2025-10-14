import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


import Home from './pages/Home'
import Explorar from './pages/Explorar'
import Perfil from './pages/Perfil'
import Login from './pages/Login'
import Registro from './pages/Registro'
import LiveStart from './pages/LiveStart'
import Nosotros from './pages/Nosotros'
import Terminos from './pages/Terminos'
import NotFound from './pages/NotFound'
import Sidebar from './components/Sidebar'
import { AuthProvider } from "./components/AuthContext";

export default function App() {
  return (
    <AuthProvider>
    <div style={{ backgroundColor: '#18181b', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
      <Sidebar/>
      <main style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/perfil/" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/live" element={<LiveStart />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      </div>
      <Footer />
    </div>
    </AuthProvider>
  )
}