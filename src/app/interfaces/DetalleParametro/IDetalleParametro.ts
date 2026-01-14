export interface IDetalleParametro {
    id?: string
    parametro_clase?: number
    nombre?: string
    nombre_url?: string
    descripcion?: string
    valor?: string
    abreviatura?: string
    longitud?: number
    en_persona?: boolean
    en_empresa?: boolean
    compra?: boolean
    venta?: boolean
    visible?: boolean
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
}

export interface DetalleParametroResponse {
    result: boolean
    message?: string
    data?: IDetalleParametro | IDetalleParametro[]
    error?: string
    status?: number
}

export interface IDetalleParametroPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface DetalleParametroResponsePaginate {
    result: boolean
    message?: string
    data?: IDetalleParametro[]
    pagination?: IDetalleParametroPaginate
    error?: string
    status?: number
}