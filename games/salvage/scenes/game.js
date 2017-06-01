var onStart = function () {
	if (!gameWorld.soundtrack) { 
    gameWorld.musicLoop = function () {
      gameWorld.soundtrack = gameWorld.playSound(Resources.salvage);
      gameWorld.soundtrack.onended = gameWorld.musicLoop;
    }
    //gameWorld.musicLoop();
  }
	
  var bg = this.addLayer(Object.create(Layer).init(240,320));
	bg.active = true;
  var fg = this.addLayer(Object.create(Layer).init(240,320));
	fg.active = true;
	
	var b = bg.add(Object.create(Entity).init(0, 0, 10 * gameWorld.width, 10 * gameWorld.height));
  b.color = "#C13160";
  b.z = -6;
	
	for (var i = 0; i < 100; i++) {
		bg.add(Object.create(Entity).init(randint(0, gameWorld.width * 2), randint(0, gameWorld.height * 2), 1, 1)).color = "white";
	}
	
	this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
	
	var atmosphere = bg.add(Object.create(Atmosphere).init(gameWorld.width / 2, gameWorld.height / 2 + 60, 240, 2, PI / 8, "#e91e63"));
	atmosphere.addBehavior(Velocity);
	atmosphere.velocity = {x: 0, y: 0, angle: PI / 180};
	atmosphere.addBehavior(Oscillate, {object: atmosphere, field: "amplitude", initial: 2, constant: 1, rate: 4});
	atmosphere.z = -5;
	
	// smaller
  //var atmosphere = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60, Resources.atmosphere));
	var atmosphere = bg.add(Object.create(Atmosphere).init(gameWorld.width / 2, gameWorld.height / 2 + 60, 236, 2, PI / 2, "white"));
	atmosphere.addBehavior(Velocity);
	atmosphere.angle = Math.random() * PI2;
	atmosphere.velocity = {x: 0, y: 0, angle: PI / 180};
	atmosphere.addBehavior(Oscillate, {object: atmosphere, field: "amplitude", initial: 2, constant: 1, rate: 4});
	atmosphere.z = -4;

  var planet = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 + 60,  Resources.planet));
	planet.z = -3;
	planet.addBehavior(Velocity);
	
	for (var i = 0; i < 15; i++) {
		//var cloud = bg.add(Object.create(Entity).init(planet.x + randint(-80, 80), planet.y + randint(-80, 80), randint(160, 240), randint(1,5)));
		var cloud = bg.add(Object.create(Sprite).init(planet.x + randint(-planet.w / 2, planet.w / 2), planet.y + randint(-planet.h / 2, planet.h / 2), Resources.clouds));
    cloud.animation = randint(0,2);
    cloud.color = "white";
		cloud.opacity = Math.random() * 0.5 + 0.5;
		cloud.addBehavior(Velocity);
		cloud.addBehavior(Wrap, {min: {x: planet.x - 160, y: 0}, max: {x: planet.x + 160, y: gameWorld.height * 2}});
		cloud.velocity = {x: randint(5,30), y: 0};
	}
	
	//var silo = bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height / 2 -100, Resources.silo));
	//silo.addBehavior(Silo);
	//silo.family = "enemy";
	
	gameWorld.shop = bg.add(Object.create(Sprite).init(gameWorld.width / 2 + 80, gameWorld.height / 2 - 60,  Resources.shop));
	gameWorld.shop.family = "store";
	gameWorld.shop.setCollision(Polygon);
  gameWorld.shop.setVertices([
    {x: -14, y: -6},
    {x: 0, y: -14},
    {x: 14, y: -6},
    {x: 0, y: 14}
    ])
	
	this.player_top = fg.add(Object.create(Sprite).init(gameWorld.width / 4, gameWorld.height / 4, Resources.viper));
  var p = this.player_top;
  var player_bot = bg.add(Object.create(Entity).init(p.x, p.y, p.w, p.h));
  player_bot.color = "red";
  player_bot.setCollision(Polygon);
	player_bot.damage = player_bot.addBehavior(Damage, {layer: bg, timer: 0, invulnerable: 1});
	//player_bot.shoot = Weapons.double;
	player_bot.move = Movement.standard;

	player_bot.addBehavior(Accelerate);
	player_bot.addBehavior(Velocity);
  player_bot.velocity = {x: 0, y: 0};
  player_bot.acceleration = {x: 0, y: 0};
  player_bot.opacity = 0;
	player_bot.health = MAXHEALTH;
	
	player_bot.addBehavior(Space, {cooldown: 0, rate: 1.5, target: planet, radius: 240, damage: 1});
	
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

  //bg.camera.addBehavior(LerpFollow, {target: player_bot, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: 0}, rate: 2});  
  //fg.camera.addBehavior(Follow, {target: bg.camera, offset: {angle: false, x: 0, y: 0, z: 0}});

  //bg.camera.addBehavior(Bound, {min: {x: -160, y: -160}, max: {x: gameWorld.width + 160, y: gameWorld.height + 160}});
  //fg.camera.addBehavior(Bound, {min: {x: -160, y: -160}, max: {x: gameWorld.width + 160, y: gameWorld.height + 160}});	
/*  for (var i = 0; i < gameWorld.width / 32; i++) {
    bg.add(Object.create(Sprite).init(i * 32 + 16, 4, Resources.barrier));
  }*/  

  //this.claw = fg.add(Object.create(Sprite).init(gameWorld.width / 2, - gameWorld.height / 2, Resources.claw));
  //this.arm = fg.add(Object.create(Entity).init(gameWorld.width / 2, - gameWorld.height, 4, gameWorld.height));
  //this.arm.addBehavior(Follow, {target: this.claw, offset: {x: 0, y: -gameWorld.height / 2 - 6}});

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
      else return fg.entities.indexOf(a) - fg.entities.indexOf(b);
    });
  };
  bg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else return bg.entities.indexOf(a) - bg.entities.indexOf(b);
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
      s.player_bot.move(s)
		}
  }

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
//	this.waves = [[8]];

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
		
	  s.bg.camera.addBehavior(LerpFollow, {target: s.player_bot, offset: {angle: false, x: -gameWorld.width / 2, y: -gameWorld.height / 2, z: 0}, rate: 2});  
  	s.fg.camera.addBehavior(Follow, {target: s.bg.camera, offset: {angle: false, x: 0, y: 0, z: 0}});
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
		
  if (!this.bg.paused && this.wave.length <= 0) {
		console.log('new wave');
		this.current_wave += 1;
		if (this.current_wave % 2 === 1) {
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