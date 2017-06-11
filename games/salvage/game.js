// canvas filter (color style); grayscale(70%) contrast(250%) brightness(90%);

var MAXHEALTH = 16, DAMAGE_COOLDOWN = 0.5;
var gameWorld = Object.create(World).init(180, 320, "index.json");

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

var Asteroid = Object.create(Behavior);
Asteroid.update = function (dt) {
	if (distance(this.entity.x, this.entity.y, this.target.x, this.target.y) < this.radius) {
		if (this.entity.die) 
			this.entity.die();
		else
			this.entity.alive = false;
		
		this.entity.removeBehavior(this);
		var theta = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
		var sw = this.entity.layer.add(Object.create(Sprite).init(this.entity.x + 8 * Math.cos(theta), this.entity.y + 8 * Math.sin(theta), Resources.shockwave));
		sw.angle = theta + PI / 2;
		sw.addBehavior(FadeOut, {duration: 0.1, delay: 1});
		sw.z = 1;
	}
}

var LerpFollow = Object.create(Behavior);
LerpFollow.update = function (dt) {  
  if (this.offset.x !== false)
    this.entity.x = lerp(this.entity.x, this.target.x + (this.offset.x || 0), this.rate * dt);
  if (this.offset.y !== false)
    this.entity.y = lerp(this.entity.y, this.target.y + (this.offset.y || 0), this.rate * dt);
  if (this.offset.z !== false)
    this.entity.z = lerp(this.entity.z, this.target.z + (this.offset.z || 0), this.rate * dt);
  if (this.offset.angle !== false)
    this.entity.angle = lerp_angle(this.entity.angle, this.target.angle + (this.offset.angle || 0), this.rate * dt);
  if (this.target.alive === false) this.entity.alive = false;
};

var Atmosphere = Object.create(Entity);
Atmosphere.init = function (x, y, radius, amplitude, frequency, color) {
	this.x = x, this.y = y, this.radius = radius, this.amplitude = amplitude, this.frequency = frequency, this.color = color || "black", this.time = 0;
	this.behaviors = [];
	return this;
};
Atmosphere.onDraw = function (ctx) {
	var INTERVAL = Math.PI / 180;
	ctx.beginPath();
	var theta, radius;
	for (var i = 0; i < Math.PI * 2; i += INTERVAL) {
		theta = (Math.PI * 2 / this.frequency) * i;
		radius = this.radius + Math.cos(theta) * this.amplitude;
		if (i === 0) {
			ctx.moveTo(this.x + Math.cos(i) * radius, this.y + Math.sin(i) * radius);
		} else {
			ctx.lineTo(this.x + Math.cos(i) * radius, this.y + Math.sin(i) * radius);
		}
	}
	ctx.closePath();
	ctx.fillStyle = this.color;
	ctx.fill();
};

var Silo = Object.create(Behavior);
Silo.update = function (dt) {
	// a lot of redunancy here, and it's not even working properly!
	if (this.cooldown === undefined) this.cooldown = 0.5;
	else if (this.cooldown > 0) this.cooldown -= dt;
	else {
		var p = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.beamship));
		p.angle = this.entity.angle - PI / 2;
		p.projectile = true;
		p.velocity = {x: 30 * Math.cos(p.angle), y: 30 * Math.sin(p.angle)};
		p.addBehavior(Velocity);
		p.family = this.entity.family;
		p.addBehavior(HeatSeeking, {family: inverse(this.entity.family), speed: 30, rate: 0.5 });
		p.setCollision(Polygon);
		p.collision.onHandle = projectileHit;
		this.cooldown = 3;
	}
}

var Surface = Object.create(Behavior);
Surface.update = function (dt) {
	this.entity.angle += this.speed * dt;
	this.entity.x = this.target.x + this.radius * Math.cos(this.entity.angle - PI / 2);
	this.entity.y = this.target.y + this.radius * Math.sin(this.entity.angle - PI / 2);
}

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
		b.z = 10;
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
  if (threshold == undefined) threshold = 1;
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

// target, speed
var Magnet = Object.create(Behavior);
Magnet.update = function (dt) {
	var theta = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
	this.entity.velocity.x = lerp(this.entity.velocity.x, this.speed * Math.cos(theta), dt);
	this.entity.velocity.y = lerp(this.entity.velocity.y, this.speed * Math.sin(theta), dt);
}

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

var Grow = Object.create(Behavior);
Grow.update = function (dt) {
	if (this.time === undefined) this.time = 0;
	this.time += dt;
	this.entity.scale = 1 + this.max * this.time / this.duration;
}

function projectileHit (object, other) {
	if (other.family != object.family && !other.projectile) {
		object.alive = false;
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

var Contrail = Object.create(Behavior);
Contrail.update = function (dt) {
	if (this.cooldown === undefined) this.cooldown = 0.1;
	if (this.entity.velocity.x !== 0 && this.entity.velocity.y !== 0) {
		if (this.cooldown <= 0 && randint(0,100) < 25) {
			this.cooldown = 0.1;
			var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.dust));
			d.addBehavior(Velocity);
			d.velocity = {x: -this.entity.velocity.x / 2, y: -this.entity.velocity.y / 2};
			d.addBehavior(FadeOut, {duration: 0.8});
		} else {
			this.cooldown -= dt;
		}
	}
}

