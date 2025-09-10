import { Empresa } from "../app/models/Empresa";

export const EMPRESA_INCLUDE = {
    model: Empresa,
    as: 'empresa',
    attributes: ['id', 'nombre_o_razon_social']
}