import ExcelJS  from 'exceljs'

const workbookTemp = new ExcelJS.Workbook();
const wsNewDist = workbookTemp.addWorksheet('New Distribution');
wsNewDist.columns = [
    { header: 'address', key: 'address' },
    { header: 'new dist', key: 'amount' },
    { header: 'reasons', key: 'reasons' }
  ];
  

const workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile('Retro-Query-Fork.xlsx').then(() => {
    const wsRetroQueryFork = workbook.getWorksheet('retro-query-fork');
    const wsRetroQuery = workbook.getWorksheet('retro-query');

    wsRetroQueryFork.eachRow(function(row, rowNumber) {
        const addressCell = row.getCell(1).value;
        if (addressCell?.toString().includes('0x')){
            const retroCol = wsRetroQuery.getColumn(1).values;
            let index = retroCol.findIndex(x => x?.toString() === addressCell.toString());
            if (index < 0){
                const distAmount = 30;
                wsNewDist.addRow({ address: addressCell.toString(), amount: distAmount, reasons: row.getCell(3).value });
            }
        }
    });

    workbookTemp.csv.writeFile('new_dist_list.csv', { sheetName: 'New Distribution' });
});


