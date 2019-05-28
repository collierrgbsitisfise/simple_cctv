const BOT = require("./bot");
const CCTV = require("./cctv");

const main = () => {
  const chatID = process.env.chatid;
  const token = process.env.token;
  console.log("chatID ", chatID);
  console.log("token ", token);
};

// const c = new CCTV(712, 712, 500, function() {
//   console.log("MOTION DETECTED");
// });
// await c.start();
main();
