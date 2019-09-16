const fs = require('fs');
const csvParser = require('csv-parser');
const csv = require('fast-csv');
const path = require('path');
const io = require('./util/io');
const notification = require('./util/notification');
const config = require('config');

const tempDir = config.get('tempDir');

const oldVersionFile = path.resolve(config.get('oldFileVersionDir'), 'finalFile.csv');
console.log("oldVersionFile", oldVersionFile)
let count = 0;

fs.watch(tempDir, (eventType, filename) => {
    const pathDirAndFile = path.join(tempDir, filename);
    // i'm using count because fs.watch fires 3 times when i add file to this dir = 1-rename + 2-change
    console.log('count', count);
    if (eventType == 'change') {
        count += 1;
        if (count == 2) {

            let allData = [];
            let fileNameObj = {};
            let responseFile;

            let rowsNumber = 17;
            let startingData = { a: "", b: "", c: "", d: "", e: "", f: "", g: "", h: "", i:"" }
            for (let i = 0; i < rowsNumber; i++) {
                allData.push({ ...startingData });
            }
            fs.createReadStream(pathDirAndFile)

                // .pipe(csvParser({ headers:["Sample N°","Count","Dilution", "V (mL)", "CFU/mL"] }))
                .pipe(csvParser({ headers: ["a", "b", "c", "d", "e", "f", "g", "h", "i"] }))

                .on('error', error => console.error(error))
                .on('data', row => allData.push(row))
                .on('end', () => {
        
                   const testType =  io.defineTestByPlateType(allData, config.get('indexOfPlateType'), Object.keys( allData[0])[8]);

                   io.convertDilutionFormat(allData, 'c');
                    allData[config.get("indexTestType")].b = testType;
                       let firstColumn = Object.keys( allData[0] )[3];
                       let secondColumn = Object.keys( allData[0] )[4];
                        io.switchBetween2Columns(allData,firstColumn,secondColumn);
                         firstColumn = Object.keys( allData[0] )[2];
                        secondColumn = Object.keys( allData[0] )[4];
                        io.switchBetween2Columns(allData,firstColumn,secondColumn);
                    
                    io.writeToFile(allData, oldVersionFile, fileNameObj);

                    console.log({
                        message:
                            'The file:\n' +
                            pathDirAndFile +
                            ',\n \n uploaded to: \n' +
                            responseFile,
                    });

                    const message = `The file uploaded to ${oldVersionFile}`;
                    // windows notification
                    notification.displayNotification(
                        'hylabs-notification',
                        message,
                    );

                     io.removeFile(pathDirAndFile);
                });
           
            count = 0;
        }
    }
});
