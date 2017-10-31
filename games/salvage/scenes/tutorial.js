var onStart =  function () {
  //Resources.music = Resources.menu;
  var player;
  var s = this;

  this.step = 0;
  this.steps = [
    // ["message", function () { condition }];
    ["move the mouse turn", function () { return player.angle !== 0; }, function () {}], // fix me: need to allow this to stay on screen for a time
    ["click to move", function () { return ((player.x != player_coordinates.x || player.y != player_coordinates.y) && player.stopped()); }, function () {}],
    ["hit objects",
      function () {
        return player.targets.filter( function (e) { return e.alive; }).length <= 0;
      },
      function () {
        for (var i = 0; i < 2; i++) {
          var c = toGrid(randint(0, gameWorld.width), randint(gameWorld.height / 2, gameWorld.height - TILESIZE));
          var a = s.fg.add(Object.create(Sprite).init(c.x, c.y, Resources.asteroid));
          a.setCollision(Polygon);
          a.z = 9;
          player.targets.push(a);
          a.collision.onHandle = function (object, other) {
            if (other.family == "player") {
              object.alive = false;
              for (var i = 0; i < 20; i++) {    
                var d = object.layer.add(Object.create(Sprite).init(object.x, object.y, Resources.dust));
                d.addBehavior(Velocity);
                var theta = Math.random() * PI2;
                var speed = randint(5, 30);
                d.velocity = {x: speed * Math.cos(theta), y: speed * Math.sin(theta)};
                d.behaviors[0].onEnd = function () {
                  this.entity.alive = false;
                };
              }
            }
          };
        }
      }
    ],
    ["avoid blue things",
      function () {
        return player.targets.filter( function (e) { return e.alive; }).length <= 0;
      },
      function () {
        for (var i = 0; i < 5; i++) {
          var c = toGrid(randint(0, gameWorld.width), 0);
          var a = s.fg.add(Object.create(Circle).init(c.x, c.y, 4));
          a.color = "black";
          a.stroke = true;
          a.strokeColor = COLORS.primary;
          a.width = 2;
      //      var a = layer.add(Object.create(Entity).init(this.x, this.y, 2, 2));
          //a.animation = 5;
          a.setCollision(Polygon);
          a.setVertices(projectile_vertices);
          a.collision.onHandle = projectileHit;
          a.addBehavior(Velocity);
          a.family = "enemy";
          a.projectile = true;
          //;
          var theta = PI / 2;
          //if (this.target) console.log('target');
          a.velocity = {x: 80 * Math.cos(theta), y: 80 * Math.sin(theta)  };
          a.angle = theta;
          //a.addBehavior(CropDistance, {target: s.player, max: 10 * gameWorld.distance});
          a.addBehavior(Trail, {interval: 0.06, maxlength: 10, record: []});
          s.player.targets.push(a);
        }
      }
    ],
    ["you are now ready", function () { return false; }, function () {}]
  ];
  this.condition = function () { return true; };

  var fg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  this.message = fg.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height - 16, Resources.expire_font, this.steps[this.step][0], {spacing: -2, align: "center"}));

  var bg = fg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  bg.color = "black";
  bg.z = -10;
  var grid = fg.add(Object.create(TiledBackground).init(MIN.x, MIN.y, 2 * Math.ceil(WIDTH / TILESIZE) * TILESIZE, 2 * Math.ceil(HEIGHT / TILESIZE) * TILESIZE, Resources.grid));
  grid.z = -9;

  var ground = fg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 6, gameWorld.width, 12, Resources.ground));
  ground.z = 11;
  ground.solid = true;
  ground.setCollision(Polygon);
  /*var title = fg.add(Object.create(SpriteFont).init(gameWorld.width / 2 + 6, gameWorld.height - 20, Resources.expire_font, "tutorial", {spacing: -2, align: "center"}));
  title.scale = 3;
  title.z = 10;*/

  /* player */
  var player_coordinates = toGrid(64, 64);
  player = fg.add(Object.create(Sprite).init(player_coordinates.x, player_coordinates.y, Resources.viper));
  player.setCollision(Polygon);
  player.move = Movement.standard;
  player.speed = 6.5;
  player.targets = [];
  player.family = "player";
  player.z = 10;
  player.distance = TILESIZE;
  player.min = {x: 16, y: 16};
  player.max = {x: WIDTH - 16, y: HEIGHT - 16};
  player.stopped = function () {
    return !this.lerpx && !this.lerpy;
  };
  this.player = player;
  this.player_bot = player; // fix me: rename player_bot;
  this.fg = fg;
  
  this.pause = function () {
    if (player.stopped()) {      
      this.fg.paused = true;
    }
  };
  this.unpause = function () {
    this.fg.paused = false;
  };

  var down = function (e) {
    if (s.fg.active && s.fg.paused) {
      var b = s.fg.onButton(e.x, e.y);
      if (b) {
        b.trigger();
        return;
      }
    }
    if (s.player.stopped()) {
      s.player.angle = Math.round(angle(s.player.x - s.fg.camera.x, s.player.y - s.fg.camera.y, e.x, e.y) / (PI / 2)) * PI / 2;
      s.player.move(s);
    }
  };
  var move = function (e) {
    if (s.fg.active) {
      var b = s.fg.onButton(e.x, e.y);
      if (b) {
        b.hover();
      }
      var buttons = s.fg.entities.filter( function (e) { return e.family == "button"; });
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i] != b && buttons[i].unhover) {
          buttons[i].unhover();
        }
      }
      //return;
    }
    if (s.player.stopped()) {
      //if (s.player_bot.velocity.x === 0 && s.player_bot.velocity.y === 0) {
        s.player.angle = Math.round(angle(s.player.x - s.fg.camera.x, s.player.y - s.fg.camera.y, e.x, e.y) / (PI / 2)) * PI / 2;
      //}
    }
  };
  
  var up = function (e) {
  };


  var b = fg.add(Object.create(SpriteFont).init(gameWorld.width / 2, 16, Resources.expire_font, " - menu - ", {spacing: -2, align: "center"}));
  var button = fg.add(Object.create(Entity).init(gameWorld.width / 2, 16, gameWorld.width, 16));
  button.family = "button";
  button.opacity = 0;
  button.text = b;
  button.hover = function () { this.text.scale = 2;};
  button.unhover = function () { this.text.scale = 1; };
  button.trigger = function () {
    gameWorld.setScene(0, true);
  };

  this.onMouseDown = down;
  this.onMouseMove = move;
  this.onTouchMove = function (e) {
    e.x = e.touch.x;
    e.y = e.touch.y;
    move(e);
  }
  this.onTouchEnd = function (e) {
    e.x = e.touch.x;
    e.y = e.touch.y;
    down(e);
  }

  this.pause();
};

var onUpdate = function () {
  if (this.condition && this.condition()) {
    this.message.text = this.steps[this.step][0];
    this.condition = this.steps[this.step][1];
    this.steps[this.step][2]();
    this.step += 1;
  }
};