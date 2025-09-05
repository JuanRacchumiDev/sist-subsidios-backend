export type AuthCredenciales = {
    email?: string
    username?: string
    password?: string
}

export type AuthResponse = {
    result: boolean
    message?: string
    token?: string
    status: number
    usuario?: {
        idUsuario?: string
        username?: string
        nombrePerfil?: string
        slugPerfil?: string
        nombreCompletoUsuario?: string
    }
    error?: string,
    codigoTemp?: string
}