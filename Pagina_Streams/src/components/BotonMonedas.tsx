import { useEffect, useRef, useState } from "react";
import { API } from "../Comandosllamadas/llamadas";
import { useAuth } from "./AuthContext";

interface BotonMonedasProps {
  monedas?: number;
  setMonedas?: (nuevas: number) => void;
  streamerID?: number;
}

export default function BotonMonedas({ monedas = 0, setMonedas, streamerID }: BotonMonedasProps) {
  const [abierto, setAbierto] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [cantidadEnviar, setCantidadEnviar] = useState("");
  const botonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const [notificacion, setNotificacion] = useState<string | null>(null);
  const [toastCoords, setToastCoords] = useState<{ top: number; left: number } | null>(null);

  const usuario = (user as any);
  const idUsuario = usuario?. ID;

  // Cantidades rápidas sugeridas
  const cantidadesRapidas = [10, 50, 100, 500];

  // Colocar menú en posición fija
  const posicionarMenu = () => {
    const btn = botonRef.current;
    if (! btn) return setCoords(null);
    const r = btn.getBoundingClientRect();
    setCoords({ top: r.top - 8, left: r.left + r.width / 2 });
  };

  useEffect(() => {
    if (abierto) {
      posicionarMenu();
    } else {
      setCoords(null);
      setCantidadEnviar("");
    }
  }, [abierto]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (
        botonRef.current &&
        (botonRef.current.contains(target as Node) || menuRef.current?.contains(target as Node))
      ) {
        return;
      }
      setAbierto(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", posicionarMenu, true);
    window.addEventListener("resize", posicionarMenu);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", posicionarMenu, true);
      window.removeEventListener("resize", posicionarMenu);
    };
  }, []);

  const enviarMonedas = async (cantidad: number) => {
    // Validar cantidad
    if (cantidad <= 0) {
      setNotificacion("La cantidad debe ser mayor a 0.");
      const rect = botonRef.current?.getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
      return;
    }

    // Validar que tenga suficientes monedas
    if (monedas < cantidad) {
      setNotificacion("No tienes suficientes monedas.");
      const rect = botonRef.current?.getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
      return;
    }

    // Validar que haya un streamer
    if (!streamerID || ! idUsuario) {
      setNotificacion("Error: No se pudo identificar al streamer.");
      const rect = botonRef.current?. getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
      return;
    }

    try {
      console.log(`🔄 [BotonMonedas] Enviando ${cantidad} monedas... `);

      // 1. Descontar monedas del usuario que envía
      const nuevasMonedasUsuario = monedas - cantidad;
      const resultUsuario = await API.ActualizarMonedas(idUsuario, nuevasMonedasUsuario);

      if (! resultUsuario.success) {
        setNotificacion("Error al actualizar tus monedas.");
        return;
      }

      console.log(`✅ [BotonMonedas] Monedas del usuario: ${nuevasMonedasUsuario}`);

      // 2. Obtener monedas actuales del streamer
      const streamerDataResult = await API.ObtenerDatosUsuario(streamerID);

      if (!streamerDataResult. success || !streamerDataResult.user) {
        setNotificacion("Error al obtener datos del streamer.");
        return;
      }

      const monedasStreamer = streamerDataResult.user. Monedas || 0;
      const nuevasMonedasStreamer = monedasStreamer + cantidad;

      // 3. Agregar monedas al streamer
      const resultStreamer = await API.ActualizarMonedas(streamerID, nuevasMonedasStreamer);

      if (!resultStreamer.success) {
        setNotificacion("Error al actualizar monedas del streamer.");
        return;
      }

      console.log(`✅ [BotonMonedas] Monedas del streamer: ${nuevasMonedasStreamer}`);

      // 4. Actualizar localStorage y estado local
      if (setMonedas) setMonedas(nuevasMonedasUsuario);
      
      // Actualizar usuario en localStorage
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        userData.Monedas = nuevasMonedasUsuario;
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // 5. Mostrar notificación
      setNotificacion(`Has enviado ${cantidad} monedas 💰`);
      const rect = botonRef.current?. getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
      setAbierto(false);

      console.log(`✅ [BotonMonedas] Transacción completada`);

    } catch (error) {
      console.error("❌ [BotonMonedas] Error:", error);
      setNotificacion("Error al enviar monedas.");
      const rect = botonRef.current?.getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect. top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
    }
  };

  return (
    <div className="boton-monedas" style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={botonRef}
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        style={{
          backgroundColor: "#1f1f23",
          color: "white",
          border: "1px solid #333",
          borderRadius: "6px",
          padding: "6px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "600",
        }}
      >
        💰 {monedas}
      </button>

      {abierto && coords && (
        <div
          ref={menuRef}
          role="dialog"
          aria-label="Menú de enviar monedas"
          style={{
            position: "fixed",
            top: coords.top - 280,
            left: Math.max(8, coords.left - 160),
            width: 320,
            backgroundColor: "#1b1b1f",
            border: "1px solid #333",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            color: "white",
            zIndex: 9999,
            padding: 12,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong style={{ fontSize: "1rem" }}>Enviar monedas</strong>
            <button
              onClick={() => setAbierto(false)}
              style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer" }}
              aria-label="Cerrar menú"
            >
              ✖
            </button>
          </div>

          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: "12px", color: "#b3b3b3", marginBottom: 8 }}>
              Saldo actual: {monedas} monedas
            </p>
            
            {/* Input de cantidad */}
            <input
              type="number"
              placeholder="Cantidad a enviar"
              value={cantidadEnviar}
              onChange={(e) => setCantidadEnviar(e.target.value)}
              min="1"
              max={monedas}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 6,
                border: "1px solid #555",
                backgroundColor: "#0e0e10",
                color: "white",
                fontSize: "14px",
                marginBottom: 10,
              }}
            />

            {/* Botón de enviar */}
            <button
              onClick={() => {
                const cantidad = parseInt(cantidadEnviar);
                if (! isNaN(cantidad)) {
                  enviarMonedas(cantidad);
                }
              }}
              disabled={!cantidadEnviar || parseInt(cantidadEnviar) <= 0}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: cantidadEnviar && parseInt(cantidadEnviar) > 0 ? "#00b7ff" : "#555",
                border: "none",
                color: cantidadEnviar && parseInt(cantidadEnviar) > 0 ? "black" : "white",
                borderRadius: 6,
                cursor: cantidadEnviar && parseInt(cantidadEnviar) > 0 ? "pointer" : "not-allowed",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Enviar
            </button>
          </div>

          {/* Cantidades rápidas */}
          <div>
            <p style={{ fontSize: "12px", color: "#b3b3b3", marginBottom: 8 }}>
              Cantidades rápidas:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {cantidadesRapidas.map((cantidad) => (
                <button
                  key={cantidad}
                  onClick={() => enviarMonedas(cantidad)}
                  disabled={monedas < cantidad}
                  style={{
                    padding: "8px",
                    backgroundColor: monedas >= cantidad ? "linear-gradient(180deg,#141416,#1e1e22)" : "#333",
                    border: "1px solid #555",
                    color: monedas >= cantidad ? "white" : "#666",
                    borderRadius: 6,
                    cursor: monedas >= cantidad ? "pointer" : "not-allowed",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  {cantidad} 💰
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast de notificación */}
      {notificacion && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: toastCoords?.top ??  window.innerHeight * 0.1,
            left: toastCoords?.left ?? window.innerWidth / 2 - 160,
            width: 240,
            background: "rgba(0,0,0,0.85)",
            color: "white",
            padding: "10px 14px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
            zIndex: 10001,
            textAlign: "center",
          }}
        >
          {notificacion}
        </div>
      )}
    </div>
  );
}