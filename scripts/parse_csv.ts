import { BigNumber } from '@ethersproject/bignumber';
import { program } from 'commander'
import fs from 'fs'

program
  .version('0.0.0')
  .requiredOption(
    '-i, --input <path>',
    'input csv location path which includes address amount and reason'
  )

program.parse(process.argv)

const json = csvToJSON(fs.readFileSync(program.input, { encoding: 'utf8' }));

json.map(account => {
    account.earnings = convertHexadecimal(parseFloat(account.earnings));
});

console.log(JSON.stringify(json, null, 2));


function csvToJSON(csv: string){

    var lines=csv.split("\n");
  
    var result = [];
  
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){
  
        var obj = { address: '', earnings: '', reasons: '' };
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            switch (j) {
                case 0:
                    obj.address = currentline[j];
                    break;
                case 1:
                    obj.earnings = currentline[j];
                    break;
                case 2: 
                    obj.reasons = currentline[j];
                    break;
            }
        }
  
        result.push(obj);
  
    }
  
    return result; 
}

function convertHexadecimal(amount: number): string{
    const addSeg = BigNumber.from((Math.floor((amount - Math.floor(amount)) * (10 ** 18))).toString());
    const num = BigNumber.from(Math.floor(amount)).mul(BigNumber.from(10).pow(18)).add(addSeg);
    const truncated = (num.div((BigNumber.from(10).pow(12)))).mul(BigNumber.from(10).pow(12));
    const hex1 = truncated.toHexString();
    const hex2 = num.toHexString();
    if (hex1 === '0x00'){
        return hex2;
    }else{
        return hex1;
    }
}