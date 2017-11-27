var onStart =  function () {
  
  this.nullaries = [];
  this.negatives = [];
  this.primaries = [];
  this.secondaries = [];
  this.tertiaries = [];
  var s = this;

  Resources.music = Resources.soundtrack;
  //if (gameWorld.soundtrack) gameWorld.soundtrack.stop()
  if (!gameWorld.soundtrack) {
    if (AudioContext) {
      //gameWorld.filter = gameWorld.audioContext.createBiquadFilter();
      //gameWorld.filter.connect(gameWorld.audioContext.destination);
      //gameWorld.filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
      //gameWorld.filter.frequency.value = 24000; // Set cutoff to 440 HZ
    }

    gameWorld.musicLoop = function () {
      gameWorld.soundtrack = gameWorld.playSound(Resources.music, 1);
      //gameWorld.soundtrack.connect(gameWorld.filter);
      gameWorld.soundtrack.onended = gameWorld.musicLoop;
    }
    gameWorld.musicLoop();
  }

  var colorize = this.addLayer(Object.create(Layer).init(1000, 1000));
  
  var c = colorize.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  c.color = COLORS.negative;
  this.negatives.push(c);
  
  this.bg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  this.bg.active = true;
  
  var back = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  back.color = "black";
  back.z = 0;
  this.nullaries.push(back);
  
  //var grid = this.bg.add(Object.create(TiledBackground).init(MIN.x, MIN.y, 2 * Math.ceil(WIDTH / TILESIZE) * TILESIZE, 2 * Math.ceil(HEIGHT / TILESIZE) * TILESIZE, Resources.grid));
  //grid.z = 1;

  var title = this.bg.add(Object.create(SpriteFont).init(8, gameWorld.height - 16, Resources.expire_font, "bastille day", {spacing: -2, align: "left"}));
  //title.addBehavior(Oscillate, {field: "y", object: title, initial: gameWorld.height / 2, rate: 1, constant: 24});
  //title.blend = "destination-out";
  title.scale = 3;
  title.z = 10;

  var boss = this.bg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height - 44, Resources.boss));
  boss.z = 11;
  
  var ground = this.bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 4, gameWorld.width, 8, Resources.ground));
  //ground.blend = "destination-out";
  ground.z = 10;
  
