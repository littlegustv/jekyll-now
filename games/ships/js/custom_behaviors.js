var Follow = Object.create(Behavior);
Follow.update = function (dt) {
  this.entity.x = this.target.x + this.offset.x;
  this.entity.y = this.target.y + this.offset.y;
  if (this.target.alive == false) this.entity.alive = false;
}

var Shake = Object.create(Behavior);
Shake.update = function (dt) {
  this.time += dt;
  if (!this.time || this.time > this.duration) {
    if (this.original)
    {
      this.entity.x = this.original.x, this.entity.y = this.original.y;
      this.original = undefined;
    }
    return;
  }
  else {
    this.entity.x += Math.random() * this.magnitude - this.magnitude / 2;
    this.entity.y += Math.random() * this.magnitude - this.magnitude / 2;
  }
}
Shake.start = function () {
  if (this.original) return;
  this.original = {x: this.entity.x, y: this.entity.y};
  this.time = 0;
}

var Crop = Object.create(Behavior);
Crop.update = function (dt) {
  if (this.entity.x > this.max.x || this.entity.x < this.min.x) this.entity.alive = false;
  if (this.entity.y > this.max.y || this.entity.y < this.min.y) this.entity.alive = false;
}

var Trail = Object.create(Behavior);
Trail.update = function (dt) {
  if (!this.time) this.start();
  if (this.totalTime > this.duration) return;
  this.time += dt;
  this.totalTime += dt;
  if (this.time > this.interval) {
    this.time = 0;
    var p = this.createParticle(this.entity.x, this.entity.y - 12 * GLOBALS.scale);
    p.z = 10;
    p.health = 0;
    p.opacity = 0.3;
    p.addBehavior(FadeOut, {duration: 1});
    this.entity.layer.add(p);
  }
}
Trail.createParticle = function (x, y) {
  return Object.create(Entity).init(x + Math.random() * 16 - 8,y + Math.random() * 16 - 8,32,32);
}
Trail.start = function () {
  this.time = 0;
  this.totalTime = 0;
  this.interval = this.interval || 0.05;
  this.duration = this.duration || 10;
}

var SeaSpray = Object.create(Behavior);
SeaSpray.update = function (dt) {
  if (!this.spray) this.start();
}
SeaSpray.start = function () {
  if (Math.random() * 100 < 10 && Math.abs(this.entity.velocity.x) > 10) {
    this.spray = Object.create(Spray).init(this.entity.x + 1 * sign(this.entity.velocity.x), this.entity.y - 1, 16, false);
    this.spray.z = 1;
    //this.spray.addBehavior(Crop, {min: {x: 0, y: 0}, max: {x: CONFIG.width, y: CONFIG.height}});
    this.spray.addBehavior(Follow, {target: this.entity, offset: {x: 0, y: 0}});
    this.entity.layer.add(this.spray);
  }
}

var Flip = Object.create(Behavior);
Flip.update = function (dt) {
  if (this.entity.velocity.x > 0) {
    this.entity.mirrored = false;
  } else {
    this.entity.mirrored = true;
  }
}
Flip.transform = function (ctx) {
  if (this.entity.mirrored) ctx.scale(-1, 1);
}

var Die = Object.create(Behavior);
Die.update = function (dt) {
  if (this.entity.health <= 0) {
    if (!this.time) this.start();
    this.time += dt;
    if (this.time >= this.duration) this.entity.alive = false;
    this.entity.opacity = (this.duration - this.time) / this.duration;
    if (this.entity.offset) {
      this.entity.offset.y += Math.sin(this.time) * 5;
    }
    this.entity.angle += dt / 10;
  }
};
Die.start = function () {
  if (this.entity.collision) {
    this.entity.collision.onCheck = function (a, b) { return false };
  }
  this.time = 0;
}

var FadeOut = Object.create(Behavior);
FadeOut.update = function (dt) {
    if (!this.time) this.start();
    this.time += dt;

    if (this.time >= this.duration) this.entity.alive = false;
    this.entity.opacity = clamp(this.maxOpacity * (this.duration - this.time) / this.duration, 0, 1);
};
FadeOut.start = function () {
  if (this.entity.collision) {
    this.entity.collision.onCheck = function (a, b) { return false };
  }
  this.maxOpacity = this.entity.opacity;
  this.time = 0;
}


var Climb = Object.create(Behavior);
Climb.update = function (dt) {
  if (this.entity.x > this.max.x) {
    this.entity.velocity.x *= -1;
    this.entity.x = this.max.x;
    if (this.entity.y > 116) 
      this.entity.y = this.entity.y - 32 * GLOBALS.scale / 2;
  }
  if (this.entity.x < this.min.x) {
    this.entity.velocity.x *= -1;
    this.entity.x = this.min.x;
    if (this.entity.y > 116)
      this.entity.y = this.entity.y - 32 * GLOBALS.scale / 2;
  }
}

var PeriodicCannon = Object.create(Behavior);
PeriodicCannon.update = function (dt) {
  if (this.time == undefined) this.start();
  this.time += dt;
  if (this.time > this.interval) {
    this.time = 0;
    var exp = Object.create(Explosion).init(this.entity.x, this.entity.y - 1, 12 * GLOBALS.scale, 40, "rgba(255,255,255,0.2)");
    //exp.offset = {x: 0, y: GLOBALS.scale * 4};
    this.entity.layer.add(exp);

    addCannon(this.entity, {x: 0, y: -SPEED.ship});

    gameWorld.playSound(Resources.cannon);
  }
}
PeriodicCannon.start = function () {
  this.time = 0;
  this.interval = this.interval || 3;
}

var Shift = Object.create(Behavior);
Shift.update = function (dt) {
  if (!this.time) this.start();
  this.time += dt;
  this.entity[this.field] += this.constant * Math.sin(this.time);
}
Shift.start = function () {
  this.time = 0;
  this.constant = this.constant || 1;
}

var Oscillate = Object.create(Behavior);
Oscillate.update = function (dt) {
  if (!this.time) this.start();
  this.time += dt;
  this.entity[this.field] = this.constant * Math.sin(this.time);
}
Oscillate.start = function () {
  this.time = 0;
  this.constant = this.constant || 1;
}

var Cooldown = Object.create(Behavior);
Cooldown.update = function (dt) {
  if (this.entity.cooldown === undefined) this.start;

  if (this.entity.cooldown > 0)
    this.entity.cooldown -= dt;
}
Cooldown.start = function () {
  this.entity.cooldown = 0;
}

var HighLight = Object.create(Behavior);
HighLight.start = function () {
  this.time = 0;
  this.duration = this.duration || 1;
}
HighLight.update = function (dt) {
  if (this.time == undefined) this.start();
  if (this.entity.frame == 1) {
    this.time += dt;
    if (this.time > this.duration) {
      this.time = 0;
      this.entity.frame = 0;
    }
  }
}

var Reload = Object.create(Behavior);
Reload.drawAfter = function (ctx) {
  if (this.entity.cooldown && this.entity.maxCooldown) {
    if (this.entity.cooldown >= 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(this.entity.x - this.entity.w / 2, this.entity.y - this.entity.h, this.entity.w, 4 * GLOBALS.scale);
      ctx.fillStyle = "white";
      ctx.fillRect(this.entity.x - this.entity.w / 2 + 1* GLOBALS.scale, this.entity.y - this.entity.h + 1 * GLOBALS.scale, (this.entity.w - 2 * GLOBALS.scale) * (1 - this.entity.cooldown / this.entity.maxCooldown), 4 * GLOBALS.scale - 2 * GLOBALS.scale);
    }
  }
}