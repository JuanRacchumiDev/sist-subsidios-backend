import { Colaborador } from "../app/models/Colaborador";

export const COLABORADOR_INCLUDE = {
    model: Colaborador,
    as: 'colaborador',
    attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno']
}