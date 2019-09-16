const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');


const removeFile = filePath => {
    fs.unlink(filePath, err => {
        if (err) throw err;
        console.log(path.basename(filePath) + ' was deleted');
    });
};


const writeToFile = (allData, destFile, fileNameObj) => {
    try {
        // for (i=0; i<)
        // let n= "\n\n\n\n\n\n\n\n\n\n\n"
        const ws = fs.createWriteStream(destFile, { flags: 'w' });
        // ws.write(n);
        // // for (key in fileNameObj) {
        // //     ws.write(fileNameObj[key] + ',' + key + '\n');
        // // }
        // csv.write(allData, {headers: true}).pipe(ws);
        csv.write(allData, { headers: true }).pipe(ws);

    } catch (e) {
        console.log('Err', e);
    }
};




const switchBetween2Columns = (arr, firtsKeyInObj, secondKeyInObject) => {
    arr.map((item) => {
        let tempValue;
        tempValue = item[firtsKeyInObj];
        item[firtsKeyInObj] = item[secondKeyInObject];
        item[secondKeyInObject] = tempValue;
    });
}

const defineTestByPlateType = (arrWithObjs, index, key) => {
    console.log("my location is:", arrWithObjs[index][key])
    let valueToreturn;
    switch (arrWithObjs[index][key]) {
        case "PCA":
            valueToreturn = "totalcount"
            break;
        case "Coliforms":
            valueToreturn = "coliforms"
            break;
        case "TBX":
            valueToreturn = "ecoli"
            break;
        case "Enterobacteriaceae":
            valueToreturn = "Enterobacteriaceae"
            break;
        default:
            valueToreturn = false;
    }
    return valueToreturn;
}

const convertDilutionFormat = (arrWithObjs, key)=>{
    for (let i = 0; i < arrWithObjs.length; i++){
        console.log(arrWithObjs[i][key])
        if (arrWithObjs[i][key] == '1.00E-01'){
            arrWithObjs[i][key] = '1 in 10';
        }
        else if (arrWithObjs[i][key] == '1.00E-02'){
            arrWithObjs[i][key] = '1 in 100';
        }
        else if (arrWithObjs[i][key] == '1.00E-03'){
            arrWithObjs[i][key] = '1 in 1000';
        }
        else if (arrWithObjs[i][key] == '1.00E-04'){
            arrWithObjs[i][key] = '1 in 10000';
        }
    }
}

module.exports = {
    removeFile,
    writeToFile,
    switchBetween2Columns,
    defineTestByPlateType,
    convertDilutionFormat
};
