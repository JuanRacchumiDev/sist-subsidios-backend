import { Colaborador } from "../app/models/Colaborador";

export const COLABORADOR_INCLUDE = {
    model: Colaborador,
    as: 'colaborador',
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
        'correo_institucional',
        'correo_personal',
        'numero_celular'
    ]
}