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
        id_usuario?: string
        id_empresa?: string
        id_colaborador?: string
        username?: string
        nombre_perfil?: string
        slug_perfil?: string
        nombre_completo?: string
    }
    error?: string,
    codigo_temp?: string
}