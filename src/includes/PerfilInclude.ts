import { DetalleParametro } from "../app/models/DetalleParametro";

export const PERFIL_INCLUDE = {
    model: DetalleParametro,
    as: 'perfil',
    attributes: ['id', 'nombre']
}