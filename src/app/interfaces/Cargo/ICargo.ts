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

export interface ICargoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface CargoResponsePaginate {
    result: boolean
    message?: string
    data?: ICargo[]
    pagination?: ICargoPaginate
    error?: string
    status?: number
}