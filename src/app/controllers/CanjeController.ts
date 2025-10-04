import { NextFunction, Response, Request } from "express";
import GetCanjesService from '../services/Canje/GetCanjes'
import GetCanjeService from '../services/Canje/GetCanje'
import GetCanjesForReportService from '../services/Canje/GetCanjesForReport'
import CreateCanjeService from '../services/Canje/CreateCanje'
import UpdateCanjeService from '../services/Canje/UpdateCanje'
import { ICanje } from "../interfaces/Canje/ICanje";
import GetCanjesPaginateService from "../services/Canje/GetCanjesPaginate";
import { ICanjeFilter } from "../interfaces/Canje/ICanjeFilter";
import { THeaderColumn } from "../types/Reportes/THeader";
import HDate from "../../helpers/HDate";
import { generateExcelReport } from "../utils/excelGenerator";
import { TItemReport } from "../types/Canje/TItemReport";

class CanjeController {
    async getAllCanjes(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetCanjesService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllCanjesPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            // Extracción de filtros opcionales de req.query
            const {
                nombre_colaborador,
                codigo_canje,
                codigo_citt,
                fecha_inicio_subsidio,
                fecha_final_subsidio,
                estado
            } = req.query;

            // Construir el objeto de filtros (maneja el estado como booleano si es necesario)
            const filters: ICanjeFilter = {
                nombre_colaborador: nombre_colaborador as string,
                codigo_canje: codigo_canje as string,
                codigo_citt: codigo_citt as string,
                fecha_inicio_subsidio: fecha_inicio_subsidio as string,
                fecha_final_subsidio: fecha_final_subsidio as string,
                estado: estado !== undefined ? estado === 'true' : undefined // Convierte 'true'/'false' a booleano, o undefined si no está
            };

            const result = await GetCanjesPaginateService.execute(page, limit, filters)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllForReport(req: Request, res: Response, next: NextFunction) {
        try {
            const reportTitle = 'REPORTE DE DETALLE DE DESCANSOS MÉDICOS'

            const fileSuffix = HDate.getCurrentDateToString("ddMMyyyy")

            const headersColumns: THeaderColumn[] = [
                {
                    nameColumn: "DNI",
                    key: "numero_documento",
                    width: 10
                },
                {
                    nameColumn: "APALLIDOS Y NOMBRES",
                    key: "nombre_colaborador",
                    width: 40
                },
                {
                    nameColumn: "INICIO SUBSIDIO",
                    key: "fecha_inicio_subsidio",
                    width: 20
                },
                {
                    nameColumn: "FIN SUBSIDIO",
                    key: "fecha_fin_subsidio",
                    width: 20
                },
                {
                    nameColumn: "N° DE DÍAS SUBSIDIO",
                    key: "total_dias",
                    width: 20
                }
            ]

            console.log('req.query')
            console.log(req.query)

            const {
                type,
                limit,
                output
            } = req.query; // 'type': non_consecutive, consecutive, global | 'limit': 90, 150, 340 | 'output': excel, pdf

            if (!type || !limit) {
                return res.status(400).json({ message: 'Los parámetros "type" y "limit" son obligatorios.' });
            }

            const parsedLimit = parseInt(limit as string);

            const reportType = type as 'non_consecutive' | 'consecutive' | 'global';

            // Ejecuta el servicio
            const response = await GetCanjesForReportService.execute(reportType, parsedLimit);

            const { result, data } = response

            if (!result || !data) {
                return res.status(response.status || 500).json(response);
            }

            const fileExtension = output === "pdf" ? "pdf" : "xlsx";

            const filename = `reporte_subsidios_${reportType}_${fileSuffix}.${fileExtension}`;

            const dataCanjes = data as TItemReport[]

            if (output === 'excel') {
                const excelBuffer = await generateExcelReport(reportTitle, headersColumns, dataCanjes);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.send(excelBuffer);
            }

        } catch (error) {
            next(error)
            res.status(500).json({ message: 'Error interno del servidor al generar el reporte.', error: error });
        }
    }

    async getCanjeById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetCanjeService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createCanje(req: Request, res: Response, next: NextFunction) {
        try {
            const canjeData: ICanje = req.body;
            const result = await CreateCanjeService.execute(canjeData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateCanje(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const canjeData: ICanje = req.body;
            const result = await UpdateCanjeService.execute(id, canjeData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new CanjeController()