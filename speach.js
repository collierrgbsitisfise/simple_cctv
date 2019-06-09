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

  static async executeOggAudioFromTelegramByFileId(fileId, token) {
    //get file path by fileId
    const { result } = await new Promise((res, _) => {
      https.get(
        `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`,
        data => {
          data.setEncoding("utf8");
          let rawData = "";
          data.on("data", chunk => {
            rawData += chunk;
          });
          data.on("end", () => {
            const parsedData = JSON.parse(rawData);
            res(parsedData);
          });
        }
      );
    });
    const file = fs.createWriteStream("voice_command.oga");

    //save file .oga
    await new Promise((res, _) => {
      https.get(
        `https://api.telegram.org/file/bot${token}/${result.file_path}`,
        data => {
          data.pipe(file);
          file.on("finish", function() {
            file.close();
            res("voice_command.oga");
          });
        }
      );
    });

    // convert .oga to .mp3
    await new Promise((res, _) => {
      exec("ffmpeg -i voice_command.oga voice_command.mp3", () => {
        res(true);
      });
    });

    await Speach.executeAudioMp3("voice_command.mp3");
  }
}

// https://api.telegram.org/bot<token>/getFile?file_id=<file_id>
module.exports.Speach = Speach;
