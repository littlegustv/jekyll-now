var WINDOW = {width: 600, height: 400};
var GAME = {width: 4500, height: 10240};
var MAX_SPEED = 200; // load this kind of stuff from JSON?

var entities = [];

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function angle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function clockwise(angle1, angle2) {
  var a1 = (angle1 + 2 * Math.PI) % (2 * Math.PI);
  var a2 = (angle2 + 2 * Math.PI) % (2 * Math.PI);
  if ( a1 < Math.PI ) {
    return (a2 < a1 || a2 > a1 + Math.PI);
  }
  else {
    return (a2 < a1 && a2 > a1 - Math.PI);
  }
}

var Entity = {
  x: WINDOW.width / 2,
  y: WINDOW.height / 2,
  speed: 0,
  angle: 0,
  team: "enemy",
  alive: true,
  collideable: true,
  update: function (dt) {
    this.x += dt * this.speed * Math.cos(this.angle);
    this.y += dt * this.speed * Math.sin(this.angle);
    this.checkBounds();
  },
  checkBounds: function () {
    this.x = this.x < WINDOW.width / 2 ? WINDOW.width / 2 : this.x;
    this.x = this.x > GAME.width - WINDOW.width/2 ? GAME.width - WINDOW.width/2 : this.x;
    this.y = this.y < WINDOW.height / 2 ? WINDOW.height / 2 : this.y;
    this.y = this.y > GAME.height - WINDOW.height/2 ? GAME.height - WINDOW.height/2 : this.y;
  },
  draw: function(ctx) {
    ctx.drawImage(this.image,
                  this.getX() - this.w/2,
                  this.getY() - this.h/2);
  },
  init: function (image, x, y) {
    this.image = image;
    this.x = x;
    this.y = y;
    return this;
  },
  getX: function() { return this.x|0; },
  getY: function() { return this.y|0; }
}
var Camera = Object.create(Entity);
Camera.draw = function (ctx) {
  ctx.translate(-this.x,-this.y);
};
Camera.shake = function (depth) {
  if (depth == 0) return;
  else {
    var th = this;
    this.x += Math.random() * 4 - 2;
    this.y += Math.random() * 4 - 2;
    setTimeout(function() { th.shake(depth - 1); }, 1000 / 60);
  }
};
var Projectile = Object.create(Entity);
Projectile.init = function (x, y, angle, speed, team) {
  this.x = x, this.y = y, this.angle = angle, this.speed = speed;
  this.team = team, this.h = 8, this.w = 8, this.type = "bullet";
  return this;
}
Projectile.checkBounds = function () {
  if (this.x > GAME.width || this.x < 0 || this.y > GAME.height || this.y < 0) {
    this.alive = false;
  }
}
Projectile.handleCollision = function (obj) {
  this.alive = false;
  var e = Object.create(Explosion).init(this.x, this.y, this.w, "rgba(200,100,45,0.7");
  entities.push(e);
  console.log(e);
}
Projectile.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.getX(), this.getY(), this.w/2, 0, Math.PI * 2, true);
  ctx.stroke();
}

