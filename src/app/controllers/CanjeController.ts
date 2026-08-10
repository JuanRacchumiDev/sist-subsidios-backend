import { NextFunction, Response, Request } from "express";
import GetCanjesService from '../services/Canje/GetCanjes'
import GetCanjeService from '../services/Canje/GetCanje'
import GetCanjesForReportService, { TReportType } from '../services/Canje/GetCanjesForReport'
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
            const {
                query: {
                    page,
                    limit,
                    id_empresa,
                    id_tipocontingencia,
                    id_tipodescansomedico,
                    search,
                    fecha_inicio,
                    fecha_final,
                }
            } = req

            const setPage = parseInt(page as string) || 1
            const setLimit = parseInt(limit as string) || 10

            // Construir el objeto de filtros (maneja el estado como booleano si es necesario)
            const filters: ICanjeFilter = {
                id_tipodescansomedico: id_tipodescansomedico as string,
                id_tipocontingencia: id_tipocontingencia as string,
                id_empresa: id_empresa as string,
                nombre_colaborador: (search as string)?.trim(),
                fecha_inicio_subsidio: fecha_inicio as string,
                fecha_final_subsidio: fecha_final as string,
            };

            console.log({ filters })

            const result = await GetCanjesPaginateService.execute(setPage, setLimit, filters)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Controlador principal para obtener el reporte agrupado de canjes/subsidios
     */
    async getAllForReport(req: Request, res: Response, next: NextFunction) {
        try {
            const fileSuffix = HDate.getCurrentDateToString("ddMMyyyy");

            const {
                type,
                limit,
                output,
                fechaInicio,
                fechaFinal,
                fecha_inicio,
                fecha_final
            } = req.query;

            // 1. Validaciones de parámetros requeridos
            if (!type || !limit) {
                return res.status(400).json({
                    success: false,
                    message: 'Los parámetros "type" y "limit" son obligatorios.'
                });
            }

            const parsedLimit = parseInt(limit as string, 10);
            const reportTypeRaw = type as string;

            // 2. Mapeo seguro al tipo de reporte soportado por el servicio
            let reportType: TReportType;
            if (reportTypeRaw === 'no_consecutivos' || reportTypeRaw === 'no_consecutivos_90') {
                reportType = 'no_consecutivos_90';
            } else if (reportTypeRaw === 'consecutivos' || reportTypeRaw === 'consecutivos_150') {
                reportType = 'consecutivos_150';
            } else if (reportTypeRaw === 'global' || reportTypeRaw === 'global_340') {
                reportType = 'global_340';
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'El parámetro "type" es inválido. Permitidos: no_consecutivos, consecutivos, global.'
                });
            }

            // 3. Captura opcional de fechas
            const startDate = (fechaInicio || fecha_inicio) ? String(fechaInicio || fecha_inicio) : undefined;
            const endDate = (fechaFinal || fecha_final) ? String(fechaFinal || fecha_final) : undefined;

            // 4. Ejecución del Servicio
            const dataCanjes: TItemReport[] = await GetCanjesForReportService.execute(
                reportType,
                startDate,
                endDate
            );

            const titleReport = CanjeController.defineTitleReport(reportTypeRaw, parsedLimit);

            // 5. Retorno en formato JSON (por defecto si no solicita archivo)
            if (!output || output === 'json') {
                return res.status(200).json({
                    success: true,
                    title: titleReport,
                    total: dataCanjes.length,
                    data: dataCanjes
                });
            }

            // 6. Generación e impresión de reporte Excel
            if (output === 'excel') {
                const headersColumns: THeaderColumn[] = [
                    {
                        nameColumn: "ID / CÓDIGO COLABORADOR",
                        key: "id_colaborador",
                        width: 25
                    },
                    {
                        nameColumn: "APELLIDOS Y NOMBRES",
                        key: "nombre_colaborador",
                        width: 40
                    },
                    {
                        nameColumn: "CANTIDAD DE CANJES",
                        key: "cantidad_canjes",
                        width: 20
                    },
                    {
                        nameColumn: "TOTAL DÍAS ACUMULADOS",
                        key: "total_dias_acumulados",
                        width: 25
                    },
                    {
                        nameColumn: "¿EXCEDE LÍMITE?",
                        key: "excede_limite",
                        width: 18
                    }
                ];

                const fileExtension = "xlsx";
                const filename = `reporte_subsidios_${parsedLimit}_${reportTypeRaw}_${fileSuffix}.${fileExtension}`;

                const excelBuffer = await generateExcelReport(titleReport, headersColumns, dataCanjes);

                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                return res.status(200).send(excelBuffer);
            }

            return res.status(400).json({
                success: false,
                message: 'Formato de salida "output" no soportado.'
            });

        } catch (error: any) {
            next(error);
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

    /**
     * Define el título dynamic para la cabecera del reporte Excel/PDF
     */
    private static defineTitleReport(type: string, limit: number): string {
        switch (type) {
            case 'no_consecutivos':
            case 'no_consecutivos_90':
                return `REPORTE DE SUBSIDIOS NO CONSECUTIVOS (LÍMITE: ${limit} DÍAS)`;
            case 'consecutivos':
            case 'consecutivos_150':
                return `REPORTE DE SUBSIDIOS CONSECUTIVOS (LÍMITE: ${limit} DÍAS)`;
            case 'global':
            case 'global_340':
                return `REPORTE GLOBAL DE SUBSIDIOS (LÍMITE: ${limit} DÍAS)`;
            default:
                return `REPORTE ACUMULADO DE SUBSIDIOS MAYORES A ${limit} DÍAS`;
        }
    }
}

export default new CanjeController()