// goes to nearest enemy of acceptable 'family'
var HeatSeeking = Object.create(Behavior);
HeatSeeking.start = function () {
	var t = this;
	this.target = this.entity.layer.entities.filter(function (a) { return a.family == t.family && !a.projectile }).sort(function (a, b) { return distance(t.entity.x, t.entity.y, a.x, a.y) - distance(t.entity.x, t.entity.y, b.x, b.y); })[0];
};
HeatSeeking.update = function (dt) {
	if (!this.target) this.start();
	if (!this.controller.alive) {
		this.entity.alive = false;
		this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.small)).addBehavior(FadeOut, {duration: 0.5});
		gameWorld.playSound(Resources.hit, volume(this.entity));
	}
	this.entity.angle = lerp_angle(this.entity.angle, angle(this.entity.x, this.entity.y, this.target.x, this.target.y), this.rate * dt);
	this.entity.velocity = {x: this.speed * Math.cos(this.entity.angle), y: this.speed * Math.sin(this.entity.angle) };
};

// push to raindrop
function lerp_angle (a1, a2, rate) {
  var r = a1 + short_angle(a1, a2) * rate;
	if (Math.abs(r - a2) < 0.01) return a2;
	else return r;
}

var projectile_vertices = [
	{x: -6, y: -3},
	{x: 6, y: -3},
	{x: 6, y: 3},
	{x: -6, y: 3}
]
var Weapons = {
	standard: function (layer) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.projectiles));
			a.animation = 3;
			a.setCollision(Polygon);
			a.setVertices(projectile_vertices);
			gameWorld.playSound(Resources.laser, volume(a));
			a.collision.onHandle = projectileHit;
			a.addBehavior(Velocity);
			a.family = this.family;//"player";
			a.projectile = true;
			var theta = this.target ? angle(this.x, this.y, this.target.x, this.target.y) : this.angle;
			if (this.target) console.log('target');
			a.velocity = {x: 100 * Math.cos(theta), y: 100 * Math.sin(theta)	};
			a.angle = theta;
			return 1.3;
	},
	double: function (layer) {
		for (var i = 0; i < 3; i++) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.projectiles));
			a.setCollision(Polygon);
			a.setVertices(projectile_vertices);
			a.animation = 2;
			gameWorld.playSound(Resources.laser, volume(a));
			a.collision.onHandle = projectileHit;
			a.addBehavior(Velocity);
			a.family = this.family;//"player";
			a.projectile = true;
			var theta = this.angle - PI / 6 + i * PI / 6;
			a.velocity = {x: 100 * Math.cos(theta), y: 100 * Math.sin(theta)};
			a.angle = theta;
		}
		return 0.6;
	},
	homing: function (layer) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.projectiles));
			a.setCollision(Polygon);
			a.setVertices(projectile_vertices);
			a.animation = 1;
			//gameWorld.playSound(Resources.mortar);
			a.collision.onHandle = projectileHit;
			a.addBehavior(Velocity);
			a.addBehavior(HeatSeeking, {family: this.family == "player" ? "enemy" : "player" , speed: 50, rate: 1, controller: this});
			a.family = this.family;
			a.projectile = true;
			var theta = this.angle;
			a.velocity = {x: 90 * Math.cos(theta), y: 90 * Math.sin(theta)};
			a.angle = theta;
			return 0.6;			
	},
	proximity: function (layer) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bomb));
			a.setCollision(Polygon);
			//gameWorld.playSound(Resources.mortar);
			a.collision.onHandle = projectileHit;
			a.addBehavior(Oscillate, {field: "angle", object: a, rate: 1, initial: 0, constant: PI2, offset: 0});
			//a.addBehavior(Velocity);
			//a.addBehavior(HeatSeeking, {family: "enemy"});
			a.family = this.family;
			a.projectile = true;
			//var theta = this.angle;
			//a.velocity = {x: 50 * Math.cos(theta), y: 50 * Math.sin(theta)};
			return 0.1;			
	},
	spark: function (layer) {
		for (var i = 0; i < 5; i++) {
			var theta = i * PI2 / 5;
			var a = layer.add(Object.create(Sprite).init(this.x + Math.cos(theta) * 8, this.y + Math.sin(theta) * 8, Resources.projectiles));
			a.angle = theta;
			a.addBehavior(Velocity);
			a.velocity = {x: 40 * Math.cos(theta), y: 40 * Math.sin(theta) };
			a.addBehavior(FadeOut, {duration: 1});
			a.setCollision(Polygon);
			a.setVertices(projectile_vertices);
			a.collision.onHandle = projectileHit;
			a.family = this.family;
			a.projectile = true;
			gameWorld.playSound(Resources.spark_sound, volume(a));
		}
		return 1;
	},
	beam: function (layer) {
		if (this.animations > 1) {
			this.animation = 1;
		}
		this.movement.speed = 0;
		var b = layer.add(Object.create(Entity).init(this.x, this.y, 4, 154));
		b.color = "#111";
		b.setCollision(Polygon);
		b.collision.onHandle = function (object, other) {
			if (other.family != object.family && !other.projectile) {
				var small = object.layer.add(Object.create(Sprite).init(object.x, object.y, Resources.small));
				small.addBehavior(FadeOut, {duration: 0.5});
				gameWorld.playSound(Resources.hit);
			}
		};
		var t = this;
		b.family = this.family;
		b.projectile = true;
		b.surface = b.addBehavior(Surface, {speed: 0, target: {x: gameWorld.width / 2, y: gameWorld.height / 2 + 60}, radius: 160});
		b.addBehavior(FadeOut, {delay: 1.3, duration: 0.3, maxOpacity: 1})
		b.addBehavior(Delay, {duration: 1.6, callback: function () {
			t.animation = 0;
			t.movement.speed = PI / 36;
			console.log('mhm');
		}});
		b.addBehavior(FadeIn, {duration: 0.3, maxOpacity: 1});
		b.opacity = 0;
		b.z = this.z - 1;
		b.angle = this.angle;// - PI / 2;
		gameWorld.playSound(Resources.beam, volume(b));
		//console.log(b);
		return 5.5;
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
/*
var Shoot = Object.create(Behavior);
Shoot.update = function (dt) {
	if (this.cooldown <= 0) {
    gameWorld.playSound(Resources.laser);
    var e = Object.create(Sprite).init(this.entity.x - 2, this.entity.y - 2, Resources.projectile);
    e.addBehavior(Velocity);
    e.setCollision(Polygon);
    e.family = "enemy";
    e.projectile = true;
    e.collision.onHandle = function (object, other) {
			if (other.solid) object.alive = false;
      if (other.family == "player" && other.damage && other.damage.hit) {
        other.damage.hit(1);
      }
      if (other.family != "enemy" && !other.projectile) object.alive = false;
    }
    var theta = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
    e.angle = theta;
    e.velocity = {x: 100 * Math.cos(theta), y: 100 * Math.sin(theta)};
    this.entity.layer.add(e);
    this.cooldown = randint(1,2);
  } else {
    this.cooldown -= dt;
  }
}

var Walker = Object.create(Behavior);
Walker.update = function (dt) {
	if (this.cooldown > 0) this.cooldown -= dt;
	else if (this.cooldown > -1) {
		this.cooldown = -1;
		var t = this;
		var beam = this.entity.layer.add(Object.create(Entity).init(this.entity.x, this.entity.y, 2, gameWorld.height));
		beam.addBehavior(Follow, {target: this.entity, offset: {x: 0, y: - gameWorld.height / 2 }});
		beam.addBehavior(FadeIn, {duration: 0.4});
		beam.setCollision(Polygon);
		beam.family = "enemy";
		beam.collision.onHandle = function (object, other) {
			if (other.family == "player" && other.damage && other.damage.hit) {
				console.log('what');
        other.damage.hit(1);
      }
		}
		beam.addBehavior(Delay, {duration: 2, callback: function () {
			beam.addBehavior(FadeOut, {duration: 0.4});
			t.cooldown = 2;
		}});
	} else {
		
	}
}
*/
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

// behavior is good, needs visual improvement?
// also add 'wrap' or 'bounce' to bombers to keep them around?
var Bomber = Object.create(Behavior);
Bomber.update = function (dt) {
	if (this.cooldown === undefined) this.cooldown = 1;
	this.entity.angle += dt;
	this.entity.velocity.x = this.radius * Math.cos(this.entity.angle);
	this.entity.velocity.y = this.radius * Math.sin(this.entity.angle);
	
	
	if (this.cooldown <= 0) {
		this.cooldown = 1;
		var e = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.bomb));
		e.addBehavior(Velocity);
		var theta = angle(e.x, e.y, gameWorld.width / 2, gameWorld.height / 2 + 60);
		e.velocity = {x: Math.cos(theta) * 40, y: Math.sin(theta) * 40};
		e.setCollision(Polygon);
		e.collision.onHandle = projectileHit;
		e.projectile = true;
		e.family = "enemy";
		e.addBehavior(Asteroid, {target: {x: gameWorld.width / 2, y: gameWorld.height / 2 + 60}, radius: 76});
	} else {
		this.cooldown -= dt;
	}
	/*if (this.entity.velocity.y <= 0 && !this.done) {
		var e = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.bomb));
		e.addBehavior(Velocity);
		e.velocity = {x: 0, y: 0};
		e.addBehavior(Accelerate);
		e.acceleration = {x: 0, y: 100};
    e.setCollision(Polygon);
    e.family = "enemy";
    e.projectile = true;
    e.collision.onHandle = function (object, other) {
      if (other.family == "player" && other.damage && other.damage.hit) {
        other.damage.hit(1);
      }
      if (other.family != "enemy" && !other.projectile) object.alive = false;
    }
		this.done = true;
		this.entity.angle = Math.atan2(this.entity.velocity.y, this.entity.velocity.x);
	}*/
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
// end of push to riandrop
/*
var Mortar = Object.create(Behavior);
Mortar.update = function (dt) {
  if (this.cooldown <= 0) {
    gameWorld.playSound(Resources.shoot);
    var e = Object.create(Sprite).init(this.entity.x - 2, this.entity.y - 2, Resources.bomb);
    e.addBehavior(Velocity);
    e.setCollision(Polygon);
    e.family = "enemy";
    e.projectile = true;
    e.collision.onHandle = function (object, other) {
			if (other.solid) object.alive = false;
      if (other.family == "player" && other.damage && other.damage.hit) {
        other.damage.hit(1);
      }
      if (other.family != "enemy" && !other.projectile) object.alive = false;
    }
    e.velocity = {x: 0, y: -90};
    this.entity.layer.add(e);
    this.cooldown = randint(1,3);
  } else {
    this.cooldown -= dt;
  }
}*/