var Ship = Object.create(Entity);
Ship.init = function (image, x, y, team) {
  this.x = x, this.y = y, this.image = image;
  this.w = 32, this.h = 32;
  this.health = 100, this.temperature = 0, this.cooldown = 0;
  this.shield = false, this.team = team;
  this.d_angle = 0, this.acel = 0, this.a_angle = 0;
  this.type = "ship";
  //this.maxFrames = 2;
  //this.maxAnimationDelay = 0.2;
  return this;
};
Ship.update = function (dt) {

  this.d_angle += this.a_angle * dt;
  this.speed = Math.min(this.speed + this.acel * dt, MAX_SPEED);
  if (this.acel == 0 && this.speed > 25) this.speed -= 1;

  this.angle += this.d_angle * dt;
  this.x += dt * this.speed * Math.cos(this.angle);
  this.y += dt * this.speed * Math.sin(this.angle);

  this.checkBounds();
  if (this.temperature > 0) {
    this.temperature -= 15 * (dt - 0.75 * dt * this.shield);
  } else this.temperature = 0;
  if (this.cooldown > 0) {
    this.cooldown -= dt;
  } else this.cooldown = 0;

  if (this.health <= 0) {
    this.alive = false;
    //sounds["explosion"].play();
    var e = Object.create(Explosion).init(this.x, this.y, this.w, "rgba(0,100,240,0.7)");
    entities.push(e);
    this.health = 0;
  }
}
Ship.handleCollision = function (obj) {
  if (this.shield && this.temperature < 85) {
    this.temperature += 15;
  }
  else {
    this.health -= 5;
    //sounds["hit"].play();
    //camera.shake(25);
  }
}
Ship.canShoot = function() { return this.temperature < 80 && this.cooldown <= 0; }
Ship.draw = function (ctx) {
  //ctx.drawRotatedImage(this.image, this.getX(), this.getY(), this.angle, this.w, this.h,
  //                    (this.frame % this.maxFrames) * this.w, 0, this.w, this.h);
  //ctx.drawRotatedImage(this.image, this.getX(), this.getY(), this.angle);

  ctx.beginPath();
  ctx.moveTo(this.getX() + 16 * Math.cos(this.angle), this.getY() + 16 * Math.sin(this.angle));
  ctx.lineTo(this.getX() + 16 * Math.cos(this.angle + 2.7), this.getY() + 16 * Math.sin(this.angle + 2.7));
  ctx.lineTo(this.getX() + 16 * Math.cos(this.angle - 2.7), this.getY() + 16 * Math.sin(this.angle - 2.7));
  ctx.closePath();
  ctx.stroke();

  if (this.shield) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.w * 0.6, 0, 2*Math.PI, true);
    ctx.stroke();
  }

  if (this.acel > 0) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.getX() - 16 * Math.cos(this.angle),
            this.getY() - 16 * Math.sin(this.angle),
          4, this.angle + Math.PI /2, this.angle - Math.PI/2, false);
    ctx.stroke();
  }
}
var Enemy = Object.create(Ship);
Enemy.init = function (image, x, y, target) {
  this.x = x, this.y = y, this.image = image;
  this.w = 32, this.h = 32, this.target = target;
  this.health = 100, this.temperature = 0, this.cooldown = 0;
  this.shield = false, this.team = "enemy", this.type = "ship";
  return this;
}
Enemy.update = function (dt) {
  //this.angle = angle(this.x, this.y, this.target.x, this.target.y);

  if (clockwise(this.angle, angle(this.x, this.y, this.target.x, this.target.y))) {
    this.d_angle = -Math.PI/2;
  } else { this.d_angle = Math.PI/2; }

  this.angle += this.d_angle * dt;

  this.y += 100 * Math.sin(this.angle) * dt;
  this.x += 100 * Math.cos(this.angle) * dt;
  if (Math.random() * 100 < 1) {
    var b = Object.create(Projectile).init(this.getX(), this.getY(), this.angle, 1000, "enemy");
    entities.push(b);
  }
  if (this.health <= 0) {
    this.alive = false;
    var e = Object.create(Explosion).init(this.x, this.y, this.w, "rgba(0,240,240,0.7)");
    entities.push(e);
    this.health = 0;
    //sounds["explosion"].play();
  }
};

var Explosion = {
  init: function (x, y, radius, color) {
    this.parts = [];
    this.doExplode(x, y, radius);
    this.alive = true;
    this.collideable = false;
    this.color = color;
    return this;
  },
  doExplode: function (x, y, radius) {
    this.parts.push({
      x: x,
      y: y,
      radius: radius,
      duration: 0.5,
    });
    var ee = this;
    if (this.parts.length < 50) {
      for (var i = 0; i < 3; i++) {
        setTimeout(function () {
          var offsetX = Math.random() * 2 * radius - radius;
          var offsetY = Math.random() * 2 * radius - radius;
          ee.doExplode(x + offsetX, y + offsetY, radius * 0.75);
        }, 1000 / 30);
      }
    }
  },
  draw: function (ctx) {
    ctx.fillStyle = this.color;
    for (var i = 0; i < this.parts.length; i++) {
      ctx.beginPath();
      ctx.arc(this.parts[i].x, this.parts[i].y, this.parts[i].radius, 0, Math.PI * 2, true);
      ctx.fill();
    }
  },
  update: function (dt) {
    for (var i = 0; i < this.parts.length; i++) {
      this.parts[i].duration -= dt;
      if (this.parts[i].duration <= 0)
        this.parts.splice(i, 1);
    }
    if (this.parts.length <= 0)
      this.alive = false;
  }

};

function checkCollision (obj1, obj2) {
  if (obj1.x + obj1.w / 2 > obj2.x - obj2.w / 2 &&
      obj1.x - obj1.w / 2 < obj2.x + obj2.w / 2) {
    if (obj1.y + obj1.h / 2 > obj2.y - obj2.h / 2 &&
        obj1.y - obj1.h / 2 < obj2.y + obj2.h / 2) {
      obj1.handleCollision(obj2);
      obj2.handleCollision(obj1);
    }
  }
}
