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
	
	this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	
  bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height / 2, 10 * gameWorld.width, 10* gameWorld.height, Resources.bg)).z = -2;
	var planet = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60,  Resources.planet));
	planet.z = -1;
	planet.addBehavior(Velocity);
	
	bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 16, gameWorld.width, 64, Resources.silhouette)).opacity = 0.3;
	//planet.velocity = {x: 0, y: 0, angle: PI / 72};

	// player is on foreground, can rotate when game is paused
	this.player_top = fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2,Resources.viper));
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
	player_bot.delay = player_bot.addBehavior(Delay, {duration: 1, remove: false, callback: function () {
		this.entity.velocity = {x: 0, y: 0};
		this.entity.acceleration = {x: 0, y: 0};
		s.pause();
	}});

  //player_bot.addBehavior(Follow, {target: p, offset: {angle: 0, x: false, y: false, z: false}});
	this.player_top.addBehavior(Follow, {target: player_bot, offset: {angle: false, x: 0, y: 0, z: 0}});
	this.player_bot = player_bot;
	
  this.claw = fg.add(Object.create(Sprite).init(gameWorld.width / 2, - gameWorld.height / 2, Resources.claw));
  this.arm = fg.add(Object.create(Entity).init(gameWorld.width / 2, - gameWorld.height, 4, gameWorld.height));
  this.arm.addBehavior(Follow, {target: this.claw, offset: {x: 0, y: -gameWorld.height / 2 - 6}});

	this.store = Object.create(Store).init(this.ui, this.player_bot);
  for (var i = 0; i < gameWorld.width / 4; i++) {
    bg.add(Object.create(Sprite).init(i * 4 + 2, 2, Resources.barrier));
  }  
	
	var borders = [];
	borders.push(bg.add(Object.create(TiledBackground).init(-6, gameWorld.height / 2, 32, gameWorld.height, Resources.building2)));
  borders.push(bg.add(Object.create(TiledBackground).init(gameWorld.width + 6, gameWorld.height / 2, 32, gameWorld.height, Resources.building2)));
  borders.push(bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 4,gameWorld.width,8,Resources.ground)));
	borders.forEach(function (b) {
		b.obstacle = true;
  	b.setCollision(Polygon);  
  	b.solid = true;
	});

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
				s.player_top.angle = angle(s.player_top.x, s.player_top.y, e.x, e.y);
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
	]
}
var onUpdate = function (dt) {
  
	for (var i = 0; i < this.wave.length; i++) {
		if (!this.wave[i].alive) this.wave.splice(i, 1);
	}
  if (!this.bg.paused && this.wave.length <= 0) {
		console.log('new wave');
		this.current_wave += 1;
		if (this.current_wave % 2 === 0) {
      var t = this;
      t.bg.paused = true;
			t.player_bot.locked = true;
			t.player_bot.velocity = {x: 0, y: 0};
			t.player_bot.acceleration = {x: 0, y: 0};
      this.claw.lerpx = this.claw.addBehavior(Lerp, {object: this.claw, field: "x", goal: this.player_bot.x, rate: 5});
      this.claw.lerpy = this.claw.addBehavior(Lerp, {object: this.claw, field: "y", goal: this.player_bot.y, rate: 5, callback: function () {
        t.claw.animation = 1;
        t.claw.removeBehavior(t.claw.lerpx);
        t.claw.removeBehavior(t.claw.lerpy);
        t.player_bot.grabbed = t.player_bot.addBehavior(Follow, {target: t.claw, offset: {x: 0, y: 0}});
        t.player_top.grabbed = t.player_top.addBehavior(Follow, {target: t.claw, offset: {x: 0, y: 0}});
        t.claw.lerpx = t.claw.addBehavior(Lerp, {object: t.claw, field: "x", goal: 3 * gameWorld.width / 4, rate: 5});
        t.claw.lerpy = t.claw.addBehavior(Lerp, {object: t.claw, field: "y", goal: gameWorld.height / 3, rate: 5, callback: function () {
    			t.store.open();
        	t.claw.removeBehavior(t.claw.lerpx);
        	t.claw.removeBehavior(t.claw.lerpy);
					// player jumps back to previous position here; but no matter, this whole store-open trigger is going to change, right? FIX ME!
          t.player_bot.removeBehavior(t.player_bot.grabbed);
          t.player_top.removeBehavior(t.player_top.grabbed);
        }});
      }})
      gameWorld.playSound(Resources.store);
		} else {
			var w = choose(this.waves);
			gameWorld.playSound(Resources[choose(["spawn", "spawn2"])]);
			for (var j = 0; j < w.length; j++) {
				var enemy = spawn(this.bg, w[j], this.player_bot);
				this.wave.push(enemy);
			}
		}
	}
}