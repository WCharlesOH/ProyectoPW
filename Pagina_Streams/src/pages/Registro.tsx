import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./StyleRegistro.css";
import { API } from "../Comandosllamadas/llamadas";
import type { datacompleta, registro, Usuario } from "../components/types";

export default function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [confirm, setconfirm] = useState(false);
  const todo = API;

  const [form, setForm] = useState<registro>({
    NombreUsuario: "",
    email: "",
    Contraseña: "",
    ImagenPerfil: "usa",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.NombreUsuario.trim()) return "Ingresa tu nombre de usuario.";

    if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo electrónico inválido.";

    if (form.Contraseña.length < 6)
      return "La contraseña debe tener al menos 6 caracteres.";

    if (!confirm) return "Debes aceptar los términos y condiciones.";

    return "";
  };

  const onSubmits = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setError("");
    setLoading(true);

    const resp = await todo.RegistoUsuario(
      form.NombreUsuario,
      form.Contraseña,
      form.email,
      form.ImagenPerfil
    );

    if (resp.success) {
      const idNuevoUsuario: number = resp.data;

      const usua = await todo.ObtenerDatosUsuario(idNuevoUsuario);

      const usuario = usua.user;

      localStorage.setItem("user", JSON.stringify(usuario));

      login(usuario);
      setLoading(false);
      navigate("/");
    } else {
      setLoading(false);
      setError(resp.error);
    }
  };

  return (
    <div className="reg-wrap">
      <header className="brand">
        <span className="brand-name">Streams</span>
      </header>

      <form className="reg-card" onSubmit={onSubmits}>
        <h2 className="reg-title">Crear Cuenta</h2>
        <p className="reg-sub">Completa el formulario para registrarte</p>

        {error && <div className="reg-error">{error}</div>}

        <label className="reg-label" htmlFor="NombreUsuario">
          Nombre de Usuario
        </label>
        <input
          id="NombreUsuario"
          name="NombreUsuario"
          type="text"
          value={form.NombreUsuario}
          onChange={onChange}
          className="reg-input"
          autoComplete="name"
        />

        <label className="reg-label" htmlFor="email">
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          className="reg-input"
          autoComplete="email"
        />

        <label className="reg-label" htmlFor="Contraseña">
          Contraseña
        </label>
        <input
          id="Contraseña"
          name="Contraseña"
          type="password"
          value={form.Contraseña}
          onChange={onChange}
          className="reg-input"
          autoComplete="new-password"
        />

        <button className="reg-btn" type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
        <p className="reg-foot">
          acepto los <Link to={"/terminos"}>Terminos y condiciones</Link>
          {/* Botón para cambiar el estado de confirmación */}
          <button type="button" onClick={() => setconfirm(!confirm)}>
            {" "}
            {confirm ? "Aceptado" : "Aceptar"}{" "}
          </button>
        </p>

        <div className="reg-foot">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </form>
    </div>
  );
}
