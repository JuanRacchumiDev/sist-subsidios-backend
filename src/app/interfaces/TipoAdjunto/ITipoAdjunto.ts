export interface ITipoAdjunto {
    id?: string
    nombre?: string
    extensiones?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoAdjuntoResponse {
    result?: boolean
    message?: string
    data?: ITipoAdjunto | ITipoAdjunto[]
    error?: string
    status?: number
}