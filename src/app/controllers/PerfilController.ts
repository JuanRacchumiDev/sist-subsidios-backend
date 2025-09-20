import { Request, Response, NextFunction } from 'express'
import CreatePerfilService from '../services/Perfil/CreatePerfil'
import DeletePerfilService from '../services/Perfil/DeletePerfil'
import GetPerfilService from '../services/Perfil/GetPerfil'
import GetPerfilesService from '../services/Perfil/GetPerfiles'
import GetByNombreService from '../services/Perfil/GetByNombre'
import GetPerfilesPaginateService from '../services/Perfil/GetPerfilesPaginate'
import UpdatePerfilService from '../services/Perfil/UpdatePerfil'
import { IPerfil } from '../interfaces/Perfil/IPerfil';

class PerfilController {
    async getAllPerfiles(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetPerfilesService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllPerfilesPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            const result = await GetPerfilesPaginateService.execute(page, limit)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
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

            const result = await GetByNombreService.execute(nombreStr);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createPerfil(req: Request, res: Response, next: NextFunction) {
        try {
            const perfilData: IPerfil = req.body;
            const result = await CreatePerfilService.execute(perfilData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updatePerfil(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const perfilData: IPerfil = req.body;
            const result = await UpdatePerfilService.execute(id, perfilData);
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