// timer, invulnerable
var Damage = Object.create(Behavior);
Damage.update = function (dt) {
	if (this.timer > 0) this.timer -= dt;
  if (Math.random() * 100 < (MAXHEALTH - this.entity.health)) {
    var c = Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.particles);//Resources.smoke);
    //var c = Object.create(Entity).init(this.entity.x, this.entity.y, 8, 8);
    c.animation = 2;
    c.addBehavior(FadeOut, {duration: 0.7});
    c.addBehavior(Velocity);
    c.z = this.entity.z - 1;
    c.velocity = {x: Math.random() * 32 - 16, y: -100};
    //c.addBehavior(Oscillate, {object: c.offset, field: "x", constant: 10, rate: 4, time: 0});
    this.layer.add(c);
  }
}
Damage.hit = function (damage) {
	if (this.timer <= 0) {
		console.log('yeah');
		this.entity.health -= damage;
		if (this.entity.health <= 0) {
			
		}
		this.timer = this.invulnerable;
		return true;
	} else {
		return false;
	}
}

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

var Asteroid = Object.create(Behavior);
Asteroid.update = function (dt) {
	if (distance(this.entity.x, this.entity.y, this.target.x, this.target.y) <= this.radius) {
		this.entity.velocity = {x: 0, y: 0};
		this.radius = 0;
		this.entity.alive = false;
		var e = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.explosion));
		var s = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.shockwave));
		e.addBehavior(FadeOut, {duration: 1});
		s.addBehavior(FadeOut, {duration: 1, delay: 1});
		s.z = 2;
		e.z = 1;
		gameWorld.playSound(Resources.hit);
		s.angle = angle(this.entity.x, this.entity.y, this.target.x, this.target.y) - PI / 2;
	}
}

