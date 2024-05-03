
const { createCanvas, Image } = require('canvas');
const pixelmatch = require('pixelmatch');

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

module.exports.compareImages = compareImages