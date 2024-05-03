const {compareImages} = require("./compare-Images")
const Tesseract = require('tesseract.js');
const {captureScreenshot} = require("./capture-screenshot")
const screenshot = require('screenshot-desktop');
const {tableFunc} = require("./table");
const fs = require("fs");

function sleep(seconds) {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


async function CaputeMoneyAmount(Time) {

        sleep(Time).then(() => {
            CaputeMoneyAmount(Time)
        })
        
        

        const screenSize = await screenshot.listDisplays();
        const screenWidth = screenSize[0].width;
        await captureScreenshot('./ImageData/screenshotMoney.png', screenWidth, 0, 200, 100);
    
        const result = await Tesseract.recognize('./ImageData/screenshotMoney.png')
        console.log(result?.data?.text)

        
        tableFunc({moneyAmount: Number(result?.data?.text.match(/\d+/g).join(''))})

}


module.exports.CaputeMoneyAmount = CaputeMoneyAmount