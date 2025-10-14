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
    <Titulo texto="Terminos Y Condiciones"></Titulo>
    <p>
  <strong>1. Aceptación de los Términos:</strong> Al acceder o utilizar nuestra plataforma de streaming, el usuario acepta cumplir con estos Términos y Condiciones, así como con nuestras políticas de privacidad y uso. Si no está de acuerdo con alguno de los términos, deberá abstenerse de utilizar el servicio.
</p>

<p>
  <strong>2. Uso del Servicio:</strong> El usuario se compromete a utilizar la plataforma únicamente con fines personales y no comerciales. Queda prohibido compartir cuentas, redistribuir el contenido o intentar manipular el sistema de reproducción.
</p>

<p>
  <strong>3. Registro y Seguridad:</strong> Para acceder a ciertas funciones del servicio, el usuario deberá crear una cuenta con información veraz y actualizada. El usuario es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades que ocurran bajo su cuenta.
</p>

<p>
  <strong>4. Propiedad Intelectual:</strong> Todo el contenido disponible en la plataforma, incluyendo películas, series, logotipos, textos, imágenes y software, es propiedad de la empresa o de sus respectivos titulares de derechos. Queda prohibida su reproducción o distribución sin autorización previa.
</p>

<p>
  <strong>5. Planes y Pagos:</strong> Algunos servicios pueden requerir una suscripción de pago. Los precios, modalidades y beneficios serán informados claramente antes de la contratación. No se realizarán reembolsos por pagos ya efectuados, salvo en casos específicos previstos por la ley.
</p>

<p>
  <strong>6. Limitación de Responsabilidad:</strong> La empresa no se hace responsable por interrupciones del servicio, fallos técnicos, pérdida de datos o cualquier daño derivado del uso de la plataforma. No garantizamos la disponibilidad continua del contenido.
</p>

<p>
  <strong>7. Modificaciones del Servicio:</strong> Nos reservamos el derecho de modificar, suspender o finalizar el servicio en cualquier momento, así como de actualizar estos términos cuando sea necesario. Las modificaciones serán publicadas en esta página y entrarán en vigencia inmediatamente.
</p>

<p>
  <strong>8. Privacidad y Datos Personales:</strong> La información personal del usuario será tratada de acuerdo con nuestra Política de Privacidad, garantizando la protección y confidencialidad de los datos conforme a la legislación vigente.
</p>

<p>
  <strong>9. Legislación Aplicable:</strong> Estos términos se rigen por las leyes del país en el que opera la plataforma. Cualquier conflicto o disputa será resuelto ante los tribunales competentes de dicha jurisdicción. 
    
</p>



  <img src="https://cdn-icons-png.flaticon.com/512/16391/16391099.png" alt="" />  



    
    <dt></dt>
    <button className="btn btn-secondary" 
            onClick={ salir }>
                Volver
        </button>
    </div>
}
