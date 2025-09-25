import PDFDocument from 'pdfkit';

export const generatePdfReport = (headers: string[], data: any[]): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 30 });
        let buffers: any[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
        });
        doc.on('error', reject);

        // Título
        doc.fontSize(16).text('Reporte de Descansos Médicos', { align: 'center' });
        doc.moveDown();

        // Tabla de datos
        const table = {
            headers: headers.map(header => ({
                label: header,
                property: header.replace(/ /g, '_').toLowerCase(),
                width: 70,
                renderer: null
            })),
            datas: data,
        };

        const tableTop = doc.y;
        const columnWidth = 60;
        const rowHeight = 20;

        // Dibuja los encabezados
        doc.fontSize(10).font('Helvetica-Bold');
        headers.forEach((header, i) => {
            doc.text(header, doc.page.margins.left + i * columnWidth, tableTop, { width: columnWidth, align: 'left' });
        });
        doc.y = tableTop + rowHeight;

        // Dibuja las filas de datos
        doc.font('Helvetica');
        data.forEach((row, i) => {
            const y = tableTop + rowHeight + i * rowHeight;
            doc.text(row.colaborador || '', doc.page.margins.left + 0 * columnWidth, y, { width: columnWidth });
            doc.text(row.fecha_inicio || '', doc.page.margins.left + 1 * columnWidth, y, { width: columnWidth });
            doc.text(row.fecha_final || '', doc.page.margins.left + 2 * columnWidth, y, { width: columnWidth });
            doc.text(String(row.total_dias) || '', doc.page.margins.left + 3 * columnWidth, y, { width: columnWidth });
            doc.text(row.tipo_contingencia || '', doc.page.margins.left + 4 * columnWidth, y, { width: columnWidth });
            doc.text(row.tipo_descanso || '', doc.page.margins.left + 5 * columnWidth, y, { width: columnWidth });
            doc.text(row.mes_devengado || '', doc.page.margins.left + 6 * columnWidth, y, { width: columnWidth });
            doc.text(row.codigo_citt || '', doc.page.margins.left + 7 * columnWidth, y, { width: columnWidth });
        });

        doc.end();
    });
};