class Vehicle {
    constructor(x, y) {
      this.position = createVector(x, y);
      this.velocity = createVector(0, 0);
      this.theta = PI / 2;
      this.acceleration = createVector(0, 0);
      this.r = 6;
      this.maxspeed = 8;
      this.maxforce = 0.6;
      this.colour = [random(0, 255), random(0, 255), random(0, 255)];
    }
  
    // Method to update location
    update() {
      this.acceleration.limit(this.maxforce);
      // Update velocity
      this.velocity.add(this.acceleration);
      // Limit speed
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      // Reset acceleration to 0 each cycle
      this.acceleration.mult(0);
    }
  
    applyForce(force) {
      // We could add mass here if we want A = F / M
      this.acceleration.add(force);
    }
  
    show() {
      // Draw a triangle rotated in the direction of velocity
      //triangle: base 2r, height 4r, isosecles, position is middle of base
      this.theta = this.velocity.heading() + PI / 2;
      fill(this.colour);
      stroke(0);
      strokeWeight(2);
      push();
      translate(this.position.x, this.position.y);
      rotate(this.theta);
      beginShape();
      vertex(0, -this.r * 2);
      vertex(-this.r, this.r * 2);
      vertex(this.r, this.r * 2);
      endShape(CLOSE);
      pop();
    }
  
    arrive(targetX, targetY) {
      let target = createVector(targetX, targetY);
      // A vector pointing from the location to the target
      let desired = p5.Vector.sub(target, this.position);
      let d = desired.mag();
      // Scale with arbitrary damping within 100 pixels
      if (d < 10) {
        var m = map(d, 0, 10, 0, this.maxspeed);
        desired.setMag(m);
      } else {
        desired.setMag(this.maxspeed);
      }
  
      // Steering = Desired minus Velocity
      let steer = p5.Vector.sub(desired, this.velocity); // Limit to maximum steering force
      this.applyForce(steer);
    }
  
    unalignment(boids) {
      let perceptionRadius = 50;
      let steer = createVector();
      let total = 0;
  
      for (const other of boids) {
        let distance = dist(
          this.position.x,
          this.position.y,
          other.position.x,
          other.position.y
        );
  
        if (other !== this && distance < perceptionRadius) {
          steer.add(other.velocity);
          total++;
        }
      }
  
      if (total > 0) {
        steer.div(total); //average
        steer.setMag(this.maxspeed); //desired velocity
        steer.sub(this.velocity); //calculate force
      }
      //borrowed from boids, pursuers should not all go in the same direction
      steer.mult(-1);
      this.applyForce(steer);
    }
  
    boundaries() {
      let desired = null;
      //d is the distance from the edge
      if (this.position.x < d) {
        desired = createVector(this.maxspeed, this.velocity.y); //what???
      } else if (this.position.x > width - d) {
        desired = createVector(-this.maxspeed, this.velocity.y); //what???
      }
  
      if (this.position.y < d) {
        desired = createVector(this.velocity.x, this.maxspeed); //what????
      } else if (this.position.y > height - d) {
        desired = createVector(this.velocity.x, -this.maxspeed); //what???
      }
  
      if (desired !== null) {
        desired.normalize();
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        this.applyForce(steer);
      }
    }
  
    collided() {
      if (player.power != 1) {
        let p = createVector(mouseX - this.position.x, mouseY - this.position.y); //coor of player when vehicle's position is 0,0
        p.rotate(-this.theta);
        if (dist(0, -2 * this.r, p.x, p.y) <= 24) {
          player.hp -= 1;
          player.power = 1;
          player.frame = 180;
        } else if (dist(-this.r, 2 * this.r, p.x, p.y) <= 24) {
          player.hp -= 1;
          player.power = 1;
          player.frame = 180;
        } else if (dist(this.r, 2 * this.r, p.x, p.y) <= 24) {
          player.hp -= 1;
          player.power = 1;
          player.frame = 180;
        } //only checks if player collided with vertices of vehicle, a bit cheaty but highly unlikely for player to hit vehicle without hitting a vertex as vehicles are moving quite fast
      }
    }
  }
  
  class Player {
    constructor() {
      this.hp = 3; //hearts can be scaled to different values
      this.frame = 0;
      this.power = 0;
      this.r = 24;
    }
  
    update() {
      if (this.frame % 30 < 15) {
        fill(127);
        stroke(0);
        strokeWeight(2);
        circle(mouseX, mouseY, 2 * this.r);
      } //flash 6 times when hit
  
      if (this.frame > 0) {
        this.frame -= 1; //3 seconds of immunity when hit
      } else {
        this.power = 0; //no more immunity
      }
      if (player.hp > 0) {
        for (let i = 0; i < player.hp; i++) {
          heart(width - 20 - i * 35, 30);
        }
      } else {
        gamestage = 2;
        button2.show();
      }
    }
  }
  
  function heart(x, y) {
    stroke(0);
    fill("red");
    push();
    translate(x, y); //bottom of heart
    bezier(0, 0, 24.1, -12.1, 14.7, -32.5, 0, -20.7); //right half of heart
    bezier(0, 0, -24.1, -12.1, -14.7, -32.5, 0, -20.7); //left half of heart
    //values found by desmos, original values for right half of the heart unscaled and following normal math conventions: 0, 0, 7.23, 3.62, 4.42, 9.76, 0, 6.2
    pop();
  }
  