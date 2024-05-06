const fs = require("fs");
const ks = require('node-key-sender');
const Tesseract = require('tesseract.js');
const {SettingsYML} = require("./load-settings");
const {loadReferenceImages} = require("./util/load-Ref-Images")
const {compareImages} = require("./util/compare-Images")
const {captureScreenshot} = require("./util/capture-screenshot")
const {performActions} = require("./util/main-state-actions")
const {CaputeMoneyAmount} = require("./util/capture-money");
const {tableFunc} = require("./util/table");

const {startNextServer} = require("./startNext")

const options = {
    accessibilityPermission: true, // Enable accessibility permission check (macOS only)
    screenRecordingPermission: true // Enable screen recording permission check (macOS only)
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





const settings = SettingsYML()

if(settings?.Website?.RunLocalWebsite) {
    startNextServer()
}

if(settings?.UnpdateImagesMoney) {
    CaputeMoneyAmount(settings?.MoneyTime || 300)
}

let HasBeenInMenu = false

async function CheckStateAndCap(referenceImages) {
    await captureScreenshot('./ImageData/screenshot.png',700, 300, 20, 20);
    let carDetected = false;
    const screenshotData = fs.readFileSync('./ImageData/screenshot.png');
    for (const state in referenceImages) {
        const diffPixels = await compareImages(screenshotData, referenceImages[state]);
        

        let threshold = 50;
        if(state === 'carAvalible') {
            
            threshold = 50;
        }
        if(state === 'Gamertagup') {
            threshold = 50;
        }
       
        console.log(diffPixels, threshold, state)
        if (diffPixels < threshold) {

            if(state === 'mainMenu') HasBeenInMenu = true
            
            carDetected = true


            const actionResult = await performActions(state, settings?.AmountOFCars || 0, settings?.Delay || 1000);

            if (!actionResult) {
                return true; 
            }
            

        } else if(state === 'carAvalible' && !carDetected && HasBeenInMenu) {
            HasBeenInMenu = false
            ks.sendKey('escape');
            return false
        }
        
    }
}


async function main() {


    const referenceImages = await loadReferenceImages();
    while (true) {
        let continueLoop = false

        if(settings?.CheckGameSelected) {
            import('get-windows').then(({ activeWindow }) => {
                activeWindow(options)
                    .then( async (result) => {
                        
                        if( result.title === 'Forza Horizon 5') {
                            continueLoop = await CheckStateAndCap(referenceImages)
                        }
    
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }).catch(error => {
                console.error('Error:', error);
            });
        } else {
            continueLoop = await CheckStateAndCap(referenceImages)
        }



        tableFunc({
            moneyAmountMax:settings?.Moneylimits?.Limitmoney ?  
            settings?.Moneylimits?.MoneyLimit || 
            0 : 0
        }


        )

        if (continueLoop) {
            await sleep(10000); // Pause the loop for 30 secondscontinueLoop
            continueLoop = true
        } else {
            tableFunc({
                moneyAmountMax: settings?.Moneylimits?.Limitmoney ? settings?.Moneylimits?.MoneyLimit || 0 : 0
            });

            await sleep(settings?.UpdateINT || 700); // Pause for the specified update interval
        }
        
    }
}

main().catch(console.error);
