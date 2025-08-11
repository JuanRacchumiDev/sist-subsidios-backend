import { Request, Response, NextFunction } from 'express'
import CreateParentescoService from '../services/Parentesco/CreateParentesco'
import DeleteParentescoService from '../services/Parentesco/DeleteParentesco'
import GetParentescoService from '../services/Parentesco/GetParentesco'
import GetParentescosService from '../services/Parentesco/GetParentescos'
import GetByNombreService from '../services/Parentesco/GetByNombre'
import UpdateParentescoService from '../services/Parentesco/UpdateParentesco'
import { IParentesco } from '../interfaces/Parentesco/IParentesco';

class ParentescoController {
    async getAllParentescos(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetParentescosService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getParentescoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetParentescoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getParentescoByNombre(req: Request, res: Response, next: NextFunction) {
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

    async createParentesco(req: Request, res: Response, next: NextFunction) {
        try {
            const parentescoData: IParentesco = req.body;
            const result = await CreateParentescoService.execute(parentescoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateParentesco(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const parentescoData: IParentesco = req.body;
            const result = await UpdateParentescoService.execute(id, parentescoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteParentesco(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteParentescoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new ParentescoController()