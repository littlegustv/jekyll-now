var FAMILY = {enemy: 1};

var Hybrid = Object.create(Lerp);
Hybrid.update = function (dt) {
  if (this.object === undefined) this.object = this.entity;
  if (this.stopped) return;
  var done = true;
  for (var field in this.goals) {
    if (field == "angle") // n/a noop for angle for now...
      this.object[field] = lerp_angle(this.object[field], this.goals[field], this.rate * dt);
    else {
      this.object[field] = Math.abs(this.object[field] - this.goals[field]) <= this.threshold ? lerp(this.object[field], this.goals[field], this.rate * dt) : this.object[field] + sign(this.goals[field] - this.object[field]) * this.speed * dt;
    }
    if (this.object[field] != this.goals[field]) done = false;
  }
  if (done && this.callback) {
    this.stopped = true;
    this.callback();
  }
};

// PUSH TO RAINDROP ALREADY???
Layer.draw = function (ctx) {
  //this.ctx.fillStyle = this.bg;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.save();
  this.camera.draw(this.ctx);

  var entities = this.drawOrder();

  for (var i = 0; i < entities.length; i++) {
    entities[i].draw(this.ctx);
  }
  this.ctx.restore();
}

var game = Object.create(World).init(180, 320, "index.json");
