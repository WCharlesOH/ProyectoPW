import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import "./StyleRegistro.css";
import { API } from "../Comandosllamadas/llamadas";
import type { registro } from "../components/types";

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

    /**
     * 🐛 CORRECCIÓN CLAVE: Usar los nombres de propiedad correctos del objeto 'form'.
     * Los nombres deben coincidir con 'NombreUsuario', 'email', y 'Contraseña'.
     */
    const validate = () => {
        // 1. Corregido: form.name NO existe, debe ser form.NombreUsuario
        if (!form.NombreUsuario.trim()) return "Ingresa tu nombre de usuario."; 
        
        // 2. Corregido: form.email está bien, pero aseguramos que sea string
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo electrónico inválido.";
        
        // 3. Corregido: form.password NO existe, debe ser form.Contraseña
        if (form.Contraseña.length < 6) return "La contraseña debe tener al menos 6 caracteres."; 
        
        // 4. Verificación de términos y condiciones
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

        const resp = await todo.RegistoUsuario(form.NombreUsuario, form.Contraseña, form.email, form.ImagenPerfil);
        
        if (resp.success) {
            // Asumimos que resp.data contiene SOLO el ID del usuario (número)
            const idNuevoUsuario: number = resp.data; 

            // 🔑 CORRECCIÓN DE FLUJO: Obtener el objeto de usuario COMPLETO
            const usua = await todo.ObtenerDatosUsuario(idNuevoUsuario);
            
            // Asumimos que usua.user es el objeto de usuario tipo Usuario
            const usuario = usua.user; 
            
            localStorage.setItem("user", JSON.stringify(usuario));

            login(usuario);
            setLoading(false);
            navigate("/"); 
        } else {
            // 🔑 IMPORTANTE: Desactivar loading también en caso de error
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

                <label className="reg-label" htmlFor="NombreUsuario">Nombre de Usuario</label>
                <input
                    id="NombreUsuario"
                    name="NombreUsuario"
                    type="text"
                    value={form.NombreUsuario}
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

                <label className="reg-label" htmlFor="Contraseña">Contraseña</label>
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
                <p 
                    className="reg-foot">acepto los {" "}
                    <Link to={"/terminos"}>Terminos y condiciones</Link>
                    {/* Botón para cambiar el estado de confirmación */}
                    <button type="button" onClick={()=>setconfirm(!confirm)}> {confirm ? "Aceptado" : "Aceptar"} </button>
                </p>

                <div className="reg-foot">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </div>
            </form>
        </div>
    );
}
