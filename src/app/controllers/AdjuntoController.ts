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
                return res.status(400).json({
                    result: false,
                    message: 'No se ha agregado ningún archivo',
                    status: 400
                });
            }

            console.log({ body })

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
                ruc,
                numero_documento
            } = body

            // const { originalname, mimetype, filename } = file // DiskStorage
            const { originalname, mimetype, buffer } = file

            // Generar un nombre único para el archivo
            const uniqueSuffix: string = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
            const extension: string = path.extname(originalname);
            const filename = `${uniqueSuffix}${extension}`;

            let relativePath: string = "";

            let finalPath: string = ""; // Ruta absoluta para guardar en disco

            const currentYear = HDate.getCurrentYear(); // Asumiendo que esta función está disponible

            if (ruc && numero_documento) {
                // Se asume que 'public' está en el mismo nivel que 'src' y 'app'
                const baseUploadDir = path.join(process.cwd(), 'public', 'uploads');

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

            // let relativePath: string = ""

            // if (ruc && numero_documento) {
            //     const currentYear = HDate.getCurrentYear()

            //     relativePath = path.join('uploads', ruc, currentYear, numero_documento, filename)
            // } else {
            //     relativePath = path.join('uploads', filename)
            // }

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
                file_data: buffer,
                file_path: relativePath,
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