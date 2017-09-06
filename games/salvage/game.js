/* global Resources, Entity, Sprite, SpriteFont, TiledBackground, Behavior, World, randint, clamp, between */
// canvas filter (color style); grayscale(70%) contrast(250%) brightness(90%);

var MAXHEALTH = 4, DAMAGE_COOLDOWN = 0.5;
var gameWorld = Object.create(World).init(180, 320, "index.json");
gameWorld.wave = 0;
gameWorld.distance = 100;

var SCHEMES = [{
	negative: "#000000",
	nullary: "#FFFFFF",
	primary: "#32CD32", //#ff6347 -> used for enemy weapons, projectiles -> signifies 'energy'
	secondary: "#FF953E", // -> used for explosions
	tertiary: "#940455" // -> used for... everything else? emphasis, particles?
},
{
	negative: "#FFFFFF",
	nullary: "#000000",
	primary: "orange",
	secondary: "red", 
	tertiary: "tomato" 
},
{ // gameboy
	negative: "#000000",
	nullary: "#b7b7b7",
	primary: "#ffffff",
	secondary: "#686868", 
	tertiary: "#000000" 
}
]

var COLORS = SCHEMES[0];

var Z = {
	particle: 1,
	projectile: 2,
	entity: 3,
	obstacle: 4
}

var buttonHover = function () { 
	if (this.opacity != 0.6) gameWorld.playSound(Resources.hover);
	this.opacity = 0.6;
};
var buttonUnHover = function () { this.opacity = 1;};

// 
var HealthBar = Object.create(Behavior);
HealthBar.draw = function (ctx) {
	var w = this.entity.w / this.entity.maxhealth;
	for (var i = 0; i < this.entity.maxhealth; i++) {
		ctx.fillStyle = (i <= this.entity.health) ? "black" : "gray";
		ctx.fillRect(this.entity.x - this.entity.w / 2 + i * w + w / 2, this.entity.y - this.entity.h / 2, w, 8);
	}
}

// very custom, so avoid passing parameters and just assume them...
var Radar = Object.create(Behavior);
Radar.draw = function(ctx) {
	var t = this;
	var concerning = this.entity.layer.entities.filter(function (e) { return e.family == "enemy" && !e.projectile && (!between(e.x, t.entity.x - gameWorld.width / 2, t.entity.x + gameWorld.width / 2) || !between(e.y, t.entity.y - gameWorld.height / 2, t.entity.y + gameWorld.height / 2)); });
	ctx.fillStyle = COLORS.tertiary;
	for (var i = 0; i < concerning.length; i++) {
		var x = clamp(concerning[i].x, this.entity.x - gameWorld.width / 2, this.entity.x + gameWorld.width / 2) - 2;
		var y = clamp(concerning[i].y, this.entity.y - gameWorld.height / 2, this.entity.y + gameWorld.height / 2) - 2;
		var theta = angle(this.entity.x, this.entity.y, x, y);
		ctx.moveTo(x, y);
		ctx.lineTo(x - 16 * Math.cos(theta + PI / 6), y - 16 * Math.sin(theta + PI / 6));
		ctx.lineTo(x - 16 * Math.cos(theta - PI / 6), y - 16 * Math.sin(theta - PI / 6));
		ctx.closePath();
		ctx.fill();
	}
}

var Disable = Object.create(Behavior);
Disable.update = function (dt) {
	if (this.cooldown === undefined) this.cooldown = 0;
	this.cooldown -= dt;
	if (this.cooldown <= 0 && this.target.health > 1) {
		this.cooldown = this.entity.shoot(this.entity.layer);
	}
}

var Shielded = Object.create(Behavior);
Shielded.update = function (dt) {
	if (this.entity.shield < 1) this.entity.shield += dt * this.rate;
	else this.entity.shield = 1;
	this.entity.shield_sprite.opacity = this.entity.shield;
}

var Shake = Object.create(Behavior);
Shake.update = function (dt) {
	if (this.time === undefined) this.time = 0;
	this.time += dt;
	if (this.time >= this.duration) this.entity.removeBehavior(this);
	else {
		this.entity.x += randint(this.min, this.max) * dt;
		this.entity.y += randint(this.min, this.max) * dt;
	}
}

var HyperDrive = Object.create(Behavior);
HyperDrive.update = function (dt) {
	if (this.done === undefined) {
		console.log('heyt');
		this.entity.layer.paused = false;
		this.entity.behaviors = [this.entity.behaviors[0], this]; // :O ... keep animate and this, remove all other behaviors
		this.entity.addBehavior(Velocity);
		this.entity.health = 100;
		this.entity.addBehavior(Accelerate);
		this.entity.velocity = {x: 0, y: 0};
		this.entity.angle = 0;
		this.entity.acceleration = {x: 100, y: 0};
		this.done = true;
	}
}

Scene.draw = function (ctx) {
  ctx.clearRect(0, 0, gameWorld.width, gameWorld.height); // HERE!
  for (var i = 0; i < this.layers.length; i++) {
    if (this.layers[i].active)
    {
      this.layers[i].draw(ctx);
      ctx.drawImage(this.layers[i].canvas, 0, 0);
    }
  }
}

// push to raindrop 'active' flag for layer
Scene.update = function (dt) {
	this.time += dt;
	for (var i = 0; i < this.layers.length; i++) {
		if (this.layers[i].active)
			this.layers[i].update(dt);
	}
	this.onUpdate(dt);
};

