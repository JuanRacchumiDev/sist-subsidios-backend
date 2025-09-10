import { Reembolso } from "../app/models/Reembolso";

export const REEMBOLSO_INCLUDE = {
    model: Reembolso,
    as: 'reembolso',
    attributes: ['id', 'codigo']
}