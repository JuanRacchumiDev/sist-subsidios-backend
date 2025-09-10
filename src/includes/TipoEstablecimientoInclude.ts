import { TipoEstablecimiento } from "../app/models/TipoEstablecimiento";

export const TIPO_ESTABLECIMIENTO_INCLUDE = {
    model: TipoEstablecimiento,
    as: 'tipoEstablecimiento',
    attributes: ['id', 'nombre']
}