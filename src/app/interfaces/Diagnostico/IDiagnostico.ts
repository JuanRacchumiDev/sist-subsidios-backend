export interface IDiagnostico {
    codCie10?: string
    nombre?: string
    nombre_url?: string
    tiempo?: number
    sexo?: string
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

export interface IDiagnosticoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface DiagnosticoResponsePaginate {
    result: boolean
    message?: string
    data?: IDiagnostico[]
    pagination?: IDiagnosticoPaginate
    error?: string
    status?: number
}