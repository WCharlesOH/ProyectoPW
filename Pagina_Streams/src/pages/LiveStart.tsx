import React, { useEffect, useState } from "react";
import Player from "../components/Player";
import ChatBox from "../components/ChatBox";
import { canalActividad, canalStream, emitirStream, emitirActividad } from "../datos/sincronizacion";

interface LiveStartProps {
  monedas: number;
  setMonedas: (m: number) => void;
}

const categorias = ["Gaming", "Arte", "Musica", "Charlas", "Deportes"];

const LiveStart: React.FC<LiveStartProps> = ({ monedas, setMonedas }) => {
  const [categoria, setCategoria] = useState("Gaming");
  const streamer = {
    username: "Streamer123",
    descripcion: "¡Bienvenidos! Hoy jugaremos y charlaremos.",
    seguidores: 24320,
    imagenUrl: "https://pbs.twimg.com/media/GutWA1nWIAAbKVf.jpg",
  };

  const [actividades, setActividades] = useState<{ id: string; text: string; time: string }[]>([]);
  const [tiempo, setTiempo] = useState(0);

  // Manejar actividades y stream
  useEffect(() => {
    const handleActividad = (e: MessageEvent) => {
      if (e.data?.tipo === "actividad") {
        const hora = new Date(e.data.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setActividades(prev => [{ id: crypto.randomUUID(), text: e.data.texto, time: hora }, ...prev.slice(0, 19)]);
      }
    };

    const handleStream = (e: MessageEvent) => {
      if (e.data?.tipo === "stream" && !e.data.activo) {
        setTiempo(0);
      }
    };

    canalActividad.addEventListener("message", handleActividad);
    canalStream.addEventListener("message", handleStream);

    return () => {
      canalActividad.removeEventListener("message", handleActividad);
      canalStream.removeEventListener("message", handleStream);
    };
  }, []);

  // Iniciar contador al abrir la ventana
  useEffect(() => {
    const timer = setInterval(() => setTiempo(prev => prev + 1), 1000);
    emitirActividad("🟢 Transmisión iniciada", "stream");
    emitirStream(true, Date.now());

    return () => {
      clearInterval(timer);
      emitirStream(false);
      emitirActividad("🟥 Transmisión detenida", "stream", { duracion: tiempo });
    };
  }, []);

  const detenerLive = () => {
    emitirActividad("🟥 Transmisión detenida", "stream", { duracion: tiempo });
    emitirStream(false);
    window.close();
  };

  const formatoTiempo = (seg: number) => {
    const h = String(Math.floor(seg / 3600)).padStart(2, "0");
    const m = String(Math.floor((seg % 3600) / 60)).padStart(2, "0");
    const s = String(seg % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0e0e10", color: "white", marginLeft: 250, padding: 20 }}>
      <div style={{ flex: 1, paddingRight: 20 }}>
        <Player imagenUrl={streamer.imagenUrl} />
        <p>⏱️ Tiempo en vivo: {formatoTiempo(tiempo)}</p>

        <h1>{streamer.username}</h1>
        <p style={{ color: "#ccc" }}>{streamer.descripcion}</p>

        <div style={{ margin: "10px 0" }}>
          <label><strong>Categoría:</strong> </label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ marginLeft: 10, padding: 4, borderRadius: 4 }}>
            {categorias.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <p><strong>Seguidores:</strong> {streamer.seguidores}</p>

        <h2>Actividad y regalos</h2>
        <div style={{ maxHeight: 200, overflowY: "auto" }}>
          {actividades.length === 0 && <p style={{ opacity: 0.5 }}>No hay actividad aún.</p>}
          {actividades.map(a => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", background: "rgba(255,255,255,0.02)", padding: 8, borderRadius: 6, marginBottom: 6 }}>
              <span>{a.text}</span>
              <span style={{ opacity: 0.7, fontSize: 12 }}>{a.time}</span>
            </div>
          ))}
        </div>

        <button onClick={detenerLive} style={{ background: "#ef4444", color: "white", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: "bold", marginTop: 20 }}>
          ⏹️ Detener Live
        </button>
    </div>

      <div style={{ width: 380, background: "#18181b", display: "flex", flexDirection: "column", borderLeft: "1px solid #2a2a2a" }}>
        <ChatBox monedas={monedas} setMonedas={setMonedas} />
      </div>
    </div>
  );
};

export default LiveStart;


