let video;
let poseNet;
let pose;
let skeleton;



let brain;
let poseLabel = "";
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  let options = {
    inputs: 34,
    outputs: 2,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'model.json',
    metadata: 'model_meta.json',
    weights: 'model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x * mul + factor;
      let y = pose.keypoints[i].position.y * mulFacHeight;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
  } else {
      poseLabel = 'N';
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  background(220);
  translate(video.width, 0);
  scale(-1, 1);
  factor = -(windowWidth - video.width);
  mulFacHeight = windowHeight/480;
  image(video, factor, 0, windowWidth, windowHeight);
  mul = windowWidth/640; 
  if (pose) {
    /*for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x * mul + factor, a.position.y * mulFacHeight,b.position.x * mul + factor,b.position.y * mulFacHeight);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x * mul + factor;
      let y = pose.keypoints[i].position.y * mulFacHeight;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }*/
  }
  pop();             
  fill(255, 0, 255);
  noStroke();
  textSize(128);
  textAlign(CENTER, CENTER);                if(poseLabel == 'A') {
        fill(0, 255, 0);
        text('A', width / 2, height / 2);
    } else if(poseLabel == 'B') {
        fill(0, 0, 0);
        text('B', width / 2, height / 2);
    } else if(poseLabel == 'C') {
        fill(255, 0, 0);
        text('C', width / 2, height / 2);
    } else {
        fill(0, 255, 255);
        text('You\n can do\n better', width / 2, height / 2);
    }
}
