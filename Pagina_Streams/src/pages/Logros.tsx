import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Ranking from "./Ranking";
import type { Usuario } from "../components/types";
import type { ranking } from "../components/types";
import { API } from "../Comandosllamadas/llamadas";

interface LogroPlantilla {
  ID_Logro: number;
  Nombre: string;
  descripcion: string;
  Puntaje: number;
}

interface LogroUsuario {
  ID_Usuario: number;
  ID_Logro: number;
  Completado: boolean;
  logros: LogroPlantilla;
}

export default function Logros() {
  const [todosLosLogros, setTodosLosLogros] = useState<LogroPlantilla[]>([]);
  const [misLogrosSeleccionados, setMisLogrosSeleccionados] = useState<LogroUsuario[]>([]);
  const [rankingUsuarios, setRankingUsuarios] = useState<ranking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [xpTotal, setXpTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  
  // Estados para el popup
  const [popupAbierto, setPopupAbierto] = useState(false);
  const [logrosSeleccionados, setLogrosSeleccionados] = useState<number[]>([]);
  const [guardando, setGuardando] = useState(false);
  
  const navigate = useNavigate();
  const { username } = useParams();
  
  const info: Usuario | null = JSON.parse(localStorage. getItem("user") || "null");
  const id = info ?  Number(info.ID) : null;
  const nivels = info ? Number(info.NivelStreams) : null;
  const nombreUsuario = info?.NombreUsuario || username;

  // Cargar TODOS los logros disponibles (plantilla)
  const cargarTodosLosLogros = async () => {
    try {
      console.log("🔄 [Logros] Cargando todos los logros...");
      const data = await API.ObtenerTodosLogros();
      
      if (data.success && data.logros) {
        setTodosLosLogros(data.logros);
        console.log(`✅ [Logros] ${data.logros.length} logros cargados`);
      } else {
        setError("Error al cargar logros");
      }
    } catch (error) {
      console.error("❌ [Logros] Error:", error);
      setError("Error al cargar logros");
    }
  };

  // Cargar MIS LOGROS seleccionados
  const cargarMisLogros = async () => {
    if (!id) {
      console. error("ID inválido");
      return;
    }

    try {
      console.log("🔄 [Logros] Cargando mis logros...");
      const data = await API.Ver_logrosMios(id);
      
      if (data.success && data. logros) {
        setMisLogrosSeleccionados(data.logros);
        console.log(`✅ [Logros] ${data.logros.length} logros del usuario cargados`);
      } else {
        setError("Error al cargar tus logros");
      }
    } catch (error) {
      console.error("❌ [Logros] Error:", error);
      setError("Error al cargar tus logros");
    }
  };

  const cargarRanking = async () => {
    try {
      const data = await API.ObtenerRanking();
      if (data.success) {
        setRankingUsuarios(data.ranking);
      }
    } catch (error) {
      console.error("❌ [Logros] Error cargando ranking:", error);
    }
  };

  const actualizarInfoUsuario = async () => {
    if (!id) return;
    
    try {
      const data = await API.ObtenerDatosUsuario(id);
      if (data.success && data.user) {
        localStorage.setItem("user", JSON. stringify(data.user));
      }
    } catch (error) {
      console.error("❌ [Logros] Error actualizando info:", error);
    }
  };

  const actualizarNivel = async (totalParaGuardar: number) => {
    if (!id) return;
    
    try {
      await API.ActualizarNivelStreams(id, totalParaGuardar);
      await actualizarInfoUsuario();
    } catch (error) {
      console.error("❌ [Logros] Error actualizando nivel:", error);
    }
  };

  const reclamar = async (logroUsuario: LogroUsuario) => {
    if (!id) return;

    // Solo reclamar si no está completado
    if (logroUsuario.Completado) {
      console.log("⚠️ [Logros] Este logro ya fue reclamado");
      return;
    }

    try {
      console.log(`🔄 [Logros] Reclamando logro: ${logroUsuario.logros. Nombre}`);
      
      // Marcar como completado en el backend
      const result = await API. Actualizar_Logros(logroUsuario.ID_Logro, id. toString(), true);
      
      if (result.success) {
        // Actualizar XP
        const nuevoTotal = xpTotal + logroUsuario.logros.Puntaje;
        setXpTotal(nuevoTotal);
        await actualizarNivel(nuevoTotal);
        
        // Recargar mis logros para actualizar UI
        await cargarMisLogros();
        
        console.log(`✅ [Logros] Logro reclamado: +${logroUsuario.logros.Puntaje} XP`);
      }
    } catch (error) {
      console.error("❌ [Logros] Error al reclamar:", error);
    }
  };

  // Abrir popup y cargar logros ya seleccionados
  const abrirPopup = () => {
    const idsSeleccionados = misLogrosSeleccionados.map(l => l.ID_Logro);
    setLogrosSeleccionados(idsSeleccionados);
    setPopupAbierto(true);
  };

  // Alternar selección de logro en el popup
  const toggleLogroSeleccion = (idLogro: number) => {
    setLogrosSeleccionados(prev => {
      if (prev.includes(idLogro)) {
        // Deseleccionar
        return prev. filter(id => id !== idLogro);
      } else {
        // Seleccionar (máximo 5)
        if (prev.length >= 5) {
          alert("Solo puedes seleccionar hasta 5 logros");
          return prev;
        }
        return [...prev, idLogro];
      }
    });
  };

  // Guardar logros seleccionados
  const guardarLogrosSeleccionados = async () => {
    if (!id) return;

    setGuardando(true);
    try {
      console.log("🔄 [Logros] Guardando selección de logros...");

      // Para cada logro en todosLosLogros, verificar si debe estar en la selección
      for (const logro of todosLosLogros) {
        const estaSeleccionado = logrosSeleccionados.includes(logro.ID_Logro);
        const yaExiste = misLogrosSeleccionados.some(l => l. ID_Logro === logro.ID_Logro);

        if (estaSeleccionado && !yaExiste) {
          // Agregar nuevo logro
          await API.AsignarLogro(id, logro.ID_Logro, false);
          console.log(`✅ [Logros] Logro asignado: ${logro. Nombre}`);
        }
        // Nota: No eliminamos logros porque el endpoint AsignarLogro solo crea
      }

      // Recargar mis logros
      await cargarMisLogros();
      setPopupAbierto(false);
      console.log("✅ [Logros] Selección guardada");
      
    } catch (error) {
      console.error("❌ [Logros] Error al guardar:", error);
      setError("Error al guardar la selección");
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    // Validar usuario
    if (!info || !nombreUsuario) {
      console. error("No hay usuario logueado");
      navigate("/login");
      return;
    }

    const cargarDatos = async () => {
      setCargando(true);
      await Promise.all([
        cargarTodosLosLogros(),
        cargarMisLogros(),
        cargarRanking()
      ]);
      
      if (nivels) {
        setXpTotal(nivels);
      }
      
      setCargando(false);
    };

    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular nivel actual
  const nivel = 1 + Math.floor(xpTotal / 100);
  const xpParaNivelActual = xpTotal % 100;
  const progreso = Math. min((xpParaNivelActual / 100) * 100, 100);

  if (cargando) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh", 
        backgroundColor: "#0e0e10" 
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "5px solid #333",
          borderTop: "5px solid #00b7ff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", padding: "40px", backgroundColor: "#0e0e10", minHeight: "100vh", color: "white" }}>
      
      {/* Logros */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#00b7ff", margin: 0 }}>Mis Logros ({misLogrosSeleccionados. length}/5)</h2>
          <button 
            onClick={abrirPopup}
            style={{ 
              backgroundColor: "#00b7ff", 
              color: "white", 
              border: "none", 
              borderRadius: "8px", 
              padding: "10px 20px", 
              fontWeight: "bold", 
              cursor: "pointer", 
              transition: "background 0.3s" 
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#0099cc"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#00b7ff"}
          >
            Seleccionar Logros
          </button>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: "#ff4444", 
            color: "white", 
            padding: "10px", 
            borderRadius: "6px", 
            marginBottom: "20px" 
          }}>
            {error}
          </div>
        )}

        {/* Barra de experiencia */}
        <div style={{ margin: "0 auto 30px", width: "80%", maxWidth: "500px", backgroundColor: "#1f1f23", borderRadius: "12px", padding: "20px" }}>
          <h3>Nivel {nivel}</h3>
          <div style={{ height: "24px", backgroundColor: "#2a2a2e", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ 
              width: `${progreso}%`, 
              height: "100%", 
              background: "linear-gradient(90deg, #00b7ff, #0077ff, #4a00ff)", 
              transition: "width 0.6s" 
            }} />
          </div>
          <p style={{ marginTop: "8px", fontSize: "14px", opacity: 0.8 }}>
            {xpParaNivelActual} XP / 100 XP
          </p>
        </div>

        {/* Lista de MIS logros seleccionados */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", maxWidth: "600px", margin: "0 auto" }}>
          {misLogrosSeleccionados.length === 0 ? (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              color: "#adadb8" 
            }}>
              <p style={{ fontSize: "18px" }}>
                No tienes logros seleccionados. Haz clic en "Seleccionar Logros" para elegir hasta 5. 
              </p>
            </div>
          ) : (
            misLogrosSeleccionados.map(logroUsuario => (
              <div 
                key={logroUsuario.ID_Logro} 
                style={{ 
                  flex: "0 1 45%", 
                  backgroundColor: logroUsuario.Completado ?  "#2a2a2e" : "#1f1f23",
                  color: "white", 
                  padding: "15px", 
                  borderRadius: "8px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  opacity: logroUsuario.Completado ? 0.6 : 1,
                  border: logroUsuario.Completado ? "2px solid #00ff7f" : "none"
                }}
              >
                <div style={{ textAlign: "left", flex: 1 }}>
                  <h4 style={{ margin: 0 }}>
                    {logroUsuario.logros.Nombre}
                    {logroUsuario. Completado && " ✓"}
                  </h4>
                  <p style={{ margin: "5px 0 0", fontSize: "14px", opacity: 0.8 }}>
                    {logroUsuario.logros.descripcion}
                  </p>
                  <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#00b7ff", fontWeight: "bold" }}>
                    +{logroUsuario.logros.Puntaje} XP
                  </p>
                </div>
                <button 
                  style={{ 
                    backgroundColor: logroUsuario.Completado ?  "#555" : "#00ff7f", 
                    border: "none", 
                    borderRadius: "6px", 
                    padding: "6px 12px", 
                    fontWeight: "bold", 
                    cursor: logroUsuario. Completado ? "not-allowed" : "pointer",
                    opacity: logroUsuario. Completado ? 0.5 : 1
                  }} 
                  onClick={() => reclamar(logroUsuario)}
                  disabled={logroUsuario.Completado}
                >
                  {logroUsuario.Completado ?  "Reclamado" : "Reclamar"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ranking al costado */}
      <Ranking usuarios={rankingUsuarios} />

      {/* Popup de selección de logros */}
      {popupAbierto && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#1f1f23",
            borderRadius: "12px",
            padding: "30px",
            maxWidth: "700px",
            maxHeight: "80vh",
            overflow: "auto",
            width: "90%",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ color: "#00b7ff", margin: 0 }}>
                Seleccionar Logros ({logrosSeleccionados.length}/5)
              </h2>
              <button
                onClick={() => setPopupAbierto(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>

            <p style={{ color: "#adadb8", marginBottom: "20px" }}>
              Selecciona hasta 5 logros que deseas tener en tu perfil
            </p>

            {/* Lista de TODOS los logros disponibles */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", marginBottom: "20px" }}>
              {todosLosLogros.map(logro => {
                const estaSeleccionado = logrosSeleccionados.includes(logro.ID_Logro);
                
                return (
                  <div
                    key={logro. ID_Logro}
                    onClick={() => toggleLogroSeleccion(logro.ID_Logro)}
                    style={{
                      backgroundColor: estaSeleccionado ?  "#00b7ff" : "#2a2a2e",
                      padding: "15px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      border: estaSeleccionado ? "2px solid #00ff7f" : "2px solid transparent",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, color: "white" }}>
                          {estaSeleccionado && "✓ "}
                          {logro.Nombre}
                        </h4>
                        <p style={{ margin: "5px 0", fontSize: "14px", color: "#adadb8" }}>
                          {logro.descripcion}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "#00ff7f", fontWeight: "bold" }}>
                          +{logro. Puntaje} XP
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botones de acción */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setPopupAbierto(false)}
                style={{
                  backgroundColor: "#555",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={guardarLogrosSeleccionados}
                disabled={guardando || logrosSeleccionados.length === 0}
                style={{
                  backgroundColor: guardando || logrosSeleccionados.length === 0 ? "#555" : "#00ff7f",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  cursor: guardando || logrosSeleccionados.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                {guardando ?  "Guardando..." : "Guardar Selección"}
              </button>
            </div>
          </div>
        </div>
      )}

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