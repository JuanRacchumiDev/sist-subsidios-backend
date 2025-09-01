import { Request, Response, NextFunction } from 'express'
import CreatePersonaService from '../services/Persona/CreatePersona'
import GetPersonasService from '../services/Persona/GetPersonas'
import GetPersonaService from '../services/Persona/GetPersona'
import UpdatePersonaService from '../services/Persona/UpdatePersona'
import GetInfoApiService from '../services/Persona/GetInfoApi'
import GetByIdTipoAndNumDocService from '../services/Persona/GetByIdTipoAndNumDoc'
import { IPersona } from '../interfaces/Persona/IPersona';

class PersonaController {
    async getPersonaByApi(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { abreviatura, numeroDocumento } } = req

            if (!abreviatura || !numeroDocumento) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'La abreviatura y número de documento son requeridos como parámetros de consulta',
                        status: 400
                    }
                );
            }

            const abreviaturaStr = abreviatura as string

            const numeroDocumentoStr = numeroDocumento as string

            const result = await GetInfoApiService.execute(abreviaturaStr, numeroDocumentoStr)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllPersonas(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetPersonasService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getPersonaById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetPersonaService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getPersonaByIdTipoDocAndNumDoc(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { idTipoDoc, numDoc } } = req

            if (!idTipoDoc || !numDoc) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El tipo de documento y número de documento son requeridos como parámetros de consulta'
                    }
                );
            }

            const idTipoDocStr = idTipoDoc as string
            const numDocStr = numDoc as string

            const result = await GetByIdTipoAndNumDocService.execute(idTipoDocStr, numDocStr)

            if (result.status === 500) {
                res.status(result.status).json(result)
            }
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }

    async createPersona(req: Request, res: Response, next: NextFunction) {
        try {
            const personaData: IPersona = req.body;
            const result = await CreatePersonaService.execute(personaData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updatePersona(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const personaData: IPersona = req.body;
            const result = await UpdatePersonaService.execute(id, personaData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new PersonaController()