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
  
  // fix me: probably only need one of these...
  if (this.entity.crashed) return;
  if (this.disabled) return;

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
/*
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
}*/

var Colorize = Object.create(Behavior);
Colorize.draw = function (ctx) {
  if (!this.color) {
    this.color = randomColor();
  }
  ctx.fillStyle = this.color;
  ctx.fillRect(this.entity.x - this.w / 2, this.entity.y - this.h / 2, this.w, this.h);
}

// for some reason 'rope' is moveing with 'offset'; figure out why, maybe?

// goal = target + offset; as long as entity != goal; lerp (or just always lerp?)

var Rope = Object.create(Behavior);
Rope.start = function () {
  this.time = Math.random() * 2 * Math.PI;
  if (!this.offset) this.offset = {x: 0, y: 0};
}
Rope.update = function (dt) {
  if (!this.time) this.start();
  this.time += dt;

  if (this.target) {
    this.entity.x = lerp(this.entity.x, this.target.x + this.offset.x, dt);
    this.entity.y = lerp(this.entity.y, this.target.y + this.offset.y, dt);
  }

  // should figure out GOAL first (based on target, length and offset); then check distance and move towards it, yeah?
  /*if (this.target && distance(this.entity.x, this.entity.y, this.target.x + this.offset.x, this.target.y + this.offset.y) > this.length) {
    var vector = normalize((this.target.x + this.offset.x) - this.entity.x, (this.target.y + this.offset.y) - this.entity.y);
    var goal = {x: (this.target.x + this.offset.x) + vector.x * this.length, y: (this.target.y + this.offset.y) + vector.y * this.length};
  }*/
}
Rope.draw = function (ctx) {
  ctx.fillStyle = this.color;
  if (!this.target) {
    // no target, draw straight down
    for (var i = 0; i < this.length; i += (this.width - 1)) {
      var x = this.time + 2 * Math.PI * i / this.length;
      ctx.fillRect(this.entity.x - this.width / 2 + Math.sin(x) * 4, this.entity.y + i, this.width, this.width);  
    }
  } else {
    // target, draw to origin
    var length = this.target.y - this.entity.y, width = this.target.x - this.entity.x, n = length / this.width;
    for (var i = 0; i < n; i++) {
//      var x = this.time + 2 * Math.PI * i / n;
//      ctx.fillRect(this.entity.x + this.width * i / n + Math.sin(x) * 4, this.entity.y + i * this.width, this.width, this.width);  
        ctx.fillRect(this.entity.x + width * i / n, this.entity.y + length * i / n, this.width, this.width);
    }
  }
}

var Jump = Object.create(Behavior);
Jump.start = function () {
  console.log('starting!')
  this.duration = this.duration || 1;
  this.time = this.duration + 1;
  this.constant = this.constant || 128;
}
Jump.update = function (dt) {
  if (this.time == undefined) this.start();
  if (this.time > this.duration) return;
  else {
    this.time += dt;
    this.entity.y -= Math.sin(2 * Math.PI * this.time / this.duration) * this.constant * dt;
  }
}
Jump.jump = function () {
  if (this.time > this.duration) {
    this.time = 0;
    console.log('jumping');
  }
}

var TargetWrap = Object.create(Behavior);
TargetWrap.update = function (dt) {
  if (false) { //(this.entity.x > this.max.x) {
    //this.entity.x = this.min.x + (this.entity.x - this.max.x);
  } else if (this.entity.x < this.target.x - this.min.x) {
    this.entity.x = this.target.x + this.max.x;
  }
}