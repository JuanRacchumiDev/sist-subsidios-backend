import { EReembolso } from "../../enums/EReembolso"
import { ICanje } from "../Canje/ICanje"
import { IColaborador } from "../Colaborador/IColaborador"

export interface IReembolso {
    id?: string
    id_canje?: string
    id_colaborador?: string
    correlativo?: number
    codigo?: string
    codigo_reembolso?: string
    numero_expediente?: string
    fecha_registro?: string
    fecha_reembolso?: string
    fecha_maxima_reembolso?: string
    fecha_maxima_subsanar?: string
    fecha_pago?: string
    is_cobrable?: boolean
    observacion?: string
    nombre_colaborador?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado_registro?: EReembolso
    sistema?: boolean
    estado?: boolean
    canje?: ICanje
    colaborador?: IColaborador
}

export interface ReembolsoResponse {
    result: boolean
    message?: string
    data?: IReembolso | IReembolso[]
    error?: string
    status?: number
}

export interface IReembolsoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface ReembolsoResponsePaginate {
    result: boolean
    message?: string
    data?: IReembolso[]
    pagination?: IReembolsoPaginate
    error?: string
    status?: number
}