import { Reembolso } from "../app/models/Reembolso";

export const REEMBOLSO_INCLUDE = {
    model: Reembolso,
    as: 'reembolso',
    attributes: ['id', 'id_canje', 'correlativo', 'codigo', 'codigo_reembolso', 'numero_expediente', 'fecha_registro', 'fecha_reembolso', 'fecha_maxima_reembolso', 'fecha_pago', 'is_cobrable', 'observacion', 'user_crea', 'estado_registro', 'id_colaborador', 'nombre_colaborador', 'fecha_solicitud', 'valor_dia', 'fecha_actualiza']
}