import { Cobro } from "../app/models/Cobro";

export const COBRO_INCLUDE = {
    model: Cobro,
    as: 'cobro',
    attributes: ['id', 'codigo', 'codigo_cheque', 'codigo_voucher']
}