// CONSTANTS

// first bug: setScene reloads (THIS) js file, you can see it keep adding script tags to the HTML :/

var fullscreen = false;

var onStart = function () {

  this.cars = ["smart", "smart", "smart", "smart", "smart", "smart"];
  this.cars = this.cars.concat(gameWorld.difficulties.slice(0,gameWorld.difficulty).map(function (d) { return d.sprite; }));

  this._gamepad = Object.create(Gamepad).init();
  var t = this;

  this.buttons = [];

  //var bg_camera = Object.create(Camera).init(0, 0);
  var bg = Object.create(Layer).init(160, 90);
  this.bg = bg;

  //var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(160, 90);
  t.fg = fg;

  fg.add(Object.create(SpriteFont).init(CONFIG.width / 2, 6, Resources.expire_font, "Thanks, Christie!", {align: "center", spacing: -2}));


  var mute_sprite = fg.add(Object.create(Sprite).init(CONFIG.width - 2, 6, Resources.mute));
  mute_sprite.removeBehavior(mute_sprite.behaviors[0]);

  var mute_button = Object.create(Button).init(CONFIG.width - 20, 6, 40, 12);
  mute_button.family = "button";
  mute_button.set = function () {
    if (gameWorld.muted && gameWorld.audioContext && gameWorld.audioContext.gn) {
      mute_sprite.animation = 1;
      gameWorld.audioContext.gn.gain.value = 0;
    } else if (gameWorld.audioContext && gameWorld.audioContext.gn) {
      mute_sprite.animation = 0;
      gameWorld.audioContext.gn.gain.value = 1;
    }
  }
  mute_button.set();
  mute_button.trigger = function () {
    gameWorld.muted = !gameWorld.muted;
    mute_button.set();
  };
  mute_button.hover = function () {
    mute_sprite.frame = 1;
  };
  mute_button.unhover = function () {
    mute_sprite.frame = 0;
  };
  this.buttons.push(mute_button);
  fg.add(mute_button);

  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }
  
  var i = 0;


  var trees = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - 8 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE * 2, Resources.trees);
  bg.add(trees);

  var road = Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 26 - 1 * LANE_SIZE, gameWorld.width, 6 * LANE_SIZE, Resources.road);
  bg.add(road);
  
  var b1 = bg.add(Object.create(Sprite).init(gameWorld.width, gameWorld.height - 32 - 6 * LANE_SIZE, Resources.bridge));
  
  var ground = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - 7 * LANE_SIZE - 2, CONFIG.width + LANE_SIZE, 4, Resources.ground);
  bg.add(ground);

/*
  var ground_low = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - 2, CONFIG.width + LANE_SIZE, 4, Resources.ground);
  fg.add(ground_low);
*/
  var b2 = fg.add(Object.create(Sprite).init(gameWorld.width, gameWorld.height - 32, Resources.bridge));
  b2.z = 11;
  var g2 = fg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 11, gameWorld.width, 4, Resources.ground));
  g2.z = 12;

  for (var i = 0; i < 6; i++) {
    for (var j = 32 + randint(16, 32); j < gameWorld.width + 32; j += randint(16, 32)) {
      var s = fg.add(Object.create(Sprite).init(j, gameWorld.height - 29 - 4 * LANE_SIZE + i * LANE_SIZE, Resources[choose(this.cars)]));
      s.removeBehavior(s.behaviors[0]);
      s.addBehavior(Oscillate, {constant: 4, field: 'x', object: s.offset, time: Math.random() * PI2, initial: 0, rate: 0.2});
    }
  }

  fg.add(Object.create(Sprite).init(24, gameWorld.height - 29 - 1 * LANE_SIZE, Resources.repair));

  this._gamepad.buttons.a.onStart = function (dt) {
    gameWorld.setScene(0, true);
  }

  this.touch = {x: 0, y: 0, delay: 0};
  this.onTouchStart = function (e) {
    if (!fullscreen) requestFullScreen();
    t.touch.x = e.touch.x, t.touch.y = e.touch.y;
  }
  this.onClick = function (e) {
    var b = t.fg.onButton(e.x, e.y);
    if (b) {
      if (b.trigger) b.trigger();
      return;
    }
  }
  this.onTouchEnd = function (e) {
    var x = e.touch.x, y = e.touch.y;
    var b = t.fg.onButton(e.touch.x, e.touch.y);
    if (b) {
      if (b.trigger) {
        b.trigger();
      }
      return;
    }
    if (Math.abs(t.touch.y - y) < 10) {
      if (gameWorld.difficulty <= gameWorld.unlocked){
      }
      else {
      }
      return;
    } else if (y < t.touch.y) {
      gameWorld.difficulty = Math.max(0, gameWorld.difficulty - 1);
      t.doRefreshSelectors = true;    
    } else {
      gameWorld.difficulty = Math.min(gameWorld.difficulty + 1, gameWorld.difficulties.length - 1);  
      t.doRefreshSelectors = true;    
    }
  }
  this.onMouseMove = function (e) {
    for (var i = 0; i < t.buttons.length; i++) {
      if (t.buttons[i].check(e.x, e.y)) {
        t.buttons[i].hover();
      } else {
        t.buttons[i].unhover();
      }
    }
  }

  this.layers.push(bg);
  this.layers.push(fg);
};


var onUpdate = function (dt) {
  this._gamepad.update(dt);
  if (Math.random() * 100 < 1) {
    gameWorld.playSound(Resources.beepbeep);
  }
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};