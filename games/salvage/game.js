var MAXHEALTH = 16, DAMAGE_COOLDOWN = 0.5;
var gameWorld = Object.create(World).init(320, 180, "index.json");

// push to raindrop -> collisions fix
Layer.update = function (dt) {
	if (this.paused > 0) {
	  this.paused -= dt;
	  return;
	}
	this.camera.update(dt);
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

function projectileHit (object, other) {
	if (other.family != object.family && !other.projectile) {
		object.alive = false;
		var small = object.layer.add(Object.create(Sprite).init(object.x, object.y, Resources.small));
		small.addBehavior(FadeOut, {duration: 0.5});
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
	this.entity.angle = lerp_angle(this.entity.angle, angle(this.entity.x, this.entity.y, this.target.x, this.target.y), dt);
	this.entity.velocity = {x: 50 * Math.cos(this.entity.angle), y: 50 * Math.sin(this.entity.angle) };
};

// push to raindrop
function lerp_angle (a1, a2, rate) {
  var r = a1 + short_angle(a1, a2) * rate;
	if (Math.abs(r - a2) < 0.01) return a2;
	else return r;
}

var Weapons = {
	standard: function (layer) {
		if (this.cooldown <= 0) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.projectile));
			a.setCollision(Polygon);
			gameWorld.playSound(Resources.laser);
			a.collision.onHandle = projectileHit;
			a.addBehavior(Velocity);
			a.family = "player";
			a.projectile = true;
			a.velocity = {x: 100 * Math.cos(this.angle), y: 100 * Math.sin(this.angle)	};
			a.angle = theta;
			this.cooldown = 0.3;
			return true;
	    }
	},
	double: function (layer) {
		if (this.cooldown <= 0) {
			for (var i = 0; i < 3; i++) {
				var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.projectile));
				a.setCollision(Polygon);
				gameWorld.playSound(Resources.laser);
				a.collision.onHandle = projectileHit;
				a.addBehavior(Velocity);
				a.family = "player";
				a.projectile = true;
				var theta = this.angle - PI / 6 + i * PI / 6;
				a.velocity = {x: 100 * Math.cos(theta), y: 100 * Math.sin(theta)};
				a.angle = theta;
				this.cooldown = 0.6;
			}
			return true;
    }
	},
	heat_seeking: function (layer) {
		if (this.cooldown <= 0) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.projectile));
			a.setCollision(Polygon);
			//gameWorld.playSound(Resources.mortar);
			a.collision.onHandle = projectileHit;
			a.addBehavior(Velocity);
			a.addBehavior(HeatSeeking, {family: "enemy"});
			a.family = "player";
			a.projectile = true;
			var theta = this.angle;
			a.velocity = {x: 90 * Math.cos(theta), y: 90 * Math.sin(theta)};
			a.angle = theta;
			this.cooldown = 0.6;			
			return true;
    	}
	},
	mine_layer: function (layer) {
		if (this.cooldown <= 0) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.bomb));
			a.setCollision(Polygon);
			//gameWorld.playSound(Resources.mortar);
			a.collision.onHandle = projectileHit;
			a.addBehavior(Oscillate, {field: "angle", object: a, rate: 1, initial: 0, constant: PI2, offset: 0});
			//a.addBehavior(Velocity);
			//a.addBehavior(HeatSeeking, {family: "enemy"});
			a.family = "player";
			a.projectile = true;
			//var theta = this.angle;
			//a.velocity = {x: 50 * Math.cos(theta), y: 50 * Math.sin(theta)};
			this.cooldown = 0.1;			
			return true;
		}
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
	this.entity.velocity.y = Math.max(this.entity.velocity.y, -100);
	if (this.entity.velocity.y <= 0 && !this.done) {
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
// end of push to riandrop

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
}

