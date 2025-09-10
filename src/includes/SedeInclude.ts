import { Sede } from "../app/models/Sede";

export const SEDE_INCLUDE = {
    model: Sede,
    as: 'sede',
    attributes: ['id', 'nombre']
}