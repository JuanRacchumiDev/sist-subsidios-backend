import { IEmpresa } from "../Empresa/IEmpresa"
import { IDetalleParametro } from "../DetalleParametro/IDetalleParametro"

export interface ITrabajadorSocial {
    id?: string
    id_tipodocumento?: string
    id_cargo?: string
    id_empresa?: string
    id_area?: string
    id_sede?: string
    id_pais?: string
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    nombre_completo?: string
    nombre_area?: string
    nombre_sede?: string
    nombre_pais?: string
    correo_institucional?: string
    correo_personal?: string
    numero_celular?: string
    foto?: string
    fecha_nacimiento?: string
    fecha_ingreso?: string
    fecha_salida?: string
    es_representante_legal?: boolean
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: IDetalleParametro
    cargo?: IDetalleParametro
    empresa?: IEmpresa
    area?: IDetalleParametro
    sede?: IDetalleParametro
    pais?: IDetalleParametro
}

export interface TrabajadorSocialResponse {
    result?: boolean
    message?: string
    data?: ITrabajadorSocial | ITrabajadorSocial[],
    error?: string
    status?: number
}

export interface ITrabajadorSocialPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface TrabajadorSocialResponsePaginate {
    result: boolean
    message?: string
    data?: ITrabajadorSocial[]
    pagination?: ITrabajadorSocialPaginate
    error?: string
    status?: number
}