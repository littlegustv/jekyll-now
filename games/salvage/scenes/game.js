/* global Resources, Layer, gameWorld, MAXHEALTH, Entity, TiledBackground, Sprite, SpriteFont */
var onStart = function () {
	
	Resources.music = Resources.salvage;
  //var super_bg = this.addLayer(Object.create(Layer).init(1000,1000));
  //super_bg.active = true;
  //var parallax = this.addLayer(Object.create(Layer).init(1000,1000));
  var bg = this.addLayer(Object.create(Layer).init(1000,1000));
	bg.active = true;
  var fg = this.addLayer(Object.create(Layer).init(1000,1000));
	fg.active = true;
	//parallax.active = true;

  
	var b = bg.add(Object.create(Entity).init(0, 0, 10 * gameWorld.width, 10 * gameWorld.height));
  b.color = "#ffffff";
  b.z = -10;
	
	bg.add(Object.create(TiledBackground).init(0, 0, 48 * gameWorld.width, 48 * gameWorld.height, Resources.grid)).z = -8;
	
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
	}
	
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
/*
  this.ui.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height - 8, gameWorld.width, 16)).color = "#6DC72E";
  var name = this.ui.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height - 8, Resources.expire_font, "Standard", {align: "center", spacing: -2}));
  var l = this.ui.add(Object.create(Entity).init(8, gameWorld.height - 8, 16, 16));
  var l_text = this.ui.add(Object.create(SpriteFont).init(4, gameWorld.height - 8, Resources.expire_font, "<", {align: "left"}));
  l.color = "#6DC72E";
  l.family = "button";
  l.trigger = function () {
    s.unpause();
    s.player_bot.delay.set(0.5);
		s.player_bot.thrust = modulo(s.player_bot.thrust - 1, s.player_bot.thrusts.length);
		s.player_bot.speed = s.player_bot.thrusts[s.player_bot.thrust].speed;
		s.player_bot.distance = s.player_bot.thrusts[s.player_bot.thrust].distance;
    //current_movement_key = modulo(current_movement_key - 1, movement_keys.length);
    //player_bot.move = Movement[movement_keys[current_movement_key]];
    name.text = s.player_bot.speed + ", " + s.player_bot.distance;
    name.text = movement_keys[current_movement_key];
  };
  l.hover = function () {
    l.opactity = 0.5;
  };
  l.unhover = function () {
    this.opactity = 1;
  };
  var r = this.ui.add(Object.create(Entity).init(gameWorld.width - 8, gameWorld.height - 8, 16, 16));
  var r_text = this.ui.add(Object.create(SpriteFont).init(gameWorld.width, gameWorld.height - 8, Resources.expire_font, ">", {align: "right"}));
  r.family = "button";
  r.color = "#6DC72E";
  r.trigger = function () {
		s.player_bot.thrust = modulo(s.player_bot.thrust + 1, s.player_bot.thrusts.length);
		s.player_bot.speed = s.player_bot.thrusts[s.player_bot.thrust].speed;
		s.player_bot.distance = s.player_bot.thrusts[s.player_bot.thrust].distance;
    //current_movement_key = modulo(current_movement_key + 1, movement_keys.length);
    //player_bot.move = Movement[movement_keys[current_movement_key]];
    name.text = s.player_bot.speed + ", " + s.player_bot.distance;
    s.unpause();
    s.player_bot.delay.set(0.5);
  };
  r.hover = function () {
    l.opactity = 0.5;
  };
  r.unhover = function () {
    this.opactity = 1;
  };*/

	//bg.add(Object.create(TiledBackground).init(-8, gameWorld.height / 2, 32, gameWorld.height * 10, Resources.building2)).z = -7;
	//bg.add(Object.create(TiledBackground).init(gameWorld.width + 8, gameWorld.height / 2, 32, gameWorld.height * 10, Resources.building2)).z = -7;
	
  var player_bot = bg.add(Object.create(Sprite).init(48, 48, Resources.viper));
  player_bot.color = "red";
  player_bot.setCollision(Polygon);
	player_bot.move = Movement.standard;
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
				expl.z = 1;
				var flash = other.layer.add(Object.create(Circle).init(other.x, other.y, 12));
				flash.z = 2;
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

	gameWorld.shop = bg.add(Object.create(Sprite).init(gameWorld.width - 48, gameWorld.height / 2 + 60,  Resources.shop));
	gameWorld.shop.opacity = 0;
	gameWorld.shop.addBehavior(AI, {target: player_bot, rate: 5, value: 0});

	this.player_bot = player_bot;
  var t = this;

	bg.camera.addBehavior(Follow, {target: player_bot, offset: {x: -gameWorld.width / 2, y: -gameWorld.height / 2}, rate: 5});
  fg.camera.addBehavior(Follow, {target: bg.camera, offset: {x: 0, y: 0}});
	
  this.bg = bg;
  this.fg = fg;
	
  this.keydown = false;
  this.pause = function () {
		if (!this.player_bot.lerpx && !this.player_bot.lerpy) {			
			this.bg.paused = true;
			this.player_bot.velocity = {x: 0, y: 0};
			this.player_bot.acceleration = {x: 0, y: 0};
			this.player_bot.animation = 0;
		}
  }
  this.unpause = function () {
    this.bg.paused = false;
    this.fg.paused = false;
  }
  this.pause();
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
	
	this.wave = [];
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
	//this.waves = [[0]];
	//this.waves = [[0], [0,0,0], [0,0,0,0,0], [0,0,0,0,0,0,0,0]];
	
	var boss = this.bg.add(Object.create(Sprite).init(player_bot.x, player_bot.y - gameWorld.height / 3, Resources.boss));
	boss.animation = 0;
	boss.modules = [];
	boss.z = 12;
	boss.lerpFollow = boss.addBehavior(LerpFollow, {target: player_bot, rate: 0.3, offset: {x: 0, y: -gameWorld.height / 3, angle: false, z: false}});
	boss.setCollision(Polygon);
	gameWorld.boss = boss;
	/*
	for (var i = 0; i < 4; i++) {
		var theta = (i + 1) * PI2 / 5;
		var b = this.bg.add(Object.create(Sprite).init(boss.x, boss.y, Resources.modules));
		b.animation = i;
		b.z = 9 - 0.1 * i;
		b.addBehavior(Follow, {target: boss, offset: {x: (i + 1) * 32, y: 0, angle: false, z: false}, rate: 1.5})
		//b.addBehavior(LerpFollow, {target: boss, offset: {x: 20 * Math.cos(theta), y: 20 * Math.sin(theta), angle: false, z: false}, rate: 1.5});
		b.setCollision(Polygon);
		boss.modules.push(b);
		b.addBehavior(Joined, {target: boss, color: COLORS.tertiary, width: 4});
	}*/
	
  // intro animation
  this.intro = true;
  this.bg.paused = false;
  this.fg.paused = false;

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
      //this.entity.stopped = true;
      s.pause();
    }});
    this.entity.removeBehavior(this.entity.lerp);
    this.entity.removeBehavior(this.entity.lerpx);
    this.entity.removeBehavior(this.entity.lerpy);
		
	  //s.bg.camera.addBehavior(LerpFollow, {target: s.player_bot, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: 0}, rate: 2});  
  	//s.fg.camera.addBehavior(Follow, {target: s.bg.camera, offset: {angle: false, x: 0, y: 0, z: 0}});
    //super_bg.camera.addBehavior(Follow, {target: s.bg.camera, offset: {angle: false, x: 0, y: 0, z: 0}});
    //parallax.camera.addBehavior(Follow, {target: s.bg.camera, offset: {angle: false, x: 0, y: 0, z: 0}});
    //s.fg.camera.addBehavior(LerpFollow, {target: s.player_bot, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: 0}, rate: 2});

    //console.log('what?');
  }});
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
		
  if (!this.bg.paused && this.wave.length <= 0) {
		console.log('new wave');
		this.current_wave += 1;
		if (this.current_wave % 2 === 1) {
			// store is open for business?
			// drop cash
			// 'adding'
			var cash = s.bg.add(Object.create(SpriteFont).init(gameWorld.boss.x, gameWorld.boss.y, Resources.expire_font, "$1 cash", {align: "center", spacing: -2}));
			cash.addBehavior(Velocity);
			cash.velocity = {x: 0, y: 20};
			cash.setCollision(Polygon);
			cash.collision.onHandle = function (object, other) {
				if (other == s.player_bot) {
					object.alive = false;
					other.salvage += 1;
          gameWorld.playSound(Resources.coins);
					for (var i = 0; i < 20; i++) {
						var p = object.layer.add(Object.create(SpriteFont).init(other.x, other.y, Resources.expire_font, "$", {align: "center"}));
						p.addBehavior(Velocity);
						p.addBehavior(FadeOut, {duration: 0, delay: Math.random()});
						p.velocity = {x: randint(-20,20), y: randint(-20,20)};
					}
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