import { useState} from "react"
import "./StyleLogin.css"
import { login } from "../datos/prueba"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [error, seterror] = useState<String>()
  const [email, setemail] = useState<string>("")
  const [password, setpassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  
  const handleLogin = ({ email, password }: { email: string; password: string }) => {
    const result = login(email, password)
    if (result.success && result.user) {
      seterror(`Hola, ${result.user.role} bienvenido!`)
      if(result.user.role == "streamer"){
        navigate(`/perfils/${result.user.name}`)
      }
      else{
        navigate(`/perfilv/${result.user.name}`)
      }
    } else {
      seterror(result.error)
    }
  }
  return <div>
    <h2>Iniciar Sesión</h2>
    <div className="row">
        <p style={{ display: "inline-block", marginRight: "306px"}}>Correo</p>
        <p style={{ display: "inline-block" }}>Contaseña</p>
    </div>
    <div>
      <input type="email" required value={email} onChange={(p)=>setemail(p.target.value)} 
      placeholder="Ingresar correo" 
      className="Size_Recuadros"
      style={{backgroundColor:"black", color:"white", display: "inline-block", marginRight: "176px"}} />
      <input type={showPassword ? "text" : "password"} value={password} onChange={(p)=>setpassword(p.target.value)} 
      placeholder="................" 
      className="Size_Recuadros"
      style={{backgroundColor:"black", color:"white", display: "inline-block"}}/>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-2 text-gray-600 hover:text-black"
      >
        {showPassword ? "Mostrar" : "Ocultar"}
      </button>
    </div>
    <div>
      <button 
      className="LoginC"
      onClick={()=>handleLogin({email, password})}
      style={{backgroundColor:"gray",border:"none", display:"block", marginTop:"30px"}}>Logear</button>
    </div>
    <div>
      <p>{error}</p>
    </div>
    </div>
}