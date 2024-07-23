let vehicles = [];
let d = 10;
let gamestage = 0;
let score = 0;
let pastHighScore = 0;
let counter = 0;
let X = [],
  Y = []; //array to store new vehicles spawn coordinates
let startingFrame; //to ensure more vehicles always spawn 10 seconds after the first one, otherwise vehicles spawning may get interupted by new vehicles spawning if player clicks start at 7-9th second
let button1, button2;

function setup() {
  createCanvas(800, 600);
  button1 = createButton("Start Game"); //button to start game
  button1.position(width / 2 - 41.5, (height * 2) / 3 - 10.5); //center the button to 400, 400
  button1.mousePressed(() => {
    gamestage = 1; //start actual game
    startingFrame = frameCount;
    button1.hide();
    counter = 180;
    for (let i = 0; i < 3; i++) {
      X.push(random(20, width - 20));
      Y.push(random(20, height - 20));
    } //prepare spawning new vehicles
    player = new Player(); //spawn player
  });
  button2 = createButton("Return to start"); //button to go back to start
  button2.position(width / 2 - 50, height * 2 / 3 - 10.5);
  button2.mousePressed(() => {
    vehicles = []; //clear vehicles
    gamestage = 0; //go back to start
    if (score > pastHighScore) {
      pastHighScore = score; //saves high score
    }
    score = 0; //clear score
    button1.show();
    button2.hide();
  })
  button2.hide();
}

function draw() {
  background(255);
  if (gamestage == 0) {
    fill("blue");
    textSize(60);
    textAlign(CENTER);
    text("Fly and Seek", width / 2, height / 3);
  } else if (gamestage == 1) {
    player.update();
    // Call the appropriate steering behaviors for our agents
    for (let vehicle of vehicles) {
      vehicle.collided();
      vehicle.arrive(mouseX, mouseY);
      vehicle.unalignment(vehicles);
      vehicle.boundaries();
      vehicle.update();
      vehicle.show();
    }
    if ((frameCount - startingFrame) % 900 == 0) {
      counter = 180;
      X = [];
      Y = []; //clears the arrays of the old coordinates
      for (let i = 0; i < 3; i++) {
        X.push(random(20, width - 20));
        Y.push(random(20, height - 20));
      }
    }
    if (counter > 0) {
      for (let i = 0; i < 3; i++) {
        stroke(0);
        fill("red");
        circle(X[i], Y[i], 40);
        fill(255);
        noStroke();
        textSize(20);
        textAlign(CENTER);
        text(round(counter / 60) + 1, X[i], Y[i] + 7);
      }
      counter -= 1;
      if (counter == 1) {
        for (let i = 0; i < 3; i++) {
          let vehicle = new Vehicle(X[i], Y[i]);
          vehicles.push(vehicle); //spawn new vehicles
        }
        score++;
      }
    }
    fill(0);
    noStroke();
    textAlign(LEFT);
    textSize(30);
    text("Score: " + score, 60, 60);
  } else if (gamestage == 2) {
    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(50);
    text("Congrats! Your new score is " + score + ".", width / 2, height / 3);
    if (score > pastHighScore) {
      textSize(30);
      text("That's a new high score!", width / 2, height / 2);
    }
  }
}
