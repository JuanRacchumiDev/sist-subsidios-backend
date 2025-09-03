import { Request, Response, NextFunction } from 'express'
import CreateEstablecimientoService from '../services/Establecimiento/CreateEstablecimiento'
import DeleteEstablecimientoService from '../services/Establecimiento/DeleteEstablecimiento'
import GetEstablecimientoService from '../services/Establecimiento/GetEstablecimiento'
import GetEstablecimientosService from '../services/Establecimiento/GetEstablecimientos'
import GetEstablecimientoByNombreService from '../services/Establecimiento/GetByNombre'
import UpdateEstablecimientoService from '../services/Establecimiento/UpdateEstablecimiento'
import { IEstablecimiento } from '../interfaces/Establecimiento/IEstablecimiento';

class EstablecimientoController {
    async getAllEstablecimientos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetEstablecimientosService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getEstablecimientoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetEstablecimientoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getEstablecimientoByNombre(req: Request, res: Response, next: NextFunction) {
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

            const result = await GetEstablecimientoByNombreService.execute(nombreStr);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createEstablecimiento(req: Request, res: Response, next: NextFunction) {
        try {
            const establecimientoData: IEstablecimiento = req.body;
            const result = await CreateEstablecimientoService.execute(establecimientoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateEstablecimiento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const establecimientoData: IEstablecimiento = req.body;
            const result = await UpdateEstablecimientoService.execute(id, establecimientoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteEstablecimiento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteEstablecimientoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new EstablecimientoController()