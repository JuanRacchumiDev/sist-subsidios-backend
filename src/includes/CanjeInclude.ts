import { Canje } from "../app/models/Canje";
import { DESCANSOMEDICO_INCLUDE } from "./DescansoMedicoInclude";

export const CANJE_INCLUDE = {
    model: Canje,
    as: 'canje',
    attributes: [
        'id',
        'id_descansomedico',
        'id_colaborador',
        'correlativo',
        'codigo',
        'fecha_inicio_subsidio',
        'fecha_final_subsidio',
        'fecha_inicio_dm',
        'fecha_final_dm',
        'fecha_maxima_canje',
        'fecha_registro',
        'is_reembolsable',
        'is_continuo',
        'mes_devengado',
        'nombre_colaborador',
        'nombre_tipodescansomedico',
        'nombre_tipocontingencia',
        'estado_registro',
        'sistema',
        'estado'
    ],
    include: [
        DESCANSOMEDICO_INCLUDE
    ]
}