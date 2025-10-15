import { useNavigate } from "react-router-dom";
import Titulo from "./Titulo";



export default function Terminos(){
  const navigate = useNavigate();

  const salir = () => {
        
        navigate("/")
    }

  return<div
    style={{
      textAlign:"center",
    }}>
    <Titulo texto="Perfil de Espectador"></Titulo>
   
  
    </div>
}