/*
  var wall = this.bg.add(Object.create(TiledBackground).init(gameWorld.width * 3 / 4, gameWorld.height / 2, gameWorld.height, 8, Resources.wall));
  wall.angle = PI / 2;
  wall.z = 13;
  var wall2 = this.bg.add(Object.create(TiledBackground).init(gameWorld.width * 3 / 4 - 8, gameWorld.height / 2, gameWorld.height, 8, Resources.wall));
  wall2.angle = -PI / 2;
  wall2.z = 13;
*/

  var buttons = [
    ["new game", function () {
      gameWorld.wave = 1;
      gameWorld.setScene(1, true);
    }],
    ["tutorial", function () {
      gameWorld.setScene(3, true);
    }],
    ["mute", function () {
      if (!gameWorld.muted) {
        this.text.opacity = 0.5;
        gameWorld.mute();
      } else {
        this.text.opacity = 1;
        gameWorld.unmute();
      }
    }],
    ["twitter", function () {
      window.open("https://twitter.com/e1sif", "_blank");
    }]
  ];
  var button_objects = [];
  var selected = 0;
  var mute_button_text;
  for (var i = 0; i < buttons.length; i++) {
    var b = this.bg.add(Object.create(SpriteFont).init(8, gameWorld.height / 4 + i * 16, Resources.expire_font, buttons[i][0], {spacing: -1, align: "left"}));
    var button = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 4 + i * 16, gameWorld.width, 16));
    button.family = "button";
    b.z = 2;
    button.z = 1;
    //b.blend = "destination-out";
    button.opacity = 0;
    button.text = b;
    if (buttons[i][0] === "mute") { mute_button_text = b; }
    button.hover = function () {
      if (this.color != COLORS.button) gameWorld.playSound(Resources.hover);
      this.color = COLORS.button;
      this.opacity = 1;
    };
    button.unhover = function () {
      this.color = "white";
      this.opacity = 0;
    };

    button.trigger = buttons[i][1];
    button_objects.push(button);
  }
  if (gameWorld.saved) {
    var b = this.bg.add(Object.create(SpriteFont).init(8, gameWorld.height / 4 - 16, Resources.expire_font, "resume", {spacing: -2, align: "left"}));
    var button = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 4 - 16, gameWorld.width, 16));
    button.family = "button";
    b.z = 2;
    button.z = 1;
    //b.blend = "destination-out";
    button.opacity = 0;
    button.text = b;
    button.hover = function () {
      if (this.color != COLORS.button) gameWorld.playSound(Resources.hover);
      this.color = COLORS.button;
      this.opacity = 1;
    };
    button.unhover = function () {
      this.color = "white";
      this.opacity = 0;
    };
    button.trigger = function () {
      gameWorld.setScene(1, false);
    };
    button_objects.unshift(button);
  }


  if (localStorage && localStorage.salvageMuted == "true") {
    localStorage.salvageMuted = true;
    gameWorld.muted = true;
    window.muted = true;
    mute_button_text.opacity = 0.5;
    if (gameWorld.audioContext && gameWorld.audioContext.suspend)
      gameWorld.audioContext.suspend();
  }
  
  var ship = this.bg.add(Object.create(Sprite).init(0, HEIGHT - 48, Resources.viper));
  ship.addBehavior(Velocity);
  ship.velocity = {x: 40, y: 0};
  ship.addBehavior(Wrap, {min: {x: 0, y: 0}, max: {x: gameWorld.width, y: gameWorld.height}});
  ship.z = 12;
  ship.addBehavior(Periodic, {period: 0.8, callback: function () {
    var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.dust));
    d.z = this.entity.z - 1;
    d.behaviors[0].onEnd = function () {
      this.entity.alive = false;
    };
    d.addBehavior(Velocity);
    d.velocity = {x: - this.entity.velocity.x, y: 0};
  }});
  //ship.blend = "destination-out";

  this.colorize = function (i) {
    COLORS = SCHEMES[i];
    this.nullaries.forEach(function (e) { e.color = COLORS.nullary; });
    this.negatives.forEach(function (e) { e.color = COLORS.negative; });
    this.primaries.forEach(function (e) { e.color = COLORS.primary; });
    this.secondaries.forEach(function (e) { e.color = COLORS.secondary; });
    this.tertiaries.forEach(function (e) { e.color = COLORS.tertiary; });
  };

  var up = function () {
    selected = modulo(selected - 1, button_objects.length);
    for (var i = 0; i < button_objects.length; i++) {
      button_objects[i].unhover();
    }
    button_objects[selected].hover();
  };

  var down = function () {
    selected = modulo(selected + 1, button_objects.length);
    for (var i = 0; i < button_objects.length; i++) {
      button_objects[i].unhover();
    }
    button_objects[selected].hover();
  };

  var go = function () {
    button_objects[selected].trigger();
  };

  this.onClick = function (e) {
    var b = s.bg.onButton(e.x, e.y);
    if (b) {
      b.trigger();
    }
  };
  this.onMouseMove = function (e) {
    var buttons = s.bg.entities.filter(function (e) { return e.family === "button"; });
    var b = s.bg.onButton(e.x, e.y);
    for (var i = 0; i < buttons.length; i++) {
      if (b == buttons[i]) b.hover();
      else buttons[i].unhover();
    }
  };
  this.onTouchStart = function (e) {
    if (fullscreen) {
      e.x = e.touch.x; e.y = e.touch.y;
      this.onMouseMove(e);      
    }
  };
  this.onTouchMove = function (e) {
    if (fullscreen) {
      e.x = e.touch.x; e.y = e.touch.y;
      this.onMouseMove(e);      
    }
  };
  this.onTouchEnd = function (e) {
    if (!fullscreen) {
      requestFullScreen();
      return;
    } else {
      e.x = e.touch.x; e.y = e.touch.y;
      var b = s.bg.onButton(e.x, e.y);
      if (b) {
        b.trigger();
      }
    }
  };
  this.onKeyDown = function (e) {
    switch (e.keyCode) {
      case 38:
        up();
        break;
      case 40:
        down();
        break;
      case 13:
        go();
        break;
    }
  };
  for (var i = 0; i < button_objects.length; i++) {
    button_objects[i].unhover();
  }
  button_objects[selected].hover();
}

var onUpdate = function () {
  /*if (Math.random() * 100 < 2) {
    var w = randint(1, 4) * 4 + 4;
    var square = this.bg.add(Object.create(Sprite).init(randint(0, gameWorld.width), -8, Resources.asteroid));
    square.radius = square.w / 2;
    square.strokeColor = COLORS.primary;
    //square.color = COLORS.secondary;
    square.z = 8;
    square.addBehavior(Trail, {interval: 0.1, maxlength: 16, record: []});
    square.velocity = {x: choose([10, -10]), y: 30};
    square.addBehavior(Crop, {min: {x: -8, y: -10}, max: {x: gameWorld.width + 8, y: gameWorld.height - 6}});
    square.addBehavior(Velocity);
    //this.secondaries.push(square);
  }*/
};