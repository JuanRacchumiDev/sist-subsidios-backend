export type TDetalleEmail = {
    fecha_inicio_subsidio?: string
    fecha_final_subsidio?: string
    observacion?: string,
    descansoMedico?: {
        fecha_inicio?: string
        fecha_final?: string
        total_dias?: number
        nombre_tipocontingencia?: string
        nombre_tipodescansomedico?: string
        nombre_diagnostico?: string
        nombre_establecimiento?: string
    }
}