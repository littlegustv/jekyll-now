var onStart = function () {
	if (!gameWorld.soundtrack) {
    if (AudioContext) {
      gameWorld.filter = gameWorld.audioContext.createBiquadFilter();
      // Create the audio graph.
      gameWorld.filter.connect(gameWorld.audioContext.destination);
      // Create and specify parameters for the low-pass filter.
      gameWorld.filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
      gameWorld.filter.frequency.value = 24000; // Set cutoff to 440 HZ
    }
   
    gameWorld.musicLoop = function () {
      gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack, 1);
      gameWorld.soundtrack.connect(gameWorld.filter);
      gameWorld.soundtrack.onended = gameWorld.musicLoop;
    }
    //gameWorld.musicLoop();
  }
	
  //var super_bg = this.addLayer(Object.create(Layer).init(1000,1000));
  //super_bg.active = true;
  //var parallax = this.addLayer(Object.create(Layer).init(1000,1000));
  var bg = this.addLayer(Object.create(Layer).init(1000,1000));
	bg.active = true;
  var fg = this.addLayer(Object.create(Layer).init(1000,1000));
	fg.active = true;
	//parallax.active = true;

  
	var b = bg.add(Object.create(Entity).init(0, 0, 10 * gameWorld.width, 10 * gameWorld.height));
  b.color = "#f8f8f8";
  b.z = -6;
	

	for (var i = 0; i < 100; i++) {
		bg.add(Object.create(Entity).init(randint(0, gameWorld.width), randint(0, gameWorld.height), 1, 1));
	}
	
	this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	this.ui.active = true;

  this.ui.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height - 8, gameWorld.width, 16)).color = "#6DC72E";
  var name = this.ui.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height - 8, Resources.expire_font, "Standard", {align: "center", spacing: -2}));
  var l = this.ui.add(Object.create(Entity).init(8, gameWorld.height - 8, 16, 16));
  var l_text = this.ui.add(Object.create(SpriteFont).init(4, gameWorld.height - 8, Resources.expire_font, "<", {align: "left"}));
  l.color = "#6DC72E";
  l.family = "button";
  l.trigger = function () {
    s.unpause();
    s.player_bot.delay.set(0.5);
    current_movement_key = modulo(current_movement_key - 1, movement_keys.length);
    player_bot.move = Movement[movement_keys[current_movement_key]];
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
    current_movement_key = modulo(current_movement_key + 1, movement_keys.length);
    player_bot.move = Movement[movement_keys[current_movement_key]];
    name.text = movement_keys[current_movement_key];
    s.unpause();
    s.player_bot.delay.set(0.5);
  };
  r.hover = function () {
    l.opactity = 0.5;
  };
  r.unhover = function () {
    this.opactity = 1;
  };

	bg.add(Object.create(TiledBackground).init(-8, gameWorld.height / 2, 32, gameWorld.height * 10, Resources.building2));
	bg.add(Object.create(TiledBackground).init(gameWorld.width + 8, gameWorld.height / 2, 32, gameWorld.height * 10, Resources.building2));
	
  /*
	var atmosphere = super_bg.add(Object.create(Atmosphere).init(gameWorld.width / 2, gameWorld.height / 2 + 60, 165, 2, PI / 8, "#ddd"));
	atmosphere.addBehavior(Velocity);
	atmosphere.velocity = {x: 0, y: 0, angle: PI / 180};
	atmosphere.addBehavior(Oscillate, {object: atmosphere, field: "amplitude", initial: 2, constant: 1, rate: 4});
	atmosphere.z = -5;
	
	// smaller
  //var atmosphere = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60, Resources.atmosphere));
	var atmosphere = super_bg.add(Object.create(Atmosphere).init(gameWorld.width / 2, gameWorld.height / 2 + 60, 160, 2, PI / 2, "white"));
	atmosphere.addBehavior(Velocity);
	atmosphere.angle = Math.random() * PI2;
	atmosphere.velocity = {x: 0, y: 0, angle: PI / 180};
	atmosphere.addBehavior(Oscillate, {object: atmosphere, field: "amplitude", initial: 2, constant: 1, rate: 4});
	atmosphere.z = -4;

  var planet = parallax.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60,  Resources.ocean));
	planet.z = -3;
	planet.addBehavior(Velocity);

  for (var i = 0; i < 2; i++) {
    var continents = parallax.add(Object.create(Sprite).init(gameWorld.width / 2 - 640 * i, gameWorld.height / 2 + 60, Resources.continents));
    continents.blend = "source-atop";
    continents.addBehavior(Velocity);
    continents.velocity = {x: 5, y: 0};
    continents.addBehavior(Wrap, {min: {x: gameWorld.width / 2 - continents.w, y: 0}, max: {x: gameWorld.width / 2 + continents.w, y: gameWorld.height}})
  }

  var shadow = parallax.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60, Resources.shadow));
  shadow.blend = "source-atop";


	for (var i = 0; i < 15; i++) {
		//var cloud = bg.add(Object.create(Entity).init(planet.x + randint(-80, 80), planet.y + randint(-80, 80), randint(160, 240), randint(1,5)));
		var cloud = parallax.add(Object.create(Sprite).init(planet.x + randint(-planet.w / 2, planet.w / 2), planet.y + randint(-planet.h / 2, planet.h / 2), Resources.clouds));
    cloud.animation = randint(0,2);
    cloud.color = "white";
		cloud.opacity = Math.random() * 0.5 + 0.5;
		cloud.addBehavior(Velocity);
		cloud.addBehavior(Wrap, {min: {x: planet.x - 160, y: 0}, max: {x: planet.x + 160, y: gameWorld.height * 2}});
		cloud.velocity = {x: randint(5,30), y: 0};
	}*/
	
	//var silo = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 -100, Resources.silo));
	//silo.addBehavior(Silo);
	//silo.family = "enemy";
	
  
	/*gameWorld.shop.family = "store";
	gameWorld.shop.setCollision(Polygon);
  gameWorld.shop.setVertices([
    {x: -14, y: -6},
    {x: 0, y: -14},
    {x: 14, y: -6},
    {x: 0, y: 14}
    ])
	*/

	//this.player_top = fg.add(Object.create(Sprite).init(gameWorld.width / 4, gameWorld.height / 4, Resources.viper));
  //var p = this.player_top;
  var player_bot = bg.add(Object.create(Sprite).init(gameWorld.width / 4, gameWorld.height / 4, Resources.viper));
  player_bot.color = "red";
  player_bot.setCollision(Polygon);
	player_bot.damage = player_bot.addBehavior(Damage, {layer: bg, timer: 0, invulnerable: 1});
	//player_bot.shoot = Weapons.double;
	player_bot.move = Movement.standard;

	player_bot.addBehavior(Accelerate);
	player_bot.addBehavior(Velocity);
  player_bot.velocity = {x: 0, y: 0};
  player_bot.acceleration = {x: 0, y: 0};
  player_bot.opacity = 1;
	player_bot.health = MAXHEALTH;
	
	//player_bot.addBehavior(Space, {cooldown: 0, rate: 1.5, target: planet, radius: 240, damage: 1});
  player_bot.addBehavior(Bound, {min: {x: 6, y: -gameWorld.height * 5}, max: {x: gameWorld.width - 6, y: 5 * gameWorld.height}});
  //player_bot.addBehavior(BoundDistance, {target: planet, max: 160, min: 0, rate: 5, speed: 80, visible: true, color: "#ccc"});
	
	player_bot.salvage = 0;
  player_bot.family = "player";
  player_bot.collision.onHandle = function (object, other) {
		if (object.damage.timer > 0) return;
    if (other.family == "enemy") {
      if (!other.projectile && short_angle(angle(object.x, object.y, other.x, other.y), object.angle) < PI / 2 ) {
        // take no damage from the FRONT when it isn't a projectile...
      } else {
        var small = object.layer.add(Object.create(SpriteFont).init(object.x, object.y, Resources.expire_font, choose(["ow!", "oh no", ":(", "jeez", "ok.", "sorry."]), {spacing: -2, align: "center"}));
        if (randint(0,10) < 5) {					
					small.addBehavior(FadeOut, {duration: 1.5});
					small.addBehavior(Grow, {duration: 1, max: 2});
        } else {
					small.addBehavior(FadeOut, {duration: 1.5});
					small.addBehavior(Velocity);
					small.velocity = {x: 0, y: 0, angle: PI};
				}
				gameWorld.playSound(Resources.hit, volume(small));
        object.health -= 1;
  			object.damage.timer = DAMAGE_COOLDOWN;
      }
    }
		if (object.health <= 0) {
			object.alive = false;
			//p.alive = false;
      gameWorld.playSound(Resources.hit);
			gameWorld.setScene(0, true);
		}
  }

	gameWorld.shop = bg.add(Object.create(Sprite).init(gameWorld.width - 48, gameWorld.height / 2 + 60,  Resources.shop));
	gameWorld.shop.addBehavior(AI, {target: player_bot, rate: 5, value: 0});
	
  //player_bot.addBehavior(Follow, {target: p, offset: {angle: 0, x: false, y: false, z: false}});
	//this.player_top.addBehavior(Follow, {target: player_bot, offset: {angle: false, x: 0, y: 0, z: 0}});
	this.player_bot = player_bot;
  var t = this;

  //bg.camera.addBehavior(LerpFollow, {target: player_bot, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: 0}, rate: 2});  
  //fg.camera.addBehavior(Follow, {target: bg.camera, offset: {angle: false, x: 0, y: 0, z: 0}});
	bg.camera.addBehavior(Follow, {target: player_bot, offset: {x: false, y: -gameWorld.height / 2}});
  //bg.camera.addBehavior(Bound, {min: {x: -80, y: 0}, max: {x: gameWorld.width + 80, y: gameWorld.height}});
  fg.camera.addBehavior(Follow, {target: bg.camera, offset: {x: 0, y: 0}});
	//fg.camera.addBehavior(Bound, {min: {x: -80, y: 0}, max: {x: gameWorld.width + 80, y: gameWorld.height}}); 
  //parallax.camera.addBehavior(Bound, {min: {x: -80, y: 0}, max: {x: gameWorld.width + 80, y: gameWorld.height}}); 
