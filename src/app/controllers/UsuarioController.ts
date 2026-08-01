import { NextFunction, Response, Request } from "express";
import GetUsuariosService from '../services/Usuario/GetUsuarios'
import GetUsuariosPaginateService from '../services/Usuario/GetUsuariosPaginate'
import GetUsuarioService from '../services/Usuario/GetUsuario'
import CreateUsuarioService from '../services/Usuario/CreateUsuario'
import UpdateUsuarioService from '../services/Usuario/UpdateUsuario'
import UpdateEstadoService from '../services/Usuario/UpdateEstado'
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
            const {
                query: {
                    page,
                    limit,
                    id_perfil,
                    search
                }
            } = req

            const setPage = parseInt(page as string) || 1
            const setLimit = parseInt(limit as string) || 10

            // Construir el objeto de filtros
            const filter: IUsuarioFilter = {
                id_perfil: id_perfil as string,
                search: search as string,
            }

            console.log({ filter })

            const result = await GetUsuariosPaginateService.execute(setPage, setLimit, filter)

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
            console.log({ usuarioData })
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

    async updateEstado(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const usuarioData: IUsuario = req.body
            const result = await UpdateEstadoService.execute(id, usuarioData)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default new UsuarioController()