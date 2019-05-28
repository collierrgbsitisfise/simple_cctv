const TelegramBot = require("node-telegram-bot-api");

class BOT {
  constructor(tokne, userId) {
    this.tokne = tokne;
    this.userId = userId;
    this.bot = new TelegramBot(token, {
      polling: true
    });
  }

  sendPhotoToUser(photoData, caption) {
    bot.sendPhoto(this.userId, photoData, {
      caption
    });
  }
}

module.exports.BOT = BOT;
