import { DetalleParametro } from "../app/models/DetalleParametro";

export const TIPO_ESTABLECIMIENTO_INCLUDE = {
    model: DetalleParametro,
    as: 'tipoEstablecimiento',
    attributes: ['id', 'nombre']
}