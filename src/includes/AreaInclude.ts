import { Area } from "../app/models/Area";

export const AREA_INCLUDE = {
    model: Area,
    as: 'area',
    attributes: ['id', 'nombre']
}