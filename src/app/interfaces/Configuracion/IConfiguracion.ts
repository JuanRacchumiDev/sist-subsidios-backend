import { ETipoDato } from "../../enums/ETipoDato";

export interface IConfiguracion {
    id?: string
    clave?: string
    valor?: string
    tipo_dato?: ETipoDato
    criterio?: string
    descripcion?: string
    sistema?: boolean
    estado?: boolean
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
}

export interface ConfiguracionResponse {
    result: boolean
    message?: string
    data?: IConfiguracion | IConfiguracion[]
    error?: string
    status?: number
}

export interface IConfiguracionPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface ConfiguracionResponsePaginate {
    result: boolean
    message?: string
    data?: IConfiguracion[]
    pagination?: IConfiguracionPaginate
    error?: string
    status?: number
}