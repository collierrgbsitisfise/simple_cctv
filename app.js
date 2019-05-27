const cv = require("opencv");
const sleep = require("sleep");
const TelegramBot = require("node-telegram-bot-api");
const camera = new cv.VideoCapture(0); //open camera
const chatID = process.env.chatid;
const token = process.env.token;

console.log("chatID : ", chatID);
console.log("token : ", token);

const bot = new TelegramBot(token, {
  polling: true
});

// set the video size to 512x288
camera.setWidth(712);
camera.setHeight(712);

let firstFrame, wasMotionDetected;

const updateFiertImage = () => {
  return new Promise((resolve, _) => {
    camera.read(function(err, frame) {
      frame.save("original.jpg");
      bot.sendPhoto(chatID, require("fs").readFileSync("original.jpg"), {
        caption: "DVIJUHA"
      });
      firstFrame = frame;
      firstFrame.cvtColor("CV_BGR2GRAY");
      firstFrame.gaussianBlur([21, 21]);
      resolve(true);
    });
  });
};

sleep.sleep(2);

const getCameraSnapShot = () => {
  return new Promise((resolve, _) => {
    camera.read(async function(err, frame) {
      wasMotionDetected = false;
      let gray = frame.copy();

      gray.cvtColor("CV_BGR2GRAY");
      gray.gaussianBlur([21, 21]);

      let frameDelta = new cv.Matrix();

      frameDelta.absDiff(firstFrame, gray);

      let thresh = frameDelta.threshold(25, 255);

      thresh.dilate(2);

      let cnts = thresh.findContours();

      for (i = 0; i < cnts.size(); i++) {
        if (cnts.area(i) < 500) {
          continue;
        }

        wasMotionDetected = true;
      }

      if (wasMotionDetected) {
        await updateFiertImage();
      }

      resolve(true);
    });
  });
};

(async () => {
  await updateFiertImage();
  while (true) {
    await getCameraSnapShot();
    sleep.msleep(500);
  }
})();
