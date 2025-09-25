import { Colaborador } from "../app/models/Colaborador";

export const COLABORADOR_DM_INCLUDE = {
    model: Colaborador,
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
        'correo_institucional',
        'correo_personal',
        'numero_celular'
    ]
}