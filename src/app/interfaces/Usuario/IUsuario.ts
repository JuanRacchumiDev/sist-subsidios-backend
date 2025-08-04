import { IColaborador } from "../Colaborador/IColaborador"
import { ITrabajadorSocial } from "../TrabajadorSocial/ITrabajadorSocial"

export interface IUsuario {
    id?: string
    id_colaborador?: string
    id_trabajador?: string
    email?: string
    password?: string
    remember_token?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    colaborador?: IColaborador
    trabajadorSocial?: ITrabajadorSocial
}

export interface UsuarioResponse {
    result?: boolean
    message?: string
    data?: ITrabajadorSocial | ITrabajadorSocial[],
    error?: string
    status?: number
}