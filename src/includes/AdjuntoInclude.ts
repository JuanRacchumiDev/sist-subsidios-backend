import { Adjunto } from "../app/models/Adjunto";

export const ADJUNTO_INCLUDE = {
    model: Adjunto,
    as: 'adjuntos',
    attributes: [
        'id',
        'id_tipoadjunto',
        'id_descansomedico',
        'id_canje',
        'id_cobro',
        'id_reembolso',
        'id_colaborador',
        'id_trabajadorsocial',
        'id_documento',
        'file_name',
        'file_type',
        'file_path',
        'codigo_temp'
    ]
}