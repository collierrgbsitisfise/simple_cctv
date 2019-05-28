const TelegramBot = require("node-telegram-bot-api");

class BOT {
  constructor(tokne, charID) {
    this.tokne = tokne;
    this.charID = charID;
    this.bot = new TelegramBot(tokne, {
      polling: true
    });
  }

  sendPhotoToUser(photoData, caption) {
    this.bot.sendPhoto(this.charID, photoData, {
      caption
    });
  }
}

module.exports.BOT = BOT;
