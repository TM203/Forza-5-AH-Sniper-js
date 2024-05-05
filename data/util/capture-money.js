const {compareImages} = require("./compare-Images")
const Tesseract = require('tesseract.js');
const {captureScreenshot} = require("./capture-screenshot")
const screenshot = require('screenshot-desktop');
const {tableFunc} = require("./table");
const {SettingsYML} = require("../load-settings");
const settings = SettingsYML()
const display = settings?.Display -1 || 0

function sleep(seconds) {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


async function CaputeMoneyAmount(Time) {

        sleep(Time).then(() => {
            CaputeMoneyAmount(Time)
        })
        
        

        const screenSize = await screenshot.listDisplays();
        const screenWidth = screenSize[display].width - 700;
        await captureScreenshot('./ImageData/screenshotMoney.png', screenWidth, 0, 200, 100);
    
        const result = await Tesseract.recognize('./ImageData/screenshotMoney.png')

        let match = result.data.text.match(/\d+/g);

        if(match) {

            //if money limit hit, quit 
            //did you know 90% of gamblers quit just before they hit it big?
            console.log(settings?.Moneylimits?.Limitmoney, Number(match.join('')), settings?.Moneylimits?.MoneyLimit)

            if (settings?.Moneylimits?.Limitmoney && Number(match.join('')) < settings?.Moneylimits?.MoneyLimit) {
               process.exit();
            }
            
            tableFunc({moneyAmount: Number(match.join(''))})
        }

        
        

}


module.exports.CaputeMoneyAmount = CaputeMoneyAmount