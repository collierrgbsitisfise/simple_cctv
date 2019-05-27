const cv = require("opencv");
const sleep = require("sleep");

const camera = new cv.VideoCapture(0); //open camera

//set the video size to 512x288
camera.setWidth(512);
camera.setHeight(288);

let firstFrame, wasMotionDetected;

camera.read(function(err, frame) {
  firstFrame = frame;
  //convert to grayscale
  firstFrame.cvtColor("CV_BGR2GRAY");
  firstFrame.gaussianBlur([21, 21]);
});

const updateFiertImage = () => {
  return new Promise((res, rej) => {
    camera.read(function(err, frame) {
      frame.save("original.jpg");
      firstFrame = frame;
      firstFrame.cvtColor("CV_BGR2GRAY");
      firstFrame.gaussianBlur([21, 21]);
      res(true);
    });
  });
};

sleep.sleep(2);

interval = setInterval(function() {
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
  });
}, 500);
