var Loop = Object.create(Behavior);
Loop.start = function () {
  this.time = 0;
  this.position = {x: this.entity.x, y: this.entity.y};
}
Loop.update = function (dt) {
  if (this.time < this.duration) {
    this.time += dt;
    this.entity.x = this.position.x + this.offset(true);
    this.entity.y = this.position.y + this.offset(false);
  }
}
Loop.offset = function (x) {
  if (x)
    return this.radius - this.radius * Math.cos(this.time / (this.duration / (2 * Math.PI)));
  else
    return this.radius * Math.sin(this.time / (this.duration / (2 * Math.PI)));
}

var Bounce = Object.create(Behavior);
Bounce.start = function () {
  this.time = 0;
  this.position = {x: this.entity.x, y: this.entity.y};
}
Bounce.update = function(dt) {
  if (this.time < this.duration) {
    this.time += dt;
    this.entity.y = this.position.y + this.offset();
  }
}
Bounce.offset = function () {
  return (this.max / (1 + this.time)) * Math.sin(Math.PI * 2 * this.time);
}


var Flare = Object.create(Entity);
Flare.init = function (x, y, angle, duration) {
  this.x = x, this.y = y, this.duration = duration, this.angle = angle, this.radius = 1, this.time = 0;
  return this;
}
Flare.draw = function (ctx) {
  ctx.globalAlpha = this.opacity;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
  ctx.fillStyle = Math.floor(this.time) % 2 == 0 ? "red" : "black";
  ctx.fill();
  ctx.globalAlpha = 1;
}
Flare.update = function (dt) {
  this.time += dt;
  if (this.time > this.duration) this.alive = false;
  this.opacity = 1 - this.time / this.duration;
  this.radius += dt * 20;
  this.x += Math.cos(this.angle) * SPEED.ship * dt / 4;
  this.y += Math.sin(this.angle) * SPEED.ship * dt / 4;
}
var Beacon = Object.create(Behavior);
Beacon.start = function () {
  if (this.target) {
    var theta = Math.atan2((this.target.y - this.entity.y), (this.target.x - this.entity.x));
    console.log("mhm", theta, this.target);
    var flare = Object.create(Flare).init(this.entity.x, this.entity.y, theta, 10);
    this.entity.layer.add(flare);
  }
}

// uses: target
var Home = Object.create(Behavior);
Home.update = function (dt) {
  this.entity.angle = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
  var d = distance(this.entity.x,this.entity.y,this.target.x,this.target.y);
  var dx = this.target.x - this.entity.x, dy = this.target.y - this.entity.y;
  this.entity.velocity = {x: 0.6 * SPEED.ship * dx / d, y: 0.6 * SPEED.ship * dy / d};
}
var Warning = Object.create(Behavior);
Warning.update = function (dt) {
  if (distance(this.entity.x, this.entity.y, this.target.x, this.target.y) < this.margin) {
    this.entity.alive = false;
    this.entity.layer.add(Object.create(Flare).init(this.entity.x, this.entity.y, 0, 2));
  }
}


var WarningShot = Object.create(Behavior);
WarningShot.start = function () {
  var missile = Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.projectile);
  missile.addBehavior(Velocity);
  missile.addBehavior(Home, {target: this.target});
  missile.addBehavior(Warning, {target: this.target, margin: 100});
  missile.setCollision(Polygon);
  missile.collision.onHandle = function (object, other) {
    object.alive = false;
    object.layer.add(Object.create(Flare).init(object.x, object.y, 0, 2));
  }
  missile.family = "enemy";
  this.entity.layer.add(missile);
}

var SalvageAI = Object.create(Behavior);
SalvageAI.start = function () {
  this.MEMORY = {
    patience: 100,
    trust: 100,
    despair: 0
  };
}