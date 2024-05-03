const yaml = require('js-yaml');
const fs   = require('fs');

let settings = false

const SettingsYML = () => {
    try {

      if(!settings) {
        const doc = yaml.load(fs.readFileSync('../settings.yml', 'utf8'));

        settings = doc
      }

        return settings
      } catch (e) {
        console.log(e);
      }
}



module.exports.SettingsYML = SettingsYML