// try this out...
Layer.drawOrder = function () {
    var t = this;
    return this.entities.sort(function (a, b) {
      if (a.z < b.z) return -1;
      else if (a.z === b.z) {
      	if (a.y < b.y) return -1;
      	else return 1;
      }
      else return 1;
    });
};

// push to raindrop -> collisions fix
Layer.update = function (dt) {
	this.camera.update(dt);
	if (this.paused === true) {
		return;
	} else if (this.paused > 0) {
	  this.paused -= dt;
	  return;
	}
	for (var i = 0; i < this.entities.length; i++) {
	  this.entities[i].update(dt);
	}
	for (var i = 0; i < this.entities.length; i++) {
	  this.entities[i].checkCollisions(i + 1, this.entities); // i + 1 instead of i
	}
	for (var i = 0; i < this.entities.length; i++) {
	  if (!this.entities[i].alive) {
	    this.entities[i].end();
	    this.entities.splice(i, 1);
	  }
	}
}


// push to raindrop -> making setScene(reload) work properly
World.setScene = function (n, reload) {
	if (this.scenes[n].reload || reload === true) {
		console.log('reloading, supposedly');
		this.scenes[n] = Object.create(Scene).init(this.scenes[n].name, true);
	}
	this.removeEventListeners(this.scene);
	this.scene = this.scenes[n];
	this.addEventListeners(this.scene);
};

// push to raindrop -> remove flickering on scene change 
World.draw = function () {
	if (this.scene) {
		this.scene.draw(this.ctx);
	}
};

World.playSound = function(sound, volume) {
	if (AudioContext) {
	  var volume = volume || 1;
	  //console.log(sound);
	  var buffer = sound.buffer;
	  var source = this.audioContext.createBufferSource();
	  source.buffer = buffer;
	  
	  source.connect(this.audioContext.gn);
	  this.audioContext.gn.gain.value = volume;
	  this.audioContext.gn.connect(this.audioContext.destination);
	  source.start(0);
	  
	  return source;
	} else {
	  if (window.muted) {
	    return;
	  }
	  else {
	    sound.play();
	    debug = sound;
	    return sound;
	  }
	}
}

function volume (object) {
	//var v = Math.max(0,1 - distance(object.x, object.y, gameWorld.scene.layers[0].camera.x, gameWorld.scene.layers[0].camera.y) / (1.4 * gameWorld.height));
	//console.log(v);
	return 0.8;
}

function inverse(family) {
	return family == "enemy" ? "player" : "enemy";
}

var LerpFollow = Object.create(Behavior);
LerpFollow.update = function (dt) { 
	//console.log(this.entity.x, this.entity.y, this.target.x, this.target.y);
  if (this.offset.x !== false)
    this.entity.x = lerp(this.entity.x, this.target.x + this.offset.x, this.rate * dt);
  if (this.offset.y !== false)
    this.entity.y = lerp(this.entity.y, this.target.y + this.offset.y, this.rate * dt);
  if (this.offset.z !== false)
    this.entity.z = lerp(this.entity.z, this.target.z + this.offset.z, this.rate * dt);
  if (this.offset.angle !== false)
    this.entity.angle = lerp_angle(this.entity.angle, this.target.angle + this.offset.angle, this.rate * dt);
  if (this.target.alive === false) this.entity.alive = false;
};

Delay.update = function (dt) {
  if (this.time === undefined) this.start();
	
  this.time += dt;
  if (this.time > this.duration) {
    this.callback();
	this.time = undefined;
	if (this.remove) {
		this.entity.removeBehavior(this);
	}
  }
};
Delay.set = function (t) {
	if (t !== undefined) this.duration = t;
	this.time = 0;
};

Lerp.update = function (dt) {
  if (this.field == "angle")
    this.object[this.field] = lerp_angle(this.object[this.field], this.goal, this.rate * dt);
  else
    this.object[this.field] = lerp(this.object[this.field], this.goal, this.rate * dt, this.threshold || 1);
  if (this.object[this.field] == this.goal && this.callback) this.callback(); 
};

function lerp (current, goal, rate, threshold) {
  if (threshold === undefined) threshold = 1;
  if (Math.abs(goal - current) <= threshold) {
    return goal;
  } else {
    return (1-rate)*current + rate*goal
  }  
}

function projectileHit (object, other) {
	if (other.family != object.family && !other.projectile) {
		object.alive = false;		
		gameWorld.playSound(Resources.hit);
	}
}

// push to raindrop
SpriteFont.draw = Sprite.draw;
SpriteFont.onDraw = function (ctx) {
  for (var i = 0; i < this.text.length; i++) {
    var c = this.characters.indexOf(this.text[i]);
    var x = this.getX(i);
    if (c != -1) {
      ctx.drawImage(this.sprite.image, 
        c * this.sprite.w, 0, 
        this.sprite.w, this.sprite.h, 
        Math.round(this.x - this.w / 2) + x + this.spacing * i, this.y - Math.round(this.h / 2), this.w, this.h);          
    }
  }
}

