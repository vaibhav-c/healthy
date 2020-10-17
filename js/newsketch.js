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
            }, 10000);
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
  factor = -(windowWidth - video.width)/2;
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if(state == 'collecting') {
        let inputs = [];
        for(let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x + factor;
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
  /*translate(video.width, 0);
  scale(-1, 1);
  image(video, -7*(screen.width-2* video.width)/2, 0, screen.width, windowHeight);
  image(video, -(windowWidth - video.width), 0, windowWidth, windowHeight);*/
  translate(video.width, 0);
  scale(-1, 1);
  factor = -(windowWidth - video.width)/2;
  mulFacHeight = windowHeight/480;
  console.log(-windowWidth + video.width);
  image(video, 2 * factor, 0, windowWidth, windowHeight);//-(windowWidth - video.width), 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x + factor, eyeR.y * mulFacHeight, eyeL.x + factor, eyeL.y * mulFacHeight);
    fill(0, 255, 0);
    ellipse(pose.rightWrist.x + factor, pose.rightWrist.y * mulFacHeight, 32);
    ellipse(pose.leftWrist.x + factor, pose.leftWrist.y * mulFacHeight, 32);
    
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x + factor;
      let y = pose.keypoints[i].position.y * mulFacHeight;
      fill(255, 0, 0);
      ellipse(x,y,16,16);
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x + factor, a.position.y * mulFacHeight,b.position.x + factor,b.position.y * mulFacHeight);      
    }
  }
  pop();
}