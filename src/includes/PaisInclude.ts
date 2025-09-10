import { Pais } from "../app/models/Pais";

export const PAIS_INCLUDE = {
    model: Pais,
    as: 'pais',
    attributes: ['id', 'nombre']
}