/*  for (var i = 0; i < gameWorld.width / 32; i++) {
    bg.add(Object.create(Sprite).init(i * 32 + 16, 4, Resources.barrier));
  }*/  

  //this.claw = fg.add(Object.create(Sprite).init(gameWorld.width / 2, - gameWorld.height / 2, Resources.claw));
  //this.arm = fg.add(Object.create(Entity).init(gameWorld.width / 2, - gameWorld.height, 4, gameWorld.height));
  //this.arm.addBehavior(Follow, {target: this.claw, offset: {x: 0, y: -gameWorld.height / 2 - 6}});

  //this.store = Object.create(Store).init(this.ui, this.player_bot);
  //for (var i = 0; i < gameWorld.width / 4; i++) {
   // bg.add(Object.create(Sprite).init(i * 4 + 2, 2, Resources.barrier));
	/*
	var borders = [];
	borders.push(bg.add(Object.create(TiledBackground).init(-6, gameWorld.height / 2, 32, gameWorld.height, Resources.building2)));
  borders.push(bg.add(Object.create(TiledBackground).init(gameWorld.width + 6, gameWorld.height / 2, 32, gameWorld.height, Resources.building2)));
  borders.push(bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 4,gameWorld.width,8,Resources.ground)));
	borders.forEach(function (b) {
		b.obstacle = true;
  	b.setCollision(Polygon);  
  	b.solid = true;
	});*/

  this.bg = bg;
  this.fg = fg;
	
  this.keydown = false;
  this.pause = function () {
    this.bg.paused = true;
    this.player_bot.velocity = {x: 0, y: 0};
    this.player_bot.acceleration = {x: 0, y: 0};
    this.player_bot.animation = 0;
  }
  this.unpause = function () {
    this.bg.paused = false;
    this.fg.paused = false;
  }
  this.pause();
  
  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z !== a.z) return a.z - b.z;
      else return fg.entities.indexOf(a) - fg.entities.indexOf(b);
    });
  };
  bg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z !== a.z) return a.z - b.z;
      else return bg.entities.indexOf(a) - bg.entities.indexOf(b);
    });
  };
  var s = this;
	var down = function (e) {
		if (s.ui.active) {
			var b = s.ui.onButton(e.x, e.y);
			if (b) {
				b.trigger();
  			return;
      }
		} 
    if (!s.player_bot.locked && s.player_bot.stopped) {
      s.player_bot.move(s)
		}
    //console.log(s.player_bot.locked, s.player_bot.stopped);
	}
	var move = function (e) {
		if (s.ui.active) {
      var b = s.ui.onButton(e.x, e.y);
      if (b) {
        b.hover();
      }
      var buttons = s.ui.entities.filter( function (e) { return e.family == "button"; });
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i] != b && buttons[i].unhover) {
          buttons[i].unhover();
        }
      }
      //return;
    }
		if (!s.player_bot.locked) {
			//if (s.player_bot.velocity.x === 0 && s.player_bot.velocity.y === 0) {
				s.player_bot.angle = angle(s.player_bot.x - s.bg.camera.x, s.player_bot.y - s.bg.camera.y, e.x, e.y);
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
    [1,1,1,1,1],
		[2,2,2,3,3,3],
		[1,2,3,4,5,6,7],
		[7,7,7],
		[6,5,6,5,6,5],
		[4,4,4,4,4,4,4,4],
		[8,8],
		[1,2,3,8,8],
		[3,3,6,6,1,1],
		[2,2,4,5,6]
	];
	this.waves = [[2,2,2], [1,1,3,3]];

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
      this.entity.stopped = true;
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
			/*
      var landing_pad = this.bg.add(Object.create(Entity).init(gameWorld.shop.x - 18, gameWorld.shop.y + 12, 16, 16));
			landing_pad.z = 100;
			landing_pad.color = "gray", landing_pad.opacity = 0.5;
			landing_pad.setCollision(Polygon);
			landing_pad.collision.onHandle = function(object, other) {
				if (other.family == "player" && !other.projectile) {
					//console.log('what do you know.');
					other.locked = true;
					other.velocity = {x: 0, y: 0};
					other.acceleration = {x: 0, y: 0};
					object.alive = false;
					other.lerpx = other.addBehavior(Lerp, {object: other, field: "x", goal: landing_pad.x, rate: 5});
					other.lerpy = other.addBehavior(Lerp, {object: other, field: "y", goal: landing_pad.y, rate: 5, callback: function () {
						s.player_top.angle = 0;
						s.player_top.frame = 0;
						s.player_top.animation = 0;
						this.entity.removeBehavior(this.entity.lerpx);
						this.entity.removeBehavior(this.entity.lerpy);
						//console.log('ready to go?');
						gameWorld.scene.store.open();
					}});
				}
			}*/
		}
		
		var w = choose(this.waves);
		gameWorld.playSound(Resources[choose(["spawn"])]);
		for (var j = 0; j < w.length; j++) {
			var enemy = spawn(this.bg, w[j], this.player_bot);
			this.wave.push(enemy);
		}
	}
}