const Table = require('cli-table3');
const fs = require('fs');
const {SettingsYML} = require("../load-settings");
const settings = SettingsYML()
const filePath = './data/data.json';
const table = new Table({
    head: [`Version ${settings.versionNumber || 0}`, 'data'],
    colWidths: [15, 15]
});

const settingsUpdateInv = settings?.Website?.RunLocalWebsite ? (settings.Website.UpdateInv || 300) * 1000 : 100000

const saveTableToJson = () => {
    try {
        // Convert the table data to JSON format
        const jsonData = JSON.stringify(table, null, 2);

        // Write the JSON data to a file, replacing the existing content
        fs.writeFileSync(filePath, jsonData);

        console.log('Table data saved to', filePath);
    } catch (error) {
        console.error('Error saving table data:', error);
    }
};

setInterval(saveTableToJson, settingsUpdateInv);


const formatNumber = (number) => {
    if(number >= 1000000000) {
        return (number / 1000000000).toFixed(2) + "b";
    } else if(number >= 1000000) {
        return (number / 1000000).toFixed(2) + "m";
    } else if(number >= 1000) {
        return (number / 1000).toFixed(2) + "k";
    } else {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

let data = {
    carsCount: 0,
    carsAmountMax: 0,
    moneyAmount: 0,
    moneyAmountMax: 0
}

const tableFunc = (NewData) => {

        data = { ...data, ...NewData };

        table.length = 0;
        // Update the table with the merged data
        for(const key in data) {
            table.push([key, formatNumber(data[key])]);
        }
    console.clear();
    console.log(table.toString());

    

};



module.exports.tableFunc = tableFunc

