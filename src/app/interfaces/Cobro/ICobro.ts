import { ECobro } from "../../enums/ECobro"
import { IReembolso } from "../Reembolso/IReembolso"

export interface ICobro {
    id?: string
    id_reembolso?: string
    codigo?: string
    codigo_cheque?: string
    codigo_voucher?: string
    fecha_registro?: string
    fecha_maxima_cobro?: string
    observacion?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado_registro?: ECobro
    sistema?: boolean
    estado?: boolean
    reembolso?: IReembolso
}

export interface CobroResponse {
    result: boolean
    message?: string
    data?: ICobro | ICobro[]
    error?: string
    status?: number
}