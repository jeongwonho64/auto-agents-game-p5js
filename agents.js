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
    update() {
      this.acceleration.limit(this.maxforce);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
    }
  
    applyForce(force) {
      this.acceleration.add(force);
    }
  
    show() {
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
      let desired = p5.Vector.sub(target, this.position);
      let d = desired.mag();
      if (d < 10) {
        var m = map(d, 0, 10, 0, this.maxspeed);
        desired.setMag(m);
      } else {
        desired.setMag(this.maxspeed);
      }
      let steer = p5.Vector.sub(desired, this.velocity);
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
        steer.div(total);
        steer.setMag(this.maxspeed);
        steer.sub(this.velocity);
      }
      steer.mult(-1);
      this.applyForce(steer);
    }
  
    boundaries() {
      let desired = null;
      if (this.position.x < d) {
        desired = createVector(this.maxspeed, this.velocity.y);
      } else if (this.position.x > width - d) {
        desired = createVector(-this.maxspeed, this.velocity.y);
      }
  
      if (this.position.y < d) {
        desired = createVector(this.velocity.x, this.maxspeed);
      } else if (this.position.y > height - d) {
        desired = createVector(this.velocity.x, -this.maxspeed);
      }
  
      if (desired !== null) {
        desired.normalize();
        desired.mult(this.maxspeed);
        let steer = p5.Vector.sub(desired, this.velocity);
        this.applyForce(steer);
      }
    }
  }