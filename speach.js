const https = require("https");
const fs = require("fs");
const { exec } = require("child_process");

class Speach {
  constructor() {}

  static generateRequestURL(text) {
    return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURI(
      text
    )}&tl=ru`;
  }

  static getSpeachByText(text, fileName) {
    const file = fs.createWriteStream(`${fileName}.mp3`);
    return new Promise((res, _) => {
      https.get(Speach.generateRequestURL(text), data => {
        data.pipe(file);
        file.on("finish", function() {
          file.close();
          res(`${fileName}.mp3`);
        });
      });
    });
  }

  static executeAudioMp3(fileName) {
    return new Promise((res, _) => {
      exec(`mpg321 ${fileName}`, () => {
        res(true);
      });
    });
  }
}

module.exports.Speach = Speach;
