// canvas filter (color style); grayscale(70%) contrast(250%) brightness(90%);

var MAXHEALTH = 4, DAMAGE_COOLDOWN = 0.5;
var gameWorld = Object.create(World).init(180, 320, "index.json");
gameWorld.wave = 0;

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

// very custom, so avoid passing parameters and just assume them...
var Radar = Object.create(Behavior);
Radar.draw = function(ctx) {
	var t = this;
	var concerning = this.entity.layer.entities.filter(function (e) { return e.family == "enemy" && !e.projectile && (!between(e.x, t.entity.x - gameWorld.width / 2, t.entity.x + gameWorld.width / 2) || !between(e.y, t.entity.y - gameWorld.height / 2, t.entity.y + gameWorld.height / 2)); });
	ctx.fillStyle = "black";
	for (var i = 0; i < concerning.length; i++) {
		ctx.fillRect(clamp(concerning[i].x, this.entity.x - gameWorld.width / 2, this.entity.x + gameWorld.width / 2) - 2, clamp(concerning[i].y, this.entity.y - gameWorld.height / 2, this.entity.y + gameWorld.height / 2) - 2, 4, 4);
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

var DrawEnergy = Object.create(Behavior);
DrawEnergy.draw = function (ctx) {
	ctx.strokeStyle = this.color || "blue";
	ctx.lineWidth = this.thickness || 1;
	ctx.beginPath();
	ctx.moveTo(this.entity.x, this.entity.y);
	ctx.lineTo(this.entity.x - this.w / 2, this.entity.y + this.h);
	ctx.moveTo(this.entity.x, this.entity.y);
	ctx.lineTo(this.entity.x + this.w / 2, this.entity.y + this.h);
	ctx.stroke();
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

var Charge = Object.create(Behavior);
// speed, target, rate
Charge.update = function (dt) {
	if (!this.entity.lerpx &&  !this.entity.lerpy) {
		var theta = (PI / 2) * Math.round(angle(this.entity.x, this.entity.y, this.target.x, this.target.y) / (PI / 2));
		//var theta = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
		this.entity.angle = theta;
		this.entity.lerpx = this.entity.addBehavior(Lerp, {rate: this.rate, goal: this.entity.x + Math.cos(theta) * this.distance, object: this.entity, field: "x", callback: function () {
			console.log('removing lerpx');
			this.entity.removeBehavior(this.entity.lerpx);
			this.entity.lerpx = undefined;
		}});		
		this.entity.lerpy = this.entity.addBehavior(Lerp, {rate: this.rate, goal: this.entity.y + Math.sin(theta) * this.distance, object: this.entity, field: "y", callback: function () {
			console.log('removing lerpy');
			this.entity.removeBehavior(this.entity.lerpy);
			this.entity.lerpy = undefined;
		}});
	}
}
Charge.draw = function (ctx) {
	ctx.beginPath();
	ctx.arc(this.entity.x, this.entity.y, 18, this.entity.angle - PI / 4, this.entity.angle + PI / 4, false);
	ctx.stroke();
}

var AI = Object.create(Behavior);
AI.update = function (dt) {
	if (this.time === undefined) this.time = 0;
	this.time += dt;
  // move to player, pay
  if (this.value / this.time < 1) {
  	this.entity.y = lerp(this.entity.y, this.target.y, this.rate * dt);
    this.entity.x = lerp(this.entity.x, this.target.x + (this.target.x > gameWorld.width / 2 ? -24 : 24), this.rate * dt);
  	//this.entity.x = lerp(this.entity.x, this.target.x, this.rate * dt);
  }
  // stick around, store is 'open'
  // use above?
  // ...
  // leave for a while
  // ...
}

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
}
Delay.set = function (t) {
	if (t !== undefined) this.duration = t;
	this.time = 0;
}

var BeamShip = Object.create(Behavior);
BeamShip.update = function (dt) {
	// movement
	if (this.time === undefined) this.time = 0;
	if (this.cooldown === undefined) this.cooldown = 1;
	// weapon
	this.cooldown -= dt;
	if (this.cooldown <= 0 && this.cooldown > -1) {
		this.cooldown = -1;
		this.direction = this.entity.velocity.y;
		this.entity.velocity = {x: 0, y: 0};
		
		var theta = this.entity.angle;
		var b = this.entity.layer.add(Object.create(Entity).init(this.entity.x + Math.cos(theta) * 240, this.entity.y + Math.sin(theta) * 240, 480, 2));
		b.color = "#e91e63";
		b.angle = theta;
		b.setCollision(Polygon);
		b.collision.onHandle = function (object, other) {
			if (other.family != object.family && !other.projectile) {
				var small = object.layer.add(Object.create(Sprite).init(object.x, object.y, Resources.small));
				small.addBehavior(FadeOut, {duration: 0.5});
				gameWorld.playSound(Resources.hit, volume(small));
			}
		};
		b.family = this.entity.family;
		b.projectile = true;
		b.addBehavior(FadeOut, {delay: 0.7, duration: 0.2, maxOpacity: 1});
		b.addBehavior(FadeIn, {duration: 0.2, maxOpacity: 1});
		b.opacity = 0;
		b.z = Z.projectile;
		gameWorld.playSound(Resources.beam, volume(b));
		
	} else if (this.cooldown < -2) {
		this.cooldown = 1
		// shooting
	} else if (this.cooldown > 0) {
		this.time += dt;
		this.entity.velocity.x = Math.sin(this.time) * 60;
		if (this.entity.velocity.y === 0) this.entity.velocity.y = this.direction;
		this.entity.angle = Math.atan2(this.entity.velocity.y, this.entity.velocity.x);

		if (this.entity.y > this.max.y) {
			this.entity.velocity.y *= -1;
			this.entity.y = this.max.y;
		}
		if (this.entity.y < this.min.y) {
			this.entity.velocity.y *= -1;
			this.entity.y = this.min.y;
		}
	}
}

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

// radius, cooldown, rate, target, damage
var Space = Object.create(Behavior);
Space.update = function (dt) {
	if (this.cooldown === undefined) this.cooldown = 0;
	else if (this.cooldown > 0) this.cooldown -= dt;
	else if (distance(this.entity.x, this.entity.y, this.target.x, this.target.y) > this.radius) {
		this.entity.health -= this.damage;
		this.cooldown = this.rate;
		// create particle effect
		for (var i = 0; i < 6; i++) {
			var e = this.entity.layer.add(Object.create(Circle).init(this.entity.x, this.entity.y, 3));
			e.addBehavior(Velocity);
			e.color = "black";
			var theta = Math.random() * PI2;
			e.velocity = {x: 30 * Math.cos(theta), y: 30 * Math.sin(theta) };
			e.addBehavior(FadeOut, {duration: 1, remove: true});
		}
	}
}

var Grow = Object.create(Behavior);
Grow.update = function (dt) {
	if (this.time === undefined) this.time = 0;
	this.time += dt;
	this.entity.scale = 1 + this.max * this.time / this.duration;
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

// add cooldown visuals (circle shrinks/brightens, then POW)
var Weapons = {
	hitscan: function (layer) {
		var theta = this.target ? angle(this.x, this.y, this.target.x, this.target.y) : this.angle;
		var warn = layer.add(Object.create(Entity).init(this.x + Math.cos(theta) * gameWorld.height, this.y + Math.sin(theta) * gameWorld.height, gameWorld.height * 2, 8));
		warn.color = "#ff6347";
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
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
//			var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
			//a.animation = 5;
			a.setCollision(Polygon);
			a.setVertices(projectile_vertices);
			gameWorld.playSound(Resources.laser, volume(a));
			a.collision.onHandle = projectileHit;
			a.addBehavior(Velocity);
			a.family = this.family;//"player";
			a.projectile = true;
			var theta = this.target ? angle(this.x, this.y, this.target.x, this.target.y) : this.angle;
			if (this.target) console.log('target');
			a.velocity = {x: 80 * Math.cos(theta), y: 80 * Math.sin(theta)	};
			a.angle = theta;		
			a.addBehavior(CropDistance, {target: this, max: 10 * gameWorld.distance});
			return 1.6;
	},
	triple: function (layer) {
		if (this.count === undefined) this.count = 0;
		var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
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
		this.count += 1;
		if (this.count % 3 === 0) {
			return 3;
		} else {
			return 0.5;
		}
	},
	burst: function (layer) {
		if (this.count === undefined) this.count = 0;
		var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
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
		this.count += 1;
		if (this.count % 15 === 0) {
			return 4;
		} else {
			return 0.25;
		}
	},
	homing: function (layer) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
//			var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
			a.setCollision(Polygon);
			a.setVertices(projectile_vertices);
			//a.animation = 5;
			//gameWorld.playSound(Resources.mortar);
			a.collision.onHandle = projectileHit;
			a.addBehavior(Velocity);
			a.addBehavior(Target, {target: this.target, turn_rate: 0.2, speed: 30});
			a.family = this.family;
			a.addBehavior(CropDistance, {target: this, max: 10 * gameWorld.distance});
			a.projectile = true;
			var theta = this.angle;
			a.velocity = {x: 90 * Math.cos(theta), y: 90 * Math.sin(theta)};
			a.angle = theta;
			return 1.6;			
	},
	proximity: function (layer) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bullet));
//			var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
			//a.animation = 5;
			a.setCollision(Polygon);
			//gameWorld.playSound(Resources.mortar);
			a.collision.onHandle = projectileHit;
			a.addBehavior(CropDistance, {target: this, max: 10 * gameWorld.distance});
			//a.addBehavior(Oscillate, {field: "scale", object: a, rate: 1, initial: 1, constant: 0.2, offset: 0});
			a.addBehavior(Velocity);
			a.family = this.family;
			a.projectile = true;
			a.velocity = {x: 0, y: 0, angle: PI / 6};
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

// push to raindrop 'active' flag for layer
Scene.draw = function (ctx) {
	for (var i = 0; i < this.layers.length; i++) {
		if (this.layers[i].active)
		{
			this.layers[i].draw(ctx);
			ctx.drawImage(this.layers[i].canvas, 0, 0);
		}
	}
};
Scene.update = function (dt) {
	this.time += dt;
	for (var i = 0; i < this.layers.length; i++) {
		if (this.layers[i].active)
			this.layers[i].update(dt);
	}
	this.onUpdate(dt);
};

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
		ctx.fillStyle = "#ff6347";
		ctx.globalAlpha = 1 - (this.cooldown / 2);
		ctx.fill();
		ctx.globalAlpha = 1;
	}
}

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

