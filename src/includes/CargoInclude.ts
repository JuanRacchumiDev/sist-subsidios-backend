import { DetalleParametro } from "../app/models/DetalleParametro";

export const CARGO_INCLUDE = {
    model: DetalleParametro,
    as: 'cargo',
    attributes: ['id', 'nombre', 'abreviatura']
}