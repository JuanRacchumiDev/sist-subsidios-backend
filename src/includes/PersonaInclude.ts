import { Persona } from "../app/models/Persona";

export const PERSONA_INCLUDE = {
    model: Persona,
    as: 'persona',
    attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno', 'nombre_completo']
}