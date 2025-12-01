
export const API = {
    RegistoUsuario: async (name: string, password: string, email: string, imagen: string) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Registrar_Usuario", {
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
                const errorData = await response. json();
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Validar_Usuario", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    NombreUsuario: nombre,
                    Contraseña: password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData. error };
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Suscrito", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ID_Usuario: idUsuario }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, subscriptions: data };
        } catch (error) {
            console. error("Error al obtener suscripciones:", error);
            return { success: false, error: "Error al obtener suscripciones" };
        }
    },

    SuscripcionesCanal: async (idCanal: number) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/SuscripcioneMias", {
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
            if(idStreamer == idUsuario){
                return { success: false, error: "Error al crear nueva suscripción" };
            }
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Crear_Suscripcion", {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Eliminar_Suscripcion", {
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
            if(idStreamer == idviewer){
                return { success: false, error: "Error al crear nueva suscripción" };
            }
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Crear_ChatStreamer", {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/ObtenerDatosUsuario", {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/ObtenerDatosUsuarioNombre", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    NombreUsuario: nombreUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response. json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, user: data };
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            return { success: false, error: "Error al obtener datos del usuario" };
        }
    },

    ViendoDirecto: async (idUsuario: number, ID_Streamer: number, viendo: boolean, EnVIvo: string) => {
        try {
            if(ID_Streamer == idUsuario){
                return { success: false, error: "Error al crear nueva suscripción" };
            }
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/VIendoDirecto", {
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
                const errorData = await response. json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console. error("Error al editar datos del usuario:", error);
            return { success: false, error: "Error al editar datos del usuario" };
        }
    },

    ObtenerChatStreamer: async (idStreamer: number, idviewer: number) => {
        try {
            if(idStreamer == idviewer){
                return { success: false, error: "Error al crear nueva suscripción" };
            }
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/ObtenerDatosChat", {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Actualizar_NivelViewer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_ChatViewer: idViewer,
                    ID_chatStreamer: idStreamer,
                    NuevoNivel: nivel,
                }),
            });

            if (! response.ok) {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Actualizar_NivelStreams", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idStreamer,
                    NuevoNivel: nivel,
                }),
            });

            if (!response.ok) {
                const errorData = await response. json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console. error("Error al actualizar nivel del streamer:", error);
            return { success: false, error: "Error al actualizar nivel del streamer" };
        }
    },

    ActualizarHorasStreaming: async (idStreamer: number, horas: number) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Actualizar_HorasTransmision", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON. stringify({
                    ID_Usuario: idStreamer,
                    NuevasHoras: horas,
                }),
            });

            if (! response.ok) {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/UsuariosRanking");

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData. error };
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Asignar_Logro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idUsuario,
                    ID_LogroPlantilla: idLogro,
                    Completado: completado,
                }),
            });

            if (!response.ok) {
                const errorData = await response. json();
                return { success: false, error: errorData.error };
            }

            return { success: true };
        } catch (error) {
            console. error("Error al asignar logro al usuario:", error);
            return { success: false, error: "Error al asignar logro al usuario" };
        }
    },

    ObtenerLogrosUsuario: async (idUsuario: number) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/LogrosUsuario", {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/LogrosPlantilla");

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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Actualizar_Logro", {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Todos_Los_Logros", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response. json();
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Mas_Vistos");

            if (!response.ok) {
                const errorData = await response. json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, streamers: data };
        } catch (error) {
            console. error("Error al obtener los streamers más vistos:", error);
            return { success: false, error: "Error al obtener los streamers más vistos" };
        }
    },

    SeguidosEnVIvo: async (idUsuario: number) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/SeguidosEnVIvo", {
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
            console. error("Error al obtener los streamers seguidos:", error);
            return { success: false, error: "Error al obtener los streamers seguidos" };
        }
    },

    ActualizarEnVivo: async (idStreamer: number, EnVIvo: string) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Actualizar_Estado_EnVivo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idStreamer,
                    EnVivo: EnVIvo,
                }),
            });

            if (! response.ok) {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Actualizar_Monedas", {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/datos_Stream",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Usuario: idusuario
                })
            })

            if (! response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json()
            return {success: true, data:data}
        } catch(error) {
            console.error("Error al obtener datos del stream:", error);
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Crear_VIdeo", {
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
            console.error("Error al crear video:", error);
            return { success: false, error: "Error al crear video" };
        }
    },

    VincularJuegoVideo: async (
        ID_Juego: number,
        ID_Video: number
    ) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Vincular_Juego_Video", {
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
                return { success: false, error: errorData. error };
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Actualizar_Video", {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Eliminar_Video", {
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
    icono: string,
    idStreamer: number
) => {
    try {
        const response = await fetch("https://proyectobackend-a8nt.onrender.com/regalos/crear", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                NombreRegalo,
                PrecioRegalo,
                DescripcionRegalo,
                icono,
                ID_Streamer: idStreamer
            })
        });

        if (!response.ok) {
            const errorData = await response. json();
            return { success: false, error: errorData.error };
        }

        return { success: true };

    } catch (error) {
        console.error("Error al crear regalo:", error);
        return { success: false, error: "Error de conexión" };
    }
},

    EliminarRegalo: async (nombre: string) => {
        try {
            const response = await fetch(`https://proyectobackend-a8nt.onrender.com/regalos/eliminar? nombre=${encodeURIComponent(nombre)}`);

            if (!response. ok) {
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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/regalos/actualizar", {
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

            if (!response. ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            return { success: true };

        } catch (error) {
            console.error("Error actualizando regalo:", error);
            return { success: false, error: "Error actualizando regalo" };
        }
    },

  ObtenerRegalosGestionar: async (ID: number) => {
    try {
        const response = await fetch(`https://proyectobackend-a8nt.onrender.com/regalosbyMirko?ID=${ID}`);

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

    ObtenerRegalos: async (ID: number) => {
        try {
            const response = await fetch(`https://proyectobackend-a8nt.onrender.com/regalos`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: ID
                })
            });
            
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
            const response = await fetch(`https://proyectobackend-a8nt.onrender.com/videos/buscar?q=${encodeURIComponent(texto)}`);

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
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Mas_Visto");
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
    },

    ContarEspectadoresActuales: async (idStreamer: number) => {
    try {
        const response = await fetch("https://proyectobackend-a8nt.onrender.com/Contar_Espectadores_Actuales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ID_Streamer: idStreamer,
            }),
        });

        if (!response.ok) {
            const errorData = await response. json();
            return { success: false, error: errorData.error };
        }

        const data = await response.json();
        return { success: true, espectadores: data.espectadores };
        } catch (error) {
            console.error("Error al contar espectadores actuales:", error);
            return { success: false, error: "Error al contar espectadores actuales" };
        }
    },

    ContarSeguidoresTotales: async (idStreamer: number) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Contar_Seguidores_Totales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Streamer: idStreamer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData. error };
            }

            const data = await response.json();
            return { success: true, seguidores: data.seguidores };
        } catch (error) {
            console.error("Error al contar seguidores totales:", error);
            return { success: false, error: "Error al contar seguidores totales" };
        }
    },

    EstadisticasStreamer: async (idStreamer: number) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Estadisticas_Streamer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Streamer: idStreamer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { 
                success: true, 
                streamer: data.streamer,
                estadisticas: data.estadisticas 
            };
        } catch (error) {
            console.error("Error al obtener estadísticas del streamer:", error);
            return { success: false, error: "Error al obtener estadísticas del streamer" };
        }
    },

    ListaEspectadoresActuales: async (idStreamer: number) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Lista_Espectadores_Actuales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ID_Streamer: idStreamer,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { 
                success: true, 
                totalEspectadores: data.totalEspectadores,
                espectadores: data.espectadores 
            };
        } catch (error) {
            console.error("Error al obtener lista de espectadores:", error);
            return { success: false, error: "Error al obtener lista de espectadores" };
        }
    },

    TopStreamersPorEspectadores: async () => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/Top_Streamers_Por_Espectadores");

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData. error };
            }

            const data = await response.json();
            return { 
                success: true, 
                total: data.total,
                streamers: data.streamers 
            };
        } catch (error) {
            console.error("Error al obtener top streamers:", error);
            return { success: false, error: "Error al obtener top streamers" };
        }
    },

    ObtenerJuegos: async () => {
    try {
        const response = await fetch("https://proyectobackend-a8nt.onrender.com/ObtenerJuegos");

        if (!response.ok) {
            const errorData = await response.json();
            return { success: false, error: errorData. error };
        }

        const data = await response.json();
        return { success: true, juegos: data };
    } catch (error) {
        console.error("Error al obtener juegos:", error);
        return { success: false, error: "Error al obtener juegos" };
    }
},

    StreamersPorJuego: async (nombreJuego: string) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/StreamersPorJuego", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    NombreJuego: nombreJuego,
                }),
            });

            if (!response.ok) {
                const errorData = await response. json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { success: true, streamers: data.streamers, total: data.totalStreamers };
        } catch (error) {
            console.error("Error al obtener streamers por juego:", error);
            return { success: false, error: "Error al obtener streamers por juego" };
        }
    },

    // ============================================
    // NUEVAS FUNCIONES DE VDO. NINJA STREAMING
    // ============================================

    // Crear/Obtener sala de streaming para un streamer
    CrearSalaStreaming: async (streamerName: string, password?: string) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/api/stream/room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    streamerName,
                    password
                }),
            });

            if (!response. ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response. json();
            return { 
                success: true, 
                roomId: data.roomId,
                broadcasterUrl: data.broadcasterUrl,
                viewerUrl: data.viewerUrl,
                isLive: data.isLive,
                streamerName: data.streamerName
            };
        } catch (error) {
            console.error("Error al crear sala de streaming:", error);
            return { success: false, error: "Error al crear sala de streaming" };
        }
    },

    // Iniciar transmisión en vivo
    IniciarStream: async (streamerName: string, title?: string, category?: string) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/api/stream/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    streamerName,
                    title,
                    category
                }),
            });

            if (! response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { 
                success: true, 
                stream: data.stream,
                message: data.message
            };
        } catch (error) {
            console.error("Error al iniciar stream:", error);
            return { success: false, error: "Error al iniciar stream" };
        }
    },

    // Detener transmisión en vivo
    DetenerStream: async (streamerName: string) => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/api/stream/stop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    streamerName
                }),
            });

            if (! response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { 
                success: true, 
                message: data.message
            };
        } catch (error) {
            console.error("Error al detener stream:", error);
            return { success: false, error: "Error al detener stream" };
        }
    },

    // Obtener estado del stream de un streamer
    ObtenerEstadoStream: async (streamerName: string) => {
        try {
            const response = await fetch(`https://proyectobackend-a8nt.onrender.com/api/stream/status/${streamerName}`);

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { 
                success: true, 
                exists: data.exists,
                isLive: data.isLive,
                roomId: data.roomId,
                viewerUrl: data.viewerUrl,
                streamerName: data.streamerName,
                title: data.title,
                category: data.category,
                startedAt: data.startedAt
            };
        } catch (error) {
            console.error("Error al obtener estado del stream:", error);
            return { success: false, error: "Error al obtener estado del stream" };
        }
    },

    // Listar todos los streams activos
    ObtenerStreamsActivos: async () => {
        try {
            const response = await fetch("https://proyectobackend-a8nt.onrender.com/api/streams/live");

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }

            const data = await response.json();
            return { 
                success: true, 
                count: data.count,
                streams: data.streams
            };
        } catch (error) {
            console.error("Error al obtener streams activos:", error);
            return { success: false, error: "Error al obtener streams activos" };
        }
    },

};