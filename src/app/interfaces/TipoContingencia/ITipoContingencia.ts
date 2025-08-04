export interface ITipoContingencia {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoContingenciaResponse {
    result: boolean
    message?: string
    data?: ITipoContingencia | ITipoContingencia[]
    error?: string
    status?: number
}