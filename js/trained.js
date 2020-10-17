let brain;
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  
  video.hide();
    
    let options = {
        inputs: 34,
        outputs: 2,
        task:'classification',
        debug:true
    }
    brain = ml5.neuralNetwork(options);
    brain.loadData('exercises.json', dataReady);

}
function dataReady() {
    brain.normalizeData();
    brain.train({epochs: 50}, finished);
}
function finished() {
    console.log('Trained');
    brain.save();
}