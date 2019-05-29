const { BOT } = require("./bot");
const { CCTV } = require("./cctv");
const { SystemMonitor } = require("./systemMonitor");

const main = async () => {
  const chatID = process.env.chatid;
  const token = process.env.token;
  const bot = new BOT(token, chatID);
  const sm = new SystemMonitor();
  const cctv = new CCTV(712, 712, 500, imgData => {
    // bot.sendPhotoToUser(imgData);
  });

  console.log(await sm.getRAMInfo());
  cctv.start();
};

main();
