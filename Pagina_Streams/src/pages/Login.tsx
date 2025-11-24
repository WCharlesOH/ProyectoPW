import { useState } from "react";
import "./StyleLogin.css";
import { useAuth } from "../components/AuthContext";
import { login } from "../components/PaseLogin";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [error, seterror] = useState<String>();
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <div className="input-group">
          <label className="input-label">Correo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(p) => setemail(p.target.value)}
            placeholder="Ingresar correo"
            className="input-field"
          />
        </div>

        <div className="input-group input-group--password">
          <label className="input-label">Contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(p) => setpassword(p.target.value)}
            placeholder="................"
            className="input-field"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-password"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <button
          onClick={() => handleLogin({ email, password })}
          onKeyDown={(e) => e.key === "Enter" && handleLogin({ email, password })}
          className="login-button"
        >
          Logear
        </button>

        <p className="login-register">No hay cuenta, es momento de {" "}
          <Link to={"/registro"}>REGISTRARSE</Link>
        </p>

        {error && (
          <p className="login-error">{error}</p>
        )}
      </div>
    </div>
  );
}