/* global Resources, Layer, gameWorld, MAXHEALTH, Entity, TiledBackground, Sprite, SpriteFont */
var onStart = function () {
  this.wave = [];
  
  Resources.music = Resources.soundtrack;
  
  var bg = this.addLayer(Object.create(Layer).init(1000,1000));
  bg.active = true;

  var player_coordinates = toGrid(MIN.x + 4 * TILESIZE, MIN.y + 2 * TILESIZE);
  var player = bg.add(Object.create(Sprite).init(player_coordinates.x, player_coordinates.y, Resources.viper));

  var b = bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  b.color = "black";
  b.z = -10;
  
  var grid = bg.add(Object.create(TiledBackground).init(MIN.x, MIN.y, 2 * Math.ceil(WIDTH / TILESIZE) * TILESIZE, 2 * Math.ceil(1 + HEIGHT / TILESIZE) *  TILESIZE, Resources.grid));
  grid.z = -9;

  var cover = bg.add(Object.create(Entity).init(gameWorld.width / 2, MIN.y / 2 - 2, gameWorld.width, MIN.y - 4));
  cover.z = -8;
  cover.color = "black";

  var skyline = bg.add(Object.create(TiledBackground).init(WIDTH / 2, MAX.y + 12, WIDTH + 6, 16, Resources.skyline));
  skyline.z = 25;
  skyline.solid = true;
  skyline.setCollision(Polygon);

  var ground = bg.add(Object.create(TiledBackground).init(WIDTH / 2, MAX.y + 18, WIDTH + 6, 8, Resources.ground));
  ground.z = 26;

  var cover = bg.add(Object.create(Entity).init(WIDTH / 2, 8, WIDTH, 16));
  cover.z = 27;
  var cover = bg.add(Object.create(Entity).init(WIDTH / 2, HEIGHT - 5, WIDTH, 10));
  cover.z = 27;

  var ceiling = bg.add(Object.create(TiledBackground).init(WIDTH / 2, MIN.y - 16, WIDTH, 16, Resources.sky));
  ceiling.z = 26;

  var right = bg.add(Object.create(TiledBackground).init(MAX.x + 24, HEIGHT / 2, 32, HEIGHT, Resources.wall));
  right.z = 25.5;
  right.solid = true;
  right.setCollision(Polygon);

  /*var l1 = bg.add(Object.create(Entity).init(MIN.x / 2 - 8, MIN.y + TILESIZE - 12, MIN.x, TILESIZE * 2));
  l1.z = -6;

  var l2 = bg.add(Object.create(Entity).init(MIN.x / 2 - 8, MAX.y - TILESIZE + 12, MIN.x, TILESIZE * 2));
  l2.z = -6;

  var wall1 = bg.add(Object.create(TiledBackground).init(MIN.x / 2 - 8, MIN.y + 2 * TILESIZE - 36, MIN.x, 8, Resources.wall));
  wall1.z = -5.5;
  wall1.angle = PI;

  var wall2 = bg.add(Object.create(TiledBackground).init(MIN.x / 2 - 8, MAX.y - 2 * TILESIZE + 36, MIN.x, 8, Resources.wall));
  wall2.z = -5.5;*/

  var left = bg.add(Object.create(TiledBackground).init(16, HEIGHT / 2, 32, HEIGHT, Resources.wall));
  left.z = 25.5;
  //left.angle = PI / 2;
  //left.solid = true;
  //left.angle = PI / 2;
  //left.setCollision(Polygon);
  //var leftcover = bg.add(Object.create(Entity).init(MIN.x - 34, HEIGHT / 2, 48, HEIGHT));
  //leftcover.color = "black";
  //leftcover.z = -5;
  
  var gate = bg.add(Object.create(Sprite).init(16, (MIN.y + MAX.y) / 2, Resources.gate));
  gate.z = 26;

  this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  this.ui.active = true;

  this.health_bar = [];
  for (var i = 0.5; i < MAXHEALTH + 0.5; i++) {
    var h = this.ui.add(Object.create(Sprite).init(WIDTH / 2 - MAXHEALTH * 24 / 2 + i * 24, 16, Resources.heart));
    h.scale = 2;
    //h.follow = h.addBehavior(Follow, {target: player, offset: {x: 16 * Math.cos(i * PI / 4), y: 16 * Math.sin(PI + i * PI / 4), z: 1, angle: false}});
    //h.radius = 2;
    //h.addBehavior(Oscillate, {field: "x", object: h.follow.offset, initial: 0, constant: 16, time: i * PI / 5, func: "cos"});
    //h.addBehavior(Oscillate, {field: "y", object: h.follow.offset, initial: 0, constant: 16, time: PI + i * PI / 5});
    //h.strokeColor = "#DD0000";
    this.health_bar.push(h);
  }
  this.shield = bg.add(Object.create(Sprite).init(16 * (MAXHEALTH + 0.5), gameWorld.height - 8, Resources.shield));
  this.shield.addBehavior(Follow, {target: player, offset: {x: 0, y: 0, z: -1, angle: false, opacity: false}});
  player.shield_sprite = this.shield;

  player.cash_counter = this.ui.add(Object.create(SpriteFont).init(WIDTH + 8, 16, Resources.expire_font, "$ 0", {spacing: -2, align: "right"}));
  player.cash_counter.scale = 2;

  var s = this;
  this.updateHealthBar = function (object) {
    for (var i = 0; i < s.health_bar.length; i++) {
      if (i < object.health) {
        s.health_bar[i].animation = 0;
      } else if (i < MAXHEALTH) {
        s.health_bar[i].animation = 1;
      }
    }
    this.shield.opacity = Math.pow(object.shield, 2);
  };

  var menu_text = this.ui.add(Object.create(SpriteFont).init(36, 12, Resources.expire_font, "menu", {align: "center", spacing: -3}));
  var menu_button = this.ui.add(Object.create(Entity).init(36, 12, 64, 16));
  menu_button.family = "button";
  menu_text.scale = 2;
  menu_button.opacity = 0;
  menu_button.trigger = function () {
    if (s.bg.paused) {
      gameWorld.setScene(0, true);
      gameWorld.saved = true;
      gameWorld.playSound(Resources.select);
    }
  };
  menu_button.hover = function () {
    if (menu_text.scale != 2.2) gameWorld.playSound(Resources.hover);
    menu_text.scale = 2.2;
  };
  menu_button.unhover = function () {
    menu_text.scale = 2;
  };
  
  var mute_text = this.ui.add(Object.create(SpriteFont).init(100, 12, Resources.expire_font, "mute", {align: "center", spacing: -3}));
  var mute_button = this.ui.add(Object.create(Entity).init(100, 12, 48, 16));
  mute_button.family = "button";
  mute_text.scale = 2;
  mute_button.opacity = 0;
  if (gameWorld.muted) {
    mute_text.opacity = 0.8;
  }
  mute_button.trigger = function () {
    if (gameWorld.muted) {
      mute_text.opacity = 1;
      gameWorld.unmute();
    } else {
      mute_text.opacity = 0.8;
      gameWorld.mute();
    }
  };
  mute_button.hover = function () {
    if (mute_text.scale != 2.2) gameWorld.playSound(Resources.hover);
    mute_text.scale = 2.2;
  };
  mute_button.unhover = function () {
    mute_text.scale = 2;
  };

  player.setCollision(Polygon);
  player.move = Movement.standard;
  player.health = MAXHEALTH;
  player.shield = 0;
  // sprite object used to render shield up/down
  player.shield_sprite = this.shield;
  player.z = 50;
  player.salvage = 0;
  // movement settings
  player.speed = SPEEDS.player;
  player.distance = TILESIZE;
  player.noCollide = false;
  
  player.family = "player";
  player.stopped = function () {
    return !this.lerpx && !this.lerpy && !this.locked;
  };
  this.updateHealthBar(player);
  gameWorld.player = player;
  
  player.turn = function (angle) {
    this.angle = angle;
    switch (cardinal(angle)) {
      case 0:
        this.shield_sprite.offset = {x: 0, y: 0};
        break;
      case 1:
        this.shield_sprite.offset = {x: 0, y: 1};
        break;
      case 2:
        this.shield_sprite.offset = {x: 0, y: 1};
        break;
      case 3:
        this.shield_sprite.offset = {x: -1, y: 0};
        break;      
    }
  }
  player.collision.onHandle = function (object, other) {
    if (object.noCollide) return;
    
    if (other.family == "enemy") {
      if (other.projectile || other.beam) {
        other.beam = false;
        if (object.shield >= 1) {
          object.shield = 0;
          gameWorld.playSound(Resources.shield_down);
          var m = object.layer.add(Object.create(SpriteFont).init(object.x, object.y, Resources.expire_font, "shields down!", {spacing: -2, align: "center"}));
          m.addBehavior(Velocity);
          m.addBehavior(FadeOut, {delay: 0.5, duration: 0.2});
          m.velocity = {x: 0, y: 30, angle: PI / 12};
        } else {
          object.health -= 1;
          object.layer.camera.addBehavior(Shake, {duration: 1, min: -60, max: 60});
          object.animation = 1;
          object.addBehavior(Delay, {duration: 0.2, callback: function () {
            this.entity.animation = 0;
          }});
        }
        s.updateHealthBar(object);
        
      }
      // should this be JUST on projectile hit? probably, right! (invulnerability)
      object.noCollide = true;
      object.addBehavior(Delay, {duration: 0.5, callback: function () { this.entity.noCollide = false; }});
    }
    if (object.health <= 0) {
      object.die();
    }
  }
  player.die = function () {
    s.unpause();
    gameWorld.saved = false;
    this.collision.onCheck = function (a, b) { return false; };
    this.collision.onHandle = function (a, b) { return false; };
    s.pause = function () {};
    player.opacity = 0;
    player.removeBehavior(player.lerpx);
    player.removeBehavior(player.lerpy);
    player.death = player.addBehavior(Delay, {duration: 1.5, callback: function () {
      player.alive = false;
      player.death = undefined;
      if (gameWorld.boss.alive && gameWorld.boss.health >= boss.maxhealth) {
        gameWorld.ending = 0;
      } else if (gameWorld.boss.alive) {
        gameWorld.ending = 1;
      }
      gameWorld.setScene(2, true);
    }});

    for (var i = 0; i < 80; i++) {
      var d = this.layer.add(Object.create(Sprite).init(this.x, this.y, Resources.dust));
      d.addBehavior(Velocity);
      d.animation = 0;//choose([0, 1]);
      var theta = Math.random() * PI2;
      var speed = randint(3, 50);
      d.velocity = {x: speed * Math.cos(theta), y: speed * Math.sin(theta)};
      d.behaviors[0].onEnd = function () {
        this.entity.alive = false;
      };
    }

    gameWorld.playSound(Resources.hit);
    gameWorld.wave = 1;
  };
  this.player = player;
  
  this.store_layer = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  this.store_layer.active = false;
  console.log(player.speed);
  var store = Object.create(Store).init(this.store_layer, player);
  this.store = store;

  var t = this;
  // prevents 'shake' behavior from knocking camera out of bounds...
  bg.camera.addBehavior(Bound, {min: {x: 0, y:  0}, max: {x: WIDTH - gameWorld.width, y: HEIGHT - gameWorld.height}})

  this.bg = bg;
  
  this.keydown = false;
  this.pause = function () {
    if (this.player.stopped()) {

      var coords = toGrid(this.player.x, this.player.y);
      this.bg.paused = true;

      // open store
      if (gameWorld.boss.store_open) {
        var store_coords = toGrid(gameWorld.boss.store_open.x, gameWorld.boss.store_open.y);
        if (coords.y === store_coords.y && coords.x === store_coords.x) {
          s.store.open();
        }
      }
      // at gate
      if (coords.x === MIN.x && (coords.y == MIN.y + TILESIZE * 2 || coords.y == MIN.y + TILESIZE * 3)) {
        if (!player.hasFTL) {
          gate.animation = 0;
          gate.addBehavior(Delay, {duration: 1, callback: function () {
            this.entity.animation = 0;
            this.entity.removeBehavior(this);
          }});
          var warning = this.bg.add(Object.create(SpriteFont).init(gate.x + 2, gate.y - 10, Resources.expire_font, "DENIED", {spacing: -1, align: "center"}));
          warning.addBehavior(FadeOut, {duration: 0.5, delay: 0.5});
          gameWorld.playSound(Resources.denied);
        } else {
          var warning = this.bg.add(Object.create(SpriteFont).init(gate.x + 2, gate.y - 10, Resources.expire_font, "APPROVED", {spacing: -1, align: "center"}));
          warning.addBehavior(FadeOut, {duration: 0.5, delay: 0.5});
          cover.alive = false;
          gameWorld.playSound(Resources.approved);
          gate.animation = 1;
        }
      } 
      // through gate
      else if (coords.x <= MIN.x - 1 * TILESIZE) {
        if (gameWorld.boss.alive) {
          gameWorld.ending = 2;
        } else {
          gameWorld.ending = 3;
        }
        gameWorld.setScene(2, true);
      }

      // if wave is finished
      if (this.wave.length <= 0) {
        // remove last-wave's projectiles ?
        for (var i = 0; i < projectiles.length; i++) {
          if (projectiles[i].alive) {
            projectiles[i].alive = false;
            var f = projectiles[i].layer.add(Object.create(Circle).init(projectiles[i].x, projectiles[i].y, 5));
            f.color = COLORS.primary;
            f.addBehavior(FadeOut, {duration: 0.1, delay: 0.1});
          }
        }
        projectiles = [];
        // open store every OTHer wave
        var announcement = t.bg.add(Object.create(SpriteFont).init(MIN.x + 4 * TILESIZE + 8, gameWorld.height / 2, Resources.expire_font, "wave " + gameWorld.wave, {spacing: -3, align: "center"}));
        announcement.opacity = 0;
        announcement.addBehavior(FadeIn, {duration: 0.3, delay: 0, maxOpacity: 1});
        announcement.addBehavior(FadeOut, {duration: 0.3, delay: 0.5, maxOpacity: 1});
        announcement.scale = 2;

        for (var i = 0; i < gameWorld.wave; i++) {
          var k = i % this.waves.length;
          for (var j = 0; j < this.waves[k].length; j++) {
            var enemy = spawn(this.bg, this.waves[k][j], this.player);
            this.wave.push(enemy);            
          }
        }
        gameWorld.wave++;

        gameWorld.boss.boss.beam();
      }
    }
  }
  this.unpause = function () {
    this.bg.paused = false;
  };
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
    if (s.player.death) {
      s.player.death.duration = 0;
      return;
    } else if (s.player.stopped()) {
      s.player.turn(Math.round(angle(s.player.x - s.bg.camera.x, s.player.y - s.bg.camera.y, e.x, e.y) / (PI / 2)) * PI / 2);
      s.player.move(s);
    } else {
      s.player.buffer = Math.round(angle(s.player.x - s.bg.camera.x, s.player.y - s.bg.camera.y, e.x, e.y) / (PI / 2)) * PI / 2;
    }
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
    if (s.player.stopped()) {
      s.player.turn(Math.round(angle(s.player.x - s.bg.camera.x, s.player.y - s.bg.camera.y, e.x, e.y) / (PI / 2)) * PI / 2);
    }
  };
  
  var up = function (e) {
  };
  
  this.onMouseMove = move;
  this.onMouseUp = function (e) {
    return;
  }
  this.onMouseDown = down;
  
  this.onTouchStart = function (e) {
    if (!fullscreen) {
      requestFullScreen();
    } else {
      e.x = e.touch.x, e.y = e.touch.y;
      move(e);  
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

  var directions = {
    39: 0,
    40: PI / 2,
    37: PI,
    38: 3 * PI / 2
  }

  this.onKeyDown = function (e) {
    if (t.store.opened) {
      switch (e.keyCode) {
        case 13:
          t.store.go();
          break;
        case 40:
          t.store.up();
          break;
        case 38:
          t.store.down();
          break;
      }
    } else if (t.player.stopped()) {      
      switch (e.keyCode) {
        case 39:
          t.player.turn(0);
          break;
        case 40:
          t.player.turn(PI / 2);
          break;
        case 37:
          t.player.turn(PI);
          break;
        case 38:
          t.player.turn(3 * PI / 2);
          break;
        case 27:          
          menu_button.trigger();
          break;
        case 77:
          mute_button.trigger();
          break;
      }
      if ([37,38,39,40].indexOf(e.keyCode) !== -1) {
        t.player.move(t);
      }
    } else {
      t.player.buffer = directions[e.keyCode];
    }
  };
  
  this.waves = [
    [0, 0],
    [1],
    [2],
    [3],
    [4],
    [5],
    [6],
  ];
//  this.waves = [[6, 6]];

  //this.waves = [[2,2,2,2,2,2,2,2,2,2]];
//  this.waves = [[0,0,1,2,3,4,5,6]];

  //this.waves = [[6]];
  // this.waves = [[0], [], [], [], []];
  var boss_coordinates = toGrid(MIN.x + MAX.x / 2, MAX.y);
  var boss = this.bg.add(Object.create(Sprite).init(boss_coordinates.x - TILESIZE / 2, boss_coordinates.y, Resources.boss));
  boss.animation = 0;
  boss.offset = {x: 0, y: -16};
  boss.modules = [];
  //boss.angle = PI / 2;
  boss.z = 24;
  boss.particles = boss.addBehavior(Periodic, {period: 0.1, rate: 0, callback: function () {
    if (Math.random() < this.rate) {
      var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x + randint(0, this.entity.w) - this.entity.w / 2, this.entity.y + this.entity.offset.y + randint(-this.entity.h / 2, this.entity.h / 2), Resources.dust));
      d.z = this.entity.z + 1;
      d.behaviors[0].onEnd = function () {
        this.entity.alive = false;
      };
      d.addBehavior(Velocity);
      d.velocity = {x: 0, y: - 40};
    }
  }});

  boss.family = "neutral";
  
  boss.maxhealth = 10;
  boss.health = boss.maxhealth;
  /*boss.health_bar = [];
  for (var i = 0; i < boss.maxhealth; i++) {
    var h = bg.add(Object.create(Sprite).init(boss.x, boss.y, Resources.heart));
    var theta = (i / boss.maxhealth) * PI - PI / 2;
    h.follow = h.addBehavior(Follow, {target: boss, offset: {x: Math.cos(theta) * 24, y: Math.sin(theta) * 24, z: 1}});
    // fix me: improve pattern - decrease randomness, improve visibilty
    // NOTE: SHOULD only become visible after first collision, maybe?
    //h.addBehavior(Oscillate, {field: "x", object: h.follow.offset, initial: h.follow.offset.x, constant: randint(12, 20), time: i * PI / 5, func: "cos"});
    //h.addBehavior(Oscillate, {field: "y", object: h.follow.offset, initial: h.follow.offset.y, constant: randint(12, 20), time: PI + i * PI / 5});
    boss.health_bar.push(h);
  }*/
  
  boss.queue = [];
  boss.shoot_angle = 0;
  boss.respond = function (target) {
    if (this.health >= this.maxhealth) {}
    if (this.store_open) {
      this.store_open.alive = false;
    }
    else if (this.health >= this.maxhealth - 1) { // warning shot (DONE)
      this.shoot = Weapons.standard;
      var theta = angle(this.x, this.y, target.x, target.y), d = distance(this.x, this.y, target.x, target.y);      
      this.target = {x: this.x + d * Math.cos(theta + PI / 6), y: this.y + d * Math.sin(theta + PI / 6)};
      this.shoot(this.layer);
      this.target = {x: this.x + d * Math.cos(theta - PI / 6), y: this.y + d * Math.sin(theta - PI / 6)};
      this.shoot(this.layer);
      this.shoot = undefined;
    } else if (!this.enemy) {
      this.enemy = this.addBehavior(BossEnemy);
      this.family = "enemy";
      this.target = target;
    }
    if (!this.boss.goal) this.danger = true; // get moving if you are stopped, and just got hit!
    if (this.health <= 5) {
      this.unforgiving = true;
    }
  };
  
  boss.boss = boss.addBehavior(Boss, {duration: 0.5, speed: 70, rate: 4, target: player});
  boss.addBehavior(Bound, {min: MIN, max: MAX});
  boss.velocity = {x: 0, y: 0};
  boss.addBehavior(Velocity);
  boss.setCollision(Polygon);
  boss.setVertices([
    {x: -64, y: -32},
    {x: 64, y: -32},
    {x: 64, y: 32},
    {x: -64, y: 32}
  ])
  boss.collision.onHandle = function (object, other) {
    if (other.family == "player" && !gameWorld.boss.invulnerable) {
      object.health -= 1;
      object.particles.rate = 3 * (10 - object.health) / 10;
      gameWorld.boss.invulnerable = true;
      gameWorld.boss.respond(s.player);
      //gameWorld.boss.old_animation = gameWorld.boss.animation;
      gameWorld.boss.animation = 3;
      gameWorld.boss.addBehavior(Delay, {duration: 0.3, callback: function () { 
        this.entity.invulnerable = false;
        gameWorld.boss.animation = 3 - Math.floor(3 * this.entity.health / this.entity.maxhealth);
        console.log(gameWorld.boss.animation);
      }});
      if (object.health <= 0) {
        object.die();
      } else if (!other.projectile) {        
        var p = toGrid(other.x, other.y), b = toGrid(object.x, object.y);
        //s.player.removeBehavior((s.player.lerpx));
        //s.player.removeBehavior((s.player.lerpy));
        //s.player.move(s);
        if (other.y < object.y) {
          s.player.turn(PI / 2);
          s.player.lerpy.goal = MAX.y - 1 * TILESIZE;
          //s.player.lerpx.goal = p.x;
        } else if (other.x > object.x) {
          s.player.turn(0);
          s.player.lerpx.goal = b.x + 1 * TILESIZE;
          //s.player.lerpy.goal = p.y;
        } else if (other.x < object.x) {
          s.player.turn(PI);
          s.player.lerpx.goal = b.x - 2 * TILESIZE;
          //s.player.lerpy.goal = p.y;
        }
      }
    }
  };
  boss.die = function (e) {
    // fix me: maybe here? (need to made non-collide)
    for (var i = 0; i < 80; i++) {
      var d = this.layer.add(Object.create(Sprite).init(this.x, this.y, Resources.dust));
      d.addBehavior(Velocity);
      d.animation = choose([0, 1]);
      var theta = Math.random() * PI2;
      var speed = randint(3, 50);
      d.velocity = {x: speed * Math.cos(theta), y: speed * Math.sin(theta)};
      d.behaviors[0].onEnd = function () {
        this.entity.alive = false;
      };
    }
    gameWorld.playSound(Resources.hit);

    s.unpause();
    gameWorld.saved = false;
    s.pause = function () {};
    this.behaviors = [];
    this.death = this.addBehavior(Delay, {duration: 1.5, callback: function () {
      this.entity.alive = false;
      this.entity.death = undefined;
      if (s.player.hasFTL) {
        gameWorld.ending = 3;
      } else {
        gameWorld.ending = 4;
      }
      gameWorld.player.collision.onHandle = function (a,b) {};
      gameWorld.setScene(2, true);
    }});
    gameWorld.wave = 1;

  }

  gameWorld.boss = boss;
  boss.limbs = [];
  
  this.bg.paused = false;
  
  this.pause();
};
var onUpdate = function (dt) {
  var s = this;

  for (var i = 0; i < this.wave.length; i++) {
    if (!this.wave[i].alive) this.wave.splice(i, 1);
  };

  var enemies = this.bg.entities.filter(function (e) { return e.family == "enemy" || e.family == "neutral"; });
  var scrap = this.bg.entities.filter(function (e) { return e.scrap; });
  this.player.checkCollisions(0, enemies);
  gameWorld.boss.checkCollisions(0, scrap);

  for (var i = 0; i < enemies.length; i++) {
    if (!between(enemies[i].x, MIN.x - 1, MAX.x + 1) || !between(enemies[i].y, MIN.y - 1, MAX.y + 1)) {
      if (enemies[i].projectile) {
        projectileDie(enemies[i]);
      } else if (enemies[i].die) {
        enemies[i].die();
      } else {
        enemies[i].alive = false;
      }
    }
  }

  if (this.player.stopped() && this.player.buffer !== undefined) {
    this.player.turn(this.player.buffer);
    this.player.move(this);
    this.player.buffer = undefined;
  }
};