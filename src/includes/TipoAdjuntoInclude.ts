import { TipoAdjunto } from "../app/models/TipoAdjunto";

export const TIPO_ADJUNTO_INCLUDE = {
    model: TipoAdjunto,
    as: 'tipoAdjunto',
    attributes: ['id', 'nombre']
}