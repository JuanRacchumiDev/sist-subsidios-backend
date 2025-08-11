import { IColaborador } from "../Colaborador/IColaborador"
import { IPerfil } from "../Perfil/IPerfil"
import { ITrabajadorSocial } from "../TrabajadorSocial/ITrabajadorSocial"

export interface IUsuario {
    id?: string
    id_perfil?: string
    id_colaborador?: string
    id_trabajadorsocial?: string
    username?: string
    email?: string
    password?: string
    remember_token?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    perfil?: IPerfil
    colaborador?: IColaborador
    trabajadorSocial?: ITrabajadorSocial
}

export interface UsuarioResponse {
    result?: boolean
    message?: string
    data?: IUsuario | IUsuario[],
    error?: string
    status?: number
}