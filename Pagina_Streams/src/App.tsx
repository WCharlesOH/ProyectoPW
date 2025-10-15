import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


import Home from './pages/Home'
import Explorar from './pages/Explorar'
import Perfil from './pages/Perfil'
import DashboardStreamer from './pages/DashboardStreamer'
import Login from './pages/Login'
import Registro from './pages/Registro'
import LiveStart from './pages/LiveStart'
import Nosotros from './pages/Nosotros'
import Terminos from './pages/Terminos'
import NotFound from './pages/NotFound'
import Sidebar from './components/Sidebar'

import { AuthProvider } from "./components/AuthContext";

import { useState } from 'react'
import Perfil_V from './pages/Perfil_V'
import GestionRegalos from './pages/GestionRegalos'



//main

export default function App() {
  const [monedas, setMonedas] = useState(120);
  const location = useLocation();
  const hideSidebar = location.pathname === '/dashboard';

  return (
    <AuthProvider>
    <div style={{ backgroundColor: '#18181b', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Navbar monedas={monedas} setMonedas={setMonedas} />
  <div style={{ display: 'flex', flex: 1 }}>
  {!hideSidebar && <Sidebar/>}
  <main style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/perfil/:username" element={<Perfil monedas={monedas} setMonedas={setMonedas} />} />
          <Route path="/perfilv/:username" element={<Perfil_V />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/live" element={<LiveStart />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/dashboard" element={<DashboardStreamer monedas={monedas} setMonedas={setMonedas} />} />
          <Route path="/gestion-regalos" element={<GestionRegalos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      </div>
      <Footer />
    </div>
    </AuthProvider>
  )
}