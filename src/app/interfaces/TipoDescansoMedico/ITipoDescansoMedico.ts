export interface ITipoDescansoMedico {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface TipoDescansoMedicoResponse {
    result: boolean
    message?: string
    data?: ITipoDescansoMedico | ITipoDescansoMedico[]
    error?: string
    status?: number
}