import { Request, Response, NextFunction } from 'express'
import CreateTipoDescansoMedicoService from '../services/TipoDescansoMedico/CreateTipo'
import DeleteTipoDescansoMedicoService from '../services/TipoDescansoMedico/DeleteTipo'
import GetTipoDescansoMedicoService from '../services/TipoDescansoMedico/GetTipo'
import GetTipoDescansoMedicosService from '../services/TipoDescansoMedico/GetTipos'
import GetTipoDescansoMedicoByNombreService from '../services/TipoDescansoMedico/GetByNombre'
import UpdateTipoDescansoMedicoService from '../services/TipoDescansoMedico/UpdateTipo'
import { ITipoDescansoMedico } from '../interfaces/TipoDescansoMedico/ITipoDescansoMedico';

class TipoDescansoMedicoController {
    async getAllTipoDescansoMedicos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetTipoDescansoMedicosService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getTipoDescansoMedicoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const result = await GetTipoDescansoMedicoService.execute(id);

            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTipoDescansoMedicoByNombre(req: Request, res: Response, next: NextFunction) {
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

            const result = await GetTipoDescansoMedicoByNombreService.execute(nombreStr);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createTipoDescansoMedico(req: Request, res: Response, next: NextFunction) {
        try {
            const tipoDescansoMedicoData: ITipoDescansoMedico = req.body;
            const result = await CreateTipoDescansoMedicoService.execute(tipoDescansoMedicoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateTipoDescansoMedico(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tipoDescansoMedicoData: ITipoDescansoMedico = req.body;
            const result = await UpdateTipoDescansoMedicoService.execute(id, tipoDescansoMedicoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteTipoDescansoMedico(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteTipoDescansoMedicoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new TipoDescansoMedicoController()