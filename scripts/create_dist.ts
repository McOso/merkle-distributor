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
            if (index > -1){
                const retroCell = wsRetroQuery.getCell('B'+index);
                const retroAmount = retroCell.value as number;
                const newAmmount = row.getCell(2).value as number;
                if (newAmmount > retroAmount){
                    const distAmount = newAmmount - retroAmount;
                    const retroReasons = wsRetroQuery.getCell('C'+index);
                    const newReasons = row.getCell(3);
                    const concatReasons = newReasons.value + '|' + retroReasons.value;
                    const distReasons = concatReasons.replace(',','|');

                    if (distAmount > 1){
                        wsNewDist.addRow({ address: addressCell.toString(), amount: distAmount, reasons: distReasons });
                    }
                }
            }else {
                const distAmount = row.getCell(2).value as number;
                if (distAmount > 1){
                    wsNewDist.addRow({ address: addressCell.toString(), amount: distAmount, reasons: row.getCell(3).value });
                }
            }
        }
    });

    workbookTemp.csv.writeFile('NewDistributionList.csv', { sheetName: 'New Distribution' });
});


