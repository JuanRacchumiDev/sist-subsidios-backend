// import { Colaborador } from "../app/models/Colaborador";
import { Persona } from '../app/models/Persona'

export const COLABORADOR_DM_INCLUDE = {
    // model: Colaborador,
    model: Persona,
    as: 'colaborador_dm',
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