import { EOrigen } from "../../enums/EOrigen"
import { IDetalleParametro } from "../DetalleParametro/IDetalleParametro"
import { IEmpresa } from "../Empresa/IEmpresa"

export interface IPersona {
    id?: string
    id_tipodocumento?: string
    id_empresa?: string
    id_cargo?: string
    id_sede?: string
    id_pais?: string
    numero_documento?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombre_completo?: string
    departamento?: string
    provincia?: string
    distrito?: string
    direccion?: string
    direccion_completa?: string
    email_personal?: string
    email_institucional?: string
    telefono?: string
    ubigeo_reniec?: string
    ubigeo_sunat?: string
    ubigeo?: string
    direccion_fiscal?: string
    partida_registral?: string
    ospe?: string
    fecha_nacimiento?: string
    fecha_ingreso?: string
    fecha_salida?: string
    nombre_area?: string
    nombre_sede?: string
    nombre_pais?: string
    estado_civil?: string
    foto?: string
    sexo?: string
    origen?: EOrigen
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    is_asociado_sindicato?: boolean
    is_tiene_inconvenientes?: boolean
    is_representante_legal?: boolean
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: IDetalleParametro
    empresa?: IEmpresa
    cargo?: IDetalleParametro
    sede?: IDetalleParametro
    pais?: IDetalleParametro
    nombre_grupo?: string
}

export interface PersonaResponse {
    result: boolean
    message?: string
    data?: IPersona | IPersona[]
    error?: string
    status?: number
}

export interface IPersonaPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface PersonaResponsePaginate {
    result: boolean
    message?: string
    data?: IPersona[]
    pagination?: IPersonaPaginate
    error?: string
    status?: number
}