function spawn(layer, key, player) {
	var enemy;
	switch (key) {
		case 1:
			enemy = Object.create(Sprite).init(choose([16, gameWorld.width - 16]), gameWorld.height - 14, Resources[choose(["monster"])]);
			enemy.movement = enemy.addBehavior(Surface, {speed: PI / 36, target: {x: gameWorld.width / 2, y: gameWorld.height / 2 + 60}, radius: 82});
			enemy.angle = Math.random() * PI2;
			//enemy.addBehavior(Flip);
			//enemy.addBehavior(Crop, {min: {x: -1, y: -1}, max: {x: gameWorld.width + 1, y: gameWorld.height}})
			enemy.velocity = {x: 0, y: 0};//enemy.x > 100 ? -20 : 20, y: 0};
			enemy.z = 20;
			enemy.shoot = Weapons.beam;
		break;
		case 2:
			enemy = Object.create(Sprite).init(randint(-gameWorld.width,gameWorld.width), randint(-gameWorld.height,gameWorld.height), Resources[choose(["asteroid"])]);
			var theta = angle(enemy.x, enemy.y, gameWorld.width / 2, gameWorld.height / 2 + 60);
			enemy.angle = Math.random() * PI2;  
			enemy.addBehavior(Asteroid, {target: {x: gameWorld.width / 2, y: gameWorld.height / 2 + 60}, radius: 78});
			enemy.velocity = {x: Math.cos(theta) * 50, y: 50 * Math.sin(theta)};
		break;
		case 3:
			var distance = randint(100, 180), theta = Math.random() * PI2;
			enemy = Object.create(Sprite).init(gameWorld.width / 2 + Math.cos(theta) * distance, gameWorld.height / 2 + 60 + Math.sin(theta) * distance, Resources[choose(["bomber"])]);
			//enemy.angle = Math.random() * PI / 6 + PI / 2 - PI / 12;              
			//enemy.velocity = {x: Math.cos(enemy.angle) * 150, y: 150 * Math.sin(enemy.angle)};
			//enemy.addBehavior(Accelerate);
			//enemy.acceleration = {x: 0, y: -100};
			enemy.velocity = {x: 0, y: 0};
			enemy.angle = theta + PI / 2;
			enemy.addBehavior(Bomber, {radius: distance});
			//enemy.shoot = Weapons.mine_layer;
		break;
		case 4:
			enemy = Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["saucer"])]);
			//enemy.addBehavior(Shoot, {target: player, cooldown: 1});
			enemy.velocity = {x: 0, y: 10};
			enemy.shoot = Weapons.standard;
		break;
		case 5:
			enemy = Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["x"])]);
			enemy.angle = Math.random() * PI / 6 + PI / 2 - PI / 12;              
			enemy.velocity = {x: Math.cos(enemy.angle) * 50, y: 50 * Math.sin(enemy.angle), angle: PI}; 
			enemy.addBehavior(Bounce, {min: {x: 5, y: 0}, max: {x: gameWorld.width - 5, y: gameWorld.height - 16}});
			//enemy.shoot = function () {}; // none
		break;
		case 6:
			enemy = Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources.bug);
			enemy.addBehavior(Drone, {target: player, cooldown: 1, rate: 0.6, radius: 40, angle: Math.random() * PI2});
			enemy.velocity = {x: 0, y: 10};
			enemy.shoot = Weapons.spark;//function () {}; // 'static' electricity
    	break;
		case 7:
			var theta = Math.random() * PI2;
			enemy = Object.create(Sprite).init(gameWorld.width / 2 + 160 * Math.cos(theta), gameWorld.height / 2 + 60  + 160 * Math.sin(theta), Resources[choose(["tank"])]);
			enemy.addBehavior(Surface, {speed: PI / 36, target: {x: gameWorld.width / 2, y: gameWorld.height / 2 + 60}, radius: 82});
			enemy.angle = theta;
			//enemy.origin = {x: 0, y: 160};
			//enemy.offset = {x: 0, y: 2};
			//enemy.mirrored = enemy.x > 100;
			//enemy.addBehavior(Flip);
			enemy.shoot = Weapons.homing;
			//enemy.addBehavior(Mortar, {cooldown: 1});
			//enemy.addBehavior(Crop, {min: {x: -1, y: -1}, max: {x: gameWorld.width + 1, y: gameWorld.height}})
			enemy.velocity = {x: 0, y: 0 };
    	break;
		case 8:
			enemy = Object.create(Sprite).init(0, choose([0, gameWorld.height + 120]), Resources.beamship);
			enemy.addBehavior(Velocity);
			enemy.velocity = {x: 0, y: enemy.y > gameWorld.height / 2 ? -15 : 15};
			enemy.addBehavior(BeamShip, {max: {y: gameWorld.height + 120}, min: {y: 0}});
			//enemy.shoot = Weapons.beam;
			break;
	}
	layer.add(enemy);
	enemy.addBehavior(Velocity);
	enemy.addBehavior(Enemy, {cooldown: 0});
	enemy.setCollision(Polygon);
	enemy.setVertices([
		{x: 0, y: -6},
		{x: -6, y: 0},
		{x: 0, y: 6},
		{x: 6, y: 0}
	]);
	enemy.target = gameWorld.scene.player_bot;
	enemy.health = randint(1, 3);
	enemy.family = "enemy";
	enemy.collision.onHandle = function (object, other) {
		if (other.solid) {
			object.velocity = {x: -object.velocity.x, y: -object.velocity.y};
		} else if (other.family != object.family) {
			object.health -= 1;
			if (object.health < 0) object.die();
		}  
	}
	enemy.die = function () {
		this.collision.onHandle = function (a, b) { return false; };
		this.velocity = {x: 0, y: 0};
		this.behaviors = [];
		this.addBehavior(FadeOut, {duration: 0.5});

		for (var i = 0; i < 20; i++) {			
			var e = this.layer.add(Object.create(Circle).init(this.x + randint(-4,4), this.y + randint(-4,4), randint(2,5)));
			e.addBehavior(FadeIn, {maxOpacity: 1, duration: 0, delay: 0.5 * Math.random()});
			e.addBehavior(FadeOut, {maxOpacity: 1, duration: 0, delay: 0.5 + Math.random() * 0.5});
			e.z = this.z - 1;
			//e.addBehavior(Velocity);
			//var theta = Math.random() * PI2, speed = choose([2, 2, 2, 10, 20]);
			//e.velocity = {x: speed * Math.cos(theta), y: speed * Math.sin(theta)};
		}

		for (var i = 0; i < randint(2,5); i++) {
			var salvage = this.layer.add(Object.create(Sprite).init(this.x + randint(0,10) - 5, this.y + randint(0, 10) - 5, Resources.gem));
			salvage.addBehavior(FadeOut, {duration: 1, delay: 3});
			salvage.value = 1;
			//salvage.addBehavior(Magnet, {target: gameWorld.shop, speed: 30});
			salvage.setCollision(Polygon);
			salvage.collision.onHandle = function (object, other) {
				if ((other.family == "player" || other.family == "store") && !other.projectile) {
					object.alive = false;
					player.salvage += object.value;
					gameWorld.playSound(Resources.pickup);
					for (var i = 0; i < randint(5, 10); i++) {
						var p = object.layer.add(Object.create(Sprite).init(object.x, object.y, Resources.particles));
						p.color = "#0051ee";
						p.animation = 0;
						p.addBehavior(Velocity);
						p.addBehavior(FadeOut, {duration: 0.3});
						var theta = Math.random() * PI2;
						p.velocity = {x: 20 * Math.cos(theta), y: 20 * Math.sin(theta)};
					}
				} else if (other.solid) {
					HandleCollision.handleSolid(object, other);
				}
			}
			salvage.bounce = 0.5;
			salvage.z = this.z - 1;
			salvage.addBehavior(Velocity);
			//salvage.addBehavior(Accelerate);
			//salvage.acceleration = {x: 0, y: 100};
			var theta = Math.random() * PI2;
			salvage.velocity = {x: Math.cos(theta) * 30, y: Math.sin(theta) * 30, angle: PI};
		}
		gameWorld.playSound(Resources.hit);
	}
	enemy.addBehavior(Space, {cooldown: 0, rate: 1.5, target: {x: gameWorld.width / 2, y: gameWorld.height / 2 + 60}, radius: 320, damage: 1});
	//enemy.addBehavior(Crop, {min: {x: -10, y: -10}, max: {x: gameWorld.width + 10, y: gameWorld.height + 20}});  
	enemy.z = 10;
	return enemy;
}

