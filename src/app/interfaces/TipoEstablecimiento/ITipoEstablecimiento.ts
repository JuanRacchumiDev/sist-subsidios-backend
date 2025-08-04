export interface ITipoEstablecimiento {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoEstablecimientoResponse {
    result: boolean
    message?: string
    data?: ITipoEstablecimiento | ITipoEstablecimiento[]
    error?: string
    status?: number
}