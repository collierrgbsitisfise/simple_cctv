const { BOT } = require("./bot");
const { CCTV } = require("./cctv");

const main = () => {
  const chatID = process.env.chatid;
  const token = process.env.token;
  const bot = new BOT(token, chatID);
  const cctv = new CCTV(712, 712, 500, imgData => {
    bot.sendPhotoToUser(imgData);
  });

  cctv.start();
};

main();
