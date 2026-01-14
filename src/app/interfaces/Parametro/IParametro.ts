export interface IParametro {
    clase?: number
    nombre?: string
    nombre_url?: string
    descripcion?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface ParametroResponse {
    result: boolean
    message?: string
    data?: IParametro | IParametro[]
    error?: string
    status?: number
}

export interface IParametroPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface ParametroResponsePaginate {
    result: boolean
    message?: string
    data?: IParametro[]
    pagination?: IParametroPaginate
    error?: string
    status?: number
}