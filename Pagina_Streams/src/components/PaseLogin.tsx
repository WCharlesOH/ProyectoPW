

export type UserRole = "viewer" | "streamer"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  coins: number
  level: number
  points: number
  streamingHours: number
  createdAt: string
}

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
    createdAt: "24/01/2019"
}

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
    createdAt: "24/01/2019"
}

export function login(email:string, password:string):{success: boolean; error?:string; user?:User}{
    const usuarios: User[] = [];
    usuarios.push(User1,User2)
    const user = usuarios.find((p) => p.email == email && p.password == password)

    if (!user) {
        return { success: false, error: "Correo o contraseña incorrectos" }
    }
    
    return { success: true, user }
}