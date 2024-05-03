const fs = require("fs");
const {loadImage} = require('canvas');
const ks = require('node-key-sender');
const Tesseract = require('tesseract.js');
const {SettingsYML} = require("./load-settings");
const {loadReferenceImages} = require("./util/load-Ref-Images")
const {compareImages} = require("./util/compare-Images")
const {captureScreenshot} = require("./util/capture-screenshot")
const {performActions} = require("./util/main-state-actions")
const {CaputeMoneyAmount} = require("./util/capture-money");
const {tableFunc} = require("./util/table");

const settings = SettingsYML()





if(settings?.UnpdateImagesMoney) {
    CaputeMoneyAmount(settings?.MoneyTime || 300)
}


let carsAmount = settings?.AmountOFCars || 0;
let carsCount = 0;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function main() {
    const referenceImages = await loadReferenceImages();
    while (true) {
        if (carsCount >= carsAmount && carsAmount !== 0) {
            process.exit();
        }

        tableFunc({carsAmount, carsCount})

        await captureScreenshot('./ImageData/screenshot.png',700, 200, 200, 200);
        const screenshotData = fs.readFileSync('./ImageData/screenshot.png');
        for (const state in referenceImages) {
            const diffPixels = await compareImages(screenshotData, referenceImages[state]);
            let threshold = 9000;
            if(state === 'carAvalible') {
                threshold = 18000;
            }
            if(state === 'Gamertagup') {
                threshold = 20000;
            }
            if (diffPixels < threshold) {
                await performActions(state);
            }
        }

        await captureScreenshot('./ImageData/screenshot.png',1100, 500, 200, 200);
        const diffPixels = await compareImages(fs.readFileSync('./ImageData/screenshot.png'), await loadImage('./ImageData/Gamertagup.png'));
        const threshold = 10000;
        Tesseract.recognize('./ImageData/screenshot.png').then( async function(result) {
            if(result?.data?.text.includes("NO")) {
                ks.sendKey('escape');
            } else if (diffPixels < threshold) {
                ks.sendKey('escape');
                await sleep(400);
                ks.sendKey('escape');
                await sleep(400);
                ks.sendKey('escape');
                await sleep(400);
                ks.sendKey('escape');
            }
        });
        await new Promise(resolve => setTimeout(resolve, settings?.UpdateINT || 700));
    }
}

main().catch(console.error);
