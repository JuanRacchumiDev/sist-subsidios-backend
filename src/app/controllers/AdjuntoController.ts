import { Request, Response, NextFunction } from 'express'
import CreateAdjuntoService from '../services/Adjunto/CreateAdjunto'
import DeleteAdjuntoService from '../services/Adjunto/DeleteAdjunto'
import GetAdjuntoService from '../services/Adjunto/GetAdjunto'
import GetAdjuntosPaginateService from '../services/Adjunto/GetAdjuntosPaginate'
import getAdjuntosService from '../services/Adjunto/GetAdjuntos'
import UpdateAdjuntoService from '../services/Adjunto/UpdateAdjunto'
import { IAdjunto } from '../interfaces/Adjunto/IAdjunto';
import fs from 'fs';
import path from 'path';

class AdjuntoController {
    async getAllAdjuntos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await getAdjuntosService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllAdjuntosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            const result = await GetAdjuntosPaginateService.execute(page, limit)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAdjuntoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { params } = req

            const { id } = params

            const response = await GetAdjuntoService.execute(id);

            const { status, data } = response

            if (!status || !data) {
                return res.status(status || 404).json(response)
            }

            const { file_path, file_type, file_name } = data as IAdjunto

            if (!file_path) {
                return res.status(404).json({ result: false, message: 'Archivo no encontrado.', status: 404 });
            }

            res.setHeader('Content-Type', file_type as string)
            res.setHeader('Content-Disposition', `inline; filename="${file_name}"`)

            const fileStream = fs.createReadStream(file_path)
            fileStream.pipe(res)
        } catch (error) {
            next(error);
        }
    }

    async createAdjunto(req: Request, res: Response, next: NextFunction) {
        try {
            const { file, body } = req

            if (!file) {
                return res.status(400).json({ result: false, message: 'No se ha agregado ningún archivo', status: 400 });
            }

            const {
                id_tipoadjunto,
                id_descansomedico,
                id_canje,
                id_cobro,
                id_reembolso,
                id_colaborador,
                id_trabajadorsocial,
                id_documento,
                codigo_temp,
            } = body

            const { fieldname, originalname, mimetype, destination, filename, path, size } = file

            const fileData: IAdjunto = {
                id_tipoadjunto,
                id_descansomedico,
                id_canje,
                id_cobro,
                id_reembolso,
                id_colaborador,
                id_trabajadorsocial,
                id_documento,
                file_name: originalname,
                file_type: mimetype,
                file_data: file.buffer,
                file_path: path,
                codigo_temp
            }

            const result = await CreateAdjuntoService.execute(fileData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateAdjunto(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const cargoAdjunto: IAdjunto = req.body;
            const result = await UpdateAdjuntoService.execute(id, cargoAdjunto);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteAdjunto(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteAdjuntoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AdjuntoController()