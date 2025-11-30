
export interface Regalo {
  id: number;
  nombre: string;
  costo: number;
  puntos: number;
}

export interface Usuario {
  ID: number,
  NombreUsuario: string,
  HorasTransmision: number,
  ImagenPerfil: string,
  Monedas: number,
  NivelStreams: number,
  Puntos: number
}

export interface Logro {
  ID: number,
  Nombre: string,
  descripcion: string,
  Puntaje: number
}

export interface ranking {
  ID: number,
  NombreUsuario: string,
  NivelStreams: number,
  ImagenPerfil: string,
}