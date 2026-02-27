import { DetalleParametro } from "../app/models/DetalleParametro";

export const TIPO_CONTINGENCIA_INCLUDE = {
    model: DetalleParametro,
    as: 'tipoContingencia',
    attributes: ['id', 'nombre']
}