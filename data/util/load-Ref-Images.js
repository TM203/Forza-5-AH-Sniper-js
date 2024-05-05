const {loadImage} = require('canvas');

async function loadReferenceImages() {
    const referenceImages = {
        mainMenu: await loadImage('./ImageData/mainMenu.png'),
        MainMainMenu: await loadImage('./ImageData/MainMainMenu.png'),
        carAvalible: await loadImage('./ImageData/carAvalible.png'),
        empty: await loadImage('./ImageData/empty.png')
    };
    return referenceImages;
}


module.exports.loadReferenceImages = loadReferenceImages