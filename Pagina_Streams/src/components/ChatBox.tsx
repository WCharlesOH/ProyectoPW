import { useState } from "react";

interface Message {
  id: number;
  author: string;
  text: string;
  time: string;
}

const MOCK_MESSAGES: Message[] = [
  { id: 1, author: "UserA", text: "Hola, ¿cómo estás?", time: "12:00" },
  { id: 2, author: "UserB", text: "Bien, gracias. ¿Y tú?", time: "12:01" },
  { id: 3, author: "UserA", text: "Aquí trabajando en el proyecto.", time: "12:02" },
];

export default function ChatBox() {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    console.log("Enviar mensaje:", input);
    setInput("");
  };

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

      <div
        style={{
          flex: 1,
          padding: "12px",
          overflowY: "auto",
        }}
      >
        {MOCK_MESSAGES.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "12px",
            }}
          >
            <div style={{ fontSize: "0.85rem", color: "#888" }}>
              {msg.author} • {msg.time}
            </div>
            <div style={{ fontSize: "1rem" }}>{msg.text}</div>
          </div>
        ))}
      </div>

     
      <div
        style={{
          height: "1px",
          backgroundColor: "#444",
        }}
      />

      {/* Entrada de mensaje */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px",
        }}
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
          onClick={handleSend}
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
    </div>
  );
}