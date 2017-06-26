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
  b.color = "#ffffff";
  b.z = -10;
	
	bg.add(Object.create(TiledBackground).init(gameWorld.width / 2 - 25, gameWorld.height / 4 + 25, 250, 50 * 20, Resources.grid)).z = -8;
	
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

	bg.add(Object.create(TiledBackground).init(-8, gameWorld.height / 2, 32, gameWorld.height * 10, Resources.building2)).z = -7;
	bg.add(Object.create(TiledBackground).init(gameWorld.width + 8, gameWorld.height / 2, 32, gameWorld.height * 10, Resources.building2)).z = -7;
	
  var player_bot = bg.add(Object.create(Sprite).init(15 + 50, gameWorld.height / 4, Resources.viper));
  player_bot.color = "red";
  player_bot.setCollision(Polygon);
	player_bot.move = Movement.standard;
	player_bot.addBehavior(Accelerate);
	player_bot.addBehavior(Velocity);
  player_bot.velocity = {x: 0, y: 0};
  player_bot.acceleration = {x: 0, y: 0};
  player_bot.opacity = 1;
	player_bot.health = MAXHEALTH;
	player_bot.z = Z.entity;
  player_bot.addBehavior(Bound, {min: {x: 6, y: -gameWorld.height * 5}, max: {x: gameWorld.width - 6, y: 5 * gameWorld.height}});
	player_bot.salvage = 0;
  player_bot.family = "player";
  player_bot.collision.onHandle = function (object, other) {
		//if (object.damage.timer > 0) return;
    if (other.family == "enemy") {
      if (!other.projectile && short_angle(angle(object.x, object.y, other.x, other.y), object.angle) < PI / 2 ) {
        // take no damage from the FRONT when it isn't a projectile...
      } else {
        //var small = object.layer.add(Object.create(SpriteFont).init(object.x, object.y, Resources.expire_font, choose(["ow!", "oh no", ":(", "jeez", "ok.", "sorry."]), {spacing: -2, align: "center"}));
				/*small.z = Z.obstacle + 1;
        if (randint(0,10) < 5) {					
					small.addBehavior(FadeOut, {duration: 1.5});
					small.addBehavior(Grow, {duration: 1, max: 2});
        } else {
					small.addBehavior(FadeOut, {duration: 1.5});
					small.addBehavior(Velocity);
					small.velocity = {x: 0, y: 0, angle: PI};
				}*/
				gameWorld.playSound(Resources.hit);
        object.health -= 1;
				var expl = other.layer.add(Object.create(Sprite).init(other.x, other.y, Resources.explosion));
				expl.addBehavior(FadeOut, {duration: 0, delay: 0.8});
  			//object.damage.timer = DAMAGE_COOLDOWN;
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
	gameWorld.shop.opacity = 0;
	gameWorld.shop.addBehavior(AI, {target: player_bot, rate: 5, value: 0});

	this.player_bot = player_bot;
  var t = this;

	bg.camera.addBehavior(Follow, {target: player_bot, offset: {x: false, y: -gameWorld.height / 2}});
  fg.camera.addBehavior(Follow, {target: bg.camera, offset: {x: 0, y: 0}});
	
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
    [1,1,1,0,0,0], // learn to hit where you need to
    [2,2,2,2], // learn to close the distance
    [2,2,2,2,0,0,0,0,0], // learn to prioritize
    [5,5,5,0,0,0,0,1,1,1,1], // learn to anticipate
    [6, 6, 6, 6, 4, 4, 5],
		[6,6,7,7, 5, 5]
	];

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
			// store is open for business?
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