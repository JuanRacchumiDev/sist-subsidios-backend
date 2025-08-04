import { ITipoEstablecimiento } from "../TipoEstablecimiento/ITipoEstablecimiento"

export interface IEstablecimiento {
    id?: string
    id_tipoestablecimiento?: string
    ruc?: string
    nombre?: string
    direccion?: string
    telefono?: string
    nombre_tipoestablecimiento?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoEstablecimiento?: ITipoEstablecimiento
}

export interface EstablecimientoResponse {
    result: boolean
    message?: string
    data?: IEstablecimiento | IEstablecimiento[]
    error?: string
    status?: number
}