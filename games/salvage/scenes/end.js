var onStart =  function () {
  //Resources.music = Resources.menu;

  var fg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  this.fg = fg;
  var s = this;
  var top = this.addLayer(Object.create(Layer).init(WIDTH, HEIGHT));

  this.ui = this.addLayer(Object.create(Layer).init(WIDTH, HEIGHT));

  var e1 = top.add(Object.create(SpriteFont).init(44, gameWorld.height / 2 - 22, Resources.expire_font, ENDINGS[gameWorld.ending], {spacing: -2, align: "left"}));
  var e2 = top.add(Object.create(SpriteFont).init(44, gameWorld.height / 2, Resources.expire_font, "(ending " + (gameWorld.ending + 1) + " of " + ENDINGS.length + ")", {spacing: -2, align: "left"}));
  e1.z = 50;
  e1.scale = 2;
  e2.z = 51;
  e2.scale = 2;

  //var description = ;

  var earned = top.add(Object.create(SpriteFont).init(44, 3 * gameWorld.height / 4 - 34, Resources.expire_font, "You earned $" + gameWorld.earned + ".", {spacing: -2, align: "left"}));
  earned.scale = 2;
  var spent = top.add(Object.create(SpriteFont).init(44, 3 * gameWorld.height / 4 - 12, Resources.expire_font, "You spent $" + (gameWorld.earned - gameWorld.player.salvage) + ".", {spacing: -2, align: "left"}));
  spent.scale = 2;

  if (gameWorld.endDescription) {
    var t0 = top.add(Object.create(Sprite).init(gameWorld.width -  48, 3 * gameWorld.height / 4 + 32, gameWorld.endDescription.sprite));
    t0.scale = 2;
    t0.z = 52;
    var t = top.add(Object.create(SpriteFont).init(44, 3 * gameWorld.height / 4 + 32, Resources.expire_font, "You were destroyed by a " + gameWorld.endDescription.name + "!", {spacing: -2, align: "left"}));
    t.scale = 2;
    t.z = 53;
    gameWorld.endDescription = undefined;
  }

  var b = fg.add(Object.create(Entity).init(0, HEIGHT / 2, 3 * WIDTH, HEIGHT));
  b.color = "black";
  b.z = -10;
  
  var grid = fg.add(Object.create(TiledBackground).init(0, HEIGHT / 2, WIDTH * 3, HEIGHT + 8, Resources.grid));
  grid.z = -9;

  var cover = fg.add(Object.create(Entity).init(0, MIN.y / 2 - 2, WIDTH * 3, MIN.y - 4));
  cover.z = -8;
  cover.color = "black";

  var skyline = fg.add(Object.create(TiledBackground).init(0, MAX.y + 12, WIDTH * 3, 16, Resources.skyline));
  skyline.z = 25;
  var ground = fg.add(Object.create(TiledBackground).init(0, MAX.y + 18, WIDTH * 3, 8, Resources.ground));
  ground.z = 26;

  var cover = fg.add(Object.create(Entity).init(0, 8, WIDTH * 3, 16));
  cover.z = 23;
  var cover = fg.add(Object.create(Entity).init(0, HEIGHT - 5, WIDTH * 3, 10));
  cover.z = 23;

  var ceiling = fg.add(Object.create(TiledBackground).init(0, MIN.y - 16, WIDTH * 3, 16, Resources.sky));
  ceiling.z = 26;

  var right = fg.add(Object.create(TiledBackground).init(MAX.x + 24, HEIGHT / 2, 32, HEIGHT, Resources.wall));
  right.z = 22;

  var left = fg.add(Object.create(TiledBackground).init(16, HEIGHT / 2, 32, HEIGHT, Resources.wall));
  left.z = 22;

  var gate = fg.add(Object.create(Sprite).init(16, MAX.y - TILESIZE + 10, Resources.gate));
  gate.z = 26;

  
  if (gameWorld.ending === 2 || gameWorld.ending === 3) {

    fg.camera.x -= (WIDTH - 32);
    //e1.x -= (WIDTH - 32);
    //e2.x -= (WIDTH - 32);
    gate.animation = 1;

    var player = fg.add(Object.create(Sprite).init(-MIN.x, HEIGHT / 2, Resources.viper));
    player.angle = PI;
    player.z = 100;
    player.addBehavior(Velocity);
    player.addBehavior(Accelerate);
    player.velocity = {x: 0, y: 0};
    player.acceleration = {x: -40, y: 0};
    player.addBehavior(Periodic, {period: 0.2, callback: function () {
      var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.dust));
      d.z = this.entity.z - 1;
      d.behaviors[0].onEnd = function () {
        this.entity.alive = false;
      };
      d.addBehavior(Velocity);
      d.velocity = {x: 0, y: - this.entity.velocity.y};
    }});
  } else if (gameWorld.ending === 4) {
    // insurrection
    var wreck = fg.add(Object.create(Sprite).init(gameWorld.width / 2, MAX.y - 8, Resources.boss));
    wreck.animation = 2;
    wreck.z = 23;
    wreck.addBehavior(Periodic, {period: 0.05, callback: function () {
      if (Math.random() < 1) {        
        var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x + randint(0, this.entity.w) - this.entity.w / 2, this.entity.y, Resources.dust));
        d.z = this.entity.z - 1;
        d.behaviors[0].onEnd = function () {
          this.entity.alive = false;
        };
        d.addBehavior(Velocity);
        d.velocity = {x: 0, y: - 40};
      }
    }});
  } else {
    var wreck = fg.add(Object.create(Sprite).init(gameWorld.width / 2, MAX.y + 8, Resources.viper));
    wreck.angle = 0;
    wreck.z = 100;
    wreck.addBehavior(Periodic, {period: 0.1, callback: function () {
      if (Math.random() > 0.5) {        
        var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.dust));
        d.z = this.entity.z - 1;
        d.behaviors[0].onEnd = function () {
          this.entity.alive = false;
        };
        d.addBehavior(Velocity);
        d.velocity = {x: 0, y: - 40};
      }
    }});
    // add tombstone    
  }

  if (gameWorld.ending !== 0 && gameWorld.ending !== 1 ) {
    COLORS.button = "#ff2800";
  }

  var menu_text = this.ui.add(Object.create(SpriteFont).init(36, 12, Resources.expire_font, "menu", {align: "center", spacing: -3}));
  var menu_button = this.ui.add(Object.create(Entity).init(36, 12, 64, 16));
  menu_button.family = "button";
  menu_text.scale = 2;
  menu_text.z = 50;
  menu_button.opacity = 0;
  menu_button.trigger = function () {
    gameWorld.setScene(0, true);
    gameWorld.playSound(Resources.select);
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
  mute_text.z = 50;
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

  if (MODE !== MODES.touch) {
    this.onMouseDown = function (e) {
      var b = s.ui.onButton(e.x, e.y);
      if (b) {
        b.trigger();
      }
    };
    this.onMouseMove = function (e) {
      var buttons = s.ui.entities.filter(function (e) { return e.family === "button"; });
      var b = s.ui.onButton(e.x, e.y);
      for (var i = 0; i < buttons.length; i++) {
        if (b == buttons[i]) b.hover();
        else buttons[i].unhover();
      }
    };
  }
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
      var b = s.ui.onButton(e.x, e.y);
      console.log(e, b);
      if (b) {
        b.trigger();
      }
    }
  };

  this.onKeyDown = function (e) {
    gameWorld.setScene(0, true);
  };
};

var onUpdate = function () {
};