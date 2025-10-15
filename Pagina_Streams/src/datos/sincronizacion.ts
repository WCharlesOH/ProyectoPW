// Sistema de sincronización mejorado entre pestañas
// Usando BroadcastChannel nativo del navegador

export interface EventoActividad {
  tipo: "actividad";
  texto: string;
  categoria?: "chat" | "monedas" | "regalo" | "sistema" | "stream";
  fecha: number;
  datos?: any;
}

export interface EventoChat {
  tipo: "chat";
  mensaje: any;
  tabId: string;
}

export interface EventoStream {
  tipo: "stream";
  activo: boolean;
  tiempoInicio?: number;
  duracion?: number;
}

// Canales de comunicación
export const canalChat = new BroadcastChannel("canal_chat");
export const canalActividad = new BroadcastChannel("canal_actividad");
export const canalStream = new BroadcastChannel("canal_stream");

// IDs únicos por pestaña para evitar bucles
const tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// 🔥 Función mejorada para emitir actividad
export const emitirActividad = (
  texto: string,
  categoria: EventoActividad["categoria"] = "sistema",
  datos?: any
) => {
  const evento: EventoActividad = {
    tipo: "actividad",
    texto,
    categoria,
    fecha: Date.now(),
    datos
  };
  canalActividad.postMessage(evento);
};

// 🔥 Función mejorada para mensajes de chat
export const emitirMensajeChat = (mensaje: any) => {
  const evento: EventoChat = {
    tipo: "chat",
    mensaje: {
      ...mensaje,
      tabId // Identificar pestaña de origen
    },
    tabId
  };
  canalChat.postMessage(evento);
};

// 🔥 Función mejorada para estado del stream
export const emitirStream = (activo: boolean, tiempoInicio?: number, duracion?: number) => {
  const evento: EventoStream = {
    tipo: "stream",
    activo,
    tiempoInicio,
    duracion
  };
  canalStream.postMessage(evento);
};

// 🔥 Nueva: Obtener ID de la pestaña actual
export const obtenerTabId = () => tabId;

// 🔥 Nueva: Sincronizar monedas entre pestañas
export const emitirMonedas = (nuevasMonedas: number) => {
  emitirActividad(`🪙 Monedas actualizadas: ${nuevasMonedas}`, "monedas", { monedas: nuevasMonedas });
};

// 🔥 Nueva: Sincronizar regalos
export const emitirRegalo = (regalo: string, costo: number) => {
  emitirActividad(`🎁 Regalo enviado: ${regalo}`, "regalo", { regalo, costo });
};
