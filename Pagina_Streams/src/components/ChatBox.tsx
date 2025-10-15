import { useState, useRef, useEffect } from "react";
import BotonMonedas from "./BotonMonedas";
import BotonNivel from "./BotonNivel";
import BotonRegalo from "./botonregalo";
import { 
  canalChat, 
  emitirMensajeChat, 
  emitirActividad,
  obtenerTabId 
} from "../datos/sincronizacion";

interface Mensaje {
  autor: string;
  nivel: number;
  texto: string;
  hora: string;
  origen?: string;
}

const MENSAJES_INICIALES: Mensaje[] = [
  { autor: "UserA", nivel: 12, texto: "¡Bienvenidos al stream!", hora: "12:00" },
  { autor: "UserB", nivel: 8, texto: "¿Qué vamos a jugar hoy?", hora: "12:01" },
];

interface ChatBoxProps {
  monedas: number;
  setMonedas: (monedas: number) => void;
}

export default function ChatBox({ monedas, setMonedas }: ChatBoxProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>(MENSAJES_INICIALES);
  const [entrada, setEntrada] = useState("");
  const [nivel, setNivel] = useState(5);
  const [progreso, setProgreso] = useState(60);
  
  const nivelAnterior = useRef(nivel);
  const idTab = useRef(obtenerTabId());

  // 🔥 Escuchar mensajes de otras pestañas
  useEffect(() => {
    const manejarMensaje = (e: MessageEvent) => {
      if (e.data?.tipo === "chat" && e.data.tabId !== idTab.current) {
        setMensajes(prev => [...prev, e.data.mensaje]);
      }
    };

    canalChat.addEventListener("message", manejarMensaje);
    return () => canalChat.removeEventListener("message", manejarMensaje);
  }, []);

  // 🔥 Función mejorada para enviar mensajes
  const enviarMensaje = () => {
    if (!entrada.trim()) return;

    const nuevoMensaje: Mensaje = {
      autor: "Tú",
      nivel,
      texto: entrada,
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      origen: idTab.current,
    };

    // Actualizar localmente
    setMensajes(prev => [...prev, nuevoMensaje]);
    
    // Sincronizar con otras pestañas
    emitirMensajeChat(nuevoMensaje);
    emitirActividad(`💬 Nuevo mensaje: "${entrada.substring(0, 30)}${entrada.length > 30 ? '...' : ''}"`, "chat");

    // Limpiar y progresar
    setEntrada("");
    setProgreso(p => p + 100);
  };

  // 🔥 Subir de nivel automáticamente
  useEffect(() => {
    if (progreso >= 100) {
      const nuevoNivel = nivel + 1;
      setNivel(nuevoNivel);
      setProgreso(p => p - 100);
      
      // Notificar sistema
      const mensajeSistema: Mensaje = {
        autor: "Sistema",
        nivel: 1000,
        texto: `🎉 ¡Has subido al nivel ${nuevoNivel}!`,
        hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      
      setMensajes(prev => [...prev, mensajeSistema]);
      emitirActividad(`⬆️ Subió al nivel ${nuevoNivel}`, "sistema");
      nivelAnterior.current = nuevoNivel;
    }
  }, [progreso, nivel]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "400px",
        height: "500px",
        border: "1px solid #444",
        borderRadius: "8px",
        backgroundColor: "#1f1f23",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Área de mensajes */}
      <div style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
        {mensajes.map((msg, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "0.85rem", color: "#b3b3b3" }}>
              <strong>{msg.autor}</strong>{" "}
              <span style={{ color: "#00b7ff", fontWeight: "bold" }}>Lv.{msg.nivel}</span> • {msg.hora}
            </div>
            <div style={{ fontSize: "1rem" }}>{msg.texto}</div>
          </div>
        ))}
      </div>

      {/* Separador */}
      <div style={{ height: "1px", backgroundColor: "#444" }} />

      {/* Input de mensaje */}
      <div style={{ display: "flex", alignItems: "center", padding: "8px" }}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "4px",
            border: "1px solid #555",
            backgroundColor: "#121214",
            color: "white",
            outline: "none",
          }}
        />
        <button
          onClick={enviarMensaje}
          style={{
            marginLeft: "8px",
            padding: "8px 12px",
            border: "none",
            backgroundColor: "#00b7ff",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>

      {/* Botones inferiores */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          borderTop: "1px solid #333",
        }}
      >
        <BotonMonedas monedas={monedas} setMonedas={setMonedas} />
        <BotonRegalo monedas={monedas} setMonedas={setMonedas} />
        <BotonNivel nivel={nivel} progreso={progreso} />
      </div>
    </div>
  );
}