export interface ICargo {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface CargoResponse {
    result: boolean
    message?: string
    data?: ICargo | ICargo[]
    error?: string
    status?: number
}