import { Perfil } from "../app/models/Perfil";

export const PERFIL_INCLUDE = {
    model: Perfil,
    as: 'perfil',
    attributes: ['id', 'nombre']
}