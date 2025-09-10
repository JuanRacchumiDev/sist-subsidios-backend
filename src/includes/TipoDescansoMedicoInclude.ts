import { TipoDescansoMedico } from "../app/models/TipoDescansoMedico";

export const TIPODM_INCLUDE = {
    model: TipoDescansoMedico,
    as: 'tipoDescansoMedico',
    attributes: ['id', 'nombre']
}