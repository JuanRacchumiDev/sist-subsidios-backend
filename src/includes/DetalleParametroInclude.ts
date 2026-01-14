import { DetalleParametro } from "../app/models/DetalleParametro";

export const DETALLE_PARAMETRO_INCLUDE = {
    model: DetalleParametro,
    as: 'detalleParametro',
    attributes: ['id', 'nombre', 'abreviatura']
}