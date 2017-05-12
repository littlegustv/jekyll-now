var onStart = function () {
	if (!gameWorld.soundtrack) { 
    gameWorld.musicLoop = function () {
      gameWorld.soundtrack = gameWorld.playSound(Resources.salvage);
      gameWorld.soundtrack.onended = gameWorld.musicLoop;
    }
    //gameWorld.musicLoop();
  }
	
  var bg = this.addLayer(Object.create(Layer).init(320,240));
	bg.active = true;
  var fg = this.addLayer(Object.create(Layer).init(320,240));
	fg.active = true;
	
	bg.add(Object.create(Entity).init(0, 0, 10 * gameWorld.width, 10 * gameWorld.height)).color = "#222255";
	
	this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	
  var atmosphere = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60, Resources.atmosphere));
  atmosphere.z = -2;

  //bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height / 2, 10 * gameWorld.width, 10* gameWorld.height, Resources.bg)).z = -3;
	var planet = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60,  Resources.planet));
	planet.z = -1;
	planet.addBehavior(Velocity);
	
	var silo = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 -100, Resources.silo));
	silo.addBehavior(Silo);
	silo.family = "enemy";
	
//	bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 16, gameWorld.width, 64, Resources.silhouette)).opacity = 0.3;
	//planet.velocity = {x: 0, y: 0, angle: PI / 72};

	gameWorld.shop = bg.add(Object.create(Sprite).init(gameWorld.width / 2 + 80, gameWorld.height / 2 - 60,  Resources.shop));
	gameWorld.shop.family = "store";
	gameWorld.shop.setCollision(Polygon);
	
	// player is on foreground, can rotate when game is paused
	this.player_top = fg.add(Object.create(Sprite).init(gameWorld.width / 4, gameWorld.height / 4, Resources.viper));
  //this.player_top.family = "player";
  //this.player.addBehavior(Velocity);
  //this.player.addBehavior(Accelerate);
	//this.player.addBehavior(Contrail);
  //this.player.health = MAXHEALTH;

  //this.player.velocity = {x: 0, y: 0};
  //this.player.cooldown = 0;
	//this.player.salvage = 0;
  var p = this.player_top;
	//this.player.shoot = Weapons.double;
  var player_bot = bg.add(Object.create(Entity).init(p.x, p.y, p.w, p.h));
  player_bot.color = "red";
  player_bot.setCollision(Polygon);
	player_bot.damage = player_bot.addBehavior(Damage, {layer: bg, timer: 0, invulnerable: 1});
	player_bot.shoot = Weapons.double;
	
	player_bot.addBehavior(Accelerate);
	player_bot.addBehavior(Velocity);
  player_bot.velocity = {x: 0, y: 0};
  player_bot.acceleration = {x: 0, y: 0};
  player_bot.opacity = 0;
	player_bot.health = MAXHEALTH;
	
	player_bot.addBehavior(Space, {cooldown: 0, rate: 1.5, target: planet, radius: 320, damage: 1});
	
	player_bot.salvage = 0;
  player_bot.family = "player";
  player_bot.collision.onHandle = function (object, other) {
		if (object.damage.timer > 0) return;
    if (other.family == "enemy") {
      object.health -= 1;
			object.damage.timer = DAMAGE_COOLDOWN;
    }
		if (object.health <= 0) {
			object.alive = false;
			p.alive = false;
      gameWorld.playSound(Resources.hit);
			gameWorld.setScene(0, true);
		}
  }

  //player_bot.addBehavior(Follow, {target: p, offset: {angle: 0, x: false, y: false, z: false}});
	this.player_top.addBehavior(Follow, {target: player_bot, offset: {angle: false, x: 0, y: 0, z: 0}});
	this.player_bot = player_bot;
  var t = this;

  bg.camera.addBehavior(Follow, {target: t.player_top, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: false}});  
  fg.camera.addBehavior(Follow, {target: t.player_top, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: false}});

  //bg.camera.addBehavior(Bound, {min: {x: -160, y: -160}, max: {x: gameWorld.width + 160, y: gameWorld.height + 160}});
  //fg.camera.addBehavior(Bound, {min: {x: -160, y: -160}, max: {x: gameWorld.width + 160, y: gameWorld.height + 160}});	
