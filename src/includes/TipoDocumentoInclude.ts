import { DetalleParametro } from "../app/models/DetalleParametro";

export const TIPO_DOCUMENTO_INCLUDE = {
    model: DetalleParametro,
    as: 'tipoDocumento',
    attributes: ['id', 'nombre', 'abreviatura']
}