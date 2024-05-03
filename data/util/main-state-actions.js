
const {compareImages} = require("./compare-Images")
const {captureScreenshot} = require("./capture-screenshot")
const fs = require("fs");
const ks = require('node-key-sender');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function performActions(state) {
    switch (state) {
        case 'carAvalible':
            await sleep(1400);
            ks.sendKey('y');
            await sleep(400);
            ks.sendKey('down');
            await sleep(200);
            ks.sendKey('enter');
            await sleep(300);
            ks.sendKey('enter');
            await sleep(4000);
            await captureScreenshot('./ImageData/screenshot.png',800, 400, 400, 200);
            const diffPixels = await compareImages(fs.readFileSync('./ImageData/screenshot.png'), await loadImage('./ImageData/Failed.png'));
            const threshold = 29933;
            if (diffPixels < threshold) {
                await sleep(300);
                ks.sendKey('enter');
                await sleep(300);
                ks.sendKey('escape');
                await sleep(300);
                ks.sendKey('escape');
                await sleep(300);
                return;
            }
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
            return true;
        case 'mainMenu':
            ks.sendKey('enter');
            await sleep(400);
            ks.sendKey('enter');
            return true;
        case 'Searching':
            return true;
    }
}


module.exports.performActions = performActions