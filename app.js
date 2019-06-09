const { BOT } = require("./bot");
const { CCTV } = require("./cctv");
const { SystemMonitor } = require("./systemMonitor");
const { Speach } = require("./speach");
const main = async () => {
  const chatID = process.env.chatid;
  const token = process.env.token;
  const bot = new BOT(
    token,
    chatID,
    Speach.executeOggAudioFromTelegramByFileId
  );
  const sm = new SystemMonitor();

  bot
    .registerRoute(/\/ramusg/, async () => {
      const ramUsage = await sm.getRAMInfo();
      bot.sendTextToUser(ramUsage);
    })
    .registerRoute(/\/cpuusg/, async () => {
      const ramUsage = await sm.getRAMInfo();
      bot.sendTextToUser(ramUsage);
    })
    .registerRoute(/\/playtext (.+)/, async (_, match) => {
      const text = match[1];
      const fileName = await Speach.getSpeachByText(text, "kek");
      await Speach.executeAudioMp3(fileName);
    });

  const cctv = new CCTV(712, 712, 500, imgData => {
    bot.sendPhotoToUser(imgData);
  });

  cctv.start();
};

main();
