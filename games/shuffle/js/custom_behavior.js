var LaneMovement = Object.create(Behavior);
LaneMovement.start = function () {
  this.started = true;
  this.entity.direction = 0;
  this.entity.lane = undefined;
}
LaneMovement.setLane = function () {
  this.entity.velocity.y = 0;
  this.entity.lane = Math.round((this.entity.y + this.entity.direction * this.lane_size / 3) / this.lane_size) * this.lane_size;
  this.entity.direction = 0;
  this.entity.angle = 0;
}
LaneMovement.update = function (dt) {
  if (!this.started) this.start();
  if (this.entity.crashed) return;

  if (this.entity.direction != 0) {
    this.entity.velocity.y = lerp(this.entity.velocity.y, this.entity.direction * this.max_speed, 0.5);
  } else if (this.entity.lane !== undefined) {
    this.entity.velocity.y = (lerp(this.entity.y, this.entity.lane, 0.5) - this.entity.y) * 20;
    if (Math.abs(this.entity.velocity.y) <= this.threshold) {
      this.entity.velocity.y = 0;
      this.entity.y = this.entity.lane;
      this.entity.lane = undefined;
    }
  }
}

var Crash = Object.create(Behavior);
Crash.start = function () {
  this.duration = this.duration || 1;
  if (this.callback) this.callback();
  this.time = 0;
}
Crash.update = function (dt) {
  if (!this.time) this.start();
  this.time += dt;
  if (this.time > this.duration) {
    gameWorld.setScene(0);
  } else if (Math.random() * 100 < 15) {
    var c = Object.create(Circle).init(this.entity.x + Math.random() * 16 - 8, this.entity.y + Math.random() * 16 - 8, Math.random() * 16 + 16);
    c.color = "white";
    c.addBehavior(FadeOut, {duration: 1});
    this.entity.layer.add(c);
  }
}