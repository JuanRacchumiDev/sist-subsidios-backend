import { DescansoMedico } from "../app/models/DescansoMedico";
import { COLABORADOR_DM_INCLUDE } from "./ColaboradorDMInclude";
import { DIAGNOSTICO_INCLUDE } from "./DiagnosticoInclude";
import { DETALLE_PARAMETRO_INCLUDE } from "./DetalleParametroInclude"

export const DESCANSOMEDICO_INCLUDE = {
    model: DescansoMedico,
    as: 'descansoMedico',
    attributes: [
        'id',
        'id_colaborador',
        'id_empresa',
        'id_tipodescansomedico',
        'id_tipocontingencia',
        'codcie10_diagnostico',
        'correlativo',
        'codigo',
        'codigo_citt',
        'fecha_otorgamiento',
        'fecha_inicio',
        'fecha_final',
        'fecha_registro',
        'mes_devengado',
        'numero_colegiatura',
        'medico_tratante',
        'nombre_colaborador',
        'nombre_tipodescansomedico',
        'nombre_tipocontingencia',
        'nombre_diagnostico',
        'nombre_establecimiento',
        'total_dias',
        'is_subsidio',
        'is_acepta_responsabilidad',
        'is_acepta_politica',
        'is_continuo',
        'estado_registro',
        'sistema',
        'estado'
    ],
    include: [
        COLABORADOR_DM_INCLUDE,
        // TIPODM_INCLUDE,
        // TIPO_CONTINGENCIA_INCLUDE,
        DETALLE_PARAMETRO_INCLUDE,
        DIAGNOSTICO_INCLUDE
    ]
}