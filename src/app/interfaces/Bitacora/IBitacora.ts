import { EAccion } from "../../enums/EAccion"

export interface IBitacora {
    id?: string
    tabla?: string
    valor_anterior?: string
    valor_nuevo?: string
    accion?: EAccion
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    nombre_user?: string
}

export interface BitacoraResponse {
    result: boolean
    message?: string
    data?: IBitacora | IBitacora[]
    error?: string
    status?: number
}