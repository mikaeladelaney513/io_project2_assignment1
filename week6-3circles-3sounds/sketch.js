/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

// References Used
// https://p5js.org/examples/hello-p5-interactivity-1.html
// https://p5js.org/examples/drawing-patterns.html 
// https://editor.p5js.org/REAS/sketches/S1TNUPzim
// https://editor.p5js.org/aferriss/sketches/rJf3luXdG 

let osc;
let playing = false;
let serial;
let latestData = "waiting for data";  // you'll use this to write incoming data to the canvas
let splitter;
let diameter0 = 0, diameter1 = 0, diameter2 = 0;
// let r, g, b;
let osc1, osc2, osc3, fft;

var c1, c2;
var r;
var g;
var b;
var a;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // background(255,0,0); - if you don't wanna use the gradient background
  c1 = color(0,0,0);
  c2 = color(255);
  setGradient(c1, c2);
  r = random(255);
  g = random(255);
  b = random(255); 
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();
  console.log("serial.list()   ", serial.list());

  serial.open("COM3");
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
 
}

function setGradient(c1, c2) {
  // gradient background
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

osc1 = new p5.TriOsc(); // set frequency and type
osc1.amp(.5);
osc2 = new p5.TriOsc(); // set frequency and type
osc2.amp(.10);  
osc3 = new p5.TriOsc(); // set frequency and type
osc3.amp(.15);    

fft = new p5.FFT();
osc1.start();
osc2.start(); 
osc3.start();

// We are connected and ready to go
function serverConnected() {
  console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
  console.log(theerror);
}

function gotData() {
  var currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log("currentString  ", currentString);             // println the string
  latestData = currentString;            // save it for the draw method
  console.log("latestData" + latestData);   //check to see if data is coming in
  splitter = split(latestData, ',');       // split each number using the comma as a delimiter
  //console.log("splitter[0]" + splitter[0]); 
  diameter0 = splitter[0];                 //put the first sensor's data into a variable
  diameter1 = splitter[1];
  diameter2 = splitter[2]; 
}

function gotRawData(thedata) {
  println("gotRawData" + thedata);
}

function draw() {
  // background(255, 255, 255); - this background won't show dots, only current dot
  variableEllipse(mouseX, mouseY, pmouseX, pmouseY);
  r = random(255); 
  g = random(255); 
  b = random(255); 
  a = random(255); 

function variableEllipse(x, y, px, py) {
  let speed = abs(x - px) + abs(y - py);
  fill (r, g, b, a);
  ellipse(x, y, diameter1, diameter1);
  // ellipse(random, random, diameter1, diameter1); - doesn't work
  
  // background(255,255,255);
  // text(latestData, 10,10);
  // ellipseMode(RADIUS);    
  // fill(255,0,0);
  // noStroke(); 
  // ellipse(300, 300, diameter0*100, diameter0*100);
  // ellipseMode(RADIUS);    
  // fill(0,255,0);
  // ellipse(600, 300, diameter1, diameter1);
  // ellipseMode(RADIUS);
  // fill(0,0,255);
  // ellipse(900, 300, diameter2, diameter2);

  // background(255,255,255);
  // text(latestData, 10,10);
  // ellipseMode(RADIUS);    
  // fill(255,0,0);
  // noStroke(); 
  // ellipse(300, 300, diameter0*100, diameter0*100);

  var freq = map(diameter0, 0, width, 40, 880);    
    osc1.freq(freq);
    //console.log(freq);
    
  var freq2 = map(diameter1, 0, width, 40, 880);    
    osc2.freq(freq2);
    //console.log(freq2);
    
 var freq3 = map(diameter2*10, 0, width, 40, 880);    
    osc3.freq(freq3);
    //console.log(freq3); 
}

function mouseClicked(){
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
    console.log("getAudioContext().state" + getAudioContext().state);
  }}
  };