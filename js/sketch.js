let video;
let poseNet;
let pose;
let skeleton;
let brain;
let state='waiting';
let targetLabel;
function keyPressed() {
    if(key == 's') {
        brain.saveData();
    } else {
        targetLabel = key;
        console.log(targetLabel);
        setTimeout(function() {
            console.log('collecting');
            state = 'collecting';
            setTimeout(function() {
                console.log('not collecting');
                state = 'waiting';
            }, 30000);
        }, 5000);
    }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
    
    let options = {
        inputs: 34,
        outputs: 2,
        task:'classification',
        debug:true
    }
    brain = ml5.neuralNetwork(options);
    //brain.loadData('abcd.json', dataReady);
    

}

function gotPoses(poses) {
  //console.log(poses);
  mulFacHeight = windowHeight/480;
  factor = -(windowWidth - video.width);
  mul = windowWidth/640;
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if(state == 'collecting') {
        let inputs = [];
        for(let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x * mul + factor;
            let y = pose.keypoints[i].position.y * mulFacHeight;
            inputs.push(x);
            inputs.push(y);
        }
        let target = [targetLabel];
        brain.addData(inputs, target);
    }
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
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x * mul + factor, eyeR.y * mulFacHeight, eyeL.x * mul + factor, eyeL.y * mulFacHeight);
    fill(0, 255, 0);
    ellipse(pose.rightWrist.x * mul + factor, pose.rightWrist.y * mulFacHeight, 32);
    ellipse(pose.leftWrist.x * mul + factor, pose.leftWrist.y * mulFacHeight, 32);
    ellipse(pose.rightElbow.x * mul + factor, pose.rightElbow.y * mulFacHeight, 32);
    ellipse(pose.leftElbow.x * mul + factor, pose.leftElbow.y * mulFacHeight, 32);
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x * mul + factor;
      let y = pose.keypoints[i].position.y * mulFacHeight;
      fill(255, 0, 0);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x * mul + factor, a.position.y * mulFacHeight,b.position.x * mul + factor,b.position.y * mulFacHeight);      
    }
    //console.log(window.innerHeight + "  " + windowHeight + "  " + screen.height);
  }
  pop();
}