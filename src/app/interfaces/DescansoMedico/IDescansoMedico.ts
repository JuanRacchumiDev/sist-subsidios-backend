import { EDescansoMedico } from "../../enums/EDescansoMedico"
import { IColaborador } from "../Colaborador/IColaborador"
import { IDiagnostico } from "../Diagnostico/IDiagnostico"
import { IEstablecimiento } from "../Establecimiento/IEstablecimiento"
import { ITipoContingencia } from "../TipoContingencia/ITipoContingencia"
import { ITipoDescansoMedico } from "../TipoDescansoMedico/ITipoDescansoMedico"

export interface IDescansoMedico {
    id?: string
    id_colaborador?: string
    id_tipodescansomedico?: string
    id_tipocontingencia?: string
    codcie10_diagnostico?: string
    // id_establecimiento?: string
    codigo?: string
    fecha_otorgamiento?: string
    fecha_inicio?: string
    fecha_final?: string
    fecha_registro?: string
    fecha_actualiza?: string
    fecha_elimina?: string
    fecha_maxima_subsanar?: string
    numero_colegiatura?: string
    medico_tratante?: string
    nombre_colaborador?: string
    nombre_tipodescansomedico?: string
    nombre_tipocontingencia?: string
    nombre_diagnostico?: string
    nombre_establecimiento?: string
    observacion?: string
    total_dias?: number
    user_crea?: string
    user_actualiza?: string
    user_elimina?: string
    is_subsidio?: boolean
    is_acepta_responsabilidad?: boolean
    is_acepta_politica?: boolean
    is_continuo?: boolean
    estado_registro?: EDescansoMedico
    sistema?: boolean
    estado?: boolean
    colaborador?: IColaborador
    tipoDescansoMedico?: ITipoDescansoMedico
    tipoContingencia?: ITipoContingencia
    diagnostico?: IDiagnostico
    // establecimiento?: IEstablecimiento
}

export interface DescansoMedicoResponse {
    result: boolean
    message?: string
    data?: IDescansoMedico | IDescansoMedico[]
    error?: string
    status?: number
}

export interface IDescansoMedicoPaginate {
    currentPage: number
    limit: number
    totalPages: number
    totalItems: number
    nextPage: number | null
    previousPage: number | null
}

export interface DescansoMedicoResponsePaginate {
    result: boolean
    message?: string
    data?: IDescansoMedico[]
    pagination?: IDescansoMedicoPaginate
    error?: string
    status?: number
}