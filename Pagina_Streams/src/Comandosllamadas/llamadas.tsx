import { data } from "react-router-dom";

export const API = {
    RegistoUsuario: async (name: string, password: string, email: string, imagen: string) => {
        try {
            const response = await fetch("http://localhost:5000/Registrar_Usuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    NombreUsuario: name,
                    email: email,
                    Contraseña: password,
                    ImagenPerfil: imagen,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
            const data = await response.json();
            return { success: true , data: data};
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return { success: false, error: "Error al registrar usuario" };
        }
    },

    LoginUsuario: async (nombre: string, password: string) => {
        try {
            const response = await fetch("http://localhost:5000/Validar_Usuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    NombreUsuario: nombre,
                    Contraseña: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, user: data };
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return { success: false, error: "Error al iniciar sesión" };
        }
    },

    MisSuscripciones: async (idUsuario: number) => {
        try {
            const response = await fetch("http://localhost:5000/Suscrito", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ID_Viewer: idUsuario }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, subscriptions: data };
        } catch (error) {
            console.error("Error al obtener suscripciones:", error);
            return { success: false, error: "Error al obtener suscripciones" };
        }
    },

    SuscripcionesCanal: async (idCanal: number) => {
        try {
            const response = await fetch("http://localhost:5000/SuscripcioneMias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ID_Streamer: idCanal }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, subscriptions: data };
        } catch (error) {
            console.error("Error al obtener suscripciones del canal:", error);
            return { success: false, error: "Error al obtener suscripciones del canal" };
        }
    },

    NuevaSuscripcion: async (idUsuario: number, idStreamer: number) => {
        try {
            const response = await fetch("http://localhost:5000/Crear_Suscripcion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Viewer: idUsuario,
                    ID_Streamer: idStreamer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al crear nueva suscripción:", error);
            return { success: false, error: "Error al crear nueva suscripción" };
        }
    },

    EliminarSuscripcion: async (idUsuario: number, idStreamer: number) => {
        try {
            const response = await fetch("http://localhost:5000/Eliminar_Suscripcion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Viewer: idUsuario,
                    ID_Streamer: idStreamer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al eliminar suscripción:", error);
            return { success: false, error: "Error al eliminar suscripción" };
        }
    },

    ChatStreamer: async (idStreamer: number, idviewer: number) => {
        try {
            const response = await fetch("http://localhost:5000/Crear_ChatStreamer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Streamer: idStreamer,
                    ID_Viewer: idviewer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, chat: data };
        } catch (error) {
            console.error("Error al obtener el chat del streamer:", error);
            return { success: false, error: "Error al obtener el chat del streamer" };
        }
    },

    ObtenerDatosUsuario: async (idUsuario: number) => {
        try {
            const response = await fetch("http://localhost:5000/ObtenerDatosUsuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, user: data };
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            return { success: false, error: "Error al obtener datos del usuario" };
        }
    },

    ObtenerDatosUsuarioNombre: async (nombreUsuario: string) => {
        try {
            const response = await fetch("http://localhost:5000/ObtenerDatosUsuarioNombre", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    NombreUsuario: nombreUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, user: data };
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            return { success: false, error: "Error al obtener datos del usuario" };
        }
    },

    ViendoDirecto: async (idUsuario: number, ID_Streamer: string, viendo: string, EnVIvo: string) => {
        try {
            const response = await fetch("http://localhost:5000/VIendoDirecto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_ChatViewer: idUsuario,
                    ID_chatStreamer: ID_Streamer,
                    Viendo: viendo,
                    EnVIvo: EnVIvo,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al editar datos del usuario:", error);
            return { success: false, error: "Error al editar datos del usuario" };
        }
    },

    ObtenerChatStreamer: async (idStreamer: number, idviewer: number) => {
        try {
            const response = await fetch("http://localhost:5000/ObtenerDatosChat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_chatStreamer: idStreamer,
                    ID_ChatViewer: idviewer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, chat: data };
        } catch (error) {
            console.error("Error al obtener el chat del streamer:", error);
            return { success: false, error: "Error al obtener el chat del streamer" };
        }
    },

    ActualizarNivelviewer: async (idViewer: number, nivel: number, idStreamer: number) => {
        try {
            const response = await fetch("http://localhost:5000/Actualizar_NivelViewer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_ChatViewer: idViewer,
                    ID_chatStreamer: idStreamer,
                    NuevoNivel: nivel,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al actualizar nivel y puntos del viewer:", error);
            return { success: false, error: "Error al actualizar nivel y puntos del viewer" };
        }
    },

    ActualizarNivelStreams: async (idStreamer: number, nivel: number) => {
        try {
            const response = await fetch("http://localhost:5000/Actualizar_NivelStreams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idStreamer,
                    NuevoNivel: nivel,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al actualizar nivel del streamer:", error);
            return { success: false, error: "Error al actualizar nivel del streamer" };
        }
    },

    ActualizarHorasStreaming: async (idStreamer: number, horas: number) => {
        try {
            const response = await fetch("http://localhost:5000/Actualizar_HorasTransmision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idStreamer,
                    NuevasHoras: horas,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al actualizar horas de streaming del streamer:", error);
            return { success: false, error: "Error al actualizar horas de streaming del streamer" };
        }
    },

    ObtenerRanking: async () => {
        try {
            const response = await fetch("http://localhost:5000/UsuariosRanking");

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, ranking: data };
        } catch (error) {
            console.error("Error al obtener el ranking de streamers:", error);
            return { success: false, error: "Error al obtener el ranking de streamers" };
        }
    },

    AsignarLogro: async (idUsuario: number, idLogro: number, completado: boolean) => {
        try {
            const response = await fetch("http://localhost:5000/Asignar_Logro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idUsuario,
                    ID_Logro: idLogro,
                    Completado: completado,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al asignar logro al usuario:", error);
            return { success: false, error: "Error al asignar logro al usuario" };
        }
    },

    ObtenerLogrosUsuario: async (idUsuario: number) => {
        try {
            const response = await fetch("http://localhost:5000/LogrosUsuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, logros: data };
        } catch (error) {
            console.error("Error al obtener logros del usuario:", error);
            return { success: false, error: "Error al obtener logros del usuario" };
        }
    },

    ObtenerTodosLogros: async () => {
        try {
            const response = await fetch("http://localhost:5000/LogrosPlantilla");

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, logros: data };
        } catch (error) {
            console.error("Error al obtener todos los logros:", error);
            return { success: false, error: "Error al obtener todos los logros" };
        }
    },

    Actualizar_Logros: async (idLogro: number, idusuario: string, completado: boolean) => {
        try {
            const response = await fetch("http://localhost:5000/Actualizar_Logro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Logro: idLogro,
                    ID_Usuario: idusuario,
                    Completado: completado,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al actualizar logro:", error);
            return { success: false, error: "Error al actualizar logro" };
        }
    },

    Ver_logrosMios: async (idUsuario: number) => {
        try {
            const response = await fetch("http://localhost:5000/Todos_Los_Logros", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, logros: data };
        } catch (error) {
            console.error("Error al ver logros mios:", error);
            return { success: false, error: "Error al ver logros mios" };
        }
    },

    MasVistos: async () => {
        try {
            const response = await fetch("http://localhost:5000/Mas_Vistos");

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, streamers: data };
        } catch (error) {
            console.error("Error al obtener los streamers más vistos:", error);
            return { success: false, error: "Error al obtener los streamers más vistos" };
        }
    },

    SeguidosEnVIvo: async (idUsuario: number) => {
        try {
            const response = await fetch("http://localhost:5000/SeguidosEnVIvo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, streamers: data };
        } catch (error) {
            console.error("Error al obtener los streamers seguidos:", error);
            return { success: false, error: "Error al obtener los streamers seguidos" };
        }
    },

    ActualizarEnVivo: async (idStreamer: number, EnVIvo: string) => {
        try {
            const response = await fetch("http://localhost:5000/Actualizar_Estado_EnVivo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idStreamer,
                    EnVivo: EnVIvo,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al actualizar estado en vivo del streamer:", error);
            return { success: false, error: "Error al actualizar estado en vivo del streamer" };
        }
    },

    ActualizarMonedas: async (idStreamer: number, nuevasMonedas: number) => {
        try {
            const response = await fetch("http://localhost:5000/Actualizar_Monedas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idStreamer,
                    NuevasMonedas: nuevasMonedas,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console.error("Error al actualizar monedas del streamer:", error);
            return { success: false, error: "Error al actualizar monedas del streamer" };
        }
    },
    DatosdelStream: async (idusuario: number) => {
        try{
            const response = await fetch("http://localhost:5000/datos_Stream",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idusuario
                })
            })

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json()
            return {success: true, data:data}
        } catch(error) {
            console.error("Error al actualizar monedas del streamer:", error);
            return { success: false, error: "Error al obtener datos del stream" };
        }
    },
    CrearVideo: async (
        Titulo: string,
        url: string,
        estado: boolean,
        categoriaDeVideo: string[],
        ID_Usuario: number
    ) => {
        try{
            const response = await fetch("http://localhost:5000/Crear_VIdeo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    titulo: Titulo,
                    url: url,
                    estado: estado,
                    categoriaDeVideo: categoriaDeVideo,
                    ID_Usuario: ID_Usuario
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return{success: true}

        } catch(error) {
            console.error("Error al actualizar monedas del streamer:", error);
            return { success: false, error: "Error al obtener datos del stream" };
        }
    },
    VincularJuegoVideo: async (
        ID_Juego: number,
        ID_Video: number
    ) => {
        try {
            const response = await fetch("http://localhost:5000/Vincular_Juego_Video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ID_Juego: ID_Juego,
                    ID_Video: ID_Video
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };

        } catch (error) {
            console.error("Error al vincular juego con video:", error);
            return { success: false, error: "Error en la vinculación" };
        }
    },
    ActualizarVideo: async (
        ID_Video: number,
        duracion: number,
        estado: boolean,
        categoriaDeVideo: string[]
    ) => {
        try {
            const response = await fetch("http://localhost:5000/Actualizar_Video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ID_Video: ID_Video,
                    duracion: duracion,
                    estado: estado,
                    categoriaDeVideo: categoriaDeVideo
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };

        } catch (error) {
            console.error("Error al actualizar video:", error);
            return { success: false, error: "Error actualizando video" };
        }
    },
    EliminarVideo: async (
        ID_Video: number
    ) => {
        try {
            const response = await fetch("http://localhost:5000/Eliminar_Video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ID_Video: ID_Video
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };

        } catch (error) {
            console.error("Error al eliminar video:", error);
            return { success: false, error: "Error eliminando video" };
        }
    },
    CrearRegalo: async (
        NombreRegalo: string,
        PrecioRegalo: number,
        DescripcionRegalo: string,
        icono: string
    ) => {
        try {
            const response = await fetch("http://localhost:5000/regalos/crear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    NombreRegalo,
                    PrecioRegalo,
                    DescripcionRegalo,
                    icono
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };

        } catch (error) {
            console.error("Error al crear regalo:", error);
            return { success: false, error: "Error creando regalo" };
        }
    },
    EliminarRegalo: async (nombre: string) => {
        try {
            const response = await fetch(`http://localhost:5000/regalos/eliminar?nombre=${encodeURIComponent(nombre)}`);

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };

        } catch (error) {
            console.error("Error eliminando regalo:", error);
            return { success: false, error: "Error eliminando regalo" };
        }
    },
    ActualizarRegalo: async (
        ID_Regalo: number,
        nuevoNombre: string,
        nuevoPrecio: number,
        DescripcionRegalo: string,
        icono: string
    ) => {
        try {
            const response = await fetch("http://localhost:5000/regalos/actualizar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ID_Regalo,
                    nuevoNombre,
                    nuevoPrecio,
                    DescripcionRegalo,
                    icono
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };

        } catch (error) {
            console.error("Error actualizando regalo:", error);
            return { success: false, error: "Error actualizando regalo" };
        }
    },
    ObtenerRegalos: async () => {
        try {
            const response = await fetch("http://localhost:5000/regalos");

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const datos = await response.json();
            return { success: true, data: datos };

        } catch (error) {
            console.error("Error obteniendo regalos:", error);
            return { success: false, error: "Error obteniendo regalos" };
        }
    },
    BuscarVideos: async (texto: string) => {
        try {
            const response = await fetch(`http://localhost:5000/videos/buscar?q=${encodeURIComponent(texto)}`);

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const datos = await response.json();
            return { success: true, data: datos };

        } catch (error) {
            console.error("Error buscando videos:", error);
            return { success: false, error: "Error buscando videos" };
        }
    },

    MasVisto : async () => {
        try {
            const response = await fetch("http://localhost:5000/Mas_Visto");
            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
            const datos = await response.json();
            return { success: true, data: datos };
        } catch (error) {   
            console.error("Error obteniendo videos más vistos:", error);
            return { success: false, error: "Error obteniendo videos más vistos" };
        }
    }       

};
