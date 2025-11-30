import type {dataprops} from "../pages/Login"



export type datapropsRole = "viewer" | "streamer";



/* --- Helpers de almacenamiento --- */
const LS_KEY = "registereddatapropss";

/** Devuelve la lista de usuarios registrados en localStorage (si no hay, []) */
export function getRegistereddatapropss(Usuarios: dataprops[]): dataprops[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
const users : dataprops[] = []

/** Guarda la lista completa en localStorage */
export function setRegistereddatapropss(user: dataprops) {

    users.push(user)
  localStorage.setItem(LS_KEY, JSON.stringify(users));
}

/** Todos los usuarios disponibles: hardcodeados + registrados */
export function getAlldatapropss(): dataprops[] {
  const locals = getRegistereddatapropss();
  return [...locals];
}

