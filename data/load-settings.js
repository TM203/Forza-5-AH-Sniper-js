const yaml = require('js-yaml');
const fs   = require('fs');

const SettingsYML = () => {
    try {
        const doc = yaml.load(fs.readFileSync('../settings.yml', 'utf8'));
        console.log(doc)
        return doc
      } catch (e) {
        console.log(e);
      }
}



module.exports.SettingsYML = SettingsYML