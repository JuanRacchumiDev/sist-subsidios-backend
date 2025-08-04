export interface IDiagnostico {
    id?: string
    nombre?: string
    nombre_url?: string
    tiempo?: number
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface DiagnosticoResponse {
    result: boolean
    message?: string
    data?: IDiagnostico | IDiagnostico[]
    error?: string
    status?: number
}