var Bounce = Object.create(Behavior);
Bounce.update = function (dt) {
  if (this.entity.x > this.max.x) {
    this.entity.x = this.max.x;
    this.entity.velocity.x *= -1;
  } else if (this.entity.x < this.min.x) {
    this.entity.x = this.min.x;
    this.entity.velocity.x *= -1;
  }
  if (this.entity.y > this.max.y) {
    this.entity.y = this.max.y;
    this.entity.velocity.y *= -1;
  } else if (this.entity.y < this.min.y) {
    this.entity.y = this.min.y;
    this.entity.velocity.y *= -1;
  }
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

// push to raindrop, maybe with certain modifications??
var BoundDistance = Object.create(Behavior);
BoundDistance.update = function (dt) {
  	var d = distance(this.entity.x, this.entity.y, this.target.x, this.target.y);
  	if (d > this.max) {
  		var speed = Math.sqrt(Math.pow(this.entity.velocity.x, 2) + Math.pow(this.entity.velocity.y, 2));
	  	this.entity.out_of_bounds = true;
	  	var theta = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
	    this.entity.angle = lerp_angle(this.entity.angle, theta, this.rate * dt);
	    this.entity.velocity = {x: Math.cos(this.entity.angle) * speed, y: Math.sin(this.entity.angle) * speed};
	} else if (d < this.min) {
  		var speed = Math.sqrt(Math.pow(this.entity.velocity.x, 2) + Math.pow(this.entity.velocity.y, 2));
	  	this.entity.out_of_bounds = true;
	  	var theta = angle(this.target.x, this.target.y, this.entity.x, this.entity.y);
	    this.entity.angle = lerp_angle(this.entity.angle, theta, this.rate * dt);
	    this.entity.velocity = {x: Math.cos(this.entity.angle) * speed, y: Math.sin(this.entity.angle) * speed};
	} else {
	  	this.entity.out_of_bounds = false;
	  }
	if (this.visible && this.entity.out_of_bounds) {
		var c = this.entity.layer.add(Object.create(Circle).init(this.entity.x, this.entity.y, randint(4,8)));
		c.addBehavior(FadeIn, {duration: 0.1, delay: 0.1, maxOpacity: 1});
		c.addBehavior(FadeOut, {duration: 1.1, delay: 0.1, maxOpacity: 1});
		c.color = this.color || "white";
	}
};

var CropDistance = Object.create(Behavior);
CropDistance.update = function (dt) {
	var d = distance(this.entity.x, this.entity.y, this.target.x, this.target.y);
	if (d > this.max) {
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

var Wheel = Object.create(Entity);
Wheel.init = function (x, y, radius, border, slice, step, percentage, colors) {
	this.x = x, this.y = y, this.radius = radius, this.border = border, this.slice = slice, this.step = step, this.percentage = percentage, this.colors = colors;
	this.behaviors = [], this.offset = {x: 0, y: 0};
	return this;
} 
Wheel.onDraw = function (ctx) {
	ctx.fillStyle = this.colors[0];
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  ctx.fill();

	for (var i = 0; i < 100 / this.step; i += 1) {
  	if (i < this.percentage / this.step)
      ctx.fillStyle = this.colors[2];
    else
    	ctx.fillStyle = this.colors[1];
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.radius - this.border, i * 2 * Math.PI / (100 / this.step) + this.slice, (i + 1) * 2 * Math.PI / (100 / this.step) - this.slice, false);
    ctx.fill();
	}
  
  ctx.fillStyle = this.colors[0];
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius / 4 + this.border, 0, Math.PI * 2, false);
  ctx.fill();
  
  ctx.fillStyle = this.colors[3];
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius / 4, 0, Math.PI * 2, false);
  ctx.fill();
}


