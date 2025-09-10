import { Cargo } from "../app/models/Cargo";

export const CARGO_INCLUDE = {
    model: Cargo,
    as: 'cargo',
    attributes: ['id', 'nombre']
}
