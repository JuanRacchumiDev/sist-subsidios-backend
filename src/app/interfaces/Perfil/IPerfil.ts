export interface IPerfil {
    id?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface PerfilResponse {
    result: boolean
    message?: string
    data?: IPerfil | IPerfil[],
    error?: string
    status?: number
}

export interface IPerfilPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface PerfilResponsePaginate {
    result: boolean
    message?: string
    data?: IPerfil[]
    pagination?: IPerfilPaginate
    error?: string
    status?: number
}