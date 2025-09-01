import { Request, Response, NextFunction } from 'express'
import CreateSedeService from '../services/Sede/CreateSede'
import DeleteSedeService from '../services/Sede/DeleteSede'
import GetSedeService from '../services/Sede/GetSede'
import GetSedesService from '../services/Sede/GetSedes'
import GetSedeByNombreService from '../services/Sede/GetByNombre'
import UpdateSedeService from '../services/Sede/UpdateSede'
import { ISede } from '../interfaces/Sede/ISede';

class SedeController {
    async getAllSedes(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetSedesService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getSedeById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetSedeService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getSedeByNombre(req: Request, res: Response, next: NextFunction) {
        try {
            // const { nombre } = req.query; // Asumiendo que se pasa como query param
            // if (typeof nombre !== 'string') {
            //     return res.status(400).json({ result: false, message: 'El nombre es requerido como parámetro de consulta', status: 400 });
            // }

            const { query: { nombre } } = req

            if (!nombre) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El nombre es requerido como parámetro de consulta',
                        status: 400
                    }
                );
            }

            const nombreStr = nombre as string

            const result = await GetSedeByNombreService.execute(nombreStr);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createSede(req: Request, res: Response, next: NextFunction) {
        try {
            const sedeData: ISede = req.body;
            const result = await CreateSedeService.execute(sedeData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateSede(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const sedeData: ISede = req.body;
            const result = await UpdateSedeService.execute(id, sedeData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteSede(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteSedeService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new SedeController()