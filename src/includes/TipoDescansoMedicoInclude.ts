import { DetalleParametro } from "../app/models/DetalleParametro";

export const TIPODM_INCLUDE = {
    model: DetalleParametro,
    as: 'tipoDescansoMedico',
    attributes: ['id', 'nombre']
}