var Triangle = Object.create(Entity);
Triangle.init = function (x, y, r) {
	this.instance();
	this.x = x, this.y = y, this.r = r;
	return this;
}
Triangle.onDraw = function (ctx) {
	ctx.fillStyle = this.color;
	ctx.beginPath();
	var theta = PI2 / 3;
	ctx.moveTo(this.x + Math.cos(this.angle) * this.r, this.y + Math.sin(this.angle) * this.r);
	ctx.lineTo(this.x + Math.cos(this.angle + theta) * this.r, this.y + Math.sin(this.angle + theta) * this.r);
	ctx.lineTo(this.x + Math.cos(this.angle + 2 * theta) * this.r, this.y + Math.sin(this.angle + 2 * theta) * this.r);
	ctx.closePath();
	ctx.fill();
	if (this.stroke) {
		ctx.lineWidth = this.width;
		ctx.strokeStyle = this.strokeColor;
		ctx.stroke();
	}
}
Circle.oldDraw = Circle.onDraw;
Circle.onDraw = function (ctx) {
	this.oldDraw(ctx);
	if (this.stroke) {
		ctx.lineWidth = this.width;
		ctx.strokeStyle = this.strokeColor;
		ctx.stroke();
	}
}
Entity.oldDraw = Entity.onDraw;
Entity.onDraw = function (ctx) {
	this.oldDraw(ctx);
	if (this.stroke) {
		ctx.lineWidth = this.width;
		ctx.strokeStyle = this.strokeColor;
		ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
	}	
};

var Trail = Object.create(Behavior);
Trail.update = function (dt) {
	if (this.time === undefined) {
		this.record = [];
		this.time = 0;
	}
	this.time += dt;
	
	if (this.time >= this.interval) {
		this.time = 0;
		this.record.push({x: this.entity.x, y: this.entity.y});
		if (this.record.length > this.maxlength) {
			this.record.shift();
		}
	}
}
Trail.draw = function (ctx) {
	var shrink = this.entity.radius / this.record.length;
	ctx.fillStyle = this.entity.strokeColor;
	for (var i = 0; i < this.record.length; i++) {
		ctx.beginPath();
		ctx.arc(this.record[i].x, this.record[i].y, i * shrink, 0, PI2, true);
		ctx.fill();
	}
}

// push to raindrop
function lerp_angle (a1, a2, rate) {
  var r = a1 + short_angle(a1, a2) * rate;
	if (Math.abs(r - a2) < 0.01) return a2;
	else return r;
}

var projectile_vertices = [
	{x: -2, y: -2},
	{x: 2, y: -2},
	{x: 2, y: 2},
	{x: -2, y: 2}
];

var projectiles = [];