/*  for (var i = 0; i < gameWorld.width / 32; i++) {
    bg.add(Object.create(Sprite).init(i * 32 + 16, 4, Resources.barrier));
  }*/  

  this.claw = fg.add(Object.create(Sprite).init(gameWorld.width / 2, - gameWorld.height / 2, Resources.claw));
  this.arm = fg.add(Object.create(Entity).init(gameWorld.width / 2, - gameWorld.height, 4, gameWorld.height));
  this.arm.addBehavior(Follow, {target: this.claw, offset: {x: 0, y: -gameWorld.height / 2 - 6}});

  this.store = Object.create(Store).init(this.ui, this.player_bot);
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
  this.pause();
  
  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  };
  var s = this;
  this.onMouseMove = function (e) {
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
      return;
    }
		if (!s.player_top.locked) {
			//if (s.player_bot.velocity.x === 0 && s.player_bot.velocity.y === 0) {
				s.player_top.angle = angle(gameWorld.width / 2, gameWorld.height / 2, e.x, e.y);
			//}
		}
  }
  this.onMouseUp = function (e) {
		return;
  }
  this.onMouseDown = function (e) {
		if (s.ui.active) {
			var b = s.ui.onButton(e.x, e.y);
			if (b) {
				b.trigger();
			}
			return;
		} else if (!s.player_bot.locked && s.bg.paused != 0) {
      s.bg.paused = false;
      s.fg.paused = false;
			s.player_bot.angle = s.player_top.angle;
      s.player_bot.animation = 1;
      s.player_bot.velocity = {
        x: Math.cos( s.player_bot.angle) * 100,
        y: Math.sin( s.player_bot.angle) * 100
      }
      s.player_bot.acceleration = {
        x: -s.player_bot.velocity.x,
        y: -s.player_bot.velocity.y
      }
      // create contrail sprite
      gameWorld.playSound(Resources.move);  
      var d = s.player_bot.layer.add(Object.create(Sprite).init(s.player_bot.x, s.player_bot.y, Resources.dust));
      d.addBehavior(Velocity);
      d.velocity = {x: -s.player_bot.velocity.x / 2, y: -s.player_bot.velocity.y / 2};
      d.addBehavior(FadeOut, {duration: 0.8});
			s.player_bot.delay.set();
		}
  }
  this.onKeyPress = function (e) {
		if (!s.player_bot.locked) {
			if (e.keyCode == 122) {
				if (s.bg.paused <= 0) return;
				else {
					s.bg.paused = false;      
					s.fg.paused = false;
					s.player_bot.angle = s.player_top.angle;
					var delay = s.player_bot.shoot(s.bg)
  				var flash = s.bg.add(Object.create(Sprite).init(s.player_bot.x + 9 * Math.cos(s.player_bot.angle),
          s.player_bot.y + 9 * Math.sin(s.player_bot.angle), Resources.flash));
          flash.opacity = 0;
          flash.addBehavior(FadeIn, {duration: 0.1, maxOpacity: 1});
          flash.addBehavior(FadeOut, {maxOpacity: 1, duration: 0.1, delay: 0.2});
          flash.z = -1;
					s.player_bot.delay.set(delay);
				}
			}			
		}
  }
	/*
  this.onTouchStart = function (e) {			
    s.pause();
	}
  this.onTouchEnd = function (e) {
		if (!fullscreen) {
			requestFullScreen();
			return;
		}
    s.bg.paused = 0;
		s.fg.paused = 0;      
    s.player.velocity = {
      x: Math.cos( s.player.angle) * 100,
      y: Math.sin( s.player.angle) * 100
    }
  }
  this.onTouchMove = function (e) {
    s.player.angle = angle(s.player.x, s.player.y, e.x, e.y);
  }*/
	this.wave = [];
	this.current_wave = 0;
	this.waves = [
		[1,1,1,1,1],
		[2,2,2,3,3,3],
		[1,2,3,4,5,6,7],
		[7,7,7],
		[6,5,6,5,6,5],
		[4,4,4,4,4,4,4,4]
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
      s.pause();
    }});
    this.entity.removeBehavior(this.entity.lerp);
    this.entity.removeBehavior(this.entity.lerpx);
    this.entity.removeBehavior(this.entity.lerpy);
		
	  s.bg.camera.addBehavior(Follow, {target: s.player_bot, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: 0}});  
  	s.fg.camera.addBehavior(Follow, {target: s.player_bot, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: 0}});

    console.log('what?');
  }});
}
var onUpdate = function (dt) {
  
  if (this.intro) return; // for now...

	for (var i = 0; i < this.wave.length; i++) {
		if (!this.wave[i].alive) this.wave.splice(i, 1);
	}
	
  if (!this.bg.paused && this.wave.length <= 0) {
		console.log('new wave');
		this.current_wave += 1;
		if (this.current_wave % 2 === 1) {
			var landing_pad = this.bg.add(Object.create(Entity).init(gameWorld.shop.x - 18, gameWorld.shop.y + 12, 16, 16));
			landing_pad.z = 100;
			landing_pad.color = "gray", landing_pad.opacity = 0.5;
			landing_pad.setCollision(Polygon);
			landing_pad.collision.onHandle = function(object, other) {
				console.log('collided');
				if (other.family == "player" && !other.projectile) {
					console.log('what do you know.');
					other.locked = true;
					other.velocity = {x: 0, y: 0};
					other.acceleration = {x: 0, y: 0};
					object.alive = false;
					other.lerpx = other.addBehavior(Lerp, {object: other, field: "x", goal: landing_pad.x, rate: 5});
					other.lerpy = other.addBehavior(Lerp, {object: other, field: "y", goal: landing_pad.y, rate: 5, callback: function () {
						this.entity.removeBehavior(this.entity.lerpx);
						this.entity.removeBehavior(this.entity.lerpy);
						console.log('ready to go?');
						gameWorld.scene.store.open();
					}});
				}
			}
		}
		
		var w = choose(this.waves);
		gameWorld.playSound(Resources[choose(["spawn", "spawn2"])]);
		for (var j = 0; j < w.length; j++) {
			var enemy = spawn(this.bg, w[j], this.player_bot);
			this.wave.push(enemy);
		}
	}
}