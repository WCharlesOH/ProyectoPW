import { useState, useRef, useEffect } from "react";
import BotonMonedas from "./BotonMonedas";
import BotonNivel from "./BotonNivel";

interface Mensaje {
  autor: string;
  nivel: number;
  texto: string;
  hora: string;
}

const MENSAJES: Mensaje[] = [
  { autor: "UserA", nivel: 12, texto: "Hola, ¿cómo estás?", hora: "12:00" },
  { autor: "UserB", nivel: 8, texto: "Bien, gracias. ¿Y tú?", hora: "12:01" },
  { autor: "UserA", nivel: 12, texto: "Aquí trabajando en el proyecto.", hora: "12:02" },
];

interface ChatBoxProps {
  monedas: number;
  setMonedas: (monedas: number) => void;
}

export default function ChatBox({ monedas, setMonedas }: ChatBoxProps) {
  const [mensajes, setMensajes] = useState(MENSAJES);
  const [entrada, setEntrada] = useState("");
  const [nivel, setNivel] = useState(5);
  const [progreso, setProgreso] = useState(60);

  // Ref para guardar el nivel anterior y evitar duplicados de mensaje
  const nivelAnterior = useRef(nivel);

  const enviarMensaje = () => {
    if (!entrada.trim()) return;

    const nuevo: Mensaje = {
      autor: "Tú",
      nivel,
      texto: entrada,
      hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMensajes((prev) => [...prev, nuevo]);
    setEntrada("");

    // Aumentamos el progreso
    setProgreso((p) => p + 100);
  };

  // Efecto que sube de nivel si progreso >= 100
  useEffect(() => {
    if (progreso >= 100) {
      setNivel((n) => n + 1);
      setProgreso((p) => p - 100);
    }
  }, [progreso]);

  // Efecto que envía mensaje del sistema solo cuando cambia el nivel
  useEffect(() => {
    if (nivel > nivelAnterior.current) {
      setMensajes((prev) => [
        ...prev,
        {
          autor: "Sistema",
          nivel: 1000,
          texto: `🎉 ¡Has subido al nivel ${nivel}!`,
          hora: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      nivelAnterior.current = nivel; // actualizamos la referencia
    }
  }, [nivel]);

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
      {/* Mensajes */}
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

      <div style={{ height: "1px", backgroundColor: "#444" }} />

      {/* Input */}
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
        <BotonNivel nivel={nivel} progreso={progreso} />
      </div>
    </div>
  );
}
