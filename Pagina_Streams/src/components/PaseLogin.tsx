export type UserRole = "viewer" | "streamer";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  coins: number;
  level: number;
  points: number;
  streamingHours: number;
  createdAt: string;
}

/* Usuarios de ejemplo (pueden quedarse para pruebas) */
const User1: User = {
  id: "123s",
  name: "Holas",
  email: "a@gmail.com",
  password: "123456",
  role: "viewer",
  coins: 100,
  level: 1,
  points: 0,
  streamingHours: 0,
  createdAt: "2019-01-24",
};

const User2: User = {
  id: "123sq",
  name: "Rebolas",
  email: "b@gmail.com",
  password: "1000",
  role: "streamer",
  coins: 0,
  level: 1,
  points: 0,
  streamingHours: 0,
  createdAt: "2019-01-24",
};

/* --- Helpers de almacenamiento --- */
const LS_KEY = "registeredUsers";

/** Devuelve la lista de usuarios registrados en localStorage (si no hay, []) */
export function getRegisteredUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
  const users : User[] = [] 
/** Guarda la lista completa en localStorage */
export function setRegisteredUsers(user: User) {
  users.push(user)
  localStorage.setItem(LS_KEY, JSON.stringify(users));

}

/** Todos los usuarios disponibles: hardcodeados + registrados */
export function getAllUsers(): User[] {
  const locals = getRegisteredUsers();
  return [User1, User2, ...locals];
}

/** Login que busca en TODOS los usuarios */
export function login(
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const usuarios = getAllUsers();
  const user = usuarios.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return { success: false, error: "Correo o contraseña incorrectos" };
  }
  return { success: true, user };
}
