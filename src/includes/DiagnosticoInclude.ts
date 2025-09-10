import { Diagnostico } from "../app/models/Diagnostico";

export const DIAGNOSTICO_INCLUDE = {
    model: Diagnostico,
    as: 'diagnostico',
    attributes: ['codCie10', 'nombre']
}