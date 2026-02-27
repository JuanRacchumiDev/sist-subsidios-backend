import { IDetalleParametro } from "../DetalleParametro/IDetalleParametro"
import { IEmpresa } from "../Empresa/IEmpresa"

export interface IRepresentanteLegal {
    id?: string
    id_tipodocumento?: string
    id_empresa?: string
    id_cargo?: string
    numero_documento?: string
    nombres?: string
    apellido_paterno?: string
    apellido_materno?: string
    direccion_fiscal?: string
    partida_registral?: string
    telefono?: string
    correo?: string
    ospe?: string
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: IDetalleParametro
    empresa?: IEmpresa
    cargo?: IDetalleParametro
}

export interface RepresentanteLegalResponse {
    result?: boolean
    message?: string
    data?: IRepresentanteLegal | IRepresentanteLegal[]
    error?: string
    status?: number
}