
import fs from 'fs'

const readJsonFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        });
    });
};

const GET = async (req, res) => {
    try {
        const jsonData = await readJsonFile('../data/data/data.json');
        res.status(200).json({ data: jsonData });
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        res.status(500).json({ error: 'Error reading or parsing JSON file' });
    }
};

export default async (req, res) => {
    if (req.method === 'GET') {
        await GET(req, res);
    } else {
        res.status(405).end();
    }
};