import { Request, Response, NextFunction } from 'express'
import CreateCargoService from '../services/Cargo/CreateCargo'
import DeleteCargoService from '../services/Cargo/DeleteCargo'
import GetCargoService from '../services/Cargo/GetCargo'
import GetCargosService from '../services/Cargo/GetCargos'
import GetByNombreService from '../services/Cargo/GetByNombre'
import UpdateCargoService from '../services/Cargo/UpdateCargo'
import { ICargo } from '../interfaces/Cargo/ICargo';

class CargoController {
    async getAllCargos(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetCargosService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
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

    async createCargo(req: Request, res: Response, next: NextFunction) {
        try {
            const cargoData: ICargo = req.body;
            const result = await CreateCargoService.execute(cargoData);
            res.status(result.status || 201).json(result);
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