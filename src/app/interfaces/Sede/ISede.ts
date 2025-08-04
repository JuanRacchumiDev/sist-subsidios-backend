export interface ISede {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface SedeResponse {
    result: boolean
    message?: string
    data?: ISede | ISede[]
    error?: string
    status?: number
}