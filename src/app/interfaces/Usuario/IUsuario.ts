import { IPersona } from "../Persona/IPersona"
import { IDetalleParametro } from "../DetalleParametro/IDetalleParametro"

export interface IUsuario {
    id?: string
    id_perfil?: string
    id_persona?: string
    username?: string
    email?: string
    password?: string
    nombre_persona?: string
    nombre_perfil?: string
    remember_token?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    perfil?: IDetalleParametro
    persona?: IPersona
}

export interface UsuarioResponse {
    result?: boolean
    message?: string
    data?: IUsuario | IUsuario[],
    error?: string | unknown
    status?: number
}

export interface IUsuarioPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface UsuarioResponsePaginate {
    result: boolean
    message?: string
    data?: IUsuario[]
    pagination?: IUsuarioPaginate
    error?: string
    status?: number
}