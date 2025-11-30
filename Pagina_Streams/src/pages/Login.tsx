import { useState} from "react"
import "./StyleLogin.css"

import { useNavigate, Link } from "react-router-dom";
import {setRegistereddatapropss} from "../components/PaseLogin"

 

export interface dataprops {
  ID : number
  nombreUsuario : string,
  horasTransmision : number,
  monedasNumber : number,
  nivelStreams : number ,
  puntos : number
}

export default function Login() {
  
  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();


  const direc= "http://localhost:5000" 



  const HttpObtenerData = async ( { email, password }: { email: string; password: string }) => {
  

    try{
      const resp = await fetch(`${direc}/Validar_Usuario`,{ 
        method: "POST", 
        headers : { "Content-Type": "application/json"},
        body : JSON.stringify({email, password} )
      })
       
      const data = await resp.json()
      const usuario : dataprops = {
        ID : data.ID,
        nombreUsuario : data.NombreUsuario,
        horasTransmision : data.HorasTransimision,
        monedasNumber : data.Monedas,
        nivelStreams : data.NivelStreams,
        puntos :  data.Puntos
      }
      setRegistereddatapropss(usuario)
      loginConfirmado()
      } catch (error) {
      console.log(error)
    }
  }

  const loginConfirmado = () => {

    navigate("/", )

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
          onClick={() => HttpObtenerData({email, password})}
          onKeyDown={(e) => e.key === "Enter" && HttpObtenerData({email,password})}
          className="login-button"
        >
          Logear
        </button>

        <p className="login-register">No hay cuenta, es momento de {" "}
          <Link to={"/registro"}>REGISTRARSE</Link>
        </p>

        
      </div>
    </div>
  );
}