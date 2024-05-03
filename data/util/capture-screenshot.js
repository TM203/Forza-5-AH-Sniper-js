const screenshot = require('screenshot-desktop');
const sharp = require('sharp');
const fs = require("fs");
const {SettingsYML} = require("../load-settings");
const settings = SettingsYML()
const display = settings?.Display -1 || 0

async function captureScreenshot(filename, x, y, width, height) {
    const screenSize = await screenshot.listDisplays();

    const screenWidth = screenSize[display].width;
    const screenHeight = screenSize[display].height;

    const imgBuffer = await screenshot({ format: 'png', screen: 0, width: screenWidth, height: screenHeight });

    const resizedImgBuffer = await sharp(imgBuffer)
        .extract({ left: x, top: y, width: width, height: height })
        .toBuffer();

    fs.writeFileSync(filename, resizedImgBuffer);
}

module.exports.captureScreenshot = captureScreenshot