// add cooldown visuals (circle shrinks/brightens, then POW)
var Weapons = {
	hitscan: function (layer) {
		var theta = this.target ? angle(this.x, this.y, this.target.x, this.target.y) : this.angle;
		var warn = layer.add(Object.create(Entity).init(this.x + Math.cos(theta) * gameWorld.height, this.y + Math.sin(theta) * gameWorld.height, gameWorld.height * 2, 8));
		warn.color = COLORS.primary; //"#ff6347";
		warn.opacity = 0;
		warn.angle = theta;
		warn.z = 0;
		warn.addBehavior(FadeIn, {duration: 0.5, maxOpacity: 1})
		warn.addBehavior(Delay, {duration: 0.5, callback: function () {
			warn.addBehavior(FadeOut, {maxOpacity: 1, duration: 0.5});
			var a = this.entity.layer.add(Object.create(Entity).init(this.entity.x, this.entity.y, this.entity.w, 2));
			a.setCollision(Polygon);
			gameWorld.playSound(Resources.laser, volume(a));
			a.collision.onHandle = projectileHit;
			a.family = "enemy";//"player";
			a.projectile = true;
			a.z = 100;
			a.angle = this.entity.angle;
			a.addBehavior(FadeOut, {duration: 0.05, delay: 0.3});
			this.entity.removeBehavior(this);
		}});
		return 1.6;
	},
	standard: function (layer) {
		//var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
		var a = layer.add(Object.create(Circle).init(this.x, this.y, 4));
		a.color = "black";
		a.stroke = true;
		a.strokeColor = COLORS.primary;
		a.width = 2;
//			var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
		//a.animation = 5;
		a.setCollision(Polygon);
		a.setVertices(projectile_vertices);
		gameWorld.playSound(Resources.laser, volume(a));
		a.collision.onHandle = projectileHit;
		a.addBehavior(Velocity);
		a.family = this.family;//"player";
		a.projectile = true;
		a.blend = "destination-out";
		var theta = this.target ? angle(this.x, this.y, this.target.x, this.target.y) : this.angle;
		//if (this.target) console.log('target');
		a.velocity = {x: 80 * Math.cos(theta), y: 80 * Math.sin(theta)	};
		a.angle = theta;		
		a.addBehavior(CropDistance, {target: this, max: 10 * gameWorld.distance});
		a.addBehavior(Trail, {interval: 0.06, maxlength: 10, record: []});
		projectiles.push(a);
		return 1.6;
	},
	triple: function (layer) {
		if (this.count === undefined) this.count = 0;
		//var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
		var a = layer.add(Object.create(Circle).init(this.x, this.y, 4));
		a.color = "black";
		a.stroke = true;
		a.strokeColor = COLORS.primary;
		a.width = 2;
		a.blend = "destination-out";
//var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
		//a.animation = 5;
		a.setCollision(Polygon);
		a.setVertices(projectile_vertices);
		gameWorld.playSound(Resources.laser, volume(a));
		a.collision.onHandle = projectileHit;
		a.addBehavior(Velocity);
		a.family = this.family;//"player";
		a.addBehavior(CropDistance, {target: this, max: 10 * gameWorld.distance});
		a.projectile = true;
		var theta = this.target ? angle(this.x, this.y, this.target.x, this.target.y) : this.angle;
		if (this.target) console.log('target');
		a.velocity = {x: 100 * Math.cos(theta), y: 100 * Math.sin(theta)	};
		a.angle = theta;
		a.addBehavior(Trail, {interval: 0.06, maxlength: 10});
		projectiles.push(a);

		this.count += 1;
		if (this.count % 3 === 0) {
			return 3;
		} else {
			return 0.5;
		}
	},
	burst: function (layer) {
		if (this.count === undefined) this.count = 0;
		var a = layer.add(Object.create(Circle).init(this.x, this.y, 4));
		a.color = "black";
		a.stroke = true;
		a.strokeColor = COLORS.primary;
		a.width = 2;
		a.blend = "destination-out";
		//var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
//var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
		//a.animation = 5;
		a.setCollision(Polygon);
		a.setVertices(projectile_vertices);
		gameWorld.playSound(Resources.laser, volume(a));
		a.collision.onHandle = projectileHit;
		a.addBehavior(Velocity);
		a.family = this.family;//"player";
		a.addBehavior(CropDistance, {target: this, max: 10 * gameWorld.distance});
		a.projectile = true;
		if (this.count % 15 === 0) {
			this.theta = this.target ? angle(this.x, this.y, this.target.x, this.target.y) : this.angle;
		}
		a.velocity = {x: 100 * Math.cos(this.theta), y: 100 * Math.sin(this.theta)	};
		a.angle = this.theta;
		a.addBehavior(Trail, {interval: 0.06, maxlength: 10});
		
		projectiles.push(a);
		
		this.count += 1;
		if (this.count % 15 === 0) {
			return 4;
		} else {
			return 0.25;
		}
	},
	homing: function (layer) {
			var a = layer.add(Object.create(Triangle).init(this.x, this.y, 5));
			a.color = "black"; //"#4CAF52";
			a.stroke = true;
			a.strokeColor = COLORS.primary;
			a.width = 2;
			a.blend = "destination-out";
			//var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
//			var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
			a.setCollision(Polygon);
			a.setVertices(projectile_vertices);
			//a.animation = 5;
			//gameWorld.playSound(Resources.mortar);
			a.collision.onHandle = projectileHit;
			a.addBehavior(Velocity);
			a.radius = 4;
			a.addBehavior(Target, {target: this.target, turn_rate: 0.2, speed: 30, offset: {x: 0, y: 0}, set_angle: true});
			a.family = this.family;
			a.addBehavior(CropDistance, {target: this, max: 10 * gameWorld.distance});
			a.projectile = true;
			var theta = this.angle;
			a.velocity = {x: 90 * Math.cos(theta), y: 90 * Math.sin(theta)};
			a.angle = theta;
			a.addBehavior(Trail, {interval: 0.12, maxlength: 10})
			a.addBehavior(Follow, {target: this, offset: {x: false, y: false, z: false, alive: true, angle: false}});
			projectiles.push(a);
			
			return 1.6;			
	},
	proximity: function (layer) {
			//var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
			var a = layer.add(Object.create(Entity).init(this.x, this.y, 7, 7));
			a.color = "black";//"#8bc34a";
			a.angle = PI / 4;
			a.stroke = true;
			a.strokeColor = COLORS.primary;
			a.width = 2;
			a.blend = "destination-out";
			//a.animation = 5;
			a.setCollision(Polygon);
			//gameWorld.playSound(Resources.mortar);
			a.collision.onHandle = projectileHit;
			a.addBehavior(CropDistance, {target: this, max: 10 * gameWorld.distance});
			//a.addBehavior(Oscillate, {field: "scale", object: a, rate: 1, initial: 1, constant: 0.2, offset: 0});
			a.addBehavior(Velocity);
			a.family = this.family;
			a.projectile = true;
			projectiles.push(a);
			
			a.velocity = {x: 0, y: 0};//, angle: PI / 6};
			return 1.2;			
	}
}

// push to raindrop
var fullscreen = false;
function requestFullScreen () {
// we've made the attempt, at least
  fullscreen = true;
	console.log('requestingFullScreen');
  var body = document.documentElement;
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitRequestFullscreen) {
    body.webkitRequestFullscreen();
  } else if (body.mozRequestFullscreen) {
    body.mozRequestFullscreen();
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen();
  }
}

// cooldown, shoot
var Enemy = Object.create(Behavior);
Enemy.update = function (dt) {
	if (this.cooldown > 0) this.cooldown -= dt;
	else if (this.entity.shoot) {
		this.cooldown = this.entity.shoot(this.entity.layer);
	}
}
Enemy.draw = function (ctx) {
	if (this.cooldown > 0 && this.cooldown < 1) {
		ctx.beginPath();
		ctx.arc(this.entity.x, this.entity.y, this.cooldown * 2 * this.entity.w, 0, PI2, true);
		ctx.fillStyle = COLORS.primary; //"#ff6347";
		ctx.globalAlpha = 1 - (this.cooldown / 2);
		ctx.fill();
		ctx.globalAlpha = 1;
	}
}

