const fs = require("fs");
const { createCanvas, loadImage, Image } = require('canvas');
const pixelmatch = require('pixelmatch');
const screenshot = require('screenshot-desktop');
const ks = require('node-key-sender');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const settings = fs.readFileSync('../Settings.json', 'utf8');
const Table = require('cli-table3');

function stripComments(jsonString) {
    return jsonString.replace(/\/\/.*|\/\*[^]*?\*\//g, '');
}

const settingsWithoutComments = stripComments(settings);
let settingsJSON = JSON.parse(settingsWithoutComments);
let carsAmount = settingsJSON?.AmountOFCars || 0;
let carsCount = 0;

const table = new Table({
    head: ['Checking', 'data'],
    colWidths: [15, 15]
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function compareImages(screenshotData, referenceImage) {
    const screenshotImage = new Image();
    screenshotImage.src = screenshotData;

    const canvas1 = createCanvas(screenshotImage.width, screenshotImage.height);
    const ctx1 = canvas1.getContext('2d');
    ctx1.drawImage(screenshotImage, 0, 0);
    const screenshotImageData = ctx1.getImageData(0, 0, canvas1.width, canvas1.height);

    const canvas2 = createCanvas(referenceImage.width, referenceImage.height);
    const ctx2 = canvas2.getContext('2d');
    ctx2.drawImage(referenceImage, 0, 0);
    const referenceImageData = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);

    const diff = pixelmatch(
        screenshotImageData.data,
        referenceImageData.data,
        null,
        screenshotImage.width,
        screenshotImage.height,
        { threshold: 0.1 }
    );

    return diff;
}

async function loadReferenceImages() {
    const referenceImages = {
        mainMenu: await loadImage('mainMenu.png'),
        Searching: await loadImage('Searching.png'),
        carAvalible: await loadImage('carAvalible.png'),
        empty: await loadImage('empty.png')
    };
    return referenceImages;
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
            await captureScreenshot('screenshot.png',800, 400, 400, 200);
            const diffPixels = await compareImages(fs.readFileSync('screenshot.png'), await loadImage('Failed.png'));
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

async function main() {
    const referenceImages = await loadReferenceImages();
    while (true) {
        if (carsCount >= carsAmount && carsAmount !== 0) {
            process.exit();
        }
        await captureScreenshot('screenshot.png',700, 200, 200, 200);
        const screenshotData = fs.readFileSync('screenshot.png');
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
        table.push(
            ['Cars Bought', `${carsCount}`],
            ['Max Cars', `${carsAmount}`]
        );
        console.log(table.toString());
        table.length = 0;
        await captureScreenshot('screenshot.png',1100, 500, 200, 200);
        const diffPixels = await compareImages(fs.readFileSync('screenshot.png'), await loadImage('Gamertagup.png'));
        const threshold = 10000;
        Tesseract.recognize('screenshot.png').then( async function(result) {
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
        await new Promise(resolve => setTimeout(resolve, 700));
    }
}

main().catch(console.error);
