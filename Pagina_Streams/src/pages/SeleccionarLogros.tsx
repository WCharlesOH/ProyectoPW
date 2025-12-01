import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Logro, Usuario } from "../components/types";
import { API } from "../Comandosllamadas/llamadas";

export default function SeleccionarLogros() {
  const [logros, setLogros] = useState<Logro[]>([]);
  const [logrosSeleccionados, setLogrosSeleccionados] = useState<number[]>([]);
  const navigate = useNavigate();
  const { username } = useParams();
  
  const info: Usuario | null = JSON.parse(localStorage.getItem("user") || "null");
  const id = info ? Number(info.ID) : null;
  const nombreUsuario = info?.NombreUsuario || username;
  const todo = API;

  const SacarLogros = async () => {
    const data = await todo.ObtenerTodosLogros();
    if (data.success) {
      setLogros(data.logros); 
    }
  };

  useEffect(() => {
    if (!id || !info || !nombreUsuario) {
      alert("Debes iniciar sesión para seleccionar logros");
      navigate("/login");
      return;
    }
    SacarLogros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSeleccion = (logroId: number) => {
    setLogrosSeleccionados(prev => 
      prev.includes(logroId) 
        ? prev.filter(id => id !== logroId)
        : [...prev, logroId]
    );
  };

  const guardarSeleccion = async () => {
    if (!id || !nombreUsuario) {
      alert("Usuario no válido");
      navigate("/login");
      return;
    }

    // Aquí puedes hacer una llamada API para guardar los logros seleccionados
    console.log("Logros seleccionados:", logrosSeleccionados);
    console.log("Usuario:", nombreUsuario);
    
    // Ejemplo de llamada (ajusta según tu API):
    // await todo.GuardarLogrosSeleccionados(id, logrosSeleccionados);
    
    alert("¡Logros seleccionados guardados!");
    navigate("/logros/" + nombreUsuario);
  };

  return (
    <div style={{ padding: "40px", backgroundColor: "#0e0e10", minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "#00b7ff", marginBottom: "30px" }}>Seleccionar Logros</h2>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
          {logros.map(logro => (
            <div 
              key={logro.ID}
              onClick={() => toggleSeleccion(logro.ID)}
              style={{ 
                flex: "0 1 45%", 
                backgroundColor: logrosSeleccionados.includes(logro.ID) ? "#00b7ff" : "#1f1f23",
                color: "white", 
                padding: "15px", 
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s",
                border: logrosSeleccionados.includes(logro.ID) ? "2px solid #fff" : "2px solid transparent"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ textAlign: "left" }}>
                  <h4 style={{ margin: 0 }}>{logro.Nombre}</h4>
                  <p style={{ margin: "5px 0 0", fontSize: "14px", opacity: 0.8 }}>{logro.descripcion}</p>
                  <p style={{ margin: "5px 0 0", fontSize: "12px", fontWeight: "bold" }}>+{logro.Puntaje} XP</p>
                </div>
                <div style={{ fontSize: "24px" }}>
                  {logrosSeleccionados.includes(logro.ID) ? "✓" : "○"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button 
            onClick={guardarSeleccion}
            disabled={logrosSeleccionados.length === 0}
            style={{ 
              backgroundColor: logrosSeleccionados.length === 0 ? "#555" : "#00ff7f",
              color: "white",
              border: "none", 
              borderRadius: "8px", 
              padding: "12px 30px", 
              fontWeight: "bold", 
              cursor: logrosSeleccionados.length === 0 ? "not-allowed" : "pointer",
              fontSize: "16px"
            }}
          >
            Seleccionar ({logrosSeleccionados.length})
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              backgroundColor: "#555",
              color: "white",
              border: "none", 
              borderRadius: "8px", 
              padding: "12px 30px", 
              fontWeight: "bold", 
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