// timer, invulnerable
var Damage = Object.create(Behavior);
Damage.update = function (dt) {
	if (this.timer > 0) this.timer -= dt;
  if (Math.random() * 100 < (MAXHEALTH - this.entity.health)) {
    var c = Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.smoke);
    //var c = Object.create(Entity).init(this.entity.x, this.entity.y, 8, 8);
    c.opacity = 1;
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
function spawn(layer, key, player) {
	var enemy;
	console.log('twice?');
	switch (key) {
		case 1:
			enemy = Object.create(Sprite).init(choose([16, gameWorld.width - 16]), gameWorld.height - 14, Resources[choose(["walker"])]);
      enemy.angle = 0;
			enemy.offset = {x: 0, y: 2};
      enemy.mirrored = enemy.x > 100;
      enemy.addBehavior(Flip);
			enemy.addBehavior(Walker, {cooldown: 1});
      //enemy.addBehavior(Crop, {min: {x: -1, y: -1}, max: {x: gameWorld.width + 1, y: gameWorld.height}})
      enemy.velocity = {x: enemy.x > 100 ? -20 : 20, y: 0};
			break;
		case 2:
      enemy = Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["asteroid"])]);
      enemy.angle = Math.random() * PI / 6 + PI / 2 - PI / 12;              
      enemy.velocity = {x: Math.cos(enemy.angle) * 50, y: 50 * Math.sin(enemy.angle)}; 
			break;
		case 3:
      enemy = Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["bomber"])]);
      enemy.angle = Math.random() * PI / 6 + PI / 2 - PI / 12;              
      enemy.velocity = {x: Math.cos(enemy.angle) * 150, y: 150 * Math.sin(enemy.angle)};
			enemy.addBehavior(Accelerate);
			enemy.acceleration = {x: 0, y: -100};
			enemy.addBehavior(Bomber);
			break;
		case 4:
      enemy = Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["saucer"])]);
      enemy.addBehavior(Shoot, {target: player, cooldown: 1});
      enemy.velocity = {x: 0, y: 10};
			break;
		case 5:
			enemy = Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["x"])]);
      enemy.angle = Math.random() * PI / 6 + PI / 2 - PI / 12;              
      enemy.velocity = {x: Math.cos(enemy.angle) * 50, y: 50 * Math.sin(enemy.angle), angle: PI}; 
			enemy.addBehavior(Bounce, {min: {x: 5, y: 0}, max: {x: gameWorld.width - 5, y: gameWorld.height - 16}});
			break;
		case 6:
      enemy = Object.create(Sprite).init(randint(0,gameWorld.width), 0, Resources[choose(["drone"])]);
      enemy.addBehavior(Drone, {target: player, cooldown: 1, rate: 0.6, radius: 40, angle: Math.random() * PI2});
      enemy.velocity = {x: 0, y: 10};
    	break;
		case 7:
			// disable tanks for now...
      enemy = Object.create(Sprite).init(choose([16, gameWorld.width - 16]), gameWorld.height - 14, Resources[choose(["tank", "walker"])]);
      enemy.angle = 0;
			enemy.offset = {x: 0, y: 2};
      enemy.mirrored = enemy.x > 100;
      enemy.addBehavior(Flip);
      enemy.addBehavior(Mortar, {cooldown: 1});
      //enemy.addBehavior(Crop, {min: {x: -1, y: -1}, max: {x: gameWorld.width + 1, y: gameWorld.height}})
      enemy.velocity = {x: enemy.x > 100 ? -20 : 20, y: 0};
    	break;
	}
	layer.add(enemy);
	enemy.addBehavior(Velocity);
	enemy.setCollision(Polygon);
	enemy.setVertices([
		{x: 0, y: -6},
		{x: -6, y: 0},
		{x: 0, y: 6},
		{x: 6, y: 0}
	]);
	enemy.health = randint(1, 3);
	enemy.family = "enemy";
	enemy.collision.onHandle = function (object, other) {
		if (other.family != object.family) {
			object.health -= 1;
			if (object.health < 0) object.die();
		}        
	}
	enemy.die = function () {
		this.collision.onHandle = function (a, b) { return false; };
		this.velocity = {x: 0, y: 0};
		this.addBehavior(FadeOut, {duration: 0.5});
		var exp = this.layer.add(Object.create(Sprite).init(this.x, this.y, Resources.explosion));
		exp.addBehavior(FadeOut, {duration: 0.5, delay: 1});
		exp.z = this.z - 1;
		
		for (var i = 0; i < randint(2,5); i++) {
			var salvage = this.layer.add(Object.create(Sprite).init(this.x + randint(0,10) - 5, this.y + randint(0, 10) - 5, Resources.gem));
			salvage.addBehavior(FadeOut, {duration: 1, delay: 3});
			salvage.value = 1;
			salvage.setCollision(Polygon);
			salvage.collision.onHandle = function (object, other) {
				if (other.family == "player" && !other.projectile) {
					object.alive = false;
					other.salvage += object.value;
					gameWorld.playSound(Resources.pickup);
					for (var i = 0; i < randint(5, 10); i++) {
						var p = object.layer.add(Object.create(Entity).init(object.x, object.y, 12, 12));
						p.color = "#0051ee";
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
	enemy.addBehavior(Crop, {min: {x: -10, y: -10}, max: {x: gameWorld.width + 10, y: gameWorld.height + 20}});  
	return enemy;
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
		var b1 = this.layer.add(Object.create(Entity).init(0, gameWorld.height / 2, gameWorld.width / 2, gameWorld.height * 2));
		b1.color = "#000000";
		var b2 = this.layer.add(Object.create(Entity).init(0, gameWorld.height / 2, gameWorld.width / 2, gameWorld.height - 12));
		b2.color = "white";
		
		var r = [];

		var outer = this.layer.add(Object.create(Sprite).init(3 * gameWorld.width / 4, gameWorld.height - 22, Resources.silhouette));
		var inner = this.layer.add(Object.create(Entity).init(3 * gameWorld.width / 4 + 12, gameWorld.height - 12, gameWorld.width / 2 + 8, 24));
		inner.color = "white";
		r.push(inner);
		r.push(outer);
		//this.layer.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height / 2, 160, 112, Resources.border)); 				// border
		//this.layer.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, 152, 104)).color="white";								//body
		this.layer.add(Object.create(SpriteFont).init(gameWorld.width / 6, 32, Resources.expire_font, "SHOPPE", {align: "center", spacing: -2})); // title
		
		var t = this;
		var close = this.layer.add(Object.create(SpriteFont).init(gameWorld.width / 6, gameWorld.height - 32, Resources.expire_font, "done", {align: "center", spacing: -2}));
		close.family = "button";
		close.trigger = function () {
			t.player.salvage -= t.spent;
			t.spent = 0;
			if (t.weapon) t.player.shoot = Weapons[t.weapon];
			t.weapon = undefined;
			t.close();
		}
		close.hover = function () {
			this.old_opacity = this.opacity;
			this.opacity = 0.6;
		}
		close.unhover = function () {
			this.opacity = this.old_opacity || 1;
		}
		this.weapons = {};
		this.salvage = this.layer.add(Object.create(SpriteFont).init(gameWorld.width / 6, 48, Resources.expire_font, "$ 0", {align: "center", spacing: -2}));
			
		//r.push(this.layer.add(Object.create(SpriteFont).init(gameWorld.width / 6 - 72, gameWorld.height / 2 + 16, Resources.expire_font, "Repairs", {align: "left", spacing: -2})));
		this.repair_price_text = this.layer.add(Object.create(SpriteFont).init(3 * gameWorld.width / 4, gameWorld.height - 24, Resources.expire_font, "Repair $ 1", {align: "center", spacing: -2}));
		r.push(this.repair_price_text);
		
		var health_bg = this.layer.add(Object.create(TiledBackground).init(3 * gameWorld.width / 4, gameWorld.height - 12, 128, 8, Resources.border));
		health_bg.opacity = 0;
		r.push(health_bg);
		this.health_bar = this.layer.add(Object.create(TiledBackground).init(3 * gameWorld.width / 4, gameWorld.height - 12, 128, 8, Resources.border));
		r.push(this.health_bar);
		
		var i = 2;
		for (var k in Weapons) {
			(function () {	
				var key = k;
				var icon = t.layer.add(Object.create(Sprite).init(gameWorld.width / 6, 44 + i * 14, Resources.icons));
				t.weapons[key] = icon;
				icon.animation = i % Resources.icons.animations;
				icon.family = "button";
				icon.purchase = key;
				icon.trigger = function () {
					if (t.weapon == key && t.spent > 0) {
						t.weapon = undefined;
						t.spend(-1);
						this.opacity = 1;
					} else if (t.player.salvage > (t.spent + 1)) {
						if (t.weapon) {
							t.weapons[t.weapon].opacity = 1;
							t.spend(-1);
						}
						t.weapon = key;
						this.opacity = 0.3;
						t.spend(1);
					}
				}
				icon.hover = function () {
					this.old_opacity = this.opacity;
					this.opacity = 0.6;
				}
				icon.unhover = function () {
					this.opacity = this.old_opacity || 1;
				}
				i++;
			})();
		}
		
		var plus = t.layer.add(Object.create(SpriteFont).init(gameWorld.width - 24, gameWorld.height - 24, Resources.expire_font, "+", {align: "center", spacing: -2}));
		plus.family = "button";
		plus.w = 8, plus.h = 8;
		plus.trigger = function () {
			console.log('repair plus');
			if (t.player.health < MAXHEALTH && t.spent < t.player.salvage) {
				t.spent += 1;
				t.player.health += 1;
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				t.health_bar.w = 128 * t.player.health / MAXHEALTH;
				t.health_bar.w = 128 * (t.player.health / MAXHEALTH), t.health_bar.x = gameWorld.width / 6 - (128 - t.health_bar.w) / 2;
			}
		};
		plus.hover = function () {}
		plus.unhover = function () {}
		r.push(plus);
		var minus = t.layer.add(Object.create(SpriteFont).init(gameWorld.width - 12, gameWorld.height - 24, Resources.expire_font, "-", {align: "center", spacing: -2}));
		minus.family = "button";
		plus.w = 8, plus.h = 8;
		minus.trigger = function () { 
			console.log('repair minus');
			if (t.player.health > 0 && t.spent > 0) {
				t.spent -= 1;
				t.player.health -= 1;
				t.salvage.text = "$" + (t.player.salvage - t.spent);
				t.health_bar.w = 128 * (t.player.health / MAXHEALTH), t.health_bar.x = gameWorld.width / 6 - (128 - t.health_bar.w) / 2;
			}
		};

		minus.hover = function () {}
		minus.unhover = function () {}
		r.push(minus);
		
		for (var i = 0; i < this.layer.entities.length; i++) {
			this.layer.entities[i].origin = {x: 0, y: 240};
			this.layer.entities[i].angle = -PI/2;
			this.layer.entities[i].lerp = this.layer.entities[i].addBehavior(Lerp, {object: this.layer.entities[i], field: "angle", goal: 0, rate: 5});
			//this.layer.entities[i].lerp = this.layer.entities[i].addBehavior(Lerp, {object: this.layer.entities[i], field: "y", goal: this.layer.entities[i].y + gameWorld.height * 2, rate: 10});
			this.layer.entities[i].goal = this.layer.entities[i].lerp.goal;
			this.layer.entities[i].original = this.layer.entities[i].angle;
		}
		
		for (var i = 0; i < r.length; i++) {
			r[i].angle = PI / 2;
		}
		
		outer.lerp.goal = -PI / 36;
		outer.goal = outer.lerp.goal;
		
		// special exception for off-kilter border
		b1.lerp.goal = PI / 36;
		b1.goal = b1.lerp.goal;
		b2.lerp.goal = PI / 72;
		b2.goal = b2.lerp.goal;
		
	},
	open: function () {
		this.salvage.text = "$ " + this.player.salvage;
		this.health_bar.w = 128 * (this.player.health / MAXHEALTH), this.health_bar.x = 3 * gameWorld.width / 4 - (128 - this.health_bar.w) / 2;
		
		this.repair_cost = (MAXHEALTH - this.player.health) / this.player.salvage; // price calculated to cost ALL your money to repair completely
		this.repair_price_text.text = "$ " + Math.floor(this.repair_cost * 10) / 10;
		
		for (var i = 0; i < this.layer.entities.length; i++) {
			this.layer.entities[i].lerp.goal = this.layer.entities[i].goal;
		}
		this.layer.active = true;
		for (var i = 0; i < gameWorld.scene.layers.length; i++) {
			gameWorld.scene.layers[i].paused = 10000;
		}
		this.layer.paused = 0;
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
		gameWorld.scene.claw.lerpx = gameWorld.scene.claw.addBehavior(Lerp, {object: gameWorld.scene.claw, field: "x", goal: gameWorld.width / 2, rate: 5, callback: function () { this.entity.removeBehavior(this.entity.lerpx); }});
		gameWorld.scene.claw.lerpy = gameWorld.scene.claw.addBehavior(Lerp, {object: gameWorld.scene.claw, field: "y", goal: - gameWorld.height, rate: 5, callback: function () { this.entity.removeBehavior(this.entity.lerpy); }});
		gameWorld.current_wave += 1;
	}
}

/* MUSIC */
/*
BUGS:
-collision handling happens twice? (i.e. salvage score)

FEATURES:
x-add checks for pause/unpause
x-create 5 new enemies with different attacks, patterns of movement
  x- different attacks
  x- different movement behaviors
x-implement 'waves'
x-implement AI 'store' (popup) - UI layer
 x- collectible 'scrap' (salvage?) that enemies drop (score counter)
 x- start with repairs only?
x-add powerups, upgrades
x-implement scrap/repair mechanic

-end goal -> barrier with 'salvage' cost ?
-implement AI combat behavior
-add more enemies, waves, environmental hazards [volvanic eruption? ion clouds? asteroids? lightning?], etc.
-different 'levels' - locations with different environments/hazards?
*/