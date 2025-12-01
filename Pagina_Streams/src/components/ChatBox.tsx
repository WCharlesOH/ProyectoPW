import { useState, useRef, useEffect } from "react";
import BotonMonedas from "./BotonMonedas";
import BotonNivel from "./BotonNivel";
import BotonRegalo from "./botonregalo";
import { useAuth } from "./AuthContext";
import { API } from "../Comandosllamadas/llamadas";

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
  const [nivel, setNivel] = useState(1);
  const [progreso, setProgreso] = useState(0);
  const [streamerID, setStreamerID] = useState<number | null>(null);
  const [chatCreado, setChatCreado] = useState(false);
  const [nivelCargado, setNivelCargado] = useState(false);
  
  const mensajesRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Obtener datos del usuario
  const usuario = (user as any);
  const nombreUsuario = usuario?. NombreUsuario || usuario?.name || "Usuario";
  const idUsuario = usuario?.ID;
  const avatarUsuario = usuario?.ImagenPerfil || `https://ui-avatars.com/api/? name=${nombreUsuario}&background=9147ff&color=fff&size=40`;

  // Obtener ID del streamer y crear/cargar chat usando API. ObtenerDatosUsuarioNombre, API.ChatStreamer y API.ObtenerChatStreamer
  useEffect(() => {
    const initChat = async () => {
      if (! streamerName || !idUsuario || chatCreado) return;
      
      try {
        // Obtener datos del streamer
        const result = await API.ObtenerDatosUsuarioNombre(streamerName);
        if (result.success && result.user) {
          setStreamerID(result.user.ID);
          
          // Crear o obtener el chat del usuario con el streamer
          const chatResult = await API.ChatStreamer(result.user.ID, idUsuario);
          if (chatResult.success) {
            setChatCreado(true);
            
            // Obtener datos del chat para cargar el nivel guardado
            const chatDataResult = await API.ObtenerChatStreamer(result.user.ID, idUsuario);
            if (chatDataResult.success && chatDataResult.chat) {
              // Cargar el nivel desde el backend
              const nivelGuardado = chatDataResult.chat.NivelViewer || 1;
              setNivel(nivelGuardado);
              setNivelCargado(true);
            }
            
            // Actualizar que está viendo el directo usando API. ViendoDirecto
            await API.ViendoDirecto(
              idUsuario,
              result.user.ID. toString(),
              "true",
              result.user.EnVivo ?  "true" : "false"
            );
          }
        }
      } catch (error) {
        console.error("Error inicializando chat:", error);
      }
    };

    initChat();
  }, [streamerName, idUsuario, chatCreado]);

  // Auto-scroll al final
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Subir de nivel automáticamente y actualizar en el backend usando API.ActualizarNivelviewer
  useEffect(() => {
    const actualizarNivel = async () => {
      if (progreso >= 100 && idUsuario && streamerID && nivelCargado) {
        const nuevoNivel = nivel + 1;
        setNivel(nuevoNivel);
        setProgreso(p => p - 100);
        
        // Actualizar nivel en el backend
        try {
          const result = await API.ActualizarNivelviewer(idUsuario, nuevoNivel, streamerID);
          if (result.success) {
            console.log(`✅ Nivel actualizado a ${nuevoNivel} en el backend`);
          }
          
          // Agregar mensaje de sistema local
          const mensajeSistema: Mensaje = {
            id: Date.now().toString(),
            autor: "Sistema",
            nivel: 0,
            texto: `🎉 ${nombreUsuario} subió al nivel ${nuevoNivel}!`,
            hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            tipo: "sistema",
          };
          
          setMensajes(prev => [...prev, mensajeSistema]);
        } catch (error) {
          console.error("Error actualizando nivel:", error);
        }
      }
    };

    actualizarNivel();
  }, [progreso, nivel, idUsuario, streamerID, nombreUsuario, nivelCargado]);

  const enviarMensaje = () => {
    if (! entrada.trim()) return;

    const nuevoMensaje: Mensaje = {
      id: Date.now().toString(),
      autor: nombreUsuario,
      nivel,
      texto: entrada,
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatarUrl: avatarUsuario,
      tipo: "usuario",
    };

    // Agregar mensaje localmente
    setMensajes(prev => [...prev, nuevoMensaje]);

    // Limpiar y progresar
    setEntrada("");
    setProgreso(p => p + 5);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
              background: chatCreado ? "#10b981" : "#ef4444",
            }}
          />
          <span style={{ fontSize: "12px", color: "#adadb8" }}>
            {chatCreado ? "Conectado" : "Desconectado"}
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
        {! nivelCargado ?  (
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
            Cargando chat...
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
                    color: msg. tipo === "sistema" ? "#9147ff" : "#b3b3b3",
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
                      Lv.  {msg.nivel}
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
            onChange={(e) => setEntrada(e. target.value)}
            onKeyPress={handleKeyPress}
            disabled={!nivelCargado}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#0e0e10",
              color: "white",
              outline: "none",
              fontSize: "14px",
              opacity: nivelCargado ? 1 : 0.5,
            }}
          />
          <button
            onClick={enviarMensaje}
            disabled={!entrada.trim() || !nivelCargado}
            style={{
              padding: "10px 16px",
              border: "none",
              backgroundColor: entrada.trim() && nivelCargado ?  "#9147ff" : "#555",
              color: "white",
              borderRadius: "6px",
              cursor: entrada.trim() && nivelCargado ?  "pointer" : "not-allowed",
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