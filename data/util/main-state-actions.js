const {loadImage} = require('canvas');
const {compareImages} = require("./compare-Images")
const {captureScreenshot} = require("./capture-screenshot")
const {tableFunc} = require("./table");
const fs = require("fs");
const ks = require('node-key-sender');
const Tesseract = require('tesseract.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let carsCount = 0;

async function performActions(state, carsAmountMax, Delay=300) {
    
    if (carsCount >= carsAmountMax && carsAmountMax !== 0) {
        process.exit();
    }

    tableFunc({carsAmountMax, carsCount})

    switch (state) {
        case 'carAvalible':
            console.log('wdihwdiohiodwghiodwghiohwdiowdhgoihgwe')
            await sleep(Delay);
            ks.sendKey('y');
            await sleep(400);
            ks.sendKey('down');
            await sleep(200);
            ks.sendKey('enter');
            await sleep(400);
            ks.sendKey('enter');

            await sleep(4000);
            await captureScreenshot('./ImageData/screenshot.png',800, 400, 400, 200);
            const diffPixels = await compareImages(fs.readFileSync('./ImageData/screenshot.png'), await loadImage('./ImageData/Failed.png'));
            const threshold = 25933; //29900
            if (diffPixels < threshold) {
                await sleep(300);
                ks.sendKey('enter');
                await sleep(300);
                ks.sendKey('escape');
                await sleep(300);
                ks.sendKey('escape');
                await sleep(300);
                return;
            } else if (
                await Tesseract.recognize('./ImageData/screenshot.png').then( async function(result) {
                    const wordRegex = /buyout\s*successful/i
                    console.log(result?.data?.text)
                    if(wordRegex.test(result?.data?.text)) {
                        console.log('Car detected')
                        await sleep(1000);
                        ks.sendKey('enter');
                        await sleep(1000);
                        ks.sendKey('enter');
                        await sleep(10000);
                        carsCount++;
                        ks.sendKey('enter');
                        await sleep(400);
                        ks.sendKey('escape');
                        await sleep(400);
                        ks.sendKey('escape');
    
                    }
                })
                
            )
            return true;
        case 'mainMenu':
            ks.sendKey('enter');
            await sleep(400);
            ks.sendKey('enter');
            return true;
        case 'MainMainMenu':
            ks.sendKey('enter');
            return true;
    }
}


module.exports.performActions = performActions