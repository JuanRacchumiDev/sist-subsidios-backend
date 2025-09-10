import { TrabajadorSocial } from "../app/models/TrabajadorSocial";

export const TRABAJADOR_SOCIAL_INCLUDE = {
    model: TrabajadorSocial,
    as: 'trabajadorSocial',
    attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno']
}