var Movement = {
	constant: function (s) {
		//s.player_bot.angle = s.player_top.angle;		
		s.player_bot.stopped = false; // hacky, since you are able to always change your movement with this style
		s.player_bot.addBehavior(Lerp, {object: this.velocity, field: "x", goal: 75 * Math.cos(s.player_bot.angle), rate: 5, callback: function () {
			this.entity.removeBehavior(this);
			this.entity.stopped = true;
		}});		
		s.player_bot.addBehavior(Lerp, {object: this.velocity, field: "y", goal: 75 * Math.sin(s.player_bot.angle), rate: 5, callback: function () {
			this.entity.removeBehavior(this);
		}});
		s.player_bot.delay.set(1000);
		s.player_bot.animation = 1;
	},
	standard: function (s) {
		s.unpause();
		//s.player_bot.angle = s.player_top.angle;
		s.player_bot.velocity = {
			x: Math.cos( s.player_bot.angle) * 100,
			y: Math.sin( s.player_bot.angle) * 100
		}
		s.player_bot.addBehavior(Lerp, {object: this.velocity, field: "x", goal: 0, rate: 1, callback: function () {
			this.entity.removeBehavior(this);
		}});		
		s.player_bot.addBehavior(Lerp, {object: this.velocity, field: "y", goal: 0, rate: 1, callback: function () {
			this.entity.removeBehavior(this);
		}});
//		this.layer.entities[i].addBehavior(Lerp, {object: this.layer.entities[i], field: "angle", goal: 0, rate: 5});
/*		s.player_bot.acceleration = {
			x: -s.player_bot.velocity.x,
			y: -s.player_bot.velocity.y
		}*/
		// create contrail sprite
		gameWorld.playSound(Resources.move);  
		var d = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x, s.player_bot.y, Resources.dust));
		d.addBehavior(Velocity);
		d.velocity = {x: -s.player_bot.velocity.x / 2, y: -s.player_bot.velocity.y / 2};
		d.addBehavior(FadeOut, {duration: 0.8});
		s.player_bot.stopped = false;
		s.player_bot.delay.set();
	},
	blink: function (s) {
		s.unpause();
		gameWorld.playSound(Resources.blink1);
		//s.player_bot.angle = s.player_top.angle;
		gameWorld.playSound(Resources.move);
		// blink vanish effect
		s.player_bot.delay.set(0.5);
		s.player_bot.opacity = 0.1;
		s.player_bot.stopped = false;
		s.player_bot.delay.callback = function () {
			s.pause();
			gameWorld.playSound(Resources.blink2);
			s.player_bot.x = s.player_bot.x + 50 * Math.cos(s.player_bot.angle), s.player_bot.y = s.player_bot.y + 50 * Math.sin(s.player_bot.angle);
			// blink arrive affect
		}
	},
	chaos: function (s) {
		s.unpause();
		gameWorld.playSound(Resources.move); // explosion?!
		//var theta = s.player_top.angle + Math.random() * PI /4 - PI / 8;
		//s.player_bot.angle = s.player_top.angle;
		s.player_bot.animation = 1;
		s.player_bot.velocity = {
			x: Math.cos( theta) * 150,
			y: Math.sin( theta) * 150
		}
		s.player_bot.stopped = false;
		s.player_bot.acceleration = {
			x: -s.player_bot.velocity.x / 1.5,
			y: -s.player_bot.velocity.y / 1.5
		}
		s.player_bot.delay.set(1.5);
		for (var i = 0; i < 5; i++) {
			var e = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x + randint(-5, 5), s.player_bot.y + randint(-5, 5), Resources.explosion));
			e.addBehavior(FadeOut, {delay: Math.random(), duration: 1 + Math.random()});
		}
	},
	boom: function (s) {
		s.unpause();
		s.player_bot.velocity = {x: 0, y: 0};
		gameWorld.playSound(Resources.boom);
		s.player_bot.delay.set(1);
		s.player_bot.stopped = false;
		s.player_bot.addBehavior(Delay, {duration: 0.3, callback: function () {
			//s.player_bot.angle = s.player_top.angle;
			var d = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x, s.player_bot.y, Resources.explosion));
			d.addBehavior(Velocity);
			d.velocity = {x: -s.player_bot.velocity.x / 2, y: -s.player_bot.velocity.y / 2};
			d.addBehavior(FadeOut, {duration: 0.8});
			for (var i = 0; i < 3; i++) {
				var theta = s.player_bot.angle + PI - PI / 5 + i * PI / 5;
				var a = s.bg.add(Object.create(Sprite).init(s.player_bot.x + Math.cos(theta) * 8, s.player_bot.y + Math.sin(theta) * 8, Resources.projectiles));
				a.angle = theta;
				a.addBehavior(Velocity);
				a.velocity = {x: 40 * Math.cos(theta), y: 40 * Math.sin(theta) };
				a.addBehavior(FadeOut, {duration: 1});
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

		var border = this.layer.add(Object.create(TiledBackground).init(gameWorld.width / 4 + 26, gameWorld.height / 2, 32, gameWorld.height, Resources.building2));
		
		var b1 = this.layer.add(Object.create(Entity).init(16, gameWorld.height / 2 + 1, gameWorld.width / 2 + 34, gameWorld.height * 2));
		b1.color = "#000000";
		var b2 = this.layer.add(Object.create(Entity).init(15, gameWorld.height / 2 + 1, gameWorld.width / 2 + 30, gameWorld.height - 6));
		b2.color = "white";
		
		var r = [];

		var outer = this.layer.add(Object.create(Sprite).init(3 * gameWorld.width / 4 + 8, gameWorld.height - 16, Resources.silhouette));
		
		var t = this;
		var close = this.layer.add(Object.create(Entity).init(gameWorld.width / 6, gameWorld.height - 16, gameWorld.width / 3, 16));
		this.layer.add(Object.create(SpriteFont).init(12, gameWorld.height - 16, Resources.expire_font, "done...", {align: "left", spacing: -2}));
		close.family = "button";
		close.trigger = function () {
			t.player.salvage -= t.spent;
			t.spent = 0;
			if (t.weapon) t.player.shoot = Weapons[t.weapon];
			t.weapon = undefined;
			t.close();
		}
		close.hover = function () {
			this.color = "#6DC72E";
		}
		close.unhover = function () {
			this.color = "white";
		}
		this.weapons = {};
		this.salvage = this.layer.add(Object.create(SpriteFont).init(80, 16, Resources.expire_font, "$ 0", {align: "right", spacing: -2}));
		
		this.layer.add(Object.create(Sprite).init(12, 16, Resources.gem)).velocity = {x: 0, y: 0, angle: PI / 2};
		this.gems = this.layer.add(Object.create(SpriteFont).init(24, 16, Resources.expire_font, String(t.player.salvage), {align: "left", spacing: -2}));
		
		var i = 0, j = 0;
		for (var k in Weapons) {
			if (j <= 2) { // limit to 3
				(function () {	
					var key = k;
					var b = t.layer.add(Object.create(Entity).init(gameWorld.width / 6, 40 + i * 18, gameWorld.width / 3, 16));
					b.color = "white";				

					var icon = t.layer.add(Object.create(Sprite).init(8, 40 + i * 18, Resources.icons));
					b.name = t.layer.add(Object.create(SpriteFont).init(26, 40 + i * 18, Resources.expire_font, k, {align: "left", spacing: -2}));
					b.icon = icon;
					t.weapons[key] = b;
					icon.animation = (i + 3) % Resources.icons.animations;
					b.family = "button";
					b.purchase = key;
					b.price = 1;
					b.priceText = t.layer.add(Object.create(SpriteFont).init(gameWorld.width / 3, 40 + i * 18, Resources.expire_font, "$" + b.price, {align: "right", spacing: -2}));
					b.trigger = function () {
						if (t.weapon == key && t.spent >= this.price) {
							t.weapon = undefined;
							t.spend(-1 * this.price);
							this.color = "white";
							//this.opacity = 1;
						} else {
							if (t.weapon) {
								t.weapons[t.weapon].color = "white";
								t.spend(-1 * this.price);
							}
							if (t.player.salvage > (t.spent + this.price)) {
								t.weapon = key;
								this.color = "#6DC72E";
								t.spend(this.price);
							}
						}
					}
					b.hover = function () {
						this.color = "#6DC72E";
					}
					b.unhover = function () {
						if (t.weapon != this.purchase)
							this.color = "white";
					}
					i++;
				})();
				j++; // limit to 3
			}
		}
		
		this.damageWheel = t.layer.add(Object.create(Wheel).init(52, 44 + (i + 1) * 18, 32, 4, 0.01, 5, 60, ["#000", "#333", "#6DC72E", "#fff"]));
		
		var plus = t.layer.add(Object.create(Sprite).init(8, 32 + (++i) * 18, Resources.icons));
		plus.animation = 1;
		plus.family = "button";
		plus.trigger = function () {
			console.log('repair plus');
			if (t.player.health < MAXHEALTH && t.spent < t.player.salvage) {
				t.spent += 1;
				t.player.health += 1;
				t.damageWheel.percentage = 100 * (t.player.health / MAXHEALTH);
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				//t.health_bar.w = 128 * t.player.health / MAXHEALTH;
				//t.health_bar.w = 128 * (t.player.health / MAXHEALTH), t.health_bar.x = gameWorld.width / 6 - (128 - t.health_bar.w) / 2;
			}
		};
		plus.hover = function () { this.opacity = 0.6;}
		plus.unhover = function () { this.opacity = 1;}
		r.push(plus);
		var minus = t.layer.add(Object.create(Sprite).init(8, 32 + (++i) * 18, Resources.icons));
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
		};

		minus.hover = function () { this.opacity = 0.6 }
		minus.unhover = function () { this.opacity = 1 }
		r.push(minus);
		
		for (var i = 0; i < this.layer.entities.length; i++) {
			this.layer.entities[i].origin = {x: 0, y: 240};
			this.layer.entities[i].angle = -PI/2;
			this.layer.entities[i].lerp = this.layer.entities[i].addBehavior(Lerp, {object: this.layer.entities[i], field: "angle", goal: 0, rate: 5});
			//this.layer.entities[i].lerp = this.layer.entities[i].addBehavior(Lerp, {object: this.layer.entities[i], field: "y", goal: this.layer.entities[i].y + gameWorld.height * 2, rate: 10});
			this.layer.entities[i].goal = this.layer.entities[i].lerp.goal;
			this.layer.entities[i].original = this.layer.entities[i].angle;
		}
		
		outer.lerp.goal = -PI / 36;
		outer.goal = outer.lerp.goal;
		
		// special exception for off-kilter border
		//b1.lerp.goal = PI / 36;
		//b1.goal = b1.lerp.goal;
		//b2.lerp.goal = PI / 72;
		//b2.goal = b2.lerp.goal;
		
	},
	open: function () {
		this.gems.text = "" + this.player.salvage;		
		this.salvage.text = "$ " + this.player.salvage;
		this.damageWheel.percentage = 100 * (this.player.health / MAXHEALTH);
		
		for (var i = 0; i < this.layer.entities.length; i++) {
			this.layer.entities[i].lerp.goal = this.layer.entities[i].goal;
		}
		var t = this;
		this.layer.entities[0].lerp.callback = function () {
			for (var i = 0; i < gameWorld.scene.layers.length; i++) {
				gameWorld.scene.layers[i].paused = true;
				t.layer.paused = false;
			}	
		}
		this.layer.active = true;
		for (var i = 0; i < gameWorld.scene.layers.length; i++) {
			gameWorld.scene.layers[i].paused = false;
		}
		for (var key in this.weapons) {
			this.weapons[key].price = Math.max(1, this.player.salvage - 1);
			this.weapons[key].priceText.text = "$" + this.weapons[key].price;
		}
		var theta = angle(this.player.x, this.player.y, gameWorld.shop.x, gameWorld.shop.y);
		for (var i = 0; i < this.player.salvage; i++) {
			var g = gameWorld.scene.bg.add(Object.create(Sprite).init(this.player.x, this.player.y, Resources.gem));
			g.addBehavior(Velocity);
			var s = randint(80, 110);
			g.velocity = {x: s * Math.cos(theta), y: s * Math.sin(theta), angle: PI / 12};
			g.setCollision(Polygon);
			g.collision.onHandle = function (object, other) {
				if (other.family == "store") {
					object.alive = false;
					gameWorld.playSound(Resources.pickup);
					for (var i = 0; i < randint(5, 10); i++) {
						var p = object.layer.add(Object.create(Sprite).init(object.x, object.y, Resources.particles));
						p.color = "#0051ee";
						p.animation = 0;
						p.addBehavior(Velocity);
						p.addBehavior(FadeOut, {duration: 0.3});
						var theta2 = Math.random() * PI2;
						p.velocity = {x: 20 * Math.cos(theta2), y: 20 * Math.sin(theta)};
					}
				}
			}
		}
		this.player.salvage = 0;		
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
		//gameWorld.scene.claw.lerpx = gameWorld.scene.claw.addBehavior(Lerp, {object: gameWorld.scene.claw, field: "x", goal: gameWorld.width / 2, rate: 5, callback: function () { this.entity.removeBehavior(this.entity.lerpx); }});
		//gameWorld.scene.claw.lerpy = gameWorld.scene.claw.addBehavior(Lerp, {object: gameWorld.scene.claw, field: "y", goal: - gameWorld.height, rate: 5, callback: function () { this.entity.removeBehavior(this.entity.lerpy); }});
		gameWorld.current_wave += 1;
	}
}

/* MUSIC */
/*

-end goal -> barrier with 'salvage' cost ?
-implement AI combat behavior
-add more enemies, waves, environmental hazards [volvanic eruption? ion clouds? asteroids? lightning?], etc.
-different 'levels' - locations with different environments/hazards?
*/