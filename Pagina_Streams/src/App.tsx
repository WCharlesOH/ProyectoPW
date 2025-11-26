import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'


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
import PanelControl from './pages/PanelControl'
import Suscripciones from './pages/Suscripciones'
import Ajustes from './pages/Ajustes'
import Usuario from './pages/Usuario'
import PaginaStreamer from './pages/PaginaStreamer'

import { AuthProvider } from "./components/AuthContext";

import { useState } from 'react'
import Perfil_V from './pages/Perfil_V'
import GestionRegalos from './pages/GestionRegalos'
import Logros from './pages/Logros'



//main

export default function App() {
  const [monedas, setMonedas] = useState(120);
  const location = useLocation();
  const hideSidebar = location.pathname === '/dashboard';

  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar monedas={monedas} setMonedas={setMonedas} />
        <div className="app-body">
          {!hideSidebar && <Sidebar />}
          <main className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorar" element={<Explorar />} />
              <Route path="/perfil/:username" element={<Perfil monedas={monedas} setMonedas={setMonedas} />} />
              <Route path="/perfilv/:username" element={<Perfil_V />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/terminos" element={<Terminos />} />   
              <Route path="/dashboard" element={<DashboardStreamer monedas={monedas} setMonedas={setMonedas} />} />
              <Route path="/terminos" element={<Terminos />} />
              <Route path="/dashboard" element={<DashboardStreamer monedas={monedas} />} />
              <Route path="/dashboard" element={<DashboardStreamer monedas={monedas} />} />
              <Route path="/panel" element={<PanelControl monedas={monedas} setMonedas={setMonedas} />} />
              <Route path="/suscripciones" element={<Suscripciones />} />
              <Route path="/ajustes" element={<Ajustes />} />
              <Route path="/usuario" element={<Usuario />} />
              <Route path="/canal/:id" element={<PaginaStreamer />} />
              <Route path="/gestion-regalos" element={<GestionRegalos />} />
              <Route path="/Logros/:username" element={<Logros />} />
              <Route path="/live-start" element={<LiveStart monedas={monedas} setMonedas={setMonedas} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}