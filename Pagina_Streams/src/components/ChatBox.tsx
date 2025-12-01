import { useState, useRef, useEffect } from "react";
import BotonMonedas from "./BotonMonedas";
import BotonNivel from "./BotonNivel";
import BotonRegalo from "./botonregalo";
import { useAuth } from "./AuthContext";

interface Mensaje {
  id: string;
  autor: string;
  nivel: number;
  texto: string;
  hora: string;
  avatarUrl?: string;
  tipo?: "usuario" | "sistema" | "regalo";
}

interface ChatBoxProps {
  monedas: number;
  setMonedas: (monedas: number) => void;
  streamerName?: string;
  roomId?: string;
}

export default function ChatBox({ monedas, setMonedas, streamerName }: ChatBoxProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [entrada, setEntrada] = useState("");
  const [nivel, setNivel] = useState(5);
  const [progreso, setProgreso] = useState(60);
  const [conectado, setConectado] = useState(false);
  const [cargandoMensajes, setCargandoMensajes] = useState(true);
  
  const mensajesRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const { user } = useAuth();
  
  // Obtener datos del usuario
  const usuario = (user as any);
  const nombreUsuario = usuario?. NombreUsuario || usuario?.name || "Usuario";
  const avatarUsuario = usuario?.ImagenPerfil || `https://ui-avatars.com/api/? name=${nombreUsuario}&background=9147ff&color=fff&size=40`;

  // Cargar mensajes iniciales del backend
  useEffect(() => {
    cargarMensajesIniciales();
  }, [streamerName]);

  const cargarMensajesIniciales = async () => {
    if (!streamerName) {
      setCargandoMensajes(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${streamerName}/mensajes`);
      if (response.ok) {
        const data = await response.json();
        setMensajes(data. mensajes || []);
        setConectado(true);
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    } finally {
      setCargandoMensajes(false);
    }
  };

  // Polling para obtener nuevos mensajes cada 2 segundos
  useEffect(() => {
    if (! streamerName || !conectado) return;

    intervalRef.current = window.setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chat/${streamerName}/mensajes`);
        if (response.ok) {
          const data = await response.json();
          setMensajes(data. mensajes || []);
        }
      } catch (error) {
        console.error("Error al actualizar mensajes:", error);
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef. current);
      }
    };
  }, [streamerName, conectado]);

  // Auto-scroll al final
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Subir de nivel automáticamente
  useEffect(() => {
    if (progreso >= 100) {
      const nuevoNivel = nivel + 1;
      setNivel(nuevoNivel);
      setProgreso(p => p - 100);
      
      const mensajeSistema: Mensaje = {
        id: Date.now().toString(),
        autor: "Sistema",
        nivel: 0,
        texto: `🎉 ${nombreUsuario} subió al nivel ${nuevoNivel}!`,
        hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        tipo: "sistema",
      };
      
      enviarMensajeAlBackend(mensajeSistema);
    }
  }, [progreso, nivel]);

  const enviarMensajeAlBackend = async (mensaje: Mensaje) => {
    if (!streamerName) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${streamerName}/mensaje`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensaje),
      });

      if (response.ok) {
        const data = await response.json();
        // El mensaje se actualizará automáticamente con el polling
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const enviarMensaje = () => {
    if (!entrada.trim()) return;

    const nuevoMensaje: Mensaje = {
      id: Date.now().toString(),
      autor: nombreUsuario,
      nivel,
      texto: entrada,
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatarUrl: avatarUsuario,
      tipo: "usuario",
    };

    // Agregar localmente
    setMensajes(prev => [...prev, nuevoMensaje]);
    
    // Enviar al backend
    enviarMensajeAlBackend(nuevoMensaje);

    // Limpiar y progresar
    setEntrada("");
    setProgreso(p => p + 5);
  };

  const handleKeyPress = (e: React. KeyboardEvent) => {
    if (e. key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "400px",
        height: "600px",
        border: "1px solid #444",
        borderRadius: "8px",
        backgroundColor: "#1f1f23",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Header del Chat */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #444",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#18181b",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
            💬 Chat en Vivo
          </h3>
          {streamerName && (
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#adadb8" }}>
              Chat de {streamerName}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: conectado ? "#10b981" : "#ef4444",
            }}
          />
          <span style={{ fontSize: "12px", color: "#adadb8" }}>
            {conectado ? "Conectado" : "Desconectado"}
          </span>
        </div>
      </div>

      {/* Área de mensajes */}
      <div
        ref={mensajesRef}
        style={{
          flex: 1,
          padding: "12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {cargandoMensajes ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#adadb8" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                border: "3px solid #333",
                borderTop: "3px solid #9147ff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            Cargando mensajes...
          </div>
        ) : mensajes.length === 0 ?  (
          <div style={{ textAlign: "center", padding: "20px", color: "#adadb8" }}>
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>💬</div>
            <p>Sé el primero en enviar un mensaje</p>
          </div>
        ) : (
          mensajes.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                gap: "10px",
                padding: msg.tipo === "sistema" ? "8px" : "0",
                backgroundColor: msg.tipo === "sistema" ? "rgba(145, 71, 255, 0.1)" : "transparent",
                borderRadius: msg.tipo === "sistema" ? "6px" : "0",
                borderLeft: msg.tipo === "sistema" ? "3px solid #9147ff" : "none",
              }}
            >
              {msg.tipo !== "sistema" && (
                <img
                  src={msg.avatarUrl || `https://ui-avatars.com/api/?name=${msg.autor}&background=random&size=40`}
                  alt={msg.autor}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: msg.tipo === "sistema" ? "#9147ff" : "#b3b3b3",
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <strong>{msg.autor}</strong>
                  {msg.tipo !== "sistema" && (
                    <span
                      style={{
                        color: "#00b7ff",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                      }}
                    >
                      Lv. {msg.nivel}
                    </span>
                  )}
                  <span style={{ fontSize: "0.7rem", opacity: 0.6 }}>
                    {msg.hora}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    wordBreak: "break-word",
                    lineHeight: "1.4",
                  }}
                >
                  {msg.texto}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input de mensaje */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #444",
          backgroundColor: "#18181b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#0e0e10",
              color: "white",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <button
            onClick={enviarMensaje}
            disabled={!entrada.trim()}
            style={{
              padding: "10px 16px",
              border: "none",
              backgroundColor: entrada.trim() ? "#9147ff" : "#555",
              color: "white",
              borderRadius: "6px",
              cursor: entrada.trim() ? "pointer" : "not-allowed",
              fontWeight: "bold",
              fontSize: "14px",
              transition: "all 0.2s",
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
            gap: "8px",
          }}
        >
          <BotonMonedas monedas={monedas} setMonedas={setMonedas} />
          <BotonRegalo monedas={monedas} setMonedas={setMonedas} />
          <BotonNivel nivel={nivel} progreso={progreso} />
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}