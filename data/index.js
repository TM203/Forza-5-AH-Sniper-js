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

const options = {
    accessibilityPermission: true, // Enable accessibility permission check (macOS only)
    screenRecordingPermission: true // Enable screen recording permission check (macOS only)
};







const settings = SettingsYML()


if(settings?.UnpdateImagesMoney) {
    CaputeMoneyAmount(settings?.MoneyTime || 300)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function main() {


    const referenceImages = await loadReferenceImages();
    while (true) {

        import('get-windows').then(({ activeWindow }) => {
            activeWindow(options)
                .then( async (result) => {
                    console.log(result.title)
                    if( result.title === 'Forza Horizon 5') {
                        await captureScreenshot('./ImageData/screenshot.png',700, 300, 20, 20);
                        let carDetected = false;
                        const screenshotData = fs.readFileSync('./ImageData/screenshot.png');
                        for (const state in referenceImages) {
                            const diffPixels = await compareImages(screenshotData, referenceImages[state]);
                
                            
                            let threshold = 100;
                            if(state === 'carAvalible') {
                                
                                threshold = 50;
                            }
                            if(state === 'Gamertagup') {
                                threshold = 100;
                            }
                            console.log(diffPixels, threshold, state)
                            
                            if (diffPixels < threshold) {
                                carDetected = true
                                
                                await performActions(state, settings?.AmountOFCars || 0, settings?.Delay || 300);
                            } else if(state === 'carAvalible' && !carDetected) {
                                console.log('Bevan Sucks')
                                ks.sendKey('escape');
                            }
                        }
                    }

                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }).catch(error => {
            console.error('Error:', error);
        });

        tableFunc({
            moneyAmountMax:settings?.Moneylimits?.Limitmoney ?  
            settings?.Moneylimits?.MoneyLimit || 
            0 : 0
        }
        )


        await new Promise(resolve => setTimeout(resolve, settings?.UpdateINT || 700));
    }
}

main().catch(console.error);
