import { Adjunto } from "../app/models/Adjunto";
import { CANJE_INCLUDE } from "./CanjeInclude";
import { COBRO_INCLUDE } from "./CobroInclude";
import { COLABORADOR_INCLUDE } from "./ColaboradorInclude";
import { DESCANSOMEDICO_INCLUDE } from "./DescansoMedicoInclude";
import { REEMBOLSO_INCLUDE } from "./ReembolsoInclude";
import { TRABAJADOR_SOCIAL_INCLUDE } from "./TrabSocialInclude";

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
    ],
    include: [
        DESCANSOMEDICO_INCLUDE
    ]
}