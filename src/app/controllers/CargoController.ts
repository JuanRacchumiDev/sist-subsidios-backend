import { Request, Response, NextFunction } from 'express'
import CreateCargoService from '../services/Cargo/CreateCargo'
import DeleteCargoService from '../services/Cargo/DeleteCargo'
import GetCargoService from '../services/Cargo/GetCargo'
import GetCargosService from '../services/Cargo/GetCargos'
import GetCargoByNombreService from '../services/Cargo/GetByNombre'
import GetCargosPaginateService from '../services/Cargo/GetCargosPaginate'
import UpdateCargoService from '../services/Cargo/UpdateCargo'
import { ICargo } from '../interfaces/Cargo/ICargo';

class CargoController {
    async getAllCargos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetCargosService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllCargosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            // Extracción de filtros opcionales de req.query
            const filter = req.query.filter as string || ""

            const result = await GetCargosPaginateService.execute(page, limit, filter)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getCargoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetCargoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getCargoByNombre(req: Request, res: Response, next: NextFunction) {
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

            const result = await GetCargoByNombreService.execute(nombreStr);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createCargo(req: Request, res: Response, next: NextFunction) {
        try {
            const cargoData: ICargo = req.body;
            const result = await CreateCargoService.execute(cargoData);
            // res.status(result.status || 201).json(result);
            const { status: statusCargo } = result
            if (statusCargo === 201) {
                res.status(statusCargo).json(result)
            }
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }

    async updateCargo(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const cargoData: ICargo = req.body;
            const result = await UpdateCargoService.execute(id, cargoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteCargo(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteCargoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new CargoController()