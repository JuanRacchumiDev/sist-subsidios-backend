import { NextFunction, Response, Request } from "express";
import GetDescansosService from '../services/DescansoMedico/GetDescansos'
import GetDescansoService from '../services/DescansoMedico/GetDescanso'
import GetDescansosPaginateService from '../services/DescansoMedico/GetDescansosPaginate'
import GetDescansosByColaboradorPaginate from "../services/DescansoMedico/GetDescansosByColaboradorPaginate"
import GetDescansosForReportService from "../services/DescansoMedico/GetDescansosForReport"
import GetDescansosWithCanjesForReportService from "../services/DescansoMedico/GetDescansosWithCanjesForReport"
import CreateDescansoService from '../services/DescansoMedico/CreateDescanso'
import UpdateDescansoService from '../services/DescansoMedico/UpdateDescanso'
import { IDescansoMedico } from "../interfaces/DescansoMedico/IDescansoMedico";
import { ResponseTransaction } from '../types/DescansoMedico/TResponseTransaction';
import { generatePdfReport } from "../utils/pdfGenerator";
import { generateExcelReport } from "../utils/excelGenerator";
import { IDescansoMedicoFilter } from "../interfaces/DescansoMedico/IDescansoMedicoFilter";
import HDate from "../../helpers/HDate";
import { TItemReportDescansos, TItemReportSubsidios } from "../types/DescansoMedico/TItemReport";
import { THeaderColumn } from '../types/Reportes/THeader';

class DescansoMedicoController {
    async getAllDescansos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetDescansosService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllDescansosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            // Extracción de filtros opcionales de req.query
            const {
                id_tipodescansomedico,
                id_tipocontingencia,
                nombre_colaborador,
                fecha_inicio,
                fecha_final,
                estado
            } = req.query;

            // Construir el objeto de filtros (maneja el estado como booleano si es necesario)
            const filters: IDescansoMedicoFilter = {
                id_tipodescansomedico: id_tipodescansomedico as string,
                id_tipocontingencia: id_tipocontingencia as string,
                nombre_colaborador: nombre_colaborador as string,
                fecha_inicio: fecha_inicio as string,
                fecha_final: fecha_final as string,
                estado: estado !== undefined ? estado === 'true' : undefined // Convierte 'true'/'false' a booleano, o undefined si no está
            };

            const result = await GetDescansosPaginateService.execute(page, limit, filters)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllDescansosByColaboradorPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const idColaborador = req.query.idColaborador as string

            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            // Extracción de filtros opcionales de req.query
            const {
                id_tipodescansomedico,
                id_tipocontingencia,
                fecha_inicio,
                fecha_final,
                estado
            } = req.query;

            // Construir el objeto de filtros (maneja el estado como booleano si es necesario)
            const filters: IDescansoMedicoFilter = {
                id_tipodescansomedico: id_tipodescansomedico as string,
                id_tipocontingencia: id_tipocontingencia as string,
                fecha_inicio: fecha_inicio as string,
                fecha_final: fecha_final as string,
                estado: estado !== undefined ? estado === 'true' : undefined // Convierte 'true'/'false' a booleano, o undefined si no está
            };

            const result = await GetDescansosByColaboradorPaginate.execute(idColaborador, page, limit, filters)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllDescansosForReport(req: Request, res: Response, next: NextFunction) {
        try {
            const { tipo } = req.query

            const response = await GetDescansosForReportService.execute()

            const { data } = response

            const dataDescansos = data as TItemReportDescansos[]

            const headersColumn: THeaderColumn[] = [
                {
                    nameColumn: "COLABORADOR",
                    key: "nombre_colaborador",
                    width: 25
                },
                {
                    nameColumn: "F. OTORGAMIENTO",
                    key: "fecha_otorgamiento",
                    width: 25
                },
                {
                    nameColumn: "F. INICIO",
                    key: "fecha_inicio",
                    width: 25
                },
                {
                    nameColumn: "F. FINAL",
                    key: "fecha_final",
                    width: 25
                },
                {
                    nameColumn: "TOTAL DÍAS",
                    key: "total_dias",
                    width: 25
                },
                {
                    nameColumn: "TIPO DE DESCANSO",
                    key: "nombre_tipodescanso",
                    width: 25
                },
                {
                    nameColumn: "TIPO DE CONTINGENCIA",
                    key: "nombre_tipocontingencia",
                    width: 25
                },
                {
                    nameColumn: "MES DEVENGADO",
                    key: "mes_devengado",
                    width: 25
                },
                {
                    nameColumn: "CÓDIGO CITT",
                    key: "codigo_citt",
                    width: 25
                },
            ]

            const reportTitle = 'REPORTE DE DETALLE DE DESCANSOS MÉDICOS'

            const fileExtension = tipo === "pdf" ? "pdf" : "xlsx"

            const fileSuffix = HDate.getCurrentDateToString("ddMMyyyy")

            const filename = `reporte_descansos_${fileSuffix}.${fileExtension}`

            if (tipo === 'pdf') {
                const pdfBuffer = await generatePdfReport(reportTitle, headersColumn, dataDescansos);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.send(pdfBuffer);
            } else if (tipo === 'excel') {
                const excelBuffer = await generateExcelReport(reportTitle, headersColumn, dataDescansos);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.send(excelBuffer);
            } else {
                return res.status(400).json({ message: 'Tipo de reporte no válido.' });
            }

            // res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
            res.status(500).json({ message: 'Error interno del servidor al generar el reporte.', error: error });
            // next(error)
        }
    }

