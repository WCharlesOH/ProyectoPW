import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./ResultadosBusqueda.css";

// Interfaces
interface Usuario {
  ID: number;
  NombreUsuario: string;
  ImagenPerfil: string;
  NivelStreams: number;
  EnVivo: boolean;
}

interface Categoria {
  ID_Juego: number;
  Nombre: string;
  Imagen: string | null;
}

interface Video {
  ID_Video: number;
  Titulo: string;
  CategoriaDeVideo: string;
  Url: string;
  usuario: {
    ID: number;
    NombreUsuario: string;
    ImagenPerfil: string;
  };
}

interface ResultadosBusqueda {
  query: string;
  resultados: {
    usuarios: Usuario[];
    categorias: Categoria[];
    videos: Video[];
  };
  total: number;
}

type TabActiva = "todos" | "usuarios" | "categorias" | "videos";

export default function ResultadosBusquedaPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [resultados, setResultados] = useState<ResultadosBusqueda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState<TabActiva>("todos");

  // URL de tu API backend
  const API_URL = import.meta.env. VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    if (! query) {
      setLoading(false);
      return;
    }

    const buscar = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/buscar?q=${encodeURIComponent(query)}`);
        
        if (!response. ok) {
          throw new Error("Error al realizar la búsqueda");
        }

        const data: ResultadosBusqueda = await response.json();
        setResultados(data);
      } catch (err) {
        console.error("Error en búsqueda:", err);
        setError("Ocurrió un error al buscar.  Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    buscar();
  }, [query, API_URL]);

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="busqueda-container">
        <div className="busqueda-loading">
          <div className="spinner"></div>
          <p>Buscando "{query}"...</p>
        </div>
      </div>
    );
  }

  // Sin query
  if (!query) {
    return (
      <div className="busqueda-container">
        <div className="busqueda-empty">
          <h2>🔍 Realiza una búsqueda</h2>
          <p>Escribe algo en la barra de búsqueda para encontrar usuarios, categorías y transmisiones.</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="busqueda-container">
        <div className="busqueda-error">
          <h2>❌ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Sin resultados
  if (! resultados || resultados.total === 0) {
    return (
      <div className="busqueda-container">
        <div className="busqueda-empty">
          <h2>😕 Sin resultados</h2>
          <p>No encontramos resultados para "{query}"</p>
          <p className="busqueda-sugerencia">Intenta con otros términos de búsqueda</p>
        </div>
      </div>
    );
  }

  const { usuarios, categorias, videos } = resultados. resultados;

  // Filtrar resultados según tab activa
  const mostrarUsuarios = tabActiva === "todos" || tabActiva === "usuarios";
  const mostrarCategorias = tabActiva === "todos" || tabActiva === "categorias";
  const mostrarVideos = tabActiva === "todos" || tabActiva === "videos";

  return (
    <div className="busqueda-container">
      {/* Header */}
      <div className="busqueda-header">
        <h1>Resultados para "{query}"</h1>
        <p className="busqueda-count">{resultados.total} resultados encontrados</p>
      </div>

      {/* Tabs */}
      <div className="busqueda-tabs">
        <button 
          className={`busqueda-tab ${tabActiva === "todos" ? "activa" : ""}`}
          onClick={() => setTabActiva("todos")}
        >
          Todos ({resultados.total})
        </button>
        <button 
          className={`busqueda-tab ${tabActiva === "usuarios" ? "activa" : ""}`}
          onClick={() => setTabActiva("usuarios")}
        >
          Usuarios ({usuarios. length})
        </button>
        <button 
          className={`busqueda-tab ${tabActiva === "categorias" ? "activa" : ""}`}
          onClick={() => setTabActiva("categorias")}
        >
          Categorías ({categorias.length})
        </button>
        <button 
          className={`busqueda-tab ${tabActiva === "videos" ? "activa" : ""}`}
          onClick={() => setTabActiva("videos")}
        >
          Videos ({videos.length})
        </button>
      </div>

      {/* Resultados */}
      <div className="busqueda-resultados">
        
        {/* Usuarios */}
        {mostrarUsuarios && usuarios.length > 0 && (
          <section className="busqueda-seccion">
            <h2 className="busqueda-seccion-titulo">👤 Usuarios</h2>
            <div className="busqueda-grid usuarios-grid">
              {usuarios.map((usuario) => (
                <Link 
                  to={`/canal/${usuario.NombreUsuario}`} 
                  key={usuario.ID}
                  className="usuario-card"
                >
                  <div className="usuario-avatar-container">
                    <img 
                      src={usuario. ImagenPerfil || "/default-avatar.png"} 
                      alt={usuario.NombreUsuario}
                      className="usuario-avatar"
                    />
                    {usuario.EnVivo && (
                      <span className="usuario-en-vivo">EN VIVO</span>
                    )}
                  </div>
                  <div className="usuario-info">
                    <h3 className="usuario-nombre">{usuario.NombreUsuario}</h3>
                    <p className="usuario-nivel">Nivel {usuario.NivelStreams}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Categorías */}
        {mostrarCategorias && categorias.length > 0 && (
          <section className="busqueda-seccion">
            <h2 className="busqueda-seccion-titulo">🎮 Categorías</h2>
            <div className="busqueda-grid categorias-grid">
              {categorias. map((categoria) => (
                <Link 
                  to={`/categoria/${categoria.ID_Juego}`} 
                  key={categoria.ID_Juego}
                  className="categoria-card"
                >
                  <div className="categoria-imagen-container">
                    {categoria.Imagen ?  (
                      <img 
                        src={categoria. Imagen} 
                        alt={categoria. Nombre}
                        className="categoria-imagen"
                      />
                    ) : (
                      <div className="categoria-placeholder">
                        🎮
                      </div>
                    )}
                  </div>
                  <div className="categoria-info">
                    <h3 className="categoria-nombre">{categoria.Nombre}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {mostrarVideos && videos.length > 0 && (
          <section className="busqueda-seccion">
            <h2 className="busqueda-seccion-titulo">🎬 Videos y Transmisiones</h2>
            <div className="busqueda-grid videos-grid">
              {videos.map((video) => (
                <Link 
                  to={`/video/${video. ID_Video}`} 
                  key={video.ID_Video}
                  className="video-card"
                >
                  <div className="video-thumbnail">
                    <div className="video-thumbnail-placeholder">
                      ▶️
                    </div>
                  </div>
                  <div className="video-info">
                    <h3 className="video-titulo">{video.Titulo}</h3>
                    <div className="video-meta">
                      <img 
                        src={video.usuario.ImagenPerfil || "/default-avatar.png"} 
                        alt={video.usuario. NombreUsuario}
                        className="video-usuario-avatar"
                      />
                      <span className="video-usuario-nombre">{video.usuario. NombreUsuario}</span>
                    </div>
                    <div className="video-categorias">
                      {video.CategoriaDeVideo.split(", ").map((cat, idx) => (
                        <span key={idx} className="video-categoria-tag">{cat}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}