var gameWorld = Object.create(World).init(320, 180, "index.json");

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
  if (Math.random() * 100 < (10 - this.entity.health)) {
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
	enemy.family = "enemy";
	enemy.collision.onHandle = function (object, other) {
		if (other.solid && object.opacity >= 1) object.die();
		if (other.family != "enemy") {
		//console.log('die?');
			//object.alive = false;
			if (object.opacity >= 1)
				object.die();
		}        
	}
	enemy.die = function () {
		this.collision.onCheck = function (a, b) { return false; };
		this.velocity = {x: 0, y: 0};
		this.addBehavior(FadeOut, {duration: 0.5});
		var exp = this.layer.add(Object.create(Sprite).init(this.x, this.y, Resources.explosion));
		exp.addBehavior(FadeOut, {duration: 0.5, delay: 1});
		exp.z = this.z - 1;
		
		var salvage = this.layer.add(Object.create(Sprite).init(this.x, this.y, Resources.item));
		salvage.addBehavior(FadeOut, {duration: 1, delay: 1});
		salvage.setCollision(Polygon);
		salvage.collision.onHandle = function (object, other) {
			if (other.family == "player" && !other.projectile) {
				object.alive = false;
				player.salvage += 1;
			}
		}
		salvage.z = this.z - 1;
		salvage.addBehavior(Velocity);
		salvage.velocity = {x: 0, y: 50};
		gameWorld.playSound(Resources.hit);
	}
	//enemy.addBehavior(Crop, {min: {x: -10, y: -10}, max: {x: gameWorld.width + 10, y: gameWorld.height + 20}});  
	return enemy;
}

function create_store(layer) {
	var border = layer.add(Object.create(TiledBackground).init(gameWorld.width / 2, -3 * gameWorld.height / 2, 160, 112, Resources.border));
	var inner = layer.add(Object.create(Entity).init(gameWorld.width / 2, -3 * gameWorld.height / 2, 152, 104));
	inner.color = "white";
	
	var title = layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, -3 * gameWorld.height / 2 - 44, Resources.expire_font, "SHOPPE", {align: "center", spacing: -2}));
	layer.items = [];
	
	for (var i = 0; i < 3; i++) {
		var item_icon = layer.add(Object.create(Sprite).init(gameWorld.width / 2 - 64, -3 * gameWorld.height / 2 - 16 + i * 12, Resources.icons));
		item_icon.animation = i + 2;
		var price = layer.add(Object.create(SpriteFont).init(gameWorld.width / 2 - 32, -3 * gameWorld.height / 2 - 16 + i * 12, Resources.expire_font, randint(1,5) + "$", {align: "left", spacing: -2}));
		layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, -3 * gameWorld.height / 2 - 16 + i * 12, Resources.expire_font, "___", {align: "left", spacing: -2}));
		var plus = layer.add(Object.create(SpriteFont).init(gameWorld.width / 2 + 56, -3 * gameWorld.height / 2 - 16 + i * 12, Resources.expire_font, "-", {align: "right", spacing: -2}));
		plus.family = "button";
		plus.trigger = function () { console.log('plus'); };
		var minus = layer.add(Object.create(SpriteFont).init(gameWorld.width / 2 + 72, -3 * gameWorld.height / 2 - 16 + i * 12, Resources.expire_font, "+", {align: "right", spacing: -2}));
		minus.family = "button";
		minus.trigger = function () { console.log('minus'); };
		layer.items.push({icon: item_icon, price: price});
	}
	
	layer.salvage = layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, -3 * gameWorld.height / 2 - 32, Resources.expire_font, "Total: $ 0", {align: "center", spacing: -2}));
	
	layer.add(Object.create(SpriteFont).init(gameWorld.width / 2, - 3 * gameWorld.height / 2 + 16, Resources.expire_font, "Repairs", {align: "center", spacing: -2}));
	layer.repairs = {};
	layer.repairs.price = layer.add(Object.create(SpriteFont).init(gameWorld.width - 64, -3*gameWorld.height / 2 + 28, Resources.expire_font, "$ 1", {align: "left", spacing: -2}));
	
	layer.repairs.health = layer.add(Object.create(Entity).init(gameWorld.width / 2, -3 * gameWorld.height / 2 + 28, 128, 12));
	
	var close_text = layer.add(Object.create(SpriteFont).init(gameWorld.width / 2 + 64, -3 * gameWorld.height / 2 + 40, Resources.expire_font, "done", {align: "right", spacing: -2}));
	var close = layer.add(Object.create(Entity).init(gameWorld.width / 2 + 64, -3 * gameWorld.height / 2 + 40, 32, 16));
	close.color = "#dddddd";
	close.family = "button";
	close.w = 12, close.h = 8;
	close.trigger = function () {
		for (var i = 0; i < layer.entities.length; i++) {
			layer.entities[i].lerp.goal = layer.entities[i].goal - gameWorld.height * 2;
		}
		close_store(layer);
		gameWorld.current_wave += 1;
	}
	
	for (var i = 0; i < layer.entities.length; i++) {
		layer.entities[i].lerp = layer.entities[i].addBehavior(Lerp, {object: layer.entities[i], field: "y", goal: layer.entities[i].y + gameWorld.height * 2, rate: 10});
		layer.entities[i].goal = layer.entities[i].lerp.goal;
	}
}
function open_store(layer) {
	gameWorld.scene.layers.forEach( l => l.paused = 10000 );
	layer.paused = 0;
	for (var i = 0; i < layer.entities.length; i++) {
		layer.entities[i].lerp.goal = layer.entities[i].goal;
	}
	layer.active = true;
}