// fix me: not used, but maybe useful? keeping for now
// target, radius, rate, angle
var Drone = Object.create(Behavior);
Drone.update = function (dt) {
  if (distance(this.entity.x, this.entity.y, this.target.x, this.target.y) > this.radius) {
    this.entity.x = lerp(this.entity.x, this.target.x, dt * this.rate);
    this.entity.y = lerp(this.entity.y, this.target.y, dt * this.rate);    
  } else {
    this.angle += dt;
    this.entity.x = lerp(this.entity.x, this.target.x + Math.cos(this.angle) * this.radius, dt * this.rate);
    this.entity.y = lerp(this.entity.y, this.target.y + Math.sin(this.angle) * this.radius, dt * this.rate);   
  }
  this.entity.angle = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
}

// push to raindrop
Velocity.update = function (dt) {
	this.entity.x += dt * this.entity.velocity.x;
	this.entity.y += dt * this.entity.velocity.y;	
	this.entity.angle += dt * this.entity.velocity.angle || 0;	
};

FadeIn.start = function () {
  this.maxOpacity = 1;
  this.time = 0;
};

var CropDistance = Object.create(Behavior);
CropDistance.update = function (dt) {
	var d = distance(this.entity.x, this.entity.y, this.target.x, this.target.y);
	if (d > this.max) {
		//console.log('cropdistance actually happening');
		this.entity.alive = false;
	}
}

// push to raindrop -> animate 'onEnd'
Animate.update = function (dt) {
	if (this.paused) return;
	this.entity.frameDelay -= dt;
	if (this.entity.frameDelay <= 0) {
		this.entity.frameDelay = this.entity.maxFrameDelay;
		this.entity.frame = (this.entity.frame + 1) % this.entity.maxFrame;
		if (this.entity.frame == this.entity.maxFrame - 1 &&  this.onEnd) {
			this.onEnd();
		} 
	}
};

// target, speed, turn_rate
var Target = Object.create(Behavior);
Target.update = function (dt) {
	if (this.angle === undefined) this.angle = 0;
	if (!this.offset) {
		this.entity.opacity = 0.5;
		return;
	}
	this.angle =  lerp_angle(this.angle, angle(this.entity.x, this.entity.y, this.target.x + this.offset.x, this.target.y + this.offset.y), this.turn_rate * dt);
	if (this.set_angle) this.entity.angle = this.angle;
	this.entity.velocity = {x: Math.cos(this.angle) * this.speed, y: Math.sin(this.angle) * this.speed};		
};

// target, speed, goal, tilesize
var NewTarget = Object.create(Behavior);
NewTarget.update = function (dt) {
	if (this.entity.x === this.goal.x && this.entity.y === this.goal.y) {
		// new goal
		var sx = sign(this.target.x - this.entity.x), sy = sign(this.target.y - this.entity.y);
		this.goal = {x: Math.round(this.entity.x / this.tilesize) * this.tilesize + sx * this.tilesize, y: Math.round(this.entity.y / this.tilesize) * this.tilesize + sy * this.tilesize};
	} else {
		this.entity.x = lerp(this.entity.x, this.goal.x, 0.5 * this.speed * dt);
		this.entity.y = lerp(this.entity.y, this.goal.y, this.speed * dt);
	}
};

// target object, origin object, destination object (default = entity), rate, color, width
var TractorBeam = Object.create(Behavior);
TractorBeam.update = function (dt) {
	if (!this.reached) {
		this.origin.x = lerp(this.origin.x, this.target.x, this.rate * dt);
		this.origin.y = lerp(this.origin.y, this.target.y, this.rate * dt);
		if (distance(this.origin.x, this.origin.y, this.target.x, this.target.y) <= 2) {
			//console.log('reached');
			this.reached = true;
		}
	} else {
		this.origin.x = lerp(this.origin.x, this.entity.x, this.rate * dt);
		this.origin.y = lerp(this.origin.y, this.entity.y, this.rate * dt);
		this.target.x = this.origin.x;
		this.target.y = this.origin.y;
		if (distance(this.origin.x, this.origin.y, this.entity.x, this.entity.y) <= 2) {
			this.entity.removeBehavior(this);
			if (this.callback) this.callback();
		}
	}
};
TractorBeam.draw = function (ctx) {
	ctx.beginPath();
	ctx.strokeStyle = this.color || "black";
	ctx.lineWidth = this.thickness || 2;
	if (this.entity.limbs) {
		for (var i = 0; i < this.entity.limbs.length; i++) {
			ctx.moveTo(this.entity.limbs[i].x, this.entity.limbs[i].y);
			ctx.lineTo(this.origin.x, this.origin.y);
		}
	}
	ctx.stroke();
};

// target, color, width
var Joined = Object.create(Behavior);
Joined.draw = function (ctx) {
	ctx.strokeStyle = this.color;
	ctx.lineWidth = this.width;
	ctx.beginPath();
	ctx.moveTo(this.entity.x, this.entity.y);
	ctx.lineTo(this.target.x, this.target.y);
	ctx.stroke();
}

