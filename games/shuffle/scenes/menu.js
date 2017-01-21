// CONSTANTS

// first bug: setScene reloads (THIS) js file, you can see it keep adding script tags to the HTML :/

var LANE_SIZE = 32, HANDLING = 200, THRESHOLD = 2.5, ROAD_SPEED = 160, LANE_OFFSET = 128;
var fullscreen = false;

var onStart = function () {

  this._gamepad = Object.create(Gamepad).init();

  this.layers = [];
  this.delay = 0.25;

  var t = this;

  var bg_camera = Object.create(Camera).init(0, 0);
  var bg = Object.create(Layer).init(bg_camera);
  this.bg = bg;

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);
  t.fg = fg;

  var title2 = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 80, "Bad", {align: "right", size: 64, color: "black"});
  fg.add(title2);

  var title3 = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 80, "brakes", {align: "left", size: 96, color: "black"});
  fg.add(title3);  

  fg.add(Object.create(Text).init(2 * CONFIG.width / 3, CONFIG.height / 2 + 72, "Press Any Key", {size : 24, align: "left"}));
  fg.add(Object.create(Text).init(2 * CONFIG.width / 3, CONFIG.height / 2 + 84, "Press     ", {size: 24, align: "left"}));
  fg.add(Object.create(Text).init(2 * CONFIG.width / 3, CONFIG.height / 2 + 96, "Touch Anywhere", {size: 24, align: "left"}));
  fg.add(Object.create(Text).init(2 * CONFIG.width / 3, CONFIG.height / 2 + 112, "To Begin...", {size: 32, align: "left"}));
  fg.add(Object.create(Sprite).init(2 * CONFIG.width / 3 + 64, CONFIG.height / 2 + 80, Resources.a));

  if (gameWorld.score) {
    var scoreText = Object.create(Text).init(CONFIG.width / 2, 20, "You made it " + gameWorld.score + " miles!", {});
    scoreText.addBehavior(FadeIn, {duration: 0.5});
    fg.add(scoreText);
  }

  this.selectors = [];
  this.selector_texts = [];

  for (var i = 0; i < gameWorld.difficulties.length; i++) {
    var theta = (Math.PI / 6) * (i - gameWorld.difficulty);
    var dy = 96 * Math.sin(theta);
    var dx = 96 * Math.cos(theta);
    var d = Object.create(Sprite).init(72 + dx, CONFIG.height / 2 + dy, Resources[gameWorld.difficulties[i].sprite]);
    d.addBehavior(Locked);
    d.level = i;
    d.opacity = (i == gameWorld.difficulty) ? 1 : 0.5;
    d.w *= (i == gameWorld.difficulty) ? 1 : 0.8;
    d.h *= (i == gameWorld.difficulty) ? 1 : 0.8;
    d.z = 2;
    this.selectors.push(d);
    fg.add(d);

    var st = [];
    var handling_text = Object.create(Text).init(12, CONFIG.height / 2 - 12, "Handling", {align: "left", size: 24});
    st.push(handling_text);
    var h = Math.floor(10 * gameWorld.difficulties[i].handling / 500);
    for (var j = 0; j < 10; j++) {
      var e = Object.create(Entity).init(12 + j * 10, handling_text.y + 12, 8, 8);
      e.color = j <= h ? "black" : "gray";
      st.push(e);
    }

    var speed_text = Object.create(Text).init(12, CONFIG.height / 2 + 24, "Speed", {align: "left", size: 24});
    st.push(speed_text);
    var h = Math.floor(10 * gameWorld.difficulties[i].roadSpeed / 500);
    for (var j = 0; j < 10; j++) {
      var e = Object.create(Entity).init(12 + j * 10, speed_text.y + 12, 8, 8);
      e.color = j <= h ? "black" : "gray";
      st.push(e);
    }

    for (var j = 0; j < st.length; j++) {
      var t1 = st[j];
      t1.fadeOut = function () {
        this.opacity = 0;
      }
      t1.fadeIn = function () {
        this.opacity = 1;
      }

      if (i == gameWorld.difficulty) {
        t1.opacity = 1;
      } else {
        t1.opacity = 0;
      }
      t1.z = 10;
      fg.add(t1);
    }
    this.selector_texts.push(st);
  }

  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }
  //this.fg = fg;

  this.doRefreshSelectors = false;
  this.refreshSelectors = function () {
    var lerpRate = 0.2;
    for (var i = 0; i < this.selectors.length; i++) {
      var theta = (Math.PI / 6) * (i - gameWorld.difficulty);
      var dy = 96 * Math.sin(theta);
      var dx = 96 * Math.cos(theta);
      var d = this.selectors[i];
      d.x = lerp(d.x, 72 + dx, lerpRate), d.y = lerp(d.y, CONFIG.height / 2 + dy, lerpRate);
      if (i == gameWorld.difficulty) {
      }
      d.opacity = (i == gameWorld.difficulty) ? 1 : 0.5;
      d.w = lerp(d.w, d.sprite.w * GLOBALS.scale * ((i == gameWorld.difficulty) ? 1 : 0.8), lerpRate);
      d.h = lerp(d.h, d.sprite.h * GLOBALS.scale * ((i == gameWorld.difficulty) ? 1 : 0.8), lerpRate);

      // snap to if close enough
      if (Math.abs(d.x - (72 + dx)) < 0.5) {
        d.x = 72 + dx;
        d.y = CONFIG.height / 2 + dy;
        d.w = d.sprite.w * GLOBALS.scale * ((i == gameWorld.difficulty) ? 1 : 0.8);
        d.h = d.sprite.h * GLOBALS.scale * ((i == gameWorld.difficulty) ? 1 : 0.8);
        this.doRefreshSelectors = false;
      }
    }
  }

  for (var i = 0; i < 2; i ++) {

    var trees = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 10 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE, Resources.trees);
    trees.velocity = {x: - 1 * ROAD_SPEED / 3, y: 0};
    trees.addBehavior(Velocity);
    trees.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    trees.z = -10;
    fg.add(trees);

    var ground_low = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 11 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    fg.add(ground_low);
    ground_low.addBehavior(Velocity);
    ground_low.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    ground_low.velocity = {x: -1 * ROAD_SPEED / 2, y: 0};
  }

  var block = Object.create(Entity).init(64, CONFIG.height / 2, 128, CONFIG.height);
  block.blend = "difference";
  block.color = "#ddd";
  block.z = 10;
  fg.add(block);


  this.onKeyDown = function (e) {
    if (e.keyCode == 38) {
      e.preventDefault();
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.max(0, gameWorld.difficulty - 1);
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      t.doRefreshSelectors = true;
      return false;
    } else if (e.keyCode == 40) {
      e.preventDefault();
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.min(gameWorld.difficulty + 1, gameWorld.difficulties.length - 1);  
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      t.doRefreshSelectors = true;
      return false;
    } else if (e.keyCode == 32) {
      e.preventDefault();
      if (gameWorld.difficulty <= gameWorld.unlocked)
        gameWorld.setScene(1);
      else {
        //gameWorld.playSound(Resources.error);
      }
      return false;
    }
  }

  this._gamepad.buttons.a.onStart = function (dt) {
    if (t.delay <= 0)
      if (gameWorld.difficulty <= gameWorld.unlocked)
        gameWorld.setScene(1);
      else {
        //gameWorld.playSound(Resources.error);
      }
  }
  this._gamepad.aleft.onUpdate = function (dt) {
    if (this.delay === undefined) this.delay = 0;
    if (this.delay > 0) {
      this.delay -= dt;
      return;
    }
    if (this.y < -0.3) {
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.max(0, gameWorld.difficulty - 1);
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      this.delay = 0.3;
      t.doRefreshSelectors = true;
    } else if (this.y > 0.3) {
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.min(gameWorld.difficulty + 1, gameWorld.difficulties.length - 1);  
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      this.delay = 0.3;
      t.doRefreshSelectors = true;
    }
  }

  this.touch = {x: 0, y: 0, delay: 0};
  this.onTouchStart = function (e) {
    if (!fullscreen) requestFullScreen();
    t.touch.x = e.changedTouches[0].pageX, t.touch.y = e.changedTouches[0].pageY;
  }
  this.onTouchEnd = function (e) {
    var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY;
    if (Math.abs(t.touch.y - y) < 10) {
      if (gameWorld.difficulty <= gameWorld.unlocked)
        gameWorld.setScene(1);
      else {
        //gameWorld.playSound(Resources.error);
      }
      return;
    } else if (y < t.touch.y) {
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.max(0, gameWorld.difficulty - 1);
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      t.doRefreshSelectors = true;    
    } else {
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.min(gameWorld.difficulty + 1, gameWorld.difficulties.length - 1);  
      t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      t.doRefreshSelectors = true;    
    }
  }

  this.layers.push(bg);
  this.layers.push(fg);
};

var onUpdate = function (dt) {
  this.delay -= dt;
  this._gamepad.update(dt);
  if (this.doRefreshSelectors) this.refreshSelectors();
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};