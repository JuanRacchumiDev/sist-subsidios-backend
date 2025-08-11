import { EReembolso } from "../../enums/EReembolso"
import { ICanje } from "../Canje/ICanje"

export interface IReembolso {
    id?: string
    id_canje?: string
    codigo?: string
    fecha_registro?: string
    fecha_maxima_reembolso?: string
    fecha_maxima_subsanar?: string
    is_cobrable?: boolean
    observacion?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado_registro?: EReembolso
    sistema?: boolean
    estado?: boolean
    canje?: ICanje
}

export interface ReembolsoResponse {
    result: boolean
    message?: string
    data?: IReembolso | IReembolso[]
    error?: string
    status?: number
}