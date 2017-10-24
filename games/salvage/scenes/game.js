/*

- enemy respecting boundaries
- boss...

 */


/* global Resources, Layer, gameWorld, MAXHEALTH, Entity, TiledBackground, Sprite, SpriteFont */
var onStart = function () {
  this.wave = [];
  
  Resources.music = Resources.soundtrack;
  //var super_bg = this.addLayer(Object.create(Layer).init(1000,1000));
  //super_bggit.active = true;
  //var parallax = this.addLayer(Object.create(Layer).init(1000,1000));
  //var colorize = this.addLayer(Object.create(Layer).init(1000, 1000));
  //colorize.add(Object.create(Entity).init(0, 0, 1000, 1000)).color = "#000000";//COLORS.negative;
  //colorize.color = COLORS.negative;
  
  var bg = this.addLayer(Object.create(Layer).init(1000,1000));
  bg.active = true;
  //var fg = this.addLayer(Object.create(Layer).init(1000,1000));
  //fg.active = true;
  //parallax.active = true;
//

  var player_coordinates = toGrid(64, 64);
  var player_bot = bg.add(Object.create(Sprite).init(player_coordinates.x, player_coordinates.y, Resources.viper));
  
  // is it worth doing this kind of grid??
  /*for (var i = MIN.x - 16; i <= MAX.x + 16; i+= 32) {
    for (var j = MIN.y - 16; j <= MAX.y + 16; j += 32) {
      var b = bg.add(Object.create(Entity).init(i, j, 32, 32));
      b.color = (i - (MIN.x - 16) % 64 + j - (MIN.y - 16)) % 64 == 0 ? "black" : "#111";
      b.z = -10;
    }
  }*/
  var b = bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  b.color = "black";
  b.z = -10;
  
  var grid = bg.add(Object.create(TiledBackground).init(MIN.x, MIN.y, 2 * Math.ceil(WIDTH / TILESIZE) * TILESIZE, 2 * Math.ceil(HEIGHT / TILESIZE) * TILESIZE, Resources.grid));
  grid.z = -8;

  //grid.blend = "destination-out";

  var ground = bg.add(Object.create(TiledBackground).init(WIDTH / 2, MAX.y + 10, WIDTH, 12, Resources.ground));
  ground.z = -7;
  ground.solid = true;
  //ground.blend = "destination-out";
  ground.setCollision(Polygon);

  var ceiling = bg.add(Object.create(TiledBackground).init(WIDTH / 2, 2, WIDTH - 8, 16, Resources.ground));
  ceiling.z = -7;
  ceiling.angle = PI;
  ceiling.solid = true;
  ceiling.setCollision(Polygon);

  var right = bg.add(Object.create(TiledBackground).init(WIDTH - 2, HEIGHT / 2, HEIGHT - 8, 8, Resources.ground));
  right.angle = -PI / 2;
  right.z = -6;
  right.solid = true;
  //right.blend = "destination-out";
  right.setCollision(Polygon);

  var left = bg.add(Object.create(TiledBackground).init(2, HEIGHT / 2, HEIGHT - 8, 8, Resources.ground));
  left.z = -6;
  left.solid = true;
  left.angle = PI / 2;
  //left.blend = "destination-out";
  left.setCollision(Polygon);
  
  var gate = bg.add(Object.create(Sprite).init(gameWorld.width / 2, 8, Resources.gate));
  gate.setCollision(Polygon);
  gate.solid = true;
  gate.z = -5;
/*
  for (var i = 0; i < 100; i++) {
    var star = bg.add(Object.create(Entity).init(randint(0, gameWorld.width), randint(0, gameWorld.height), 2, 2));
    star.z = -1;
    star.color = "white";
  }*/

  this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  this.ui.active = true;

  this.health_bar = []; 
  for (var i = 0.5; i < MAXHEALTH + 0.5; i++) {
    var h = bg.add(Object.create(Sprite).init(i * 16, gameWorld.height - 8, Resources.heart));
    h.follow = h.addBehavior(Follow, {target: player_bot, offset: {x: 0, y: 0, z: 1, angle: false}});
    //h.addBehavior(Trail, {interval: 0.06, maxlength: 4, record: []});
    h.radius = 2;
    h.addBehavior(Oscillate, {field: "x", object: h.follow.offset, initial: 0, constant: 16, time: i * PI / 5, func: "cos"});
    h.addBehavior(Oscillate, {field: "y", object: h.follow.offset, initial: 0, constant: 16, time: PI + i * PI / 5});
    h.strokeColor = "#DD0000";
    this.health_bar.push(h);
  }
  this.shield = bg.add(Object.create(Sprite).init(16 * (MAXHEALTH + 0.5), gameWorld.height - 8, Resources.icons));
  this.shield.animation = 1;
  this.shield.addBehavior(Follow, {target: player_bot, offset: {x: 0, y: 0, z: -1, angle: -PI / 2, opacity: false}})
  
  var s = this;
  this.updateHealthBar = function (object) {
    for (var i = 0; i < s.health_bar.length; i++) {
      if (i < object.health) {
        s.health_bar[i].opacity = 0.8;
      } else if (i < MAXHEALTH) {
        s.health_bar[i].opacity = 0.2;
      }
    }
    this.shield.opacity = Math.pow(object.shield, 2);
  };

  var menu_text = this.ui.add(Object.create(SpriteFont).init(24, 4, Resources.expire_font, "pause", {align: "center", spacing: -3}));
  var menu_button = this.ui.add(Object.create(Entity).init(24, 8, 48, 16));
  menu_button.family = "button";
  menu_button.opacity = 0;
  menu_button.trigger = function () {
    if (s.bg.paused) {
      gameWorld.setScene(0, true);
      gameWorld.saved = true;
      gameWorld.playSound(Resources.select);
    }
  };
  menu_button.hover = function () {
    if (menu_text.scale != 1.2) gameWorld.playSound(Resources.hover);
    menu_text.scale = 1.2;
  };
  menu_button.unhover = function () {
    menu_text.scale = 1;
  };
  
  var mute_text = this.ui.add(Object.create(SpriteFont).init(gameWorld.width - 16, 4, Resources.expire_font, "mute", {align: "center", spacing: -3}));
  var mute_button = this.ui.add(Object.create(Entity).init(gameWorld.width - 16, 8, 32, 16));
  mute_button.family = "button";
  mute_button.opacity = 0;
  mute_button.trigger = function () {
      gameWorld.playSound(Resources.select);
    // mute!
  };
  mute_button.hover = function () {
    if (mute_text.scale != 1.2) gameWorld.playSound(Resources.hover);
    mute_text.scale = 1.2;
  };
  mute_button.unhover = function () {
    mute_text.scale = 1;
  };
  
  //player_bot.blend = "destination-out";
  player_bot.setCollision(Polygon);
  player_bot.move = Movement.standard;
  player_bot.min = {x: 16, y: 16};
  player_bot.max = {x: WIDTH - 16, y: HEIGHT - 16};
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
  player_bot.speed = 6.5;
  player_bot.distance = TILESIZE;
  player_bot.noCollide = false;
  
  player_bot.family = "player";
  player_bot.stopped = function () {
    return !this.lerpx && !this.lerpy;
  }
  
  this.updateHealthBar(player_bot);
  gameWorld.player = player_bot;
  player_bot.collision.onHandle = function (object, other) {
    if (object.noCollide) return;
    
    if (other.family == "enemy") {
      if (!other.projectile) {
      } else {
        if (object.shield >= 1) {
          object.shield = 0;
          gameWorld.playSound(Resources.shield_down);
          //object.addBehavior(Delay, {duration: 1.5, callback: function () { this.entity.noCollide = false; }})
        } else {
          object.health -= 1;
          if (object.retaliate >= 1) {
            var theta = angle(object.x, object.y, other.x, other.y);
            var p =object.layer.add(Object.create(Circle).init(object.x, object.y, 4));
            p.color = "white";
            p.stroke = true;
            p.strokeColor = COLORS.primary;
            p.width = 2;
            //      var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
            //p.animation = 5;
            p.setCollision(Polygon);
            p.setVertices(projectile_vertices);
            gameWorld.playSound(Resources.laser);
            p.collision.onHandle = projectileHit;
            p.addBehavior(Velocity);
            p.family = "player";
            p.projectile = true;
            //;
            //if (this.target) console.log('target');
            p.velocity = {x: 80 * Math.cos(theta), y: 80 * Math.sin(theta)  };
            p.angle = theta;
            p.addBehavior(Trail, {interval: 0.06, maxlength: 10, record: []});
            projectiles.push(p);
          }
          object.layer.camera.addBehavior(Shake, {duration: 1, min: -60, max: 60});
        }
        s.updateHealthBar(object);
        
        //var expl = other.layer.add(Object.create(Sprite).init(other.x, other.y, Resources.explosion));
        //expl.addBehavior(FadeOut, {duration: 0, delay: 0.8});
        
        
        //object.damage.timer = DAMAGE_COOLDOWN;
      }
      // should this be JUST on projectile hit? probably, right! (invulnerability)
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
    gameWorld.saved = false;
    s.pause = function () {};
    player_bot.removeBehavior(player_bot.lerpx);
    player_bot.removeBehavior(player_bot.lerpy);
    player_bot.death = player_bot.addBehavior(Delay, {duration: 1.5, callback: function () {
      player_bot.alive = false;
      player_bot.death = undefined;
      if (gameWorld.boss.alive && gameWorld.boss.health >= boss.maxhealth) {
        console.log('first', gameWorld.boss.health, boss.maxhealth)
        gameWorld.ending = 0;
      } else if (gameWorld.boss.alive) {
        console.log('second');
        gameWorld.ending = 1;
      }
      gameWorld.setScene(2, true);
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
  };
  
  this.store_layer = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  this.store_layer.active = false;
  var store = Object.create(Store).init(this.store_layer, player_bot);
  this.store = store;
/*
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
  };*/

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
      // 'denied' for gate
      
      var coords = toGrid(this.player_bot.x, this.player_bot.y);
      if (coords.y === MIN.y && (coords.x == MIN.x + TILESIZE * 2 || coords.x == MIN.x + TILESIZE * 3)) {
        if (!player_bot.hasFTL) {
          gate.animation = 1;
          gate.addBehavior(Delay, {duration: 1, callback: function () {
            this.entity.animation = 0;
            this.entity.removeBehavior(this);
          }});
          var warning = this.bg.add(Object.create(SpriteFont).init(gate.x, gate.y - 4, Resources.expire_font, "denied.", {spacing: -2, align: "center"}));
          //gameWorld.playSound(Resources.denied);
          warning.addBehavior(FadeOut, {duration: 0.5, delay: 0.5});
          warning.addBehavior(Velocity);
          warning.velocity = {x: 0, y: 20, angle: PI / 12};
          gameWorld.playSound(Resources.denied);
        } else {
          gameWorld.playSound(Resources.approved);
          gate.animation = 2;
          /*gate.behaviors[0].onEnd = function () {
            this.entity.animation = 2;
            this.entity.behaviors[0].onEnd = undefined;
          };*/
        }
      } else if (coords.y < MIN.y) {
        if (gameWorld.boss.alive) {
          gameWorld.ending = 2;
        } else {
          gameWorld.ending = 3;
        }
        gameWorld.setScene(2, true);
      }

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
        if (this.current_wave % 2 === 0) {
          var theta = Math.random() * PI2;
          var g = toGrid(boss.x + 64 * Math.cos(theta), boss.y + 64 * Math.sin(theta));
          if (gameWorld.boss.health >= gameWorld.boss.maxhealth && !gameWorld.boss.store_open) {
            gameWorld.boss.store_open = t.bg.add(Object.create(Entity).init(gameWorld.boss.x + 32, gameWorld.boss.y, 16, 16));
            

            //gameWorld.boss.store_open.angle = PI / 2;
            gameWorld.boss.store_open.opacity = 0;
            gameWorld.boss.store_open.setCollision(Polygon);
            gameWorld.boss.store_open.collision.onHandle = function (a, b) {
              if (b == player_bot) {
                s.store.open();
              }
            }
            //gameWorld.boss.animation = 2;
            gameWorld.boss.store_open.addBehavior(Follow, {target: gameWorld.boss, offset: {x: 32, y: 0, angle: false, z: 1}});

            var t1 = t.bg.add(Object.create(SpriteFont).init(gameWorld.boss.x + 24, gameWorld.boss.y - 6, Resources.expire_font, "store", {spacing: -3, align: "center"}));
            var t2 = t.bg.add(Object.create(SpriteFont).init(gameWorld.boss.x + 24, gameWorld.boss.y + 6, Resources.expire_font, "open!", {spacing: -3, align: "center"}));
            t1.addBehavior(Follow, {target: gameWorld.boss.store_open, offset: {x: -8, y: -6, alive: true, z: 1 }});
            t2.addBehavior(Follow, {target: gameWorld.boss.store_open, offset: {x: -8, y: 6, alive: true, z: 1 }});
            //gameWorld.boss.animation = 1;
          /*  if (!gameWorld.boss.billboard || !gameWorld.boss.billboard.alive) {              
              gameWorld.boss.billboard = s.bg.add(Object.create(SpriteFont).init(gameWorld.boss.x, gameWorld.boss.y, Resources.expire_font, "open!", {spacing: -3, align: "center"}));
              gameWorld.boss.billboard.opacity = 0;
              gameWorld.boss.billboard.addBehavior(FadeIn, {duration: 0.5, maxOpacity: 1, delay: 0});
              gameWorld.boss.billboard.addBehavior(Follow, {target: gameWorld.boss, offset: {x: 0, y: 4, z: -1}});
              gameWorld.boss.animation = 1;
            }*/
          }
        }
        this.current_wave += 1;

        gameWorld.boss.queue.push(toGrid(0, 0));
        gameWorld.boss.payday = 1;

        //gameWorld.playSound(Resources.spawn, 0.5);

        for (var i = 0; i < gameWorld.wave; i++) {
          var k = i % this.waves.length;
          for (var j = 0; j < this.waves[k].length; j++) {
            var enemy = spawn(this.bg, this.waves[k][j], this.player_bot);
            this.wave.push(enemy);            
          }
        }
        gameWorld.wave++;
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
    [0, 0], // drones --> done!
    [1],
    [2],
    [3],
    [4],
    [5],
    [6],
    //[7],
    //[8],
    //[9],
    //[10]
  ];

  var boss = this.bg.add(Object.create(Sprite).init(toGrid(0, 100).x, toGrid(0, 100).y, Resources.boss));
  boss.animation = 0;
  boss.offset = {x: 6, y: 0};
  boss.modules = [];
  boss.angle = PI / 2;
  boss.z = 24;
  boss.particles = boss.addBehavior(Periodic, {period: 0.1, rate: 0, callback: function () {
    if (Math.random() < this.rate) {
      var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.dust));
      d.z = this.entity.z - 1;
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
  boss.queue = [];
  boss.weapons = ["standard", "triple", "burst", "homing", "hitscan", "firework"];
  boss.respond = function (target) {
    if (this.health >= this.maxhealth) {}
    else if (this.health >= this.maxhealth - 1) { // warning shot
      this.shoot = Weapons.standard;
      // fix me: should be based on NORMAL to angle(this, target), i.e. two shots to either side
      this.target = {x: target.x, y: target.y - 12};
      this.shoot(this.layer);
      this.target = {x: target.x, y: target.y + 12};
      this.shoot(this.layer);
    } else if (!this.enemy) {
      this.enemy = this.addBehavior(BossEnemy);
      this.family = "enemy";
      this.target = target;
    }

    if (this.health <= 3) {
      this.unforgiving = true;
    }
  };
  boss.addBehavior(Boss, {duration: 1.5, speed: 45, rate: 4, target: player_bot});
  boss.velocity = {x: 0, y: 0};
  boss.addBehavior(Velocity);
  boss.setCollision(Polygon);
  boss.collision.onHandle = function (object, other) {
    if (other.family == "player" && !gameWorld.boss.invulnerable) {
      object.health -= 1;
      object.particles.rate = (10 - object.health) / 10;
      gameWorld.boss.invulnerable = true;
      gameWorld.boss.respond(s.player_bot);
      //gameWorld.boss.old_animation = gameWorld.boss.animation;
      gameWorld.boss.animation = 1;
      gameWorld.boss.addBehavior(Delay, {duration: 0.4, callback: function () { 
        this.entity.invulnerable = false;
        gameWorld.boss.animation = 0;
      }});
      if (object.health <= 0) {
        object.die();
      } else if (!other.projectile) {
        var theta = angle(object.x, object.y, other.x, other.y);
        var p = toGrid(object.x + 64 * Math.cos(theta), object.y + 64 * Math.sin(theta));
        s.player_bot.removeBehavior((s.player_bot.lerpx));
        s.player_bot.removeBehavior((s.player_bot.lerpy));
        s.player_bot.angle = theta;
        s.player_bot.move(s);
        s.player_bot.lerpx.goal = p.x;
        s.player_bot.lerpy.goal = p.y;
      }
    }
  };
  boss.die = function (e) {
    // fix me: maybe here? (need to made non-collide)
    var expl = this.layer.add(Object.create(Circle).init(this.x, this.y, 24));
    expl.addBehavior(FadeOut, {duration: 0.5, delay: 0.2});
    expl.z = 1;
    var flash = this.layer.add(Object.create(Circle).init(this.x, this.y, 32));
    flash.z = 2;
    flash.addBehavior(FadeOut, {duration: 0, delay: 0.1});
    flash.color = COLORS.secondary;
    gameWorld.playSound(Resources.hit);

    s.unpause();
    gameWorld.saved = false;
    s.pause = function () {};
    this.behaviors = [];
    this.death = this.addBehavior(Delay, {duration: 1.5, callback: function () {
      this.entity.alive = false;
      this.entity.death = undefined;
      if (s.player_bot.hasFTL) {
        gameWorld.ending = 3;
      } else {
        gameWorld.ending = 4;
      }
      gameWorld.setScene(2, true);
    }});
    gameWorld.wave = 0;

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
  }
  
};