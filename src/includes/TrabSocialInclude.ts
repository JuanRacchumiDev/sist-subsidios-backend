import { Persona } from "../app/models/Persona";

export const TRABAJADOR_SOCIAL_INCLUDE = {
    model: Persona,
    as: 'trabajadorSocial',
    attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno']
}