// target object, origin object, destination object (default = entity), rate, color, width
var TractorBeam = Object.create(Behavior);
TractorBeam.update = function (dt) {
	if (!this.reached) {
		this.origin.x = lerp(this.origin.x, this.target.x, this.rate * dt);
		this.origin.y = lerp(this.origin.y, this.target.y, this.rate * dt);
		if (distance(this.origin.x, this.origin.y, this.target.x, this.target.y) <= 2) {
			console.log('reached');
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
	ctx.moveTo(this.entity.x, this.entity.y);
	ctx.lineTo(this.origin.x - this.target.w / 2, this.origin.y);
	ctx.moveTo(this.entity.x, this.entity.y);
	ctx.lineTo(this.origin.x + this.target.w / 2, this.origin.y);
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

	//enemy.animation = animations[key];
	//enemy.addBehavior(Crop, {min: {x: -16, y: -1000}, max: {x: gameWorld.width + 16, y: 1000}});
	enemy.z = Z.entity;
	//enemy.angle = enemy.x > gameWorld.width / 2 ? - PI : 0;
	enemy.addBehavior(Velocity);
	enemy.velocity = {x: 0, y: 0};
	enemy.setCollision(Polygon);
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
		// fix me: collisions still a bit bad; need feedback/bounceback for failed hit especially
			//enemy.x = Math.round(enemy.x / 48) * 48, enemy.y = Math.round(enemy.y / 48) * 48;
			//enemy.addBehavior(Charge, {target: player, distance: 48, rate: 3});
			enemy.velocity = {x: 0, y: 0};
			enemy.shielded = true;
			enemy.setVertices([
				{x: -5, y: -3}, {x: -5, y: 3}, {x: 5, y: 3}, {x: 5, y: -3}
			]);
			break;
		case 4:
		// needs a bit of tweaking for balance/difficulty - maybe only useful in combination? - 
		// - perhaps more explicit movement (tried to make box around you, e.g) would be better
			enemy.addBehavior(Target, {target: player, speed: 35, turn_rate: 1, offset: {x: randint(-16, 16), y: randint(-16, 16)}});
			enemy.shoot = Weapons.proximity;
			enemy.setVertices([
				{x: -4, y: 0}, {x: 0, y: 4}, {x: 4, y: 0}, {x: 0, y: -4}
			]);
			break;
		case 5:
		// homing should A: start in the right direction, B: be faster?
			enemy.addBehavior(Target, {target: player, speed: 20, turn_rate: 5, offset: {x: randint(-16, 16), y: randint(-16, 16)}});
			enemy.target = player;
			enemy.shoot = Weapons.homing;
			enemy.setVertices([
				{x: -6, y: -3}, {x: -6, y: 3}, {x: 6, y: 3}, {x: 6, y: -3}
			]);
			break;
		case 6:
			//enemy.addBehavior(Target, {target: player, speed: 60, turn_rate: 1, min: 80});
			enemy.shoot = Weapons.hitscan;
			enemy.animation = 0;
			enemy.target = player;
			enemy.setVertices([
				{x: -6, y: -3}, {x: -6, y: 3}, {x: 6, y: 3}, {x: 6, y: -3}
			]);
			break;
	}
	var flash = layer.add(Object.create(Sprite).init(enemy.x, enemy.y, Resources.blink));
	flash.addBehavior(FadeOut, {duration: 0, delay: 0.7});
	enemy.collision.onHandle = function (object, other) {
		if (object.shielded && short_angle(angle(object.x, object.y, other.x, other.y), object.angle) < PI / 4) {
			console.log('shielded!');
		} else if (other.family == "player") {
			enemy.alive = false;
			enemy.die();
		}
	};
	enemy.family = "enemy";
	enemy.addBehavior(Enemy);

	layer.add(enemy);
	enemy.die = function () {
		enemy.alive = false;
		var expl = enemy.layer.add(Object.create(Sprite).init(enemy.x + randint(-8, 8), enemy.y + randint(-8, 8), Resources.explosion));
		expl.addBehavior(FadeOut, {duration: 0, delay: 0.8});
		expl.z = 1;
		gameWorld.playSound(Resources.hit);        
		for (var i = 0; i < 3; i++) {
			expl.addBehavior(Delay, {duration: Math.random() * 0.6 + 0.2, callback: function () {
				var e = enemy.layer.add(Object.create(Sprite).init(enemy.x + randint(-8, 8), enemy.y + randint(-8, 8), Resources.explosion));
				e.addBehavior(FadeOut, {duration: 0, delay: 0.8});
				e.z = 1;
				gameWorld.playSound(Resources.hit);        
				this.entity.removeBehavior(this);
			}})
		}
		var scrap = enemy.layer.add(Object.create(Entity).init(enemy.x, enemy.y, 4, 4));
		gameWorld.boss.addBehavior(TractorBeam, {target: scrap, turn_rate: 5, speed: 50, color: "#000", thickness: 2, width: 3.5, rate: 6, origin: {x: gameWorld.boss.x, y: gameWorld.boss.y}});
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
var movement_keys = ["standard", "blink", "double", "chaos"];
var Movement = {
	standard: function (s) {
		s.unpause();
		s.player_bot.lerpx = s.player_bot.addBehavior(Lerp, {field: "x", goal: Math.round(s.player_bot.x + this.distance * Math.cos(s.player_bot.angle)), rate: this.speed, object: s.player_bot, callback: function () {
			this.entity.removeBehavior(this);
			this.entity.lerpx = undefined;
			s.pause();
		}});
		s.player_bot.lerpy = s.player_bot.addBehavior(Lerp, {field: "y", goal: Math.round(s.player_bot.y + this.distance * Math.sin(s.player_bot.angle)), rate: this.speed, object: s.player_bot, callback: function () {
			this.entity.removeBehavior(this);
			this.entity.lerpy = undefined;
			s.pause();
		}});
		
		// create contrail sprite
		gameWorld.playSound(Resources.move);  
		var d = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x, s.player_bot.y, Resources.dust));
		d.addBehavior(Velocity);
		d.velocity = {x: -s.player_bot.velocity.x / 2, y: -s.player_bot.velocity.y / 2};
		d.addBehavior(FadeOut, {duration: 0.8});
		//s.player_bot.stopped = false;
		//s.player_bot.delay.set();
	},
	blink: function (s) {
		s.unpause();
		gameWorld.playSound(Resources.blink1);
		gameWorld.playSound(Resources.move);
		s.player_bot.delay.set(0.5);
		s.player_bot.opacity = 0.1;
		s.player_bot.lerpx = true;
		//s.player_bot.stopped = false;
		s.player_bot.delay.old_callback = s.player_bot.delay.callback;
		s.player_bot.delay.callback = function () {
			s.pause();
			s.player_bot.opacity = 1;
			s.player_bot.lerpx = false;
			//s.player_bot.stopped = true;
			gameWorld.playSound(Resources.blink2);
			s.player_bot.x = s.player_bot.x + 50 * Math.cos(s.player_bot.angle), s.player_bot.y = s.player_bot.y + 50 * Math.sin(s.player_bot.angle);
			s.player_bot.delay.callback = s.player_bot.delay.old_callback;
		}
	},
	// just 'double' movement now, a commitment, slower (?)
	double: function (s) {
		s.unpause();
		s.player_bot.lerpx = s.player_bot.addBehavior(Lerp, {field: "x", goal: Math.round(s.player_bot.x + 100 * Math.cos(s.player_bot.angle)), rate: 2.5, object: s.player_bot, callback: function () {
			this.entity.removeBehavior(this);
			this.entity.lerpx = undefined;
		}});
		s.player_bot.lerpy = s.player_bot.addBehavior(Lerp, {field: "y", goal: Math.round(s.player_bot.y + 100 * Math.sin(s.player_bot.angle)), rate: 2.5, object: s.player_bot, callback: function () {
			this.entity.removeBehavior(this);
			this.entity.lerpy = undefined;
		}});
		
		// create contrail sprite
		gameWorld.playSound(Resources.move);  
		var d = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x, s.player_bot.y, Resources.dust));
		d.addBehavior(Velocity);
		d.velocity = {x: -s.player_bot.velocity.x / 2, y: -s.player_bot.velocity.y / 2};
		d.addBehavior(FadeOut, {duration: 0.8});
		//s.player_bot.stopped = false;
		s.player_bot.delay.set(2);
	},
	// triple movement in random direction
	chaos: function (s) {
		s.unpause();
		s.player_bot.angle = randint(0,4) * PI / 2;
		s.player_bot.lerpx = s.player_bot.addBehavior(Lerp, {field: "x", goal: Math.round(s.player_bot.x + 150 * Math.cos(s.player_bot.angle)), rate: 4.5, object: s.player_bot, callback: function () {
			this.entity.removeBehavior(this);
			this.entity.lerpx = undefined;
		}});
		s.player_bot.lerpy = s.player_bot.addBehavior(Lerp, {field: "y", goal: Math.round(s.player_bot.y + 150 * Math.sin(s.player_bot.angle)), rate: 4.5, object: s.player_bot, callback: function () {
			this.entity.removeBehavior(this);
			this.entity.lerpy = undefined;
		}});
		
		// create contrail sprite
		gameWorld.playSound(Resources.move);  
		var d = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x, s.player_bot.y, Resources.dust));
		d.addBehavior(Velocity);
		d.velocity = {x: -s.player_bot.velocity.x / 2, y: -s.player_bot.velocity.y / 2};
		d.addBehavior(FadeOut, {duration: 0.8});
		//s.player_bot.stopped = false;
		s.player_bot.delay.set(2);
	},
	boom: function (s) {
		s.unpause();
		s.player_bot.velocity = {x: 0, y: 0};
		gameWorld.playSound(Resources.boom);
		s.player_bot.delay.set(1);
		//s.player_bot.stopped = false;
		s.player_bot.addBehavior(Delay, {duration: 0.3, callback: function () {
			//s.player_bot.angle = s.player_top.angle;
			var d = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x, s.player_bot.y, Resources.explosion));
			d.addBehavior(Velocity);
			d.velocity = {x: -s.player_bot.velocity.x / 2, y: -s.player_bot.velocity.y / 2};
			d.addBehavior(FadeOut, {duration: 0.8});
			for (var i = 0; i < 3; i++) {
				var theta = s.player_bot.angle + PI - PI / 5 + i * PI / 5;
				var a = s.bg.add(Object.create(Sprite).init(s.player_bot.x + Math.cos(theta) * 8, s.player_bot.y + Math.sin(theta) * 8, Resources.projectile));
				a.angle = theta;
				a.animation = 4;
				a.addBehavior(Velocity);
				a.velocity = {x: 40 * Math.cos(theta), y: 40 * Math.sin(theta) };
				//a.addBehavior(FadeOut, {duration: 0, delay: 1});
				a.setCollision(Polygon);
				a.setVertices(projectile_vertices);
				a.collision.onHandle = projectileHit;
				a.family = "player";
				a.projectile = true;
				//gameWorld.playSound(Resources.spark_sound);
			}
			s.player_bot.animation = 1;
			s.player_bot.velocity = {
				x: Math.cos( s.player_bot.angle) * 100,
				y: Math.sin( s.player_bot.angle) * 100
			}
			s.player_bot.acceleration = {
				x: -s.player_bot.velocity.x,
				y: -s.player_bot.velocity.y
			}
			s.player_bot.removeBehavior(this);
		}})
	}
}

