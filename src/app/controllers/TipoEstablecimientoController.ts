import { Request, Response, NextFunction } from 'express'
import CreateTipoEstablecimientoService from '../services/TipoEstablecimiento/CreateTipo'
import DeleteTipoEstablecimientoService from '../services/TipoEstablecimiento/DeleteTipo'
import GetTipoEstablecimientoService from '../services/TipoEstablecimiento/GetTipo'
import GetTipoEstablecimientosService from '../services/TipoEstablecimiento/GetTipos'
import GetTipoEstablecimientoByNombreService from '../services/TipoEstablecimiento/GetByNombre'
import UpdateTipoEstablecimientoService from '../services/TipoEstablecimiento/UpdateTipo'
import { ITipoEstablecimiento } from '../interfaces/TipoEstablecimiento/ITipoEstablecimiento';

class TipoEstablecimientoController {
    async getAllTipoEstablecimientos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetTipoEstablecimientosService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getTipoEstablecimientoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const result = await GetTipoEstablecimientoService.execute(id);

            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTipoEstablecimientoByNombre(req: Request, res: Response, next: NextFunction) {
        try {
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

            const result = await GetTipoEstablecimientoByNombreService.execute(nombreStr);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createTipoEstablecimiento(req: Request, res: Response, next: NextFunction) {
        try {
            const tipoEstablecimientoData: ITipoEstablecimiento = req.body;
            const result = await CreateTipoEstablecimientoService.execute(tipoEstablecimientoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateTipoEstablecimiento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tipoEstablecimientoData: ITipoEstablecimiento = req.body;
            const result = await UpdateTipoEstablecimientoService.execute(id, tipoEstablecimientoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteTipoEstablecimiento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteTipoEstablecimientoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new TipoEstablecimientoController()