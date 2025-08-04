import { Request, Response, NextFunction } from 'express'
import CreatePerfilService from '../services/Perfil/CreatePerfil'
import DeletePerfilService from '../services/Perfil/DeletePerfil'
import GetPerfilService from '../services/Perfil/GetPerfil'
import GetPerfilesService from '../services/Perfil/GetPerfiles'
import GetByNombreService from '../services/Perfil/GetByNombre'
import UpdatePerfilService from '../services/Perfil/UpdatePerfil'
import { IPerfil } from '../interfaces/Perfil/IPerfil';

class PerfilController {
    async getAllPerfiles(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetPerfilesService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getPerfilById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetPerfilService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getPerfilByNombre(req: Request, res: Response, next: NextFunction) {
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

    async createPerfil(req: Request, res: Response, next: NextFunction) {
        try {
            const PerfilData: IPerfil = req.body;
            const result = await CreatePerfilService.execute(PerfilData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updatePerfil(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const PerfilData: IPerfil = req.body;
            const result = await UpdatePerfilService.execute(id, PerfilData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deletePerfil(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeletePerfilService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new PerfilController()