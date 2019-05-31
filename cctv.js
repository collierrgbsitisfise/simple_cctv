const cv = require("opencv");
const sleep = require("sleep");
const fs = require("fs");
class CCTV {
  constructor(width, height, snapshotInterval, onMotionDetectCb) {
    this.camera = new cv.VideoCapture(0);
    this.width = width;
    this.height = height;
    this.snapshotInterval = snapshotInterval;
    this.onMotionDetectCb = onMotionDetectCb;
    this.wasMotionDetected = false;
    this.firstFrame = null;
  }

  async start() {
    sleep.sleep(2);
    this.camera.setWidth(this.width);
    this.camera.setHeight(this.height);
    await this.setFirstFrame();
    while (true) {
      await this.getCameraSnapShot();
      sleep.msleep(500);
    }
  }

  setFirstFrame() {
    return new Promise((resolve, _) => {
      this.camera.read((err, frame) => {
        this.firstFrame = frame;
        this.firstFrame.cvtColor("CV_BGR2GRAY");
        this.firstFrame.gaussianBlur([21, 21]);
        resolve(true);
      });
    });
  }

  updateFirstImage() {
    return new Promise((resolve, _) => {
      this.camera.read(async (err, frame) => {
        frame.save("motion.jpg");
        this.firstFrame = frame;
        this.firstFrame.cvtColor("CV_BGR2GRAY");
        this.firstFrame.gaussianBlur([21, 21]);
        await this.onMotionDetectCb(fs.readFileSync("motion.jpg"));
        resolve(true);
      });
    });
  }

  getCameraSnapShot() {
    return new Promise((resolve, _) => {
      this.camera.read(
        async function(err, frame) {
          this.wasMotionDetected = false;
          let gray = frame.copy();
          gray.cvtColor("CV_BGR2GRAY");
          gray.gaussianBlur([21, 21]);
          let frameDelta = new cv.Matrix();
          frameDelta.absDiff(this.firstFrame, gray);
          let thresh = frameDelta.threshold(25, 255);
          thresh.dilate(2);
          let cnts = thresh.findContours();
          for (let i = 0; i < cnts.size(); i++) {
            if (cnts.area(i) < 500) {
              continue;
            }
            this.wasMotionDetected = true;
          }
          if (this.wasMotionDetected) {
            await this.updateFirstImage.bind(this)();
          }
          resolve(true);
        }.bind(this)
      );
    });
  }
}

module.exports.CCTV = CCTV;
