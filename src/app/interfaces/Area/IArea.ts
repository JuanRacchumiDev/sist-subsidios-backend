export interface IArea {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface AreaResponse {
    result: boolean
    message?: string
    data?: IArea | IArea[]
    error?: string
    status?: number
}

export interface IAreaPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface AreaResponsePaginate {
    result: boolean
    message?: string
    data?: IArea[]
    pagination?: IAreaPaginate
    error?: string
    status?: number
}