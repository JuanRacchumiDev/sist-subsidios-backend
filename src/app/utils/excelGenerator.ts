import { THeaderColumn } from '../types/Reportes/THeader';
import ExcelJS from 'exceljs';

export const generateExcelReport = async (
    title: string,
    headersColumn: THeaderColumn[],
    data: any[]
): Promise<Buffer> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // 1. Configurar las columnas usando THeaderColumn
    // ExcelJS requiere que las columnas tengan una 'header' y una 'key'.
    // Usamos 'nameColumn' para 'header' y 'key' para 'key'.
    worksheet.columns = headersColumn.map(col => ({
        header: col.nameColumn,
        key: col.key,
        width: col.width
    }))

    // Las filas 1 y 2 quedan vacías para dar espacio al título
    worksheet.addRow([])
    worksheet.addRow([])

    // 2. Dibujar y dar estilo al título del reporte (Fila 3)
    const titleRow = worksheet.getRow(3)
    titleRow.values = [title]

    // const finalColumnLetter = worksheet.columns.length > 0 ? worksheet.columns[headers.length - 1].letter : 'A';
    const finalColumnLetter = worksheet.columns[headersColumn.length - 1].letter;
    worksheet.mergeCells(`A3:${finalColumnLetter}3`);

    // Aplicar estilo al título (negrita, centrado, tamaño de fuente grande)
    titleRow.eachCell((cell) => {
        cell.font = { bold: true, size: 16 };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // 3. Asignar encabezados a la Fila 4
    // El método worksheet.columns ya pobló internamente la Fila 1 con los headers.
    // Hay que copiar esos valores a la Fila 4 y borrar la Fila 1.
    const originalHeaderRow = worksheet.getRow(1);
    const originalValues = originalHeaderRow.values

    const headerValues = Array.isArray(originalValues) ? originalValues.slice(1) : []

    // Asignar los valores a la Fila 4
    const actualHeaderRow = worksheet.getRow(4);
    actualHeaderRow.values = headerValues;

    originalHeaderRow.values = []

    // Aplicar estilos a la fila de encabezado (fila 2, después del título)
    // Aplicar estilos a la fila de encabezado (Fila 4)
    actualHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Letra blanca
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF000080' } // Fondo azul oscuro (ejemplo)
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // 4. Mapear los datos de entrada al formato de filas de ExcelJS (¡Cambio clave!)
    // Iteramos sobre cada objeto de datos y construimos un objeto que ExcelJS pueda insertar
    // automáticamente basado en las 'key's de las columnas definidas.

    const mappedData = data.map(item => {
        const rowData: { [key: string]: any } = {};
        // Recorre las definiciones de columnas para extraer solo los campos necesarios
        // y con el nombre de propiedad correcto (key).
        headersColumn.forEach(header => {
            rowData[header.key] = item[header.key];
        });
        return rowData;
    });

    // Añadir las filas de datos
    worksheet.addRows(mappedData);

    // Generar el buffer de Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as unknown as Buffer;
};