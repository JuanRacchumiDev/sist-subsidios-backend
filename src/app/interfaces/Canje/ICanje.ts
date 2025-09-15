import { ECanje } from "../../enums/ECanje"
import { IDescansoMedico } from "../DescansoMedico/IDescansoMedico"

export interface ICanje {
    id?: string
    id_descansomedico?: string
    correlativo?: number
    codigo?: string
    fecha_inicio_subsidio?: string
    fecha_final_subsidio?: string
    fecha_inicio_dm?: string
    fecha_final_dm?: string
    fecha_maxima_canje?: string
    fecha_registro?: string
    fecha_actualiza?: string
    fecha_elimina?: string
    fecha_maxima_subsanar?: string
    dia_fecha_inicio_subsidio?: number
    mes_fecha_inicio_subsidio?: number
    anio_fecha_inicio_subsidio?: number
    dia_fecha_final_subsidio?: number
    mes_fecha_final_subsidio?: number
    anio_fecha_final_subsidio?: number
    is_reembolsable?: boolean
    observacion?: string
    mes_devengado?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    estado_registro?: ECanje
    sistema?: boolean
    estado?: boolean
    descansoMedico?: IDescansoMedico
}

export interface CanjeResponse {
    result: boolean
    message?: string
    data?: ICanje | ICanje[]
    error?: string
    status?: number
}

export interface ICanjePaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface CanjeResponsePaginate {
    result: boolean
    message?: string
    data?: ICanje[]
    pagination?: ICanjePaginate
    error?: string
    status?: number
}