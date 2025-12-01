import { useState } from "react";
import "./StyleLogin.css";
import { useAuth } from "../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../Comandosllamadas/llamadas";

export default function Login() {
  const [error, seterror] = useState<String>();
  const [Nombre, setNombre] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const { login: logincontext } = useAuth();
  const navigate = useNavigate();

  const todo = API;

  const validacion = async (Nombre: string, password: string) => {
    const logins = await todo.LoginUsuario(Nombre, password);
    const validado = logins.success;
    if (validado) {
      logincontext(logins.user);
      navigate("/");
    } else {
      seterror(logins.error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Iniciar Sesión</h2>

        <div className="input-group">
          <label className="input-label">Correo</label>
          <input
            type="text"
            required
            value={Nombre}
            onChange={(p) => setNombre(p.target.value)}
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
          onClick={() => validacion(Nombre, password)}
          onKeyDown={(e) => e.key === "Enter" && validacion(Nombre, password)}
          className="login-button"
        >
          Logear
        </button>

        <p className="login-register">
          No hay cuenta, es momento de <Link to={"/registro"}>REGISTRARSE</Link>
        </p>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
