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

import Usuarios from './pages/Usuario'
import PaginaStreamer from './pages/PaginaStreamer'
import ResultadosBusqueda from "./pages/ResultadosBusqueda";
import CategoriaPagina from './pages/CategoriaPagina';
import { AuthProvider } from "./components/AuthContext";

import { useEffect, useState } from 'react'
import Perfil_V from './pages/Perfil_V'
import GestionRegalos from './pages/GestionRegalos'
import Logros from './pages/Logros'

import {API} from './Comandosllamadas/llamadas'
import type { Usuario } from './components/types'

export default function App() {

  const [monedas, setMonedas] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true); 

  const location = useLocation();
  const hideSidebar = location.pathname === '/dashboard';

  const todo = API

  const datos: Usuario | null = JSON.parse(localStorage.getItem("user") || "null")

  useEffect(()=>{
    if(datos){
      setMonedas(datos?.Monedas)
    }
    else{
      setMonedas(0)
    }
  }, [])

  return (
    <AuthProvider>
      <div className="app-shell">
        
        <Navbar monedas={monedas} setMonedas={setMonedas} />

        <div className="app-body">
          
          {!hideSidebar && (
            <Sidebar onToggle={setSidebarOpen} />
          )}

          <main 
            className="content-area"
            style={{
              marginLeft: hideSidebar ? 0 : (sidebarOpen ? 250 : 40),
              transition: "margin-left 0.3s ease"
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorar" element={<Explorar />} />
              <Route path="/categoria/:categoriaId" element={<CategoriaPagina sidebarAbierto={sidebarOpen} />} />
              <Route path="/buscar" element={<ResultadosBusqueda />} />
              <Route path="/perfil/:username" element={<Perfil monedas={monedas} setMonedas={setMonedas} />} />
              <Route path="/perfilv/:username" element={<Perfil_V />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/terminos" element={<Terminos />} />

              <Route path="/dashboard" element={<DashboardStreamer monedas={monedas} setMonedas={setMonedas} />} />
              <Route path="/panel" element={<PanelControl monedas={monedas} setMonedas={setMonedas} />} />
              <Route path="/suscripciones" element={<Suscripciones />} />
              <Route path="/usuario" element={<Usuarios />} />
              <Route path="/canal/:id" element={<PaginaStreamer />} />
              <Route path="/gestion-regalos" element={<GestionRegalos />} />
              <Route path="/logros/:username" element={<Logros />} />
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