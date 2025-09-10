import { Canje } from "../app/models/Canje";

export const CANJE_INCLUDE = {
    model: Canje,
    as: 'canje',
    attributes: ['id', 'codigo', 'fecha_inicio_subsidio', 'fecha_final_subsidio']
}