var Repair = Object.create(Behavior);
Repair.update = function (dt) {
	if (this.time === undefined) this.time = 0;
	this.time += dt;
	if (this.time > 1 && this.entity.material > 0) {
		this.entity.material -= 1;
		this.time = 0;
		this.entity.health = Math.min(MAXHEALTH, this.entity.health + 1);
		gameWorld.scene.updateHealthBar(this.entity);
	}
}

//var animations = [0, 1, 2, 2, 4, 4, 3, 3, 2];
var sprites = ["drone", "saucer", "modules", "bomber", "saucer", "drone", "modules"];
function spawn(layer, key, player) {
	var theta = Math.random() * PI2;
	var x = player.x + randint(- gameWorld.width / 2,  gameWorld.width / 2), y = player.y + randint(-gameWorld.height / 2, gameWorld.height / 2);
	var enemy = Object.create(Sprite).init(Math.round(x / 48) * 48, Math.round(y / 48) * 48, Resources[sprites[key % sprites.length]]);
	enemy.z = Z.entity;
	enemy.addBehavior(Velocity);
	enemy.velocity = {x: 0, y: 0};
	enemy.setCollision(Polygon);
	enemy.blend = "destination-out";
	switch (key) {
		case 0:
			enemy.addBehavior(NewTarget, {target: player, speed: 2, tilesize: 48, goal: {x: enemy.x, y: enemy.y}});
			enemy.shoot = Weapons.standard;
			enemy.target = player;
			enemy.setVertices([
				{x: -3, y: -3}, {x: -3, y: 3}, {x: 3, y: 3}, {x: 3, y: -3}
			]);
			break;
		case 1:
			enemy.addBehavior(Target, {target: player, speed: 25, turn_rate: 2.5, offset: {x: randint(-16, 16), y: randint(-16, 16)}});
			enemy.shoot = Weapons.triple;
			enemy.target = player;
			enemy.setVertices([
				{x: -3, y: -3}, {x: -3, y: 3}, {x: 3, y: 3}, {x: 3, y: -3}
			]);			
			break;
		case 2:
			enemy.addBehavior(Target, {target: player, speed: 0, turn_rate: 0, offset: {x: randint(-16, 16), y: randint(-16, 16)}});
			enemy.shoot = Weapons.burst;
			enemy.target = player;
			enemy.animation = 2;
			enemy.setVertices([
				{x: -3, y: -3}, {x: -3, y: 3}, {x: 3, y: 3}, {x: 3, y: -3}
			]);			
			break;
		case 3:
			// fix me: currently does NOTHING
			enemy.velocity = {x: 0, y: 0};
			enemy.setVertices([
				{x: -5, y: -3}, {x: -5, y: 3}, {x: 5, y: 3}, {x: 5, y: -3}
			]);
			break;
		case 4:
			enemy.addBehavior(Target, {target: player, speed: 35, turn_rate: 1, offset: {x: randint(-16, 16), y: randint(-16, 16)}});
			enemy.shoot = Weapons.proximity;
			enemy.setVertices([
				{x: -4, y: 0}, {x: 0, y: 4}, {x: 4, y: 0}, {x: 0, y: -4}
			]);
			break;
		case 5:
			enemy.addBehavior(Target, {target: player, speed: 20, turn_rate: 5, offset: {x: randint(-16, 16), y: randint(-16, 16)}});
			enemy.target = player;
			enemy.shoot = Weapons.homing;
			enemy.setVertices([
				{x: -6, y: -3}, {x: -6, y: 3}, {x: 6, y: 3}, {x: 6, y: -3}
			]);
			break;
		case 6:
			enemy.shoot = Weapons.hitscan;
			enemy.animation = 0;
			enemy.target = player;
			enemy.setVertices([
				{x: -6, y: -3}, {x: -6, y: 3}, {x: 6, y: 3}, {x: 6, y: -3}
			]);
			break;
	}
	// FIX ME: update to use color-based shape primitives instead
	var flash = layer.add(Object.create(Sprite).init(enemy.x, enemy.y, Resources.blink));
	flash.addBehavior(FadeOut, {duration: 0, delay: 0.7});
	enemy.collision.onHandle = function (object, other) {
		if (other.family == "player") {
			enemy.alive = false;
			enemy.die();
		}
	};
	enemy.family = "enemy";
	enemy.addBehavior(Enemy);

	layer.add(enemy);
	enemy.die = function () {
		enemy.alive = false;
		var expl = enemy.layer.add(Object.create(Circle).init(enemy.x, enemy.y, 24));
		expl.addBehavior(FadeOut, {duration: 0.5, delay: 0.2});
		expl.z = 1;
		var flash = enemy.layer.add(Object.create(Circle).init(enemy.x, enemy.y, 32));
		flash.z = 2;
		flash.addBehavior(FadeOut, {duration: 0, delay: 0.1});
		flash.color = COLORS.secondary;
		gameWorld.playSound(Resources.hit);        
		
		var scrap = enemy.layer.add(Object.create(Entity).init(enemy.x, enemy.y, 4, 4));
		gameWorld.boss.addBehavior(TractorBeam, {target: scrap, turn_rate: 5, speed: 50, color: COLORS.tertiary, thickness: 2, width: 3.5, rate: 6, origin: {x: gameWorld.boss.x, y: gameWorld.boss.y}});
		scrap.addBehavior(Velocity);
		scrap.velocity = {x: 0, y: 0};
		scrap.setCollision(Polygon);
		scrap.collision.onHandle = function (object, other) {
			if (other == gameWorld.boss) {
				object.alive = false;
				var p = other.layer.add(Object.create(Entity).init(object.x, other.y, 6, 6));
				p.addBehavior(Velocity);
				p.velocity = {x: 0, y: -50};
				p.addBehavior(FadeOut, {duration: 0.5, delay: 0.3});
				other.health = Math.min(other.maxhealth, other.health + 1);
			} else if (other == player && other.material !== undefined) {
				object.alive =false;
				other.material += 1;
			}
		}
	};
	enemy.addBehavior(CropDistance, {target: player, max: 10 * gameWorld.width});
	return enemy;
}

