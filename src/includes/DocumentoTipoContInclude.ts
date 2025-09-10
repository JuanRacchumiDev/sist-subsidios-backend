import { DocumentoTipoCont } from "../app/models/DocumentoTipoCont";

export const DOCUMENTO_TIPO_CONT_INCLUDE = {
    model: DocumentoTipoCont,
    as: 'documentoTipoCont',
    attributes: ['id', 'nombre']
}