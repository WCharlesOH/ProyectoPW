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
const tabId = `tab_${Date.now()}_${Math.random().toString(36). substr(2, 9)}`;

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

// Función mejorada para mensajes de chat
export const emitirMensajeChat = (mensaje: any) => {
  const evento: EventoChat = {
    tipo: "chat",
    mensaje: {
      ... mensaje,
      tabId // Identificar pestaña de origen
    },
    tabId
  };
  canalChat.postMessage(evento);
};

// Función mejorada para estado del stream (acepta cualquier objeto)
export const emitirStream = (datos: any) => {
  canalStream.postMessage(datos);
};

// Nueva: Obtener ID de la pestaña actual
export const obtenerTabId = () => tabId;

// Nueva: Sincronizar monedas entre pestañas
export const emitirMonedas = (nuevasMonedas: number) => {
  emitirActividad(`🪙 Monedas actualizadas: ${nuevasMonedas}`, "monedas", { monedas: nuevasMonedas });
};

// Nueva: Sincronizar regalos
export const emitirRegalo = (regalo: string, costo: number) => {
  emitirActividad(`🎁 Regalo enviado: ${regalo}`, "regalo", { regalo, costo });
};


// FUNCIONES DE SUSCRIPCIÓN


/**
 * Suscribirse a eventos de actividad
 */
export const suscribirActividad = (callback: (mensaje: string) => void) => {
  const handler = (event: MessageEvent) => {
    const data = event.data as EventoActividad;
    if (data && data.texto) {
      callback(data. texto);
    }
  };
  
  canalActividad.addEventListener('message', handler);
  
  return {
    unsubscribe: () => {
      canalActividad.removeEventListener('message', handler);
    }
  };
};

/**
 * Suscribirse a eventos del stream
 */
export const suscribirStream = (callback: (datos: any) => void) => {
  const handler = (event: MessageEvent) => {
    callback(event.data);
  };
  
  canalStream. addEventListener('message', handler);
  
  return {
    unsubscribe: () => {
      canalStream.removeEventListener('message', handler);
    }
  };
};

/**
 * Suscribirse a mensajes del chat
 */
export const suscribirChat = (callback: (mensaje: any) => void) => {
  const handler = (event: MessageEvent) => {
    const data = event.data as EventoChat;
    if (data && data. mensaje) {
      callback(data.mensaje);
    }
  };
  
  canalChat.addEventListener('message', handler);
  
  return {
    unsubscribe: () => {
      canalChat.removeEventListener('message', handler);
    }
  };
};