function close_store(layer) {
	gameWorld.scene.layers.forEach( l => l.paused = 0 );
	layer.active = false;
}

var Weapons = {
	standard: function (layer) {
		if (this.cooldown <= 0) {
			var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.projectile));
			a.setCollision(Polygon);
			gameWorld.playSound(Resources.laser);
			a.collision.onHandle = function (object, other) {
				if (other.family != "player" && !other.projectile) {
					object.alive = false;
				} if (other.family == "enemy" && other.die) {
					//other.alive = false;
					other.die();
				}
			};
			a.addBehavior(Velocity);
			a.family = "player";
			a.projectile = true;
			a.velocity = {x: 100 * Math.cos(this.angle), y: 100 * Math.sin(this.angle)};
			this.cooldown = 0.3;
    }
	},
	double: function (layer) {
		if (this.cooldown <= 0) {
			for (var i = 0; i < 3; i++) {
				var a = layer.add(Object.create(Sprite).init(this.x, this.y, Resources.projectile));
				a.setCollision(Polygon);
				gameWorld.playSound(Resources.laser);
				a.collision.onHandle = function (object, other) {
					if (other.family != "player" && !other.projectile) {
						object.alive = false;
					} if (other.family == "enemy" && other.die) {
						//other.alive = false;
						other.die();
					}
				};
				a.addBehavior(Velocity);
				a.family = "player";
				a.projectile = true;
				var theta = this.angle - PI / 6 + i * PI / 6;
				a.velocity = {x: 100 * Math.cos(theta), y: 100 * Math.sin(theta)};
				this.cooldown = 0.6;
			}
    }
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
-implement AI 'store' (popup) - UI layer
 x- collectible 'scrap' (salvage?) that enemies drop (score counter)
 - start with repairs only?
-add powerups, upgrades
-implement scrap/repair mechanic
-implement AI 'greedy' tractor beam for dropped powerups
-implement end goal -> barrier with 'salvage' cost
-implement AI combat behavior
-add more enemies, waves, environmental hazards [volvanic eruption? ion clouds? asteroids? lightning?], etc.
-different 'levels' - locations with different environments/hazards?
*/