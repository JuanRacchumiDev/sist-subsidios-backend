import ExcelJS from 'exceljs';
// import { TItemReport } from './types/DescansoMedico/TItemReport'; // Asume que TItemReport está definido

export const generateExcelReport = async (headers: string[], data: any[]): Promise<Buffer> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Descansos Médicos');

    // Añadir los encabezados
    worksheet.columns = headers.map(header => ({
        header: header,
        key: header.toLowerCase().replace(/ /g, '_').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u'),
        width: 25,
    }));

    // Mapear los datos de TItemReport para que coincidan con las claves de las columnas
    const mappedData = data.map(item => ({
        nombre_colaborador: item.nombre_colaborador,
        fecha_otorgamiento: item.fecha_otorgamiento,
        fecha_inicio: item.fecha_inicio,
        fecha_final: item.fecha_final,
        total_dias: item.total_dias,
        tipo_de_contingencia: item.tipo_contingencia,
        tipo_de_descanso: item.tipo_descansomedico,
        mes_devengado: item.mes_devengado,
        codigo_citt: item.codigo_citt,
    }));

    // Añadir las filas de datos
    worksheet.addRows(mappedData);

    // Generar el buffer de Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
};