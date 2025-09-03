import { Request, Response, NextFunction } from 'express'
import CreateTipoContingenciaService from '../services/TipoContingencia/CreateTipo'
import DeleteTipoContingenciaService from '../services/TipoContingencia/DeleteTipo'
import GetTipoContingenciaService from '../services/TipoContingencia/GetTipo'
import GetTipoContingenciasService from '../services/TipoContingencia/GetTipos'
import GetByNombreService from '../services/TipoContingencia/GetByNombre'
import UpdateTipoContingenciaService from '../services/TipoContingencia/UpdateTipo'
import { ITipoContingencia } from '../interfaces/TipoContingencia/ITipoContingencia';

class TipoContingenciaController {
    async getAllTipoContingencias(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetTipoContingenciasService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getTipoContingenciaById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetTipoContingenciaService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTipoContingenciaByNombre(req: Request, res: Response, next: NextFunction) {
        try {
            const { nombre } = req.query; // Asumiendo que se pasa como query param
            if (typeof nombre !== 'string') {
                return res.status(400).json({ result: false, message: 'El nombre es requerido como parámetro de consulta', status: 400 });
            }
            const result = await GetByNombreService.execute(nombre);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createTipoContingencia(req: Request, res: Response, next: NextFunction) {
        try {
            const tipoContingenciaData: ITipoContingencia = req.body;
            const result = await CreateTipoContingenciaService.execute(tipoContingenciaData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateTipoContingencia(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tipoContingenciaData: ITipoContingencia = req.body;
            const result = await UpdateTipoContingenciaService.execute(id, tipoContingenciaData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteTipoContingencia(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteTipoContingenciaService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new TipoContingenciaController()