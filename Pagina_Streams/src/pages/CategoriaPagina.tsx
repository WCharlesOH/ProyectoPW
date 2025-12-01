import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Canal {
  id: string;
  nombre: string;
  titulo: string;
  espectadores: number;
  thumbnailUrl: string;
  avatarUrl: string;
  enVivo: boolean;
}

interface CategoriaPaginaProps {
  sidebarAbierto?: boolean;
}

export default function CategoriaPagina({ sidebarAbierto = true }: CategoriaPaginaProps) {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const [canales, setCanales] = useState<Canal[]>([]);
  const [nombreCategoria, setNombreCategoria] = useState<string>("");
  const paddingLeft = sidebarAbierto ? "0px" : "60px";

  useEffect(() => {
    // TODO: Reemplazar con llamada real al backend
    // fetch(`http://localhost:5000/api/categorias/${categoriaId}/canales`)
    //   . then(res => res.json())
    //   .then(data => setCanales(data))
    //   .catch(err => console.error('Error al cargar canales:', err));

    // Datos de prueba
    const categoriasMap: { [key: string]: string } = {
      "1": "Just Chatting",
      "2": "League of Legends",
      "3": "Fortnite",
      "4": "Valorant",
      "5": "Minecraft",
      "6": "GTA V",
      "7": "Counter-Strike 2",
      "8": "Apex Legends",
    };

    setNombreCategoria(categoriasMap[categoriaId || "1"] || "Categoría");

    // Canales de prueba
    const canalesPrueba: Canal[] = [
      {
        id: "1",
        nombre: "StreamerPro",
        titulo: `Jugando ${categoriasMap[categoriaId || "1"]} - ¡Vamos por la victoria!`,
        espectadores: 15420,
        thumbnailUrl: "",
        avatarUrl: "",
        enVivo: true,
      },
      {
        id: "2",
        nombre: "GamerElite",
        titulo: `${categoriasMap[categoriaId || "1"]} con subs - ! regalos ! sorteo`,
        espectadores: 8934,
        thumbnailUrl: "",
        avatarUrl: "",
        enVivo: true,
      },
      {
        id: "3",
        nombre: "LiveMaster",
        titulo: `Stream nocturno de ${categoriasMap[categoriaId || "1"]} - Chill vibes`,
        espectadores: 5621,
        thumbnailUrl: "",
        avatarUrl: "",
        enVivo: true,
      },
    ];

    setCanales(canalesPrueba);
  }, [categoriaId]);

  return (
    <div
      style={{
        padding: "20px",
        paddingLeft,
        color: "#fff",
        background: "#18181b",
        minHeight: "100vh",
        transition: "padding-left 0.3s ease",
      }}
    >
      <section style={{ marginBottom: "30px" }}>
        <Link 
          to="/explorar" 
          style={{ 
            color: "#9147ff", 
            textDecoration: "none", 
            fontSize: "14px",
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >
          ← Volver a Explorar
        </Link>
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "bold", marginBottom: "10px" }}>
          {nombreCategoria}
        </h1>
        <p style={{ color: "#adadb8", fontSize: "14px" }}>
          Canales transmitiendo en vivo
        </p>
      </section>

      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {canales.map((canal) => (
            <Link
              key={canal.id}
              to={`/canal/${canal.nombre}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#0e0e10",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style. transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  e. currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={canal.thumbnailUrl}
                    alt={canal.titulo}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://static-cdn. jtvnw.net/ttv-static/404_preview-320x180.jpg";
                    }}
                  />
                  {canal.enVivo && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "#eb0400",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      EN VIVO
                    </div>
                  )}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {canal.espectadores. toLocaleString()} espectadores
                  </div>
                </div>

                <div style={{ padding: "12px", display: "flex", gap: "10px" }}>
                  <img
                    src={canal.avatarUrl}
                    alt={canal.nombre}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://static-cdn. jtvnw.net/user-default-pictures-uv/13e5fa74-defa-11e9-809c-784f43822e80-profile_image-70x70. png";
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {canal.titulo}
                    </div>
                    <div style={{ color: "#adadb8", fontSize: "13px" }}>
                      {canal.nombre}
                    </div>
                    <div style={{ color: "#adadb8", fontSize: "12px", marginTop: "4px" }}>
                      {nombreCategoria}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {canales.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#adadb8",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>📺</div>
            <h2 style={{ fontSize: "20px", marginBottom: "10px" }}>
              No hay canales transmitiendo en este momento
            </h2>
            <p style={{ fontSize: "14px" }}>
              Intenta explorar otras categorías
            </p>
          </div>
        )}
      </section>
    </div>
  );
}