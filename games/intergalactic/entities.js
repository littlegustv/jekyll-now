var WINDOW = {width: 800, height: 450};
var GAME = {width: 4500, height: 10240};
var MAX_SPEED = 300; // load this kind of stuff from JSON?
var ACEL = 200;

var entities = [];

var gamestate = "menu";
var menu = false;

var camera = null;

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

function onscreen (obj) {
	if (obj.x > camera.x && obj.x < camera.x + WINDOW.width) {
		if (obj.y > camera.y && obj.y < camera.y + WINDOW.height) {
			return true;
		}
	}
	return false;
}

var Entity = {
  x: WINDOW.width / 2,
  y: WINDOW.height / 2,
  speed: 0,
  angle: 0,
  radius: 0,
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
  handleCollision: function (obj) {},
  getX: function() { return this.x; },
  //getX: function() { return this.x|0; },
  getY: function() { return this.y; },
  //getY: function() { return this.y|0; }
  
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

var Ship = Object.create(Entity);
Ship.init = function (image, x, y, team) {
  this.inventory = [];
  this.x = x, this.y = y, this.image = image;
  this.radius = 16;
  this.health = 100, this.temperature = 0, this.cooldown = 0;
  this.shield = false, this.team = team;
  this.d_angle = 0, this.acel = 0;
  this.type = "ship";
  this.equipment = {weapon: null, shield: Object.create(Shield).init("Basic", 10, 10, Math.PI), engine: null, radar: null};
  //this.maxFrames = 2;
  //this.maxAnimationDelay = 0.2;
  return this;
};
Ship.doAI = function (dt) {};
Ship.update = function (dt) {

  this.doAI(dt);

  this.speed = Math.max(50, Math.min(this.speed + this.acel * dt, MAX_SPEED));
  if (this.acel == 0 && this.speed > 0) this.speed -= 0.4 * ACEL * dt;

  this.angle += this.d_angle * dt;
  this.x += dt * this.speed * Math.cos(this.angle);
  this.y += dt * this.speed * Math.sin(this.angle);

  this.checkBounds();
  if (this.temperature > 0) {
    this.temperature -= 15 * (dt - 0.75 * dt * this.equipment.shield.active);
  } else this.temperature = 0;
  if (this.cooldown > 0) {
    this.cooldown -= dt;
  } else this.cooldown = 0;

  if (this.health <= 0) {
    this.alive = false;
    //sounds["explosion"].play();
    var e = Object.create(Explosion).init(this.x, this.y, 2 * this.radius, "rgba(0,100,240,0.7)");
    entities.push(e);
    this.health = 0;
  }
  
  if (this.equipment.engine) this.equipment.engine.updateUse(dt, this);
  if (this.equipment.radar) this.equipment.radar.update(dt, this);
}
Ship.handleCollision = function (obj) {
	if (obj.type == "bullet" && obj.team != this.team) {
		if (this.equipment.shield.active && this.temperature < 85) {
			if (this.equipment.shield.inRange(angle(this.x, this.y, obj.x, obj.y))) {
				this.temperature += 15;
				console.log("blocked");
			}
			else this.health -= 1;
		}
		else {
			this.health -= 1;
		}
	} 
	if (obj.type == "solid" || obj.type == "ship") {
		var d = this.radius + obj.radius;
		var theta = angle(obj.x, obj.y, this.x, this.y);
		this.x = obj.x + d * Math.cos(theta);
		this.y = obj.y + d * Math.sin(theta);
	}
}
Ship.canShoot = function(cost) { return this.temperature < 100 - cost && this.cooldown <= 0; }
Ship.turn = function (amount) {
	this.d_angle = amount * ((1.2 * MAX_SPEED - this.speed) / MAX_SPEED) * Math.PI;
}
Ship.draw = function (ctx) {
  //ctx.drawRotatedImage(this.image, this.getX(), this.getY(), this.angle, this.w, this.h,
  //                    (this.frame % this.maxFrames) * this.w, 0, this.w, this.h);
  //ctx.drawRotatedImage(this.image, this.getX(), this.getY(), this.angle);

  ctx.beginPath();
  ctx.moveTo(this.getX() + 16 * Math.cos(this.angle), this.getY() + 16 * Math.sin(this.angle));
  ctx.lineTo(this.getX() + 16 * Math.cos(this.angle + 2.7), this.getY() + 16 * Math.sin(this.angle + 2.7));
  ctx.lineTo(this.getX() + 16 * Math.cos(this.angle - 2.7), this.getY() + 16 * Math.sin(this.angle - 2.7));
  ctx.closePath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black"
  ctx.fillStyle = "gray";
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius * 0.7, 0, Math.PI * 2, true);
  ctx.fillStyle = "rgba(100,100,225,1)";
  ctx.stroke();
  ctx.fill();

  if (this.equipment && this.equipment.shield) {
	this.equipment.shield.drawUse(ctx, this);
  }  
  if (this.equipment.radar) {
	this.equipment.radar.draw(ctx, this);
  }
  if (this.acel > 0) {
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(this.getX() - 16 * Math.cos(this.angle),
            this.getY() - 16 * Math.sin(this.angle),
          4, this.angle + Math.PI /2, this.angle - Math.PI/2, false);
    ctx.fill();
  }
}
var Enemy = Object.create(Ship);
Enemy.init = function (image, x, y, target) {
  this.x = x, this.y = y, this.image = image;
  this.radius = 16, this.target = target;
  this.health = 100, this.temperature = 0, this.cooldown = 0;
  this.speed = 0, this.d_angle = 0, this.acel = 0;
  this.shield = false, this.team = "enemy", this.type = "ship";
  this.equipment = {
	  weapon: Object.create(Weapon).init("Enemy", 10, 10, 10),
	  shield: Object.create(Shield).init("Basic", 10, 10, 0), 
	  engine: Object.create(Engine).init("Enemy", 10, 100, 0.6),
	  radar: Object.create(Pulse).init(),
  };
  this.inventory = [];
  return this;
};
Enemy.doAI = function (dt) {
	if (this.equipment.radar.detected.indexOf(this.target) != -1) {
		if (clockwise(this.angle, angle(this.x, this.y, this.target.x, this.target.y))) {
			this.turn(-0.5);
		} else { this.turn (0.5); }
		
		if (Math.random() * 100 < 1) {
			this.equipment.weapon.attacks[0](this);
		} else if (Math.random() * 100 < 1.5) {
			this.equipment.weapon.attacks[1](this);
		}
		
		if (distance(this.x, this.y, this.target.x, this.target.y) > 300) {
			this.equipment.engine.activate(1.0, this);
		}
	}
}
/*
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
    var e = Object.create(Explosion).init(this.x, this.y, 2*this.radius, "rgba(0,240,240,0.7)");
    entities.push(e);
    this.health = 0;
    //sounds["explosion"].play();
  }
};*/

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

var Solid = Object.create(Entity);
Solid.init = function (x, y, radius, color) {
	this.type = "solid"; this.team = "solid";
	this.x = x, this.y = y, this.radius = radius, this.color = color;
	return this;
}
Solid.draw = function (ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
	ctx.fillStyle = this.color;
	ctx.fill();
}
Solid.handleCollision = function (other) {};

function checkCollision (obj1, obj2) {
  if (distance(obj1.x, obj1.y, obj2.x, obj2.y) < obj1.radius + obj2.radius) {
	obj1.handleCollision(obj2);
	obj2.handleCollision(obj1);
  }
}

