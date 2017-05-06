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

	this.player = fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2,Resources.viper));
  this.player.family = "player";
  this.player.addBehavior(Velocity);
  this.player.addBehavior(Accelerate);
	//this.player.addBehavior(Contrail);
  this.player.health = MAXHEALTH;

  this.claw = fg.add(Object.create(Sprite).init(gameWorld.width / 2, - gameWorld.height / 2, Resources.claw));
  this.arm = fg.add(Object.create(Entity).init(gameWorld.width / 2, - gameWorld.height, 4, gameWorld.height));
  this.arm.addBehavior(Follow, {target: this.claw, offset: {x: 0, y: -gameWorld.height / 2 - 6}});

	this.store = Object.create(Store).init(this.ui, this.player);
  this.player.velocity = {x: 0, y: 0};
  this.player.cooldown = 0;
	this.player.salvage = 0;
  var p = this.player;
	this.player.shoot = Weapons.double;
  var player_dummy = bg.add(Object.create(Entity).init(p.x, p.y, p.w, p.h));
  player_dummy.color = "red";
  player_dummy.setCollision(Polygon);
	player_dummy.damage = this.player.addBehavior(Damage, {layer: bg, timer: 0, invulnerable: 1});

  player_dummy.velocity = {x: 0, y: 0};
  player_dummy.acceleration = {x: 0, y: 0};
  player_dummy.opacity = 0;
  player_dummy.family = "player";
  player_dummy.collision.onHandle = function (object, other) {
    if (other.family == "enemy") {
      object.health -= 1;
			object.cooldown = DAMAGE_COOLDOWN;
    }

    if (p.health <= 0) {
      p.alive = false;
      gameWorld.playSound(Resources.hit);
			gameWorld.setScene(0, true);
    }
  }
  player_dummy.addBehavior(Follow, {target: p, offset: {angle: 0, x: 0, y: 0, z: 0}});
	
  for (var i = 0; i < gameWorld.width / 32; i++) {
    bg.add(Object.create(Sprite).init(i * 32 + 16, 4, Resources.barrier));
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
    this.bg.paused = 10000;
    this.player.velocity = {x: 0, y: 0};
    this.player.animation = 0;
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
		if (!s.player.locked) {
			if (s.player.velocity.x === 0 && s.player.velocity.y === 0) {
				s.player.angle = angle(s.player.x, s.player.y, e.x, e.y);
			}
		}
  }
  this.onMouseUp = function (e) {
		return;
    if (!s.player.locked) {
			s.player.velocity = {x: 0, y: 0};
			if (s.player.cooldown <= 0) {
				s.pause();
			}
		}
  }
  this.onMouseDown = function (e) {
		if (s.ui.active) {
			var b = s.ui.onButton(e.x, e.y);
			if (b) {
				b.trigger();
			}
			return;
		} else if (!s.player.locked) {
      s.bg.paused = 0;
      s.fg.paused = 0;
      s.player.animation = 1;
      //s.player.cooldown = 1;
      s.player.velocity = {
        x: Math.cos( s.player.angle) * 100,
        y: Math.sin( s.player.angle) * 100
      }
      s.player.acceleration = {
        x: -s.player.velocity.x,
        y: -s.player.velocity.y
      }
      // create contrail sprite
      gameWorld.playSound(Resources.move);  
      var d = s.player.layer.add(Object.create(Sprite).init(s.player.x, s.player.y, Resources.dust));
      d.addBehavior(Velocity);
      d.velocity = {x: -s.player.velocity.x / 2, y: -s.player.velocity.y / 2};
      d.addBehavior(FadeOut, {duration: 0.8});

      s.player.addBehavior(Delay, {duration: 1, callback: function () {
        this.entity.velocity = {x: 0, y: 0};
        this.entity.acceleration = {x: 0, y: 0};
        s.pause();
      }});
		}
  }
  this.onKeyPress = function (e) {
		if (!s.player.locked) {
			if (e.keyCode == 122) {
				if (s.player.shoot(s.bg)) {
  				var flash = s.bg.add(Object.create(Sprite).init(s.player.x + 9 * Math.cos(s.player.angle),
            s.player.y + 9 * Math.sin(s.player.angle), Resources.flash));
          flash.opacity = 0;
          flash.addBehavior(FadeIn, {duration: 0.1, maxOpacity: 1});
          flash.addBehavior(FadeOut, {maxOpacity: 1, duration: 0.1, delay: 0.2});
          flash.z = -1;
          s.bg.paused = 0;      
  				s.fg.paused = 0;
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
  // should convert this into behavior, eventually
  if (this.bg.paused === 0) {
    if (this.player.cooldown >= 0) {
      this.player.cooldown -= dt;
    } else if (this.player.cooldown > -1) {
      if (this.player.velocity.x === 0 && this.player.velocity.y === 0) {
        this.pause();  
      }
      this.player.cooldown = -1;
      //this.player.cooldown = 0.3;
    }      
  }
	for (var i = 0; i < this.wave.length; i++) {
		if (!this.wave[i].alive) this.wave.splice(i, 1);
	}
  if (this.bg.paused === 0 && this.wave.length <= 0) {
		console.log('new wave');
		this.current_wave += 1;
		if (this.current_wave % 2 === 0) {
      var t = this;
      t.bg.paused = 10000;
			t.player.locked = true;
			t.player.velocity = {x: 0, y: 0};
      this.claw.lerpx = this.claw.addBehavior(Lerp, {object: this.claw, field: "x", goal: this.player.x, rate: 5});
      this.claw.lerpy = this.claw.addBehavior(Lerp, {object: this.claw, field: "y", goal: this.player.y, rate: 5, callback: function () {
        t.claw.animation = 1;
        t.claw.removeBehavior(t.claw.lerpx);
        t.claw.removeBehavior(t.claw.lerpy);
        t.player.grabbed = t.player.addBehavior(Follow, {target: t.claw, offset: {x: 0, y: 0}});
        t.claw.lerpx = t.claw.addBehavior(Lerp, {object: t.claw, field: "x", goal: 3 * gameWorld.width / 4, rate: 5});
        t.claw.lerpy = t.claw.addBehavior(Lerp, {object: t.claw, field: "y", goal: gameWorld.height / 3, rate: 5, callback: function () {
    			t.store.open();
        	t.claw.removeBehavior(t.claw.lerpx);
        	t.claw.removeBehavior(t.claw.lerpy);
          t.player.removeBehavior(t.player.grabbed);
        }});
      }})
      gameWorld.playSound(Resources.store);
		} else {
			var w = choose(this.waves);
			gameWorld.playSound(Resources[choose(["spawn", "spawn2"])]);
			for (var j = 0; j < w.length; j++) {
				var enemy = spawn(this.bg, w[j], this.player);
				this.wave.push(enemy);
			}
		}
	}
}