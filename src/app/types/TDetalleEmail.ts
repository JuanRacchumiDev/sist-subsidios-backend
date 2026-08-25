/**
 * Detalle individual de un descanso médico para emails
 */
export type TDetalleDescansoMedico = {
    fecha_inicio?: string
    fecha_final?: string
    total_dias?: number
    nombre_tipocontingencia?: string
    nombre_tipodescansomedico?: string
    nombre_diagnostico?: string
    nombre_establecimiento?: string
    observacion?: string
}

/**
 * Detalle de un proceso de canje para emails
 */
export type TDetalleCanje = {
    fecha_inicio_subsidio?: string
    fecha_final_subsidio?: string
    total_dias?: number
    observacion?: string
    descansoMedico?: Omit<TDetalleDescansoMedico, 'observacion'>
}

export type TDetalleReembolso = {
    fecha_registro?: string
    observacion?: string
    canje?: Omit<TDetalleCanje, 'observacion'>
}

/**
 * Contenido principal de datos para plantillas de notificación de emails.
 */
export type TDetalleEmail = {
    descansoMedico?: TDetalleDescansoMedico
    canje?: TDetalleCanje
    reembolso?: TDetalleReembolso
}