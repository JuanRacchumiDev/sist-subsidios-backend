import { EAccion } from "../../enums/EAccion"

export interface IBitacora {
    id?: string
    id_externo?: string
    tabla?: string
    valor_anterior?: string
    valor_nuevo?: string
    accion?: EAccion
    fecha_registro?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
}

export interface BitacoraResponse {
    result: boolean
    message?: string
    data?: IBitacora | IBitacora[]
    error?: string
    status?: number
}