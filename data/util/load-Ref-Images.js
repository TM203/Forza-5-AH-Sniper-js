const {loadImage} = require('canvas');

async function loadReferenceImages() {
    const referenceImages = {
        mainMenu: await loadImage('./ImageData/mainMenu.png'),
        Searching: await loadImage('./ImageData/Searching.png'),
        carAvalible: await loadImage('./ImageData/carAvalible.png'),
        empty: await loadImage('./ImageData/empty.png')
    };
    return referenceImages;
}


module.exports.loadReferenceImages = loadReferenceImages