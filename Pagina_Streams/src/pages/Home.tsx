import { Link } from "react-router-dom";
import "./Home.css";

interface Item {
  id: string;
  titulo: string;
  categoria: string;
  visitas: string;
  imagen: string;
  autor: string;
  etiquetas?: string[];
}

interface InicioLogeadoProps {
  sidebarAbierto?: boolean;
}

const ITEMS_RECOMENDADOS: Item[] = [
  { 
    id: "1", 
    titulo: "Transmisión en directo", 
    categoria: "Juegos", 
    visitas: "1.7 k", 
    imagen: "#", 
    autor: "Usuario1", 
    etiquetas: ["Español"] 
  },
  { 
    id: "2", 
    titulo: "Jugando en línea", 
    categoria: "Juegos", 
    visitas: "332", 
    imagen: "#", 
    autor: "Usuario2", 
    etiquetas: ["Competitivo"] 
  },
  { 
    id: "3", 
    titulo: "Charla comunitaria", 
    categoria: "Charlas", 
    visitas: "181", 
    imagen: "#", 
    autor: "Usuario3" 
  },
];

export default function InicioLogeado({ sidebarAbierto = true }: InicioLogeadoProps) {
  return (
    <div className={`home-page ${sidebarAbierto ? "home-page--sidebar" : "home-page--compact"}`}>

      {/* Sección principal */}
      <section className="hero-grid">
        <div className="hero-grid__featured">Contenido destacado</div>

        <div className="hero-grid__card">
          <div className="hero-grid__card-top">
            <div className="hero-grid__avatar" />
            <div className="hero-grid__user-copy">
              <div className="hero-grid__user-name">UsuarioPopular</div>
              <div className="hero-grid__user-status">Transmitiendo ahora</div>
              <div className="hero-grid__user-viewers">150 espectadores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección recomendados */}
      <section>
        <h2 className="section-title">Recomendados para ti</h2>

        <div className="recommendations">
          {ITEMS_RECOMENDADOS.map((item) => (
            <div key={item.id} className="recommendations__item">
              <Link to={`/canal/${item.id}`}>
                <div className="recommendations__thumb">
                  Imagen
                </div>
              </Link>

              <div className="recommendations__body">
                <div className="recommendations__meta">
                  <div className="recommendations__author-avatar" />
                  <div className="recommendations__info">
                    <Link to={`/canal/${item.id}`} className="recommendations__title">
                      {item.titulo}
                    </Link>
                    <div className="recommendations__channel">
                      {item.autor}
                    </div>
                    <div className="recommendations__details">
                      {item.visitas} visitas · {item.categoria}
                    </div>
                    {item.etiquetas && (
                      <div className="recommendations__tags">
                        {item.etiquetas.map((etiqueta) => (
                          <span key={etiqueta} className="recommendations__tag">
                            {etiqueta}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="home-page__footer">
          <Link to="/explorar" className="link-cta">
            Ver más
          </Link>
        </div>
      </section>
    </div>
  );
}