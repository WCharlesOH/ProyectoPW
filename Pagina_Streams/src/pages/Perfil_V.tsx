
import { useNavigate } from "react-router-dom";
import ImagenPerfil from "../imagenes/Mirko.jpg";
import { type User } from "../components/PaseLogin";

export default function Perfil_V() {
  const navigate = useNavigate()
  const user = localStorage.getItem("user")
    
  const titi : User = user ? JSON.parse(user) : null
  return (
    <div
      style={{
        padding: "40px",
        color: "white",
        textAlign: "center",
        backgroundColor: "#0e0e10",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#00b7ff", marginBottom: "20px" }}>Perfil del Streamer</h2>

      {/* Imagen central */}
      <div style={{ margin: "20px auto" }}>
        <img
          src={ImagenPerfil}
          alt="Streamer"
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "4px solid #00b7ff",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Opciones ficticias */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        {["Información sobre mí", "Estado actual", "Canjear monedas"].map((opcion, index) => (
          <button
            key={index}
            style={{
              width: "250px",
              padding: "12px",
              backgroundColor: "#1f1f23",
              border: "1px solid #00b7ff",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00b7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1f1f23")}
          >
            {opcion}
          </button>
        ))}
        <button
            key= "gologros"
            style={{
              width: "250px",
              padding: "12px",
              backgroundColor: "#1f1f23",
              border: "1px solid #00b7ff",
              borderRadius: "8px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onClick={()=>navigate(`/Logros/${titi.name}`)}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00b7ff")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1f1f23")}
          >
            Logros
          </button>
      </div>
    </div>
  );
}

