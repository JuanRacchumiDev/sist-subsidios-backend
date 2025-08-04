import { EOrigen } from "../../enums/EOrigen"
import { ITipoDocumento } from "../TipoDocumento/ITipoDocumento"

export interface IPersona {
    id?: string
    id_tipodocumento?: string
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
    ubigeo_reniec?: string
    ubigeo_sunat?: string
    ubigeo?: string
    fecha_nacimiento?: string
    estado_civil?: string
    foto?: string
    sexo?: string
    origen?: EOrigen
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    sistema?: boolean
    estado?: boolean
    tipoDocumento?: ITipoDocumento
}

export interface PersonaResponse {
    result: boolean
    message?: string
    data?: IPersona | IPersona[]
    error?: string
    status?: number
}