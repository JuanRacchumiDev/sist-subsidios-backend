import { ITipoContingencia } from "../TipoContingencia/ITipoContingencia"

export interface IDocumentoTipoCont {
    id?: string
    id_tipocontingencia?: string
    nombre?: string
    nombre_url?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoContingencia?: ITipoContingencia
}

export interface DocumentoTipoContResponse {
    result?: boolean
    message?: string
    data?: IDocumentoTipoCont | IDocumentoTipoCont[]
    error?: string
    status?: number
}

export interface IDocumentoTipoContPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface DocumentoTipoContResponsePaginate {
    result: boolean
    message?: string
    data?: IDocumentoTipoCont[]
    pagination?: IDocumentoTipoContPaginate
    error?: string
    status?: number
}