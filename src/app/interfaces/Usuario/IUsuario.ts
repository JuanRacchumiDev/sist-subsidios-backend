import { IColaborador } from "../Colaborador/IColaborador"
import { IPerfil } from "../Perfil/IPerfil"
import { ITrabajadorSocial } from "../TrabajadorSocial/ITrabajadorSocial"
import { IPersona } from "../Persona/IPersona"

export interface IUsuario {
    id?: string
    id_perfil?: string
    id_persona?: string
    id_colaborador?: string
    id_trabajadorsocial?: string
    username?: string
    email?: string
    password?: string
    nombre_persona?: string
    remember_token?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    perfil?: IPerfil
    colaborador?: IColaborador
    trabajadorSocial?: ITrabajadorSocial
    persona?: IPersona
}

export interface UsuarioResponse {
    result?: boolean
    message?: string
    data?: IUsuario | IUsuario[],
    error?: string
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