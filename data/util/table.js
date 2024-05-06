const Table = require('cli-table3');
const fs = require('fs');

const table = new Table({
    head: ['Checking', 'data'],
    colWidths: [15, 15]
});

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
    //console.clear();
    console.log(table.toString());
};

module.exports.tableFunc = tableFunc

