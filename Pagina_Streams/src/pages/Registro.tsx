import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./StyleRegistro.css";
import type { dataprops } from "./Login";
import { setRegistereddatapropss } from "../components/PaseLogin";

interface NewUser {
  nombre: string;
  contraseña: string;
  email: string;
  imagenPerfil: string;
}

export default function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [confirm, setConfirm] = useState(false);

  const [form, setForm] = useState<NewUser>({
    nombre: "",
    contraseña: "",
    email: "",
    imagenPerfil: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.nombre.trim()) return "Ingresa tu nombre.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo electrónico inválido.";
    if (form.contraseña.length < 6) return "La contraseña debe tener al menos 6 caracteres. ";
    if (!confirm) return "Debes aceptar los términos y condiciones";
    return "";
  };

  // ✅ Mover httpRegistro FUERA de onSubmit
  const httpRegistro = async () => {
    try {
      const newUser = {
        NombreUsuario: form.nombre.trim(),  // ← Backend espera "NombreUsuario"
        Contraseña: form.contraseña,        // ← Backend espera "Contraseña"
        email: form.email.trim(),
        ImagenPerfil: form.imagenPerfil.trim() || "https://via.placeholder.com/150", // ← Imagen por defecto
      };

      const resp = await fetch("http://localhost:5000/Registrar_Usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!resp.ok) {
        throw new Error("Error al registrar usuario");
      }

      const data = await resp.json();
      
      const usuario: dataprops = {
        ID: data.ID,
        nombreUsuario: data.NombreUsuario,
        horasTransmision: data.HorasTransmision,
        monedasNumber: data.Monedas,
        nivelStreams: data.NivelStreams,
        puntos: data. Puntos,
      };

      setRegistereddatapropss(usuario);
      
      // Autologin y navegación
      login({ nombre: form.nombre, contraseña: form.contraseña, email: form.email, imagenPerfil: form. imagenPerfil });
      navigate("/");
      
      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      setError("Error al crear la cuenta. Intenta de nuevo.");
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const msg = validate();
    if (msg) return setError(msg);
    
    setError("");
    setLoading(true);

    // ✅ Llamar a httpRegistro
    await httpRegistro();
    
    setLoading(false);
  };

  return (
    <div className="reg-wrap">
      <header className="brand">
        <span className="brand-name">Streams</span>
      </header>

      <form className="reg-card" onSubmit={onSubmit}>
        <h2 className="reg-title">Crear Cuenta</h2>
        <p className="reg-sub">Completa el formulario para registrarte</p>

        {error && <div className="reg-error">{error}</div>}

        <label className="reg-label" htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"  
          type="text"
          value={form.nombre}
          onChange={onChange}
          className="reg-input"
          autoComplete="name"
        />

        <label className="reg-label" htmlFor="email">Correo Electrónico</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          className="reg-input"
          autoComplete="email"
        />

        <label className="reg-label" htmlFor="contraseña">Contraseña</label>
        <input
          id="contraseña"
          name="contraseña" 
          type="password"
          value={form.contraseña}
          onChange={onChange}
          className="reg-input"
          autoComplete="new-password"
        />

        <label className="reg-label" htmlFor="imagenPerfil">URL Imagen de Perfil (opcional)</label>
        <input
          id="imagenPerfil"
          name="imagenPerfil"
          type="url"
          value={form. imagenPerfil}
          onChange={onChange}
          className="reg-input"
          placeholder="https://ejemplo.com/foto.jpg"
        />

        {/* ✅ Checkbox de términos y condiciones */}
        <div style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="checkbox"
            id="terminos"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <label htmlFor="terminos" style={{ cursor: "pointer", fontSize: "14px" }}>
            Acepto los{" "}
            <Link to="/terminos" style={{ color: "#00b7ff" }}>
              Términos y Condiciones
            </Link>
          </label>
        </div>

        {/* ✅ Botón de submit - sin onClick porque onSubmit ya maneja todo */}
        <button className="reg-btn" type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

        <div className="reg-foot">
          ¿Ya tienes cuenta?  <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </form>
    </div>
  );
}