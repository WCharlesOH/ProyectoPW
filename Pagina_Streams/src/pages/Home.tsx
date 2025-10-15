import { Link } from "react-router-dom";

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
  // Ajustar el padding según si el sidebar está abierto o cerrado
  const paddingLeft = sidebarAbierto ? "270px" : "60px";
  
  return (
    <div 
    style={{ 
      padding: "20px", 
      paddingLeft: paddingLeft,
      color: "#fff", 
      background: "#18181b", 
      minHeight: "100vh",
      transition: "padding-left 0.3s ease"
    }}>
      
      {/* Sección principal */}
      <section style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ 
          flex: 2, 
          background: "#0e0e10", 
          borderRadius: "8px", 
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid #333"
        }}>
          Contenido destacado
        </div>
        
        <div style={{ 
          flex: 1, 
          background: "#0e0e10", 
          borderRadius: "8px", 
          padding: "15px",
          border: "1px solid #333"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#333"
            }} />
            <div>
              <div style={{ color: "#00b7ff", fontWeight: "bold" }}>UsuarioPopular</div>
              <div style={{ color: "#aaa", fontSize: "14px" }}>Transmitiendo ahora</div>
              <div style={{ color: "#aaa", fontSize: "12px" }}>150 espectadores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección recomendados */}
      <section>
        <h2 style={{ color: "#fff", marginBottom: "15px" }}>
          Recomendados para ti
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "15px"
        }}>
          {ITEMS_RECOMENDADOS.map((item) => (
            <div key={item.id} style={{
              background: "#0e0e10",
              borderRadius: "8px",
              overflow: "hidden",
              border: "1px solid #333"
            }}>
              <Link to={`/canal/${item.id}`}>
                <div style={{
                  height: "140px",
                  background: "#1f1f23",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#777"
                }}>
                  Imagen
                </div>
              </Link>

              <div style={{ padding: "12px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#333"
                  }} />
                  <div style={{ flex: 1 }}>
                    <Link to={`/canal/${item.id}`} style={{ 
                      color: "#fff", 
                      textDecoration: "none",
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "5px"
                    }}>
                      {item.titulo}
                    </Link>
                    <div style={{ color: "#aaa", fontSize: "13px" }}>
                      {item.autor}
                    </div>
                    <div style={{ color: "#aaa", fontSize: "12px" }}>
                      {item.visitas} visitas · {item.categoria}
                    </div>
                    {item.etiquetas && (
                      <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                        {item.etiquetas.map((etiqueta) => (
                          <span key={etiqueta} style={{
                            fontSize: "11px",
                            color: "#ddd",
                            background: "#333",
                            padding: "2px 8px",
                            borderRadius: "10px"
                          }}>
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

        <div style={{ textAlign: "right", marginTop: "15px" }}>
          <Link to="/explorar" style={{ color: "#00b7ff", textDecoration: "none" }}>
            Ver más
          </Link>
        </div>
      </section>
    </div>
  );
}