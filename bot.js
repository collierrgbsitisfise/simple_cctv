const TelegramBot = require("node-telegram-bot-api");

class BOT {
  constructor(tokne, charID, aduioHandler = () => {}) {
    this.tokne = tokne;
    this.charID = charID;
    this.aduioHandler = aduioHandler;
    this.bot = new TelegramBot(tokne, {
      polling: true
    });

    this.bot.on("message", msg => {
      const { voice } = msg;
      if (voice) {
        this.aduioHandler(voice.file_id, this.tokne);
      }
    });
  }

  sendPhotoToUser(photoData, caption) {
    this.bot.sendPhoto(this.charID, photoData, {
      caption
    });
  }

  sendTextToUser(msg) {
    this.bot.sendMessage(this.charID, msg);
  }

  registerRoute(route, handlerCb) {
    this.bot.onText(route, handlerCb);
    return this;
  }
}

module.exports.BOT = BOT;