    async getAllDescansosWithCanjesForReport(req: Request, res: Response, next: NextFunction) {
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
                    nameColumn: "APELLIDOS Y NOMBRES",
                    key: "nombre_colaborador",
                    width: 40
                },
                {
                    nameColumn: "F. INGRESO",
                    key: "fecha_ingreso",
                    width: 15
                },
                {
                    nameColumn: "PUESTO",
                    key: "puesto",
                    width: 30
                },
                {
                    nameColumn: "SEDE",
                    key: "sede",
                    width: 30
                },
                {
                    nameColumn: "MES DEVENGUE",
                    key: "mes_devengado_dm",
                    width: 20
                },
                {
                    nameColumn: "TIPO DE CONTINGENCIA",
                    key: "tipo_contingencia",
                    width: 30
                },
                {
                    nameColumn: "INICIO DE DM",
                    key: "fecha_inicio_dm",
                    width: 20
                },
                {
                    nameColumn: "FIN DE DM",
                    key: "fecha_final_dm",
                    width: 20
                },
                {
                    nameColumn: "N° DE DÍAS DE DM",
                    key: "total_dias_dm",
                    width: 20
                },
                {
                    nameColumn: "INICIO SUBSIDIO",
                    key: "fecha_inicio_subsidio",
                    width: 20
                },
                {
                    nameColumn: "FIN SUBSIDIO",
                    key: "fecha_final_subsidio",
                    width: 20
                },
                {
                    nameColumn: "N° DE DÍAS SUBSIDIO",
                    key: "total_dias",
                    width: 20
                }
            ]

            const { tipo } = req.query

            const fileExtension = tipo === "pdf" ? "pdf" : "xlsx"

            const filename = `reporte_consolidado_descansos_${fileSuffix}.${fileExtension}`

            const response = await GetDescansosWithCanjesForReportService.execute()

            const { data } = response

            const dataDescansos = data as TItemReportSubsidios[]

            console.log({ dataDescansos })

            if (tipo === 'pdf') {
                const pdfBuffer = await generatePdfReport(reportTitle, headersColumns, dataDescansos)
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.send(pdfBuffer);
            } else if (tipo === 'excel') {
                const excelBuffer = await generateExcelReport(reportTitle, headersColumns, dataDescansos);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                res.send(excelBuffer);
            } else {
                return res.status(400).json({ message: 'Tipo de reporte no válido.' });
            }

        } catch (error) {
            next(error)
            res.status(500).json({ message: 'Error interno del servidor al generar el reporte.', error: error });
        }
    }

    async getDescansoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetDescansoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createDescanso(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log('parámetros new descanso médico', req.body)
            const descansoData: IDescansoMedico = req.body;

            const response = await CreateDescansoService.execute(descansoData);
            // console.log('response createDescanso', response)

            const dataResponse = response as ResponseTransaction
            // console.log('dataResponse createDescanso', dataResponse)

            res.status(dataResponse.status || 201).json(dataResponse);
        } catch (error) {
            next(error);
        }
    }

    async updateDescanso(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const descansoData: IDescansoMedico = req.body;
            const result = await UpdateDescansoService.execute(id, descansoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new DescansoMedicoController()