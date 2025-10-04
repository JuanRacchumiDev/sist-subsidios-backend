import { NextFunction, Response, Request } from "express";
import GetUsuariosService from '../services/Usuario/GetUsuarios'
import GetUsuariosPaginateService from '../services/Usuario/GetUsuariosPaginate'
import GetUsuarioService from '../services/Usuario/GetUsuario'
import CreateUsuarioService from '../services/Usuario/CreateUsuario'
import UpdateUsuarioService from '../services/Usuario/UpdateUsuario'
import { IUsuario } from "../interfaces/Usuario/IUsuario";
import { IUsuarioFilter } from "../interfaces/Usuario/IUsuarioFilter";

class UsuarioController {
    async getAllUsuarios(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetUsuariosService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllUsuariosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            // Extracción de filtros opcionales de req.query
            const {
                id_perfil,
                nombre_persona
            } = req.query

            // Construir el objeto de filtros
            const filter: IUsuarioFilter = {
                id_perfil: id_perfil as string,
                nombre_persona: nombre_persona as string
            }

            const result = await GetUsuariosPaginateService.execute(page, limit, filter)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getUsuarioById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetUsuarioService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarioData: IUsuario = req.body;
            const result = await CreateUsuarioService.execute(usuarioData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const usuarioData: IUsuario = req.body;
            const result = await UpdateUsuarioService.execute(id, usuarioData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new UsuarioController()