var Store = {
	init: function (layer, player) {
		this.layer = layer, this.player = player, this.spent = 0, this.repair_cost = 1;
		// create UI
		this.createUI();
		return this;
	},
	spend: function (amount) {
		if (this.player.salvage - this.spent < amount) return false; // can't afford
		else if (amount < 0 && this.spent + amount < 0) return false; // can't unspend more than you've spent
		else {
			this.spent += amount;
			this.salvage.text = "$ " + (this.player.salvage - this.spent);
		}
	},
	createUI: function () {

		var border = this.layer.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height / 2, 128, gameWorld.height / 2, Resources.building2));
		
		var b1 = this.layer.add(Object.create(Entity).init(border.x, border.y + 1, border.w - 8, border.h - 16));
		b1.color = "#000";
		var b2 = this.layer.add(Object.create(Entity).init(border.x, border.y + 2, border.w - 16, border.h - 24));
		b2.color = "#fff";
		
		var r = [];

		//var outer = this.layer.add(Object.create(Sprite).init(3 * gameWorld.width / 4 + 8, gameWorld.height - 16, Resources.silhouette));
		
		var t = this;
		var close = this.layer.add(Object.create(Entity).init(gameWorld.width / 2, 3 * gameWorld.height / 4 - 24, gameWorld.width / 2, 16));
		this.layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, 3 * gameWorld.height / 4 - 24, Resources.expire_font, "DONE", {align: "center", spacing: -2}));
		close.family = "button";
		close.trigger = function () {
			t.player.salvage -= t.spent;
			t.spent = 0;
			gameWorld.playSound(Resources.buy);
			if (t.weapon) t.player.shoot = Weapons[t.weapon];
			t.weapon = undefined;
			t.close();
		}
		close.hover = function () {
		    if (this.color != "#6DC72E") gameWorld.playSound(Resources.hover);
			this.color = "#6DC72E";
		}
		close.unhover = function () {
			this.color = "white";
		}
		//this.weapons = {};
		this.salvage = this.layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height / 4 + 24, Resources.expire_font, "$ 0", {align: "center", spacing: -2}));
				
		var buy_shield = t.layer.add(Object.create(Sprite).init(gameWorld.width / 3, t.salvage.y + 32, Resources.icons));
		buy_shield.animation = 1;
		buy_shield.family = "button";
		buy_shield.trigger = function () {
			gameWorld.playSound(Resources.select);
			if (t.spent < t.player.salvage) {
				t.spent += 1;
				t.player.addBehavior(Shielded, {rate: 1});
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				gameWorld.scene.updateHealthBar(t.player);
				// update healthbar display
			}
		};
		buy_shield.hover = buttonHover;
		buy_shield.unhover = buttonUnHover;
		r.push(buy_shield);
		
		var plus = t.layer.add(Object.create(Sprite).init(gameWorld.width / 3, t.salvage.y + 16, Resources.icons));
		plus.animation = 0;
		plus.family = "button";
		plus.trigger = function () {
			gameWorld.playSound(Resources.select);
			if (t.player.health < MAXHEALTH && t.spent < t.player.salvage) {
				t.spent += 1;
				t.player.health += 1;
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				gameWorld.scene.updateHealthBar(t.player);
				// update healthbar display
			}
		};
		plus.hover = buttonHover;
		plus.unhover = buttonUnHover
		r.push(plus);
		
		var buy_radar = t.layer.add(Object.create(Sprite).init(gameWorld.width / 3, t.salvage.y + 48, Resources.icons));
		buy_radar.animation = 2;
		buy_radar.family = "button";
		buy_radar.trigger = function () {
			gameWorld.playSound(Resources.select);
			if (t.spent < t.player.salvage) {
				t.spent += 1;
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				t.player.addBehavior(Radar);
			}
		};
		buy_radar.hover = buttonHover;
		buy_radar.unhover = buttonUnHover
		r.push(buy_radar);
		/*var minus = t.layer.add(Object.create(Sprite).init(8, 32 + (++i) * 18, Resources.icons));
		minus.animation = 2;
		minus.family = "button";
		minus.trigger = function () { 
			console.log('repair minus');
			if (t.player.health > 0 && t.spent > 0) {
				t.spent -= 1;
				t.player.health -= 1;
				t.damageWheel.percentage = 100 * (t.player.health / MAXHEALTH);
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				//t.health_bar.w = 128 * (t.player.health / MAXHEALTH), t.health_bar.x = gameWorld.width / 6 - (128 - t.health_bar.w) / 2;
			}
		};*/

		//minus.hover = function () { this.opacity = 0.6 }
		//minus.unhover = function () { this.opacity = 1 }
		//r.push(minus);
		
		var buy_retaliate = t.layer.add(Object.create(Sprite).init(gameWorld.width / 3, t.salvage.y + 64, Resources.icons));
		buy_retaliate.animation = 4;
		buy_retaliate.family = "button";
		buy_retaliate.trigger = function () {
			gameWorld.playSound(Resources.select);
			if (t.spent < t.player.salvage) {
				t.spent += 1;
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				t.player.retaliate = 1;
			}
		};
		buy_retaliate.hover = buttonHover;
		buy_retaliate.unhover = buttonUnHover;
		r.push(buy_retaliate);
		
		var buy_repair = t.layer.add(Object.create(Sprite).init(gameWorld.width / 3, t.salvage.y + 80, Resources.icons));
		buy_repair.animation = 3;
		buy_repair.family = "button";
		buy_repair.trigger = function () {
			gameWorld.playSound(Resources.select);
			if (t.spent < t.player.salvage) {
				t.spent += 1;
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				t.player.addBehavior(Repair);
				t.player.material = 0;
			}
		};
		buy_repair.hover = buttonHover;
		buy_repair.unhover = buttonUnHover;
		r.push(buy_repair);
		
		var buy_hyper = t.layer.add(Object.create(Sprite).init(gameWorld.width / 3, t.salvage.y + 96, Resources.icons));
		buy_hyper.animation = 5;
		buy_hyper.family = "button";
		buy_hyper.trigger = function () {
			gameWorld.playSound(Resources.select);
			if (t.spent < t.player.salvage) {
				t.spent += 1;
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				t.player.addBehavior(HyperDrive);
			}
		};
		buy_hyper.hover = buttonHover;
		buy_hyper.unhover = buttonUnHover;
		r.push(buy_hyper);
		
		
		for (var i = 0; i < this.layer.entities.length; i++) {
			this.layer.entities[i].origin = {x: 0, y: 240};
			this.layer.entities[i].angle = -PI/2;
			this.layer.entities[i].lerp = this.layer.entities[i].addBehavior(Lerp, {object: this.layer.entities[i], field: "angle", goal: 0, rate: 5});
			//this.layer.entities[i].lerp = this.layer.entities[i].addBehavior(Lerp, {object: this.layer.entities[i], field: "y", goal: this.layer.entities[i].y + gameWorld.height * 2, rate: 10});
			this.layer.entities[i].goal = this.layer.entities[i].lerp.goal;
			this.layer.entities[i].original = this.layer.entities[i].angle;
		}
		
		//outer.lerp.goal = -PI / 36;
		//outer.goal = outer.lerp.goal;
		
		// special exception for off-kilter border
		//b1.lerp.goal = PI / 36;
		//b1.goal = b1.lerp.goal;
		//b2.lerp.goal = PI / 72;
		//b2.goal = b2.lerp.goal;
		
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
		gameWorld.boss.energy = gameWorld.boss.addBehavior(DrawEnergy, {h: 32, w: gameWorld.width / 2, color: "#000", thickness: 2});
		gameWorld.scene.player_bot.energy = gameWorld.scene.player_bot.addBehavior(DrawEnergy, {h: -32, w: gameWorld.width / 2, color: "#000", thickness: 2});
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