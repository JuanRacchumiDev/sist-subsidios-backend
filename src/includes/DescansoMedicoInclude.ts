import { DescansoMedico } from "../app/models/DescansoMedico";

export const DESCANSOMEDICO_INCLUDE = {
    model: DescansoMedico,
    as: 'descansoMedico',
    attributes: ['id', 'codigo', 'fecha_inicio', 'fecha_final']
}