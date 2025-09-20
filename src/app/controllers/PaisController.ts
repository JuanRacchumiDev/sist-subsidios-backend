import { Request, Response, NextFunction } from 'express'
import CreatePaisService from '../services/Pais/CreatePais'
import DeletePaisService from '../services/Pais/DeletePais'
import GetPaisService from '../services/Pais/GetPais'
import GetPaisesService from '../services/Pais/GetPaises'
import GetByNombreService from '../services/Pais/GetByNombre'
import UpdatePaisService from '../services/Pais/UpdatePais'
import { IPais } from '../interfaces/Pais/IPais';

class PaisController {
    async getAllPaises(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetPaisesService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getPaisById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetPaisService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getPaisByNombre(req: Request, res: Response, next: NextFunction) {
        try {
            const { nombre } = req.query; // Asumiendo que se pasa como query param

            if (typeof nombre !== 'string') {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El nombre es requerido como parámetro de consulta',
                        status: 400
                    }
                );
            }

            const result = await GetByNombreService.execute(nombre);

            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createPais(req: Request, res: Response, next: NextFunction) {
        try {
            const paisData: IPais = req.body;
            const result = await CreatePaisService.execute(paisData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updatePais(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const paisData: IPais = req.body;
            const result = await UpdatePaisService.execute(id, paisData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deletePais(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeletePaisService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new PaisController()