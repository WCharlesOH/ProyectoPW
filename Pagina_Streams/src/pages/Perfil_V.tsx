import { useAuth } from "../components/AuthContext";
import React from "react";

function DashboardStreamer() {
  // Datos simulados, reemplaza con datos reales si tienes acceso a la API
  const horasStream = 120; // ejemplo: 120 horas
  const visualizacionesPorMes = {
    "Enero": 300,
    "Febrero": 450,
    "Marzo": 500,
    "Abril": 350,
    "Mayo": 600,
  };
  const monedasGastadas = 15000; // ejemplo: 15000 monedas

  return (
    <div style={{border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginTop: "1rem"}}>
      <h3>Dashboard del Streamer</h3>
      <p><strong>Horas transmitidas:</strong> {horasStream}</p>
      <div>
        <strong>Visualizaciones por mes:</strong>
        <ul>
          {Object.entries(visualizacionesPorMes).map(([mes, vistas]) => (
            <li key={mes}>{mes}: {vistas} visualizaciones</li>
          ))}
        </ul>
      </div>
      <p><strong>Monedas gastadas por usuarios:</strong> {monedasGastadas}</p>
    </div>
  );
}

export default function Perfil_V() {
  const { user } = useAuth();
  // Se asume que el rol del streamer es 'streamer' en user.role
  return (
    <div>
      <h2>Perfil del Streamer</h2>
      {/* ...otros datos del perfil... */}
      {user?.role === "streamer" && <DashboardStreamer />}
    </div>
  );
}