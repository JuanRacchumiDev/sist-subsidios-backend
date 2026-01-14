import { IPersona } from "../Persona/IPersona"
import { IDetalleParametro } from "../DetalleParametro/IDetalleParametro"

export interface IGrupoPersona {
    id?: string
    id_persona?: string
    id_grupo?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    persona?: IPersona
    grupo?: IDetalleParametro
}

export interface GrupoPersonaResponse {
    result: boolean
    message?: string
    data?: IGrupoPersona | IGrupoPersona[]
    error?: string
    status?: number
}