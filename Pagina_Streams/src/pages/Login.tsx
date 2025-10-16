import { useContext, useState} from "react"
import "./StyleLogin.css"
import { useAuth } from "../components/AuthContext";
import { login } from "../components/PaseLogin";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [error, seterror] = useState<String>()
  const [email, setemail] = useState<string>("")
  const [password, setpassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const { login: logincontext } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = ({ email, password }: { email: string; password: string }) => {
    const result = login(email, password)
    if (result.success && result.user) {
      seterror(`Hola, ${result.user.role} bienvenido!`)
      logincontext(result.user);
      if(result.user.role == "streamer"){
        navigate(`/`)
      }
      else{
        navigate(`/`)
      }
    } else {
      seterror(result.error)
    }
  }

  return <div>
    <div className="login-container" style={{
    maxWidth: "400px",
    margin: "80px auto",
    padding: "40px",
    backgroundColor: "#1e1e1e",
    borderRadius: "10px",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
    fontFamily: "Arial, sans-serif"
}}>
  <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Iniciar Sesión</h2>

  <div className="input-group" style={{ marginBottom: "20px" }}>
    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Correo</label>
    <input 
      type="email" 
      required 
      value={email} 
      onChange={(p) => setemail(p.target.value)} 
      placeholder="Ingresar correo" 
      style={{
        width: "100%",
        padding: "12px",
        backgroundColor: "#121212",
        color: "white",
        borderRadius: "6px",
        border: "1px solid #333",
        fontSize: "14px"
      }}
    />
  </div>

  <div className="input-group" style={{ marginBottom: "30px", position: "relative" }}>
    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Contraseña</label>
    <input 
      type={showPassword ? "text" : "password"} 
      value={password} 
      onChange={(p) => setpassword(p.target.value)} 
      placeholder="................" 
      style={{
        width: "100%",
        padding: "12px",
        backgroundColor: "#121212",
        color: "white",
        borderRadius: "6px",
        border: "1px solid #333",
        fontSize: "14px"
      }}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        color: "#aaa",
        cursor: "pointer",
        fontSize: "12px"
      }}
    >
      {showPassword ? "Ocultar" : "Mostrar"}
    </button>
  </div>

  <button 
    onClick={() => handleLogin({ email, password })}
    onKeyDown={(e) => e.key === "Enter" && handleLogin({ email, password })}
    style={{
      width: "100%",
      padding: "14px",
      backgroundColor: "#555",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      transition: "background 0.3s"
    }}
    onMouseOver={e => e.currentTarget.style.backgroundColor = "#777"}
    onMouseOut={e => e.currentTarget.style.backgroundColor = "#555"}
  >
    Logear
  </button>

    <p 
  style={{marginTop:"10px", textAlign:"center"}}>No hay cuenta, es momento de {" "}
    <Link to={"/registro"}>REGISTRARSE</Link>
  </p>

  {error && (
    <p style={{ color: "red", marginTop: "15px", textAlign: "center", fontSize: "14px" }}>{error}</p>
  )}
</div>

  </div>
}