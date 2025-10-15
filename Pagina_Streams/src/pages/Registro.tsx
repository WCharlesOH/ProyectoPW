import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import type { User, UserRole } from "../components/PaseLogin";
import "./StyleRegistro.css";

type NewUser = Omit<User, "id" | "createdAt" | "coins" | "level" | "points" | "streamingHours"> & {
  role: UserRole;
};

export default function Registro() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
    role: "viewer",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Ingresa tu nombre.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo electrónico inválido.";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    return "";
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);
    setError("");
    setLoading(true);

    // Simular "API" de registro usando localStorage
    const key = "registeredUsers";
    const existing: User[] = JSON.parse(localStorage.getItem(key) || "[]");

    if (existing.some((u) => u.email.toLowerCase() === form.email.toLowerCase())) {
      setLoading(false);
      return setError("Ya existe una cuenta con ese correo.");
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,       // en proyecto real: encriptar / nunca guardes en texto plano
      role: form.role,
      coins: 0,
      level: 1,
      points: 0,
      streamingHours: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = [...existing, newUser];
    localStorage.setItem(key, JSON.stringify(updated));

    // Autologin y navegación
    login(newUser);
    setLoading(false);
    navigate("/"); // o a "/perfil" si prefieres
  };

  return (
    <div className="reg-wrap">
      <header className="brand">
        <span className="brand-icon">S</span>
        <span className="brand-name">StreamHub</span>
      </header>

      <form className="reg-card" onSubmit={onSubmit}>
        <h2 className="reg-title">Crear Cuenta</h2>
        <p className="reg-sub">Completa el formulario para registrarte</p>

        {error && <div className="reg-error">{error}</div>}

        <label className="reg-label" htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
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

        <label className="reg-label" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          className="reg-input"
          autoComplete="new-password"
        />

        <div className="reg-label">Tipo de Cuenta</div>
        <div className="reg-radio-row">
          <label className="reg-radio">
            <input
              type="radio"
              name="role"
              value="viewer"
              checked={form.role === "viewer"}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
            />
            <span>@Espectador</span>
          </label>
          <label className="reg-radio">
            <input
              type="radio"
              name="role"
              value="streamer"
              checked={form.role === "streamer"}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
            />
            <span>Streamer</span>
          </label>
        </div>

        <button className="reg-btn" type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

        <div className="reg-foot">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </div>
      </form>
    </div>
  );
}
