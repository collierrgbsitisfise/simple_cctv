const cv = require("opencv");
const sleep = require("sleep");

const camera = new cv.VideoCapture(0); //open camera

//set the video size to 512x288
camera.setWidth(712);
camera.setHeight(712);

let firstFrame, wasMotionDetected;

const updateFiertImage = () => {
  return new Promise((resolve, _) => {
    camera.read(function(err, frame) {
      frame.save("original.jpg");
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

      console.log(cnts.size());
      for (i = 0; i < cnts.size(); i++) {
        if (cnts.area(i) < 500) {
          continue;
        }

        wasMotionDetected = true;
      }

      if (wasMotionDetected) {
        console.log("MOTION DETECTED!!");
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
    sleep.sleep(1);
  }
})();
