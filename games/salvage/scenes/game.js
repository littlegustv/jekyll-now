/*

- enemy respecting boundaries
- boss...

 */


/* global Resources, Layer, gameWorld, MAXHEALTH, Entity, TiledBackground, Sprite, SpriteFont */
var onStart = function () {
	this.wave = [];
	
	Resources.music = Resources.salvage;
  //var super_bg = this.addLayer(Object.create(Layer).init(1000,1000));
  //super_bggit.active = true;
  //var parallax = this.addLayer(Object.create(Layer).init(1000,1000));
  var colorize = this.addLayer(Object.create(Layer).init(1000, 1000));
  colorize.add(Object.create(Entity).init(0, 0, 1000, 1000)).color = COLORS.negative;
  //colorize.color = COLORS.negative;
  
  var bg = this.addLayer(Object.create(Layer).init(1000,1000));
	bg.active = true;
  //var fg = this.addLayer(Object.create(Layer).init(1000,1000));
	//fg.active = true;
	//parallax.active = true;
//
  
	var b = bg.add(Object.create(Entity).init(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT));
  b.color = COLORS.nullary;
  b.z = -10;
	
	for (var i = 1; i < WIDTH / 32; i++) {
		var h = randint(1,5) * 32; var b = bg.add(Object.create(TiledBackground).init(i * 32, HEIGHT - h / 2, 32, h, Resources.building));
		b.blend = "destination-out"; b.z = -9; b.opacity = Math.random()  / 3;
	}
	
	var grid = bg.add(Object.create(TiledBackground).init(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, Resources.grid));
	grid.z = -8;
	grid.blend = "destination-out";

  var ground = bg.add(Object.create(TiledBackground).init(WIDTH / 2, HEIGHT - 6, WIDTH, 12, Resources.ground));
  ground.z = -7;
  ground.blend = "destination-out";
  ground.setCollision(Polygon);

  var right = bg.add(Object.create(TiledBackground).init(WIDTH, HEIGHT / 2, 32, HEIGHT, Resources.building));
  right.z = -6;
  right.blend = "destination-out";
  right.setCollision(Polygon);

  var left = bg.add(Object.create(TiledBackground).init(0, HEIGHT / 2, 32, HEIGHT, Resources.building));
  left.z = -6;
  left.blend = "destination-out";
  left.setCollision(Polygon);
	
	this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	this.ui.active = true;

	this.health_bar = [];	
	for (var i = 0.5; i < MAXHEALTH + 0.5; i++) {
		this.health_bar.push(this.ui.add(Object.create(Sprite).init(i * 16, gameWorld.height - 12, Resources.icons)));
	}
	this.shield = this.ui.add(Object.create(Sprite).init(16 * (MAXHEALTH + 0.5), gameWorld.height - 12, Resources.icons));
	this.shield.animation = 1;
	
	var s = this;
	this.updateHealthBar = function (object) {
		for (var i = 0; i < s.health_bar.length; i++) {
			if (i < object.health) {
				s.health_bar[i].opacity = 1;
			} else if (i < MAXHEALTH) {
				s.health_bar[i].opacity = 0.3;
			}
		}
		this.shield.opacity = object.shield;
	};

  var menu_text = this.ui.add(Object.create(SpriteFont).init(24, 12, Resources.expire_font, "menu", {align: "center", spacing: -2}));
	var menu_button = this.ui.add(Object.create(Entity).init(24, 12, 48, 24));
	menu_button.family = "button";
	menu_button.opacity = 0;
	menu_button.trigger = function () {
		if (s.bg.paused) {
			gameWorld.setScene(0);
      gameWorld.playSound(Resources.select);
		}
	};
	menu_button.hover = function () {
    if (menu_text.scale != 2) gameWorld.playSound(Resources.hover);
    menu_text.scale = 2;
	};
	menu_button.unhover = function () {
		menu_text.scale = 1;
	};
	
	var mute_text = this.ui.add(Object.create(SpriteFont).init(gameWorld.width - 24, 12, Resources.expire_font, "mute", {align: "center", spacing: -2}));
	var mute_button = this.ui.add(Object.create(Entity).init(gameWorld.width - 24, 12, 48, 24));
	mute_button.family = "button";
	mute_button.opacity = 0;
	mute_button.trigger = function () {
      gameWorld.playSound(Resources.select);
		// mute!
	};
	mute_button.hover = function () {
    if (mute_text.scale != 2) gameWorld.playSound(Resources.hover);
    mute_text.scale = 2;
	};
	mute_button.unhover = function () {
		mute_text.scale = 1;
	};
	
  var player_bot = bg.add(Object.create(Sprite).init(48, 48, Resources.viper));
  player_bot.blend = "destination-out";
  player_bot.setCollision(Polygon);
	player_bot.move = Movement.standard;
  player_bot.min = {x: 24, y: 24};
  player_bot.max = {x: WIDTH - 24, y: HEIGHT - 24};
	player_bot.addBehavior(Accelerate);
	player_bot.addBehavior(Velocity);
  player_bot.velocity = {x: 0, y: 0};
  player_bot.acceleration = {x: 0, y: 0};
  player_bot.opacity = 1;
	player_bot.health = MAXHEALTH;
	player_bot.shield = 0;
	player_bot.shield_sprite = this.shield;
	player_bot.z = Z.entity;
  //player_bot.addBehavior(Bound, {min: {x: 6, y: -gameWorld.height * 5}, max: {x: gameWorld.width - 6, y: 5 * gameWorld.height}});
	player_bot.salvage = 0;
	// new movement settings
	player_bot.speed = 5.5;
	player_bot.distance = 48;
	player_bot.noCollide = false;
	
  player_bot.family = "player";
	player_bot.stopped = function () {
		return !this.lerpx && !this.lerpy;
	}
	
	this.updateHealthBar(player_bot);
  player_bot.collision.onHandle = function (object, other) {
		if (object.noCollide) return;
		
    if (other.family == "enemy") {
      if (!other.projectile) {
      } else {
				gameWorld.playSound(Resources.hit);
				if (object.shield >= 1) {
					object.shield = 0;
					//object.addBehavior(Delay, {duration: 1.5, callback: function () { this.entity.noCollide = false; }})
				} else {
        	object.health -= 1;
				}
				object.layer.camera.addBehavior(Shake, {duration: 1, min: -60, max: 60});
				s.updateHealthBar(object);
				
				var expl = other.layer.add(Object.create(Circle).init(other.x, other.y, 8));
				//var expl = enemy.layer.add(Object.create(Sprite).init(enemy.x + randint(-8, 8), enemy.y + randint(-8, 8), Resources.explosion));
				expl.addBehavior(FadeOut, {duration: 0.5, delay: 0.2});
				expl.z = 3;
				var flash = other.layer.add(Object.create(Circle).init(other.x, other.y, 12));
				flash.z = 4;
				flash.addBehavior(FadeOut, {duration: 0, delay: 0.1});
				flash.color = COLORS.secondary;
				gameWorld.playSound(Resources.hit);        
				
				//var expl = other.layer.add(Object.create(Sprite).init(other.x, other.y, Resources.explosion));
				//expl.addBehavior(FadeOut, {duration: 0, delay: 0.8});
				
				if (object.retaliate >= 1) {
					for (var i = 0; i < 3; i++) {
						var theta = i * PI2 / 3;
						var p =object.layer.add(Object.create(Entity).init(object.x, object.y, 4, 4));
						p.addBehavior(Velocity);
						p.velocity = {x: 40 * Math.cos(theta), y: 40 * Math.sin(theta)};
						p.projectile = true;
						p.family = object.family;
						p.setCollision(Polygon);
					}
				}
				
  			//object.damage.timer = DAMAGE_COOLDOWN;
      }
			object.noCollide = true;
			object.addBehavior(Delay, {duration: 0.5, callback: function () { this.entity.noCollide = false; }});
    }
		if (object.health <= 0) {
			object.die();
			//p.alive = false;
		}
  }
	player_bot.die = function () {
		s.unpause();
		s.pause = function () {};
		player_bot.removeBehavior(player_bot.lerpx);
		player_bot.removeBehavior(player_bot.lerpy);
		player_bot.death = player_bot.addBehavior(Delay, {duration: 1.5, callback: function () {
			player_bot.alive = false;
			player_bot.death = undefined;
			gameWorld.setScene(0, true);
		}});
		var expl = this.layer.add(Object.create(Circle).init(this.x, this.y, 32));
		//var expl = enemy.layer.add(Object.create(Sprite).init(thi));
		expl.addBehavior(FadeOut, {duration: 0.5, delay: 0.2});
		expl.z = 1;
		var flash = this.layer.add(Object.create(Circle).init(this.x, this.y, 38));
		flash.z = 2;
		flash.addBehavior(FadeOut, {duration: 0, delay: 0.1});
		flash.color = COLORS.secondary;
		gameWorld.playSound(Resources.hit);
		gameWorld.wave = 0;
	}
	
  this.store_layer = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	this.store_layer.active = false;
  var store = Object.create(Store).init(this.store_layer, player_bot);
  this.store = store;

  var e = this.ui.add(Object.create(Entity).init(gameWorld.width / 2, 12, 48, 24));
  var store_text = this.ui.add(Object.create(SpriteFont).init(gameWorld.width / 2, 12, Resources.expire_font, "store", {align: "center", spacing: -2}));
  e.family = "button";
  e.opacity = 0;
  e.trigger = function () {
    store.open();
    gameWorld.playSound(Resources.select);
  }
  e.hover = function () {
    if (store_text.scale != 2) gameWorld.playSound(Resources.hover);
    store_text.scale = 2;
  };
  e.unhover = function () {
    store_text.scale = 1;
  };

	this.player_bot = player_bot;
  var t = this;

	bg.camera.addBehavior(Follow, {target: player_bot, offset: {x: -gameWorld.width / 2, y: -gameWorld.height / 2}, rate: 5});
  bg.camera.addBehavior(Bound, {min: {x: 0, y:  0}, max: {x: WIDTH - gameWorld.width, y: HEIGHT - gameWorld.height}})
  //fg.camera.addBehavior(Follow, {target: bg.camera, offset: {x: 0, y: 0}});
	
  this.bg = bg;
  //this.fg = fg;
	
  this.keydown = false;
  this.pause = function () {
		if (!this.player_bot.lerpx && !this.player_bot.lerpy) {
			this.bg.paused = true;
			this.player_bot.velocity = {x: 0, y: 0};
			this.player_bot.acceleration = {x: 0, y: 0};
			this.player_bot.animation = 0;
      if (this.wave.length <= 0) {
        for (var i = 0; i < projectiles.length; i++) {
          if (projectiles[i].alive) {
            projectiles[i].alive = false;
            var f = projectiles[i].layer.add(Object.create(Circle).init(projectiles[i].x, projectiles[i].y, 5));
            f.color = COLORS.primary;
            f.addBehavior(FadeOut, {duration: 0.1, delay: 0.1});
          }
        }
        projectiles = [];
				this.current_wave += 1;
				var cash = s.bg.add(Object.create(SpriteFont).init(gameWorld.boss.x, gameWorld.boss.y, Resources.expire_font, "$1 cash", {align: "center", spacing: -2}));
				cash.addBehavior(Velocity);
				cash.blend = "destination-out";
				cash.velocity = {x: 0, y: 20};
				cash.setCollision(Polygon);
				cash.setVertices([
					{x: -20, y: -5},
					{x: -20, y: 5},
					{x: 20, y: 5},
					{x: 20, y: -5}
				]);
				cash.collision.onHandle = function (object, other) {
					if (other == s.player_bot) {
						object.alive = false;
						other.salvage += 1;
		        gameWorld.playSound(Resources.coins);
						for (var i = 0; i < 20; i++) {
							var p = object.layer.add(Object.create(SpriteFont).init(other.x, other.y, Resources.expire_font, "$", {align: "center"}));
							p.addBehavior(Velocity);
							p.blend = "destination-out";
							p.addBehavior(FadeOut, {duration: 0, delay: Math.random()});
							p.velocity = {x: randint(-20,20), y: randint(-20,20)};
						}
					}
				}
				var w = this.waves[gameWorld.wave % this.waves.length];
				gameWorld.wave++;
				gameWorld.playSound(Resources[choose(["spawn"])]);
				for (var j = 0; j < w.length; j++) {
					var enemy = spawn(this.bg, w[j], this.player_bot);
					this.wave.push(enemy);
				}
		  }
		}
  }
  this.unpause = function () {
    this.bg.paused = false;
    //this.fg.paused = false;
  }
  var s = this;
	var down = function (e) {
		var layer = s.store_layer.active ? s.store_layer : s.ui;		
		if (layer.active && s.bg.paused) {
			var b = layer.onButton(e.x, e.y);
			if (b) {
				b.trigger();
  			return;
      }
		}
		if (s.store_layer.active) return;
		if (s.player_bot.death) {
			s.player_bot.death.duration = 0;
			return;
		} else if (!s.player_bot.locked && s.player_bot.stopped()) {
      s.player_bot.angle = Math.round(angle(s.player_bot.x - s.bg.camera.x, s.player_bot.y - s.bg.camera.y, e.x, e.y) / (PI / 2)) * PI / 2;
      s.player_bot.move(s)
		}
    //console.log(s.player_bot.locked, s.player_bot.stopped);
	}
	var move = function (e) {
		var layer = s.store_layer.active ? s.store_layer : s.ui;
		if (layer.active) {
      var b = layer.onButton(e.x, e.y);
      if (b) {
        b.hover();
      }
      var buttons = layer.entities.filter( function (e) { return e.family == "button"; });
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i] != b && buttons[i].unhover) {
          buttons[i].unhover();
        }
      }
      //return;
    }
		if (!s.player_bot.locked && s.player_bot.stopped()) {
			//if (s.player_bot.velocity.x === 0 && s.player_bot.velocity.y === 0) {
				s.player_bot.angle = Math.round(angle(s.player_bot.x - s.bg.camera.x, s.player_bot.y - s.bg.camera.y, e.x, e.y) / (PI / 2)) * PI / 2;
			//}
		}
	}
	
	var up = function (e) {
	}
	
	
  this.onMouseMove = move;
  this.onMouseUp = function (e) {
		return;
  }
  this.onMouseDown = down;
	
	this.onTouchStart = function (e) {
		if (!fullscreen) {
			requestFullScreen();
		}
	}
	
	this.onTouchEnd = function (e) {
		e.x = e.touch.x, e.y = e.touch.y;
		down(e);
	};
	this.onTouchMove = function (e) {
		e.x = e.touch.x, e.y = e.touch.y;
		move(e);
	};
	
	this.current_wave = 0;
  this.waves = [
    [0,0,0,0,0,0], // learn to hit head-on
    [1,1,1,0,0,0,0], // learn to hit where you need to
    [2,2,1,1,0,0], // learn to close the distance
    [2,2,2,0,0,0,0,0], // learn to prioritize
    [5,5,0,0,0,0,1,1], // learn to anticipate
    [3,3,3,0,0],
    [4,4,2,1,1,1],
    [5,5,5,0,0,0,0],
    [6, 6, 6, 6, 4, 4, 5],
		[6,6, 5]
	];
  this.waves = [[0]];
	//this.waves = [[5]];
	//this.waves = [[0], [0,0,0], [0,0,0,0,0], [0,0,0,0,0,0,0,0]];
	
	var boss = this.bg.add(Object.create(Sprite).init(player_bot.x + gameWorld.width, player_bot.y, Resources.boss));
	boss.blend = "destination-out";
	boss.animation = 0;
	boss.modules = [];
	boss.z = 24;
	boss.maxhealth = 10;
	boss.health = boss.maxhealth;
	boss.respond = function (target) {
		this.health = this.limbs.reduce(function (sum, l) { return sum + l.health; }, 0);
		if (this.health >= this.maxhealth) {}
		else if (this.health >= this.maxhealth - 1) {
			this.shoot = Weapons.standard;
			// fix me: should be based on NORMAL to angle(this, target), i.e. two shots to either side
			this.target = {x: target.x, y: target.y - 12};
			this.shoot(this.layer);
			this.target = {x: target.x, y: target.y + 12};
			this.shoot(this.layer);
		} else if (this.health >= this.maxhealth - 2) {
			this.target = target;
			this.shoot(this.layer);
		} else if (this.health >= this.maxhealth / 2 && this.disable === undefined) {
			this.family = "enemy";
			this.disable = this.addBehavior(Disable, {target: target});
		} else if (this.disable !== undefined) {
			this.removeBehavior(this.disable);
			this.disable = undefined;
			this.addBehavior(Enemy);
		}
	}
	boss.lerpFollow = boss.addBehavior(LerpFollow, {target: player_bot, rate: 0.3, offset: {x: 0, y: -gameWorld.height / 3, angle: false, z: false}});
	//boss.addBehavior(HealthBar);
	gameWorld.boss = boss;
	boss.limbs = [];
	/*
	for (var i = 0; i < 6; i++) {
		var theta = PI / 2 + i * PI2 / 6;
		var limb = this.bg.add(Object.create(Circle).init(boss.x + Math.cos(theta) * 32, boss.y + Math.sin(theta) * 32, 15));
		//limb.w = 12, limb.h = 12;
		limb.angle = angle(limb.x, limb.y, boss.x, boss.y);
		limb.setCollision(Polygon);
		//limb.blend = "destination-out";
		limb.addBehavior(Follow, {target: gameWorld.boss, offset: {x: Math.cos(theta) * 32, y: Math.sin(theta) * 32, angle: false, z: -( i + 1)}});
		limb.color = COLORS.tertiary;
		limb.health = 2;
		limb.opacity = 0.8;
		limb.z = 13 + i;
		boss.limbs.push(limb);
		limb.collision.onHandle = function (object, other) {
			if (other.family == "player" && !gameWorld.boss.invulnerable) {
				// blowback
				object.health -= 1;
				gameWorld.boss.invulnerable = true;
				gameWorld.boss.respond(s.player_bot);
				gameWorld.boss.addBehavior(Delay, {duration: 1, callback: function () { this.entity.invulnerable = false}})
				if (object.health <= 0) {
					object.alive = false;
				}
				if (!other.projectile) {
					var theta = angle(gameWorld.boss.x, gameWorld.boss.y, other.x, other.y);
					
					var goal = {x: 48 * Math.round((object.x + 56 * Math.cos(theta)) / 48), y:  48 * Math.round((object.y + 56 * Math.sin(theta)) / 48)}
	
					// gridsize is 48, find nearest
	
					s.player_bot.removeBehavior((s.player_bot.lerpx));
					s.player_bot.removeBehavior((s.player_bot.lerpy));
					s.player_bot.angle = theta;
					s.player_bot.move(s);
					s.player_bot.lerpx.goal = goal.x;
					s.player_bot.lerpy.goal = goal.y;
				}
			}
		}
	}*/
	
  // intro animation
  this.intro = true;
  this.bg.paused = false;
  //this.fg.paused = false;

  this.bg.camera.scale = 0.5;
  //this.fg.camera.scale = 0.5;
  this.bg.camera.x = -gameWorld.width / 4;
  this.bg.camera.y = -gameWorld.height / 4;

  this.bg.camera.lerpx = this.bg.camera.addBehavior(Lerp, {field: "x", object: s.bg.camera, goal: 0, rate: 3.5});
  this.bg.camera.lerpy = this.bg.camera.addBehavior(Lerp, {field: "y", object: s.bg.camera, goal: 0, rate: 3.5});
  this.bg.camera.lerp = this.bg.camera.addBehavior(Lerp, {field: "scale", object: s.bg.camera, goal: 1, rate: 3.5, threshold: 0.01, callback: function () {
    s.intro = false;
    s.player_bot.delay = player_bot.addBehavior(Delay, {duration: 1, remove: false, callback: function () {
      this.entity.velocity = {x: 0, y: 0};
      this.entity.acceleration = {x: 0, y: 0};
      s.pause();
    }});
    this.entity.removeBehavior(this.entity.lerp);
    this.entity.removeBehavior(this.entity.lerpx);
    this.entity.removeBehavior(this.entity.lerpy);
		
  }});
  this.pause();
}
var onUpdate = function (dt) {
  var s = this;
  if (this.intro) return; // for now...

	for (var i = 0; i < this.wave.length; i++) {
		if (!this.wave[i].alive) this.wave.splice(i, 1);
	}

  if (this.bg.paused) {
    gameWorld.filter.frequency.value = lerp(gameWorld.filter.frequency.value, 220, dt);
  } else {
    gameWorld.filter.frequency.value = lerp(gameWorld.filter.frequency.value, 24000, dt);
  }
		
}
