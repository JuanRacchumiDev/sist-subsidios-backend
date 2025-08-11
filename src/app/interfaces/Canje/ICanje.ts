import { ECanje } from "../../enums/ECanje"
import { IDescansoMedico } from "../DescansoMedico/IDescansoMedico"

export interface ICanje {
    id?: string
    id_descansomedico?: string
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
    is_reembolsable?: boolean
    observacion?: string
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