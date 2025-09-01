import { ICanje } from "../Canje/ICanje"
import { ICobro } from "../Cobro/ICobro"
import { IColaborador } from "../Colaborador/IColaborador"
import { IDescansoMedico } from "../DescansoMedico/IDescansoMedico"
import { IReembolso } from "../Reembolso/IReembolso"
import { ITipoAdjunto } from "../TipoAdjunto/ITipoAdjunto"
import { ITrabajadorSocial } from "../TrabajadorSocial/ITrabajadorSocial"

export interface IAdjunto {
    id?: string
    id_tipoadjunto?: string
    id_descansomedico?: string
    id_canje?: string
    id_cobro?: string
    id_reembolso?: string
    id_colaborador?: string
    id_trabajadorsocial?: string
    file_name?: string
    file_type?: string
    file_data?: Buffer
    file_path?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoAdjunto?: ITipoAdjunto
    descansoMedico?: IDescansoMedico
    canje?: ICanje
    cobro?: ICobro
    reembolso?: IReembolso
    colaborador?: IColaborador
    trabajadorSocial?: ITrabajadorSocial
}

export interface AdjuntoResponse {
    result?: boolean
    message?: string
    data?: IAdjunto | IAdjunto[]
    error?: string
    status?: number
}

export interface IAdjuntoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface AdjuntoResponsePaginate {
    result: boolean
    message?: string
    data?: IAdjunto[]
    pagination?: IAdjuntoPaginate
    error?: string
    status?: number
}