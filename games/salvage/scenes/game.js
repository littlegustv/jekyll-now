var onStart = function () {
	if (!gameWorld.soundtrack) { 
    gameWorld.musicLoop = function () {
      gameWorld.soundtrack = gameWorld.playSound(Resources[choose(["salvagetheme", "salvagetheme2"])]);
      gameWorld.soundtrack.onended = gameWorld.musicLoop;
    }
    gameWorld.musicLoop();
  }
	
  var bg = this.addLayer(Object.create(Layer).init(320,240));
	bg.active = true;
  var fg = this.addLayer(Object.create(Layer).init(320,240));
	fg.active = true;
	
	this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	create_store(this.ui);
		
  bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height / 2, 10 * gameWorld.width, 10* gameWorld.height, Resources.bg));
	var planet = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 80, Resources.planet));

	this.player = fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2,Resources.viper));
  this.player.family = "player";
  this.player.addBehavior(Velocity);
  this.player.health = 25;

  this.player.velocity = {x: 0, y: 0};
  this.player.cooldown = 0;
	this.player.salvage = 0;
  var p = this.player;
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
      //p.health -= 1;
    }

    if (p.health <= 0) {
      p.alive = false;
      gameWorld.playSound(Resources.hit);
			gameWorld.setScene(0, true);
    }
  }
  player_dummy.addBehavior(Follow, {target: p, offset: {angle: 0, x: 0, y: 0, z: 0}});
  
	var borders = [];
  borders.push(bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 4,gameWorld.width,8,Resources.ground)));
	borders.push(bg.add(Object.create(TiledBackground).init(-12, gameWorld.height / 2, 32, gameWorld.height, Resources.building2)));
  borders.push(bg.add(Object.create(TiledBackground).init(gameWorld.width + 12, gameWorld.height / 2, 32, gameWorld.height, Resources.building2)));
	borders.forEach(function (b) {
		b.obstacle = true;
  	b.setCollision(Polygon);  
  	b.solid = true;
	});
  
  bg.add(Object.create(Entity).init(160, 220, 320, 20));
  this.bg = bg;
  
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
  }
  var s = this;
  this.onMouseMove = function (e) {
		if (s.ui.active) return;
    if (s.player.velocity.x === 0 && s.player.velocity.y === 0) {
      s.player.angle = angle(this.player.x, this.player.y, e.x, e.y) ;
    }
  }
  this.onMouseUp = function (e) {
		if (s.ui.active) return;
    s.player.velocity = {x: 0, y: 0};
    if (s.player.cooldown <= 0) {
      s.pause();
    }
  }
  this.onMouseDown = function (e) {
		if (s.ui.active) {
			var b = s.ui.onButton(e.x, e.y);
			if (b) {
				b.trigger();
			}
			return;
		}
		s.bg.paused = 0;
    s.player.animation = 1;
    s.player.velocity = {
      x: Math.cos( s.player.angle) * 100,
      y: Math.sin( s.player.angle) * 100
    }
		//console.log(s.player.velocity);
  }
  this.onKeyPress = function (e) {
    if (e.keyCode == 122) {
      if (s.player.cooldown <= 0) {
        s.bg.paused = 0;
        var a = s.bg.add(Object.create(Sprite).init(s.player.x, s.player.y, Resources.projectile));
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
        a.velocity = {x: 100 * Math.cos(s.player.angle), y: 100 * Math.sin(s.player.angle)};
        s.player.cooldown = 0.3;
      }
    }
  }
  this.onTouchStart = function (e) {

		if (!fullscreen) requestFullScreen();
    s.pause();
	}
  this.onTouchEnd = function (e) {
    s.bg.paused = 0;
    s.player.velocity = {
      x: Math.cos( s.player.angle) * 100,
      y: Math.sin( s.player.angle) * 100
    }
  }
  this.onTouchMove = function (e) {
    s.player.angle = angle(this.player.x, this.player.y, e.touch.x, e.touch.y) ;
  }
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
		if (this.current_wave % 3 === 0) {
			open_store(this.ui);
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