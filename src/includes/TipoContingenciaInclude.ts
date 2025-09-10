import { TipoContingencia } from "../app/models/TipoContingencia";

export const TIPO_CONTINGENCIA_INCLUDE = {
    model: TipoContingencia,
    as: 'tipoContingencia',
    attributes: ['id', 'nombre']
}