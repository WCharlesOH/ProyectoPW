import { useNavigate } from "react-router-dom";
import banner from "../assets/legal-document-illustration.jpg"; // pon una imagen en src/assets/
import "./Terminos.css";

export default function Terminos() {
  const navigate = useNavigate();

  return (
    <div className="t-wrapper">
      <button className="t-back" onClick={() => navigate(-1)}>← Regresar</button>

      <h1 className="t-title">Terminos y Condiciones</h1>

      <article className="t-card">
        <img src={banner} alt="Términos" className="t-banner" />

        <section className="t-block">
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al utilizar <strong>Streams</strong>, usted acepta estar sujeto a estos Términos y Condiciones, así como a
            las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder
            a este sitio.
          </p>
        </section>

        <section className="t-block">
          <h2>2. Uso de la Licencia</h2>
          <p>
            Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en StreamHub para
            visualización transitoria personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título.
            Bajo esta licencia, usted no puede:
          </p>
          <ul>
            <li>Modificar o copiar los materiales.</li>
            <li>Usarlos para cualquier propósito comercial o para exhibición pública.</li>
            <li>Intentar descompilar o aplicar ingeniería inversa a cualquier software contenido en StreamHub.</li>
            <li>Eliminar derechos de autor u otras notaciones de propiedad de los materiales.</li>
            <li>Transferir los materiales a otra persona o “reflejar” los materiales en cualquier otro servidor.</li>
          </ul>
        </section>

        <section className="t-block">
          <h2>3. Cuentas de Usuario</h2>
          <p>
            Al crear una cuenta, usted es responsable de mantener la seguridad de su cuenta y contraseña. StreamHub no será
            responsable de pérdidas o daños derivados del incumplimiento de esta obligación. Usted debe notificarnos de inmediato
            cualquier uso no autorizado de su cuenta.
          </p>
        </section>

        <section className="t-block">
          <h2>4. Sistema de Monedas y Regalos</h2>
          <p>
            Las monedas virtuales y los regalos en StreamHub son de uso exclusivo dentro de la plataforma. No tienen valor monetario
            real y no pueden ser intercambiados por dinero en efectivo. StreamHub se reserva el derecho de modificar el sistema
            de monedas y regalos en cualquier momento sin previo aviso.
          </p>
        </section>

        <section className="t-block">
          <h2>5.Conducta del Usuario</h2>
          <p>Los usuarios deben comportarse de manera respetuosa y apropiada. Está prohibido:</p>
          <ul>
            <li>Acosar, intimidar o amenazar a otros usuarios.</li>
            <li>Publicar contenido ofensivo, ilegal o inapropiado.</li>
            <li>Hacer spam o publicidad no autorizada.</li>
            <li>Intentar vulnerar la seguridad o el funcionamiento de la plataforma.</li>
            <li>Usar bots o automatización no autorizada.</li>
          </ul>
        </section>

        <section className="t-block">
          <h2>6. Contenido del Usuario</h2>
          <p>
            Los usuarios conservan los derechos sobre el contenido que transmiten o publican enStreams. Sin embargo, al
            publicarlo, usted otorga a Streams una licencia mundial, no exclusiva y libre de regalías para usar, reproducir y
            distribuir dicho contenido en relación con el servicio.
          </p>
        </section>

        <section className="t-block">
          <h2>7. Terminación de Cuenta</h2>
          <p>
            En  Tinamo reserva el derecho de suspender o terminar su cuenta en cualquier momento si se determina que ha violado
            estos Términos y Condiciones o si causa perjuicios a otros usuarios o a la plataforma.
          </p>
        </section>

        <section className="t-block">
          <h2>8. Limitación de Responsabilidad</h2>
          <p>
            En ningún caso Streams o sus proveedores serán responsables por daños indirectos, incidentales o consecuentes
            derivados del uso o imposibilidad de uso de la plataforma, incluso si se ha notificado la posibilidad de dichos daños.
          </p>
        </section>

        <section className="t-block">
          <h2>9. Cambios en los Términos</h2>
          <p>
            Podremos revisar estos términos en cualquier momento sin previo aviso. Al utilizar este servicio, usted acepta quedar
            sujeto a la versión vigente de los Términos y Condiciones.
          </p>
        </section>

        <section className="t-block">
          <h2>10. Contacto</h2>
          <p>
            Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de soporte@streamhub.example.
          </p>
        </section>
      </article>
    </div>
  );
}
