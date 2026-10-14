import { Request, Response, NextFunction } from 'express'
import fs from 'fs';
import path from 'path';
import CreateAdjuntoService from '../services/Adjunto/CreateAdjunto'
import DeleteAdjuntoService from '../services/Adjunto/DeleteAdjunto'
import GetAdjuntoService from '../services/Adjunto/GetAdjunto'
import GetAdjuntosPaginateService from '../services/Adjunto/GetAdjuntosPaginate'
import getAdjuntosService from '../services/Adjunto/GetAdjuntos'
import UpdateAdjuntoService from '../services/Adjunto/UpdateAdjunto'
import { IAdjunto } from '../interfaces/Adjunto/IAdjunto';
import HDate from '../../helpers/HDate'

class AdjuntoController {
    async getAllAdjuntos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await getAdjuntosService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllAdjuntosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { page, limit } } = req

            const setPage = parseInt(page as string) || 1

            const setLimit = parseInt(limit as string) || 10

            const result = await GetAdjuntosPaginateService.execute(setPage, setLimit)
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

            let finalPath = file_path

            const normalizedPath = path.normalize(file_path)

            if (!normalizedPath.startsWith('public' + path.sep) && !normalizedPath.startsWith('public/')) {
                finalPath = path.join('public', file_path)
            }

            res.setHeader('Content-Type', file_type as string)
            res.setHeader('Content-Disposition', `inline; filename="${file_name}"`)

            const fileStream = fs.createReadStream(finalPath)

            fileStream.on('error', (err) => {
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Error al leer el archivo físico' })
                }
            })

            fileStream.pipe(res)
        } catch (error) {
            next(error);
        }
    }

    async createAdjunto(req: Request, res: Response, next: NextFunction) {
        try {
            const { file, body } = req

            if (!file) {
                return res.status(400).json({
                    result: false,
                    message: 'No se ha agregado ningún archivo',
                    status: 400,
                });
            }

            const result = await CreateAdjuntoService.execute({
                file,
                bodyData: body,
            });

            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error)
        }
    }

    async updateAdjunto(req: Request, res: Response, next: NextFunction) {
        try {
            const { query, body, file } = req

            if (!file) {
                return res.status(400).json({
                    result: false,
                    message: 'No se ha agregado ningún archivo',
                    status: 400
                });
            }

            const { ruc, numero_documento } = body

            const { id_descansomedico, id_documento } = query

            const idDescansoMedico = id_descansomedico as string

            const idDocumento = id_documento as string

            const { originalname, mimetype, buffer } = file

            // Generar un nombre único para el archivo
            const uniqueSuffix: string = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
            const extension: string = path.extname(originalname)
            const filename: string = `${uniqueSuffix}${extension}`

            let relativePath: string = ""

            let finalPath: string = ""

            const currentYear = HDate.getCurrentYear();

            if (ruc && numero_documento) {
                // Definición del path y creación de directorios
                relativePath = path.join('uploads', ruc, currentYear, numero_documento, filename);
                finalPath = path.join(process.cwd(), 'public', relativePath);

                const dir = path.dirname(finalPath);
                fs.mkdirSync(dir, { recursive: true });
            } else {
                relativePath = path.join('uploads', filename);
                finalPath = path.join(process.cwd(), 'public', relativePath);
            }

            // Guardar el archivo en el disco
            fs.writeFileSync(finalPath, buffer);

            const payloadAdjunto: IAdjunto = body

            payloadAdjunto.file_name = originalname
            payloadAdjunto.file_type = mimetype
            payloadAdjunto.file_data = buffer
            payloadAdjunto.file_path = relativePath

            const result = await UpdateAdjuntoService.execute(idDescansoMedico, idDocumento, payloadAdjunto)

            res.status(result.status || 201).json(result);
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