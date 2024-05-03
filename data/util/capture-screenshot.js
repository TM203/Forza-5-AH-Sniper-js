const screenshot = require('screenshot-desktop');
const sharp = require('sharp');
const fs = require("fs");

async function captureScreenshot(filename, x, y, width, height) {
    const screenSize = await screenshot.listDisplays();
    const screenWidth = screenSize[0].width;
    const screenHeight = screenSize[0].height;

    const imgBuffer = await screenshot({ format: 'png', screen: 0, width: screenWidth, height: screenHeight });

    const resizedImgBuffer = await sharp(imgBuffer)
        .extract({ left: x, top: y, width: width, height: height })
        .toBuffer();

    fs.writeFileSync(filename, resizedImgBuffer);
}

module.exports.captureScreenshot = captureScreenshot