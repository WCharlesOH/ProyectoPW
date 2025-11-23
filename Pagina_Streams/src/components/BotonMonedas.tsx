import { useEffect, useState } from "react";
import { emitirActividad } from "../datos/sincronizacion";

interface BotonMonedasProps {
  monedas: number;
  setMonedas: (valor: number) => void;
}

export default function BotonMonedas({ monedas, setMonedas }: BotonMonedasProps) {
  const [abierto, setAbierto] = useState(false);
  const [cantidad, setCantidad] = useState<number>(0);

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".boton-monedas")) setAbierto(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const enviarMonedas = () => {
    if (cantidad <= 0) return;
    if (monedas < cantidad) return alert("No tienes suficientes monedas");
    
    setMonedas(monedas - cantidad);
    
    // 🔥 EMITIR ACTIVIDAD para que aparezca en el dashboard
    emitirActividad(
      `💰 ${cantidad} monedas enviadas`,
      "monedas",
      { cantidad }
    );

    alert(`Has enviado ${cantidad} monedas 💰`);
    setCantidad(0);
    setAbierto(false);
  };

  return (
    <div className="boton-monedas" style={{ position: "relative", display: "inline-block" }}>
      {/* Botón principal */}
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          backgroundColor: "#1f1f23",
          color: "white",
          border: "1px solid #333",
          borderRadius: "4px",
          padding: "6px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: "bold",
        }}
      >
        💰 {monedas}
      </button>

      {/* Menú desplegable para enviar */}
      {abierto && (
        <div
          style={{
            position: "absolute",
            bottom: "110%",
            left: 0,
            width: "200px",
            backgroundColor: "#1f1f23",
            border: "1px solid #333",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            color: "white",
            zIndex: 100,
            padding: "12px",
          }}
        >
          <h4 style={{ margin: "0 0 8px", fontSize: "0.9rem" }}>Enviar Monedas</h4>
          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
            placeholder="Cantidad"
            style={{
              width: "100%",
              padding: "6px 8px",
              background: "#121214",
              color: "white",
              border: "1px solid #444",
              borderRadius: "6px",
              marginBottom: "8px",
              outline: "none",
            }}
          />
          <button
            onClick={enviarMonedas}
            style={{
              width: "100%",
              backgroundColor: "#00b7ff",
              border: "none",
              borderRadius: "4px",
              color: "white",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}