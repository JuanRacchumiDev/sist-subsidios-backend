import { IArea } from "../Area/IArea"
import { ICargo } from "../Cargo/ICargo"
import { IPais } from "../Pais/IPais"
import { IParentesco } from "../Parentesco/IParentesco"
import { ISede } from "../Sede/ISede"
import { ITipoDocumento } from "../TipoDocumento/ITipoDocumento"

export interface IColaborador {
    id?: string
    id_parentesco?: string
    id_tipodocumento?: string
    id_cargo?: string
    id_area?: string
    id_sede?: string
    id_pais?: string
    numero_documento?: string
    apellido_paterno?: string
    apellido_materno?: string
    nombres?: string
    nombre_completo?: string
    fecha_nacimiento?: string
    fecha_ingreso?: string
    fecha_salida?: string
    nombre_area?: string
    nombre_sede?: string
    nombre_pais?: string
    correo_institucional?: string
    correo_personal?: string
    numero_celular?: string
    contacto_emergencia?: string
    numero_celular_emergencia?: string
    foto?: string
    curriculum_vitae?: string
    is_asociado_sindicato?: boolean
    is_presenta_inconvenientes?: boolean
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    parentesco?: IParentesco
    tipoDocumento?: ITipoDocumento
    cargo?: ICargo
    area?: IArea
    sede?: ISede
    pais?: IPais
}

export interface ColaboradorResponse {
    result?: boolean
    message?: string
    data?: IColaborador | IColaborador[],
    error?: string
    status?: number
}