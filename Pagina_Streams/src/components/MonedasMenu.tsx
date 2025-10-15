import React, { useEffect, useState } from "react";

interface MonedasMenuProps {
  monedas: number;
  setMonedas: (nuevas: number) => void;
  abierto: boolean;
  setAbierto: (estado: boolean) => void;
}

export default function MonedasMenu({
  monedas,
  setMonedas,
  abierto,
  setAbierto,
}: MonedasMenuProps) {
  const [mostrarPago, setMostrarPago] = useState(false);
  const [mostrarRecibo, setMostrarRecibo] = useState(false);
  const [compra, setCompra] = useState<{ monto: number; precioUSD: number } | null>(null);
  const [nombre, setNombre] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [cvv, setCvv] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const paquetes = [
    { monto: 100, precioUSD: 1.4, descuento: null },
    { monto: 500, precioUSD: 7.0, descuento: null },
    { monto: 1500, precioUSD: 19.95, descuento: "5 % de descuento" },
    { monto: 5000, precioUSD: 64.4, descuento: "8 % de descuento" },
    { monto: 10000, precioUSD: 126.0, descuento: "10 % de descuento" },
    { monto: 25000, precioUSD: 308.0, descuento: "12 % de descuento" },
  ];

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".menu-monedas")) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setAbierto]);

  const comprar = (paquete: { monto: number; precioUSD: number }) => {
    setCompra(paquete);
    setMostrarPago(true);
    setError(""); // limpiar error al abrir
  };

  const confirmarPago = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre || tarjeta.length !== 16 || cvv.length !== 3) {
      setError("Por favor completa todos los campos correctamente.");
      return;
    }

    setProcesando(true);
    setTimeout(() => {
      setProcesando(false);
      setMostrarPago(false);
      setMostrarRecibo(true);
      setMonedas(monedas + (compra?.monto ?? 0));
    }, 1500);
  };

  return (
    <div
    style={{ position: "relative", display: "inline-block" }} className="menu-monedas">
      {/* Botón principal */}
      <button
        onClick={() => setAbierto(!abierto)}
        style={{
          backgroundColor: "#1f1f23",
          color: "white",
          border: "1px solid #333",
          borderRadius: "4px",
          padding: "8px 12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: "bold",
        }}
      >
        💰 {monedas}
      </button>

      {/* Menú de monedas */}
      {abierto && !mostrarPago && !mostrarRecibo && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            right: 0,
            width: "320px",
            backgroundColor: "#1f1f23",
            border: "1px solid #333",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
            color: "white",
            zIndex: 100,
            padding: "12px",
          }}
        >
          <h3 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>Comprar Monedas</h3>
          {paquetes.map((p) => (
            <div
              key={p.monto}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#2a2a2e",
                borderRadius: 6,
                padding: "8px 12px",
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: "bold" }}>{p.monto} Monedas</div>
                {p.descuento && (
                  <div style={{ fontSize: "0.85rem", color: "#00b7ff" }}>{p.descuento}</div>
                )}
              </div>
              <button
                onClick={() => comprar(p)}
                style={{
                  backgroundColor: "#00b7ff",
                  border: "none",
                  borderRadius: 6,
                  color: "white",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                USD {p.precioUSD.toFixed(2)}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* POP-UP de pago */}
      {mostrarPago && compra && (
        <div style={popupOverlay}>
          <div style={popupBox}>
            <h2 style={{ color: "#00b7ff" }}>
              Pago de {compra.monto} Monedas (${compra.precioUSD})
            </h2>
            {!procesando ? (
              <form onSubmit={confirmarPago}>
                <input
                  type="text"
                  placeholder="Nombre del titular"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder="Número de tarjeta (16 dígitos)"
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value)}
                  style={inputStyle}
                />
                <input
                  type="password"
                  placeholder="CVV (3 dígitos)"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  style={inputStyle}
                />

                {error && (
                  <p style={{ color: "#ff5555", fontSize: "0.9rem", marginTop: "6px" }}>
                    {error}
                  </p>
                )}

                <button type="submit" style={btnStyle}>
                  Confirmar Pago
                </button>
              </form>
            ) : (
              <p>Procesando pago...</p>
            )}
            <button onClick={() => setMostrarPago(false)} style={btnCancel}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* POP-UP de recibo */}
      {mostrarRecibo && compra && (
        <div style={popupOverlay}>
          <div style={popupBox}>
            <h2 style={{ color: "#00b7ff" }}>✅ Pago Exitoso</h2>
            <p><strong>Cliente:</strong> {nombre}</p>
            <p><strong>Monedas:</strong> {compra.monto}</p>
            <p><strong>Total pagado:</strong> ${compra.precioUSD}</p>
            <p>Gracias por tu compra 💙</p>
            <button
              onClick={() => {
                setMostrarRecibo(false);
                setAbierto(false);
              }}
              style={btnStyle}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 ESTILOS */
const popupOverlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const popupBox: React.CSSProperties = {
  backgroundColor: "#1f1f23",
  borderRadius: "10px",
  padding: "25px",
  width: "350px",
  textAlign: "center",
  boxShadow: "0 0 20px rgba(0,183,255,0.3)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #444",
  backgroundColor: "#2a2a2e",
  color: "white",
};

const btnStyle: React.CSSProperties = {
  backgroundColor: "#00b7ff",
  border: "none",
  borderRadius: "6px",
  color: "white",
  padding: "10px 16px",
  cursor: "pointer",
  marginTop: "10px",
};

const btnCancel: React.CSSProperties = {
  ...btnStyle,
  backgroundColor: "#444",
};