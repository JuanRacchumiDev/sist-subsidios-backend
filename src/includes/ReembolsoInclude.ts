import { Reembolso } from "../app/models/Reembolso";

export const REEMBOLSO_INCLUDE = {
    model: Reembolso,
    as: 'reembolso',
    attributes: ['id', 'codigo', 'codigo_reembolso', 'numero_expediente', 'fecha_reembolso', 'fecha_maxima_reembolso', 'fecha_maxima_subsanar', 'fecha_pago', 'estado_registro']
}