import { Canje } from "../app/models/Canje";

export const CANJE_INCLUDE = {
    model: Canje,
    as: 'canje',
    attributes: [
        'id',
        'id_descansomedico',
        'correlativo',
        'codigo',
        'fecha_inicio_subsidio',
        'fecha_final_subsidio',
        'fecha_inicio_dm',
        'fecha_final_dm',
        'fecha_maxima_canje',
        'fecha_registro',
        'is_reembolsable',
        'mes_devengado',
        'estado_registro',
        'sistema',
        'estado'
    ]
}