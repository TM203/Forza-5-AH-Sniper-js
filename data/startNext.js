const { exec } = require('child_process');
const internalIp = require('internal-ip');

let errors
const folderPath = '../website';
async function startNextServer() {

    

    exec('npm run dev', { cwd: folderPath },  (error, stdout, stderr) => {

        if (error) {
            console.error(`Error executing command: ${error}`);
            errors = error
            return;
        }

        
    });
    displayNextJsServerInfo()

}



async function displayNextJsServerInfo() {
    try {
        
        const ip = await internalIp.v4() || "unknown";

        console.log(`Next.js production server is running on http://${ip}:3000`);
    } catch (error) {
        console.error('Error:', error);
        console.log(`Warning.. Next.js production server is not running`);
    }

    
}

setInterval(displayNextJsServerInfo, 5000);

module.exports.startNextServer = startNextServer