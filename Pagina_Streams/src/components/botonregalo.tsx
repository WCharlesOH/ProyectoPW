import { useEffect, useRef, useState } from "react";
import { API } from "../Comandosllamadas/llamadas";
import { useAuth } from "./AuthContext";

interface BotonRegaloProps {
  monedas?: number;
  setMonedas?: (nuevas: number) => void;
  streamerID?: number;
  disabled?: boolean;
}

type Regalo = {
  ID_Regalo: number;
  NombreRegalo: string;
  PrecioRegalo: number;
  DescripcionRegalo: string;
  icono: string;
};

export default function BotonRegalo({ monedas = 0, setMonedas, streamerID, disabled = false }: BotonRegaloProps) {
  const [abierto, setAbierto] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const botonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  const [notificacion, setNotificacion] = useState<string | null>(null);
  const [toastCoords, setToastCoords] = useState<{ top: number; left: number } | null>(null);

  const [regalosList, setRegalosList] = useState<Regalo[]>([]);
  const [cargandoRegalos, setCargandoRegalos] = useState(true);

  const usuario = (user as any);
  const idUsuario = usuario?.ID;

  // Cargar regalos del backend
  useEffect(() => {
    const cargarRegalos = async () => {
      setCargandoRegalos(true);
      try {
        console.log("🔄 [BotonRegalo] Cargando regalos...");
        
        const result = await API.ObtenerRegalos(idUsuario);
        
        if (result.success && result.data) {
          setRegalosList(result.data);
          console.log(`✅ [BotonRegalo] ${result.data.length} regalos cargados`);
        } else {
          setRegalosList([]);
        }
      } catch (error) {
        console.error("❌ [BotonRegalo] Error:", error);
        setRegalosList([]);
      } finally {
        setCargandoRegalos(false);
      }
    };

    cargarRegalos();
  }, []);

  const posicionarMenu = () => {
    const btn = botonRef. current;
    if (!btn) return setCoords(null);
    const r = btn.getBoundingClientRect();
    setCoords({ top: r.top - 8, left: r.left + r.width / 2 });
  };

  useEffect(() => {
    if (abierto) {
      posicionarMenu();
    } else {
      setCoords(null);
    }
  }, [abierto]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (
        botonRef.current &&
        (botonRef.current.contains(target as Node) || menuRef.current?. contains(target as Node))
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

  const comprarRegalo = async (regalo: Regalo) => {
    if (monedas < regalo.PrecioRegalo) {
      setNotificacion("No tienes suficientes monedas.");
      const rect = botonRef.current?.getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect. top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
      return;
    }

    if (! streamerID || !idUsuario) {
      setNotificacion("Error: No se pudo identificar al streamer.");
      const rect = botonRef.current?. getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
      return;
    }

    try {
      console.log(`🔄 [BotonRegalo] Enviando ${regalo.NombreRegalo}...`);

      // 1. Descontar monedas del usuario
      const nuevasMonedasUsuario = monedas - regalo. PrecioRegalo;
      const resultUsuario = await API. ActualizarMonedas(idUsuario, nuevasMonedasUsuario);

      if (! resultUsuario.success) {
        setNotificacion("Error al actualizar tus monedas.");
        return;
      }

      // 2. Obtener y actualizar monedas del streamer
      const streamerDataResult = await API.ObtenerDatosUsuario(streamerID);

      if (!streamerDataResult.success || !streamerDataResult.user) {
        setNotificacion("Error al obtener datos del streamer.");
        return;
      }

      const monedasStreamer = streamerDataResult.user.Monedas || 0;
      const nuevasMonedasStreamer = monedasStreamer + regalo.PrecioRegalo;

      const resultStreamer = await API.ActualizarMonedas(streamerID, nuevasMonedasStreamer);

      if (!resultStreamer.success) {
        setNotificacion("Error al actualizar monedas del streamer.");
        return;
      }

      // 3. Actualizar localStorage y estado local
      if (setMonedas) setMonedas(nuevasMonedasUsuario);
      
      // Actualizar usuario en localStorage
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        userData. Monedas = nuevasMonedasUsuario;
        localStorage.setItem("user", JSON. stringify(userData));
      }

      console.log(`✅ [BotonRegalo] Regalo enviado, localStorage actualizado`);

      // 4. Mostrar notificación
      setNotificacion(`Has enviado ${regalo.icono} ${regalo.NombreRegalo} por ${regalo.PrecioRegalo} monedas. `);
      const rect = botonRef.current?.getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
      setAbierto(false);

    } catch (error) {
      console.error("❌ [BotonRegalo] Error:", error);
      setNotificacion("Error al enviar el regalo.");
      const rect = botonRef.current?.getBoundingClientRect();
      if (rect) setToastCoords({ left: rect.left + rect.width / 2 - 120, top: rect.top - 48 });
      setTimeout(() => setNotificacion(null), 2200);
    }
  };

  return (
    <div className="boton-regalo" style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={botonRef}
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        disabled={cargandoRegalos || disabled || !streamerID}
        style={{
          backgroundColor: "#1f1f23",
          color: "white",
          border: "1px solid #333",
          borderRadius: "6px",
          padding: "6px 10px",
          cursor: cargandoRegalos ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: "600",
          opacity: cargandoRegalos ? 0.5 : 1,
        }}
      >
        🎁 {cargandoRegalos ? "..." : "Regalos"}
      </button>

      {abierto && coords && ! cargandoRegalos && (
        <div
          ref={menuRef}
          role="dialog"
          aria-label="Menú de regalos"
          style={{
            position: "fixed",
            top: coords.top - 220,
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
            <strong style={{ fontSize: "1rem" }}>Enviar regalo</strong>
            <button
              onClick={() => setAbierto(false)}
              style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer" }}
            >
              ✖
            </button>
          </div>

          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {regalosList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#adadb8" }}>
                <p>No hay regalos disponibles</p>
              </div>
            ) : (
              regalosList.map((r: Regalo) => (
                <div
                  key={r.ID_Regalo}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px",
                    borderRadius: 8,
                    marginBottom: 8,
                    background: "linear-gradient(180deg,#141416,#1e1e22)",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 20 }}>{r.icono}</div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{r.NombreRegalo}</div>
                      <div style={{ fontSize: 12, color: "#b3b3b3" }}>
                        {r. DescripcionRegalo || "Envía un gesto"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ fontWeight: 800 }}>
                      {r.PrecioRegalo} <span style={{ fontSize: 12 }}>💰</span>
                    </div>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        comprarRegalo(r);
                      }}
                      style={{
                        backgroundColor: "#00b7ff",
                        border: "none",
                        color: "black",
                        padding: "6px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {notificacion && (
        <div
          role="status"
          style={{
            position: "fixed",
            top: toastCoords?.top ?? window.innerHeight * 0.1,
            left: toastCoords?.left ?? window.innerWidth / 2 - 160,
            width: 240,
            background: "rgba(0,0,0,0.85)",
            color: "white",
            padding: "10px 14px",
            borderRadius: 8,
            boxShadow: "0 6px 18px rgba(0,0,0,0. 6)",
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