import { Persona } from "../app/models/Persona";

export const PERSONA_INCLUDE = {
    model: Persona,
    as: 'persona',
    attributes: [
        'id',
        'apellido_paterno',
        'apellido_materno',
        'nombres',
        'numero_documento',
        'nombre_completo',
        'fecha_nacimiento',
        'fecha_ingreso',
        'nombre_area',
        'nombre_sede',
        'email_institucional',
        'email_personal',
        'telefono'
    ]
}