var current_movement_key = 0;
var movement_keys = ["standard"];
// fix me: can remove
var Movement = {
	standard: function (s) {
		s.unpause();
		s.player_bot.lerpx = s.player_bot.addBehavior(Lerp, {field: "x", goal: Math.round(s.player_bot.x + this.distance * Math.cos(s.player_bot.angle)), rate: this.speed, object: s.player_bot, callback: function () {
			console.log('lerpx callback');
			this.entity.removeBehavior(this);
			this.entity.lerpx = undefined;
			s.pause();
		}});
		s.player_bot.lerpy = s.player_bot.addBehavior(Lerp, {field: "y", goal: Math.round(s.player_bot.y + this.distance * Math.sin(s.player_bot.angle)), rate: this.speed, object: s.player_bot, callback: function () {
			this.entity.removeBehavior(this);
			this.entity.lerpy = undefined;
			s.pause();
		}});
		
		gameWorld.playSound(Resources.move);  
		var d = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x, s.player_bot.y, Resources.dust));
		d.addBehavior(Velocity);
		d.velocity = {x: -s.player_bot.velocity.x / 2, y: -s.player_bot.velocity.y / 2};
		d.addBehavior(FadeOut, {duration: 0.8});
	}
}

var Store = {
	init: function (layer, player) {
		this.layer = layer, this.player = player, this.spent = 0, this.repair_cost = 1;
		this.createUI();
		return this;
	},
	buttons: [
		{ name: "Health", price: 1, icon: 0, trigger: function (t) {
			// fix me: don't allow if already at max-health
				if (t.player.health < MAXHEALTH) {
					t.player.health++;
					gameWorld.scene.updateHealthBar(t.player);
					return true;
				} else {
					return false;
				}
			}
		},
		{
			name: "Shield", price: 2, icon: 1, trigger: function (t) {
				if (!t.player.has_shield) {
					t.player.has_shield = t.player.addBehavior(Shielded, {rate: 1});
					gameWorld.scene.updateHealthBar(t.player);
					return true;
				} else {
					return false;
				}
			}
		},
		{
			name: "Radar", price: 3, icon: 2, trigger: function (t) {
				if (!t.player.has_rader) {
					t.player.has_radar = t.player.addBehavior(Radar);
					return true;
				} else {
					return false;
				}
			}
		},
		{
			name: "Retaliate", price: 5, icon: 4, trigger: function (t) {
				if (!t.player.has_retaliate) {
					gameWorld.playSound(Resources.select);
					t.player.retaliate = 1;
					t.player.has_retaliate = true;
					return true;
				} else {
					return false;
				}
			}
		},
		{
			name: "Repair", price: 6, icon: 3, trigger: function (t) {
				if (!t.player.has_repair) {
					t.player.has_repair = t.player.addBehavior(Repair);
					t.player.material = 0;
					return true;
				} else {
					return false;
				}
			}
		},
		{
			name: "FTL", price: 15, icon: 5, trigger: function (t) {
				if (!t.player.hasFTL) {
					t.player.hasFTL = t.player.addBehavior(HyperDrive); // maybe do this HERE instead of in random behavior...
					return true;
				} else {
					return false;
				}
			}
		}
	],
	createUI: function () {

		var border = this.layer.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height / 2, 128, gameWorld.height / 2, Resources.building2));
		border.z = -10;
		var b1 = this.layer.add(Object.create(Entity).init(border.x, border.y + 1, border.w - 8, border.h - 16));
		b1.color = "#000";
		b1.z = -9;
		var b2 = this.layer.add(Object.create(Entity).init(border.x, border.y + 2, border.w - 16, border.h - 24));
		b2.color = "#fff";
		b2.z = -8;

		var t = this;
		
		var close = this.layer.add(Object.create(Entity).init(gameWorld.width / 2, 3 * gameWorld.height / 4 - 24, gameWorld.width / 2 + 24, 16));
		close.z = -7;
		this.layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, 3 * gameWorld.height / 4 - 24, Resources.expire_font, "DONE", {align: "center", spacing: -2})).z = -6;
		close.family = "button";
		close.color = "white";
		close.trigger = function () {
			t.player.salvage -= t.spent;
			t.spent = 0;
			gameWorld.playSound(Resources.buy);
			t.close();
		};
		close.hover = function () {
		    if (this.color != "#6DC72E") gameWorld.playSound(Resources.hover);
			this.color = "#6DC72E";
		};
		close.unhover = function () {
			this.color = "white";
		};
		//this.weapons = {};
		this.salvage = this.layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height / 4 + 24, Resources.expire_font, "$ 0", {align: "center", spacing: -2}));
		
		for (var i = 0; i < this.buttons.length; i++) {
			// probably need closure here
			(function () {
				var j = i;
				var button = t.layer.add(Object.create(Entity).init(gameWorld.width  / 2, t.salvage.y + 16 * (1 + i), gameWorld.width / 2 + 24, 16));
				var icon = t.layer.add(Object.create(Sprite).init(gameWorld.width / 4, t.salvage.y + 16 * (i + 1), Resources.icons));
				var name = t.layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, t.salvage.y + 16 * (i + 1), Resources.expire_font, t.buttons[i].name, {spacing: -2, align: "center"}));
				var price = t.layer.add(Object.create(SpriteFont).init(3 * gameWorld.width / 4 + 8, t.salvage.y + 16 * (i + 1), Resources.expire_font, "$" + t.buttons[i].price, {spacing: -2, align: "right"}));
				button.color = "white";
				button.family = "button";
				button.price = t.buttons[j].price;
				button.hover = function () {
					var color = (t.player.salvage - t.spent >= this.price) ? "#6DC72E" : "#dddddd";
					// check if you can afford it here, change color accordingly
				    if (this.color != color) {
				    	gameWorld.playSound(Resources.hover);
						this.color = color;
				    }
				}
				button.unhover = function () {
					this.color = "white";
				}
				button.z = -2, icon.z = -1, name.z = -1;
				icon.animation = t.buttons[i].icon;
				button.trigger = function () {
					// check price HERE
					if (t.player.salvage - t.spent >= this.price)
					{
						if (t.buttons[j].trigger(t)) {
							t.spent += this.price;
							t.salvage.text = "$" + (t.player.salvage - t.spent);
							gameWorld.playSound(Resources.select);
						}
					}
				}
			})();
		}
		
		for (var i = 0; i < this.layer.entities.length; i++) {
			this.layer.entities[i].origin = {x: 0, y: 240};
			this.layer.entities[i].angle = -PI/2;
			this.layer.entities[i].lerp = this.layer.entities[i].addBehavior(Lerp, {object: this.layer.entities[i], field: "angle", goal: 0, rate: 5});
			this.layer.entities[i].goal = this.layer.entities[i].lerp.goal;
			this.layer.entities[i].original = this.layer.entities[i].angle;
		}
		
	},
	open: function () {
		this.salvage.text = "$ " + this.player.salvage;
		//this.damageWheel.percentage = 100 * (this.player.health / MAXHEALTH);
		
		for (var i = 0; i < this.layer.entities.length; i++) {
			this.layer.entities[i].lerp.goal = this.layer.entities[i].goal;
		}
		var t = this;
		this.layer.entities[0].lerp.callback = function () {
			/*for (var i = 0; i < gameWorld.scene.layers.length; i++) {
				gameWorld.scene.layers[i].paused = true;
				t.layer.paused = false;
			}*/	
		}
		this.layer.active = true;
		for (var i = 0; i < gameWorld.scene.layers.length; i++) {
			gameWorld.scene.layers[i].paused = true;
		}
		this.layer.paused = false;

		gameWorld.scene.bg.camera.addBehavior(Lerp, {object: gameWorld.scene.bg.camera.behaviors[0].offset, field: "y", goal: -7 * gameWorld.height / 8, rate: 10, callback: function () {
			this.entity.removeBehavior(this);
		}});
		gameWorld.boss.old_x = gameWorld.boss.x;
		gameWorld.boss.old_y = gameWorld.boss.y;
		gameWorld.boss.x = this.player.x;
		gameWorld.boss.y = this.player.y - 3 * gameWorld.height / 4;
		gameWorld.boss.lerpFollow.old_rate = gameWorld.boss.lerpFollow.rate;
		gameWorld.boss.lerpFollow.rate = 0;
/*		gameWorld.boss.addBehavior(Lerp, {object: gameWorld.boss.behaviors[1].offset, field: "y", goal: -3 * gameWorld.height / 4, rate: 10, callback: function () {
			this.entity.removeBehavior(this);
		}});*/
		//gameWorld.boss.behaviors[1].rate = 10;
	},
	close: function () {
		var t = this;
		for (var i = 0; i < this.layer.entities.length; i++) {
			this.layer.entities[i].lerp.goal = this.layer.entities[i].original;
		}
		this.layer.entities[0].lerp.callback = function () {
			this.callback = undefined;
			t.layer.active = false;
			t.player.locked = false;
		}
		gameWorld.current_wave += 1;
		
		gameWorld.scene.bg.camera.addBehavior(Lerp, {object: gameWorld.scene.bg.camera.behaviors[0].offset, field: "y", goal: -gameWorld.height / 2, rate: 10, callback: function () {
			this.entity.removeBehavior(this);
		}});
		gameWorld.boss.removeBehavior(gameWorld.boss.energy);
		gameWorld.scene.player_bot.removeBehavior(gameWorld.scene.player_bot.energy);
		gameWorld.boss.energy = undefined;
		gameWorld.scene.player_bot.energy = undefined;
		gameWorld.boss.addBehavior(Lerp, {object: gameWorld.boss.behaviors[1].offset, field: "y", goal: - gameWorld.height / 3, rate: 10, callback: function () {
			this.entity.removeBehavior(this);
			if (gameWorld.boss.lerpFollow.old_rate) gameWorld.boss.lerpFollow.rate = gameWorld.boss.lerpFollow.old_rate;
		}});
	}
}