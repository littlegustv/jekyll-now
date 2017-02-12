// CONSTANTS

// first bug: setScene reloads (THIS) js file, you can see it keep adding script tags to the HTML :/

var fullscreen = false;

var onStart = function () {

  this._gamepad = Object.create(Gamepad).init();
  var t = this;

  if (!gameWorld.soundtrack) { 
    gameWorld.musicLoop = function () {
      gameWorld.soundtrack = gameWorld.playSound(Resources.soundtrack1);
      gameWorld.soundtrack.onended = gameWorld.musicLoop;
    }
    gameWorld.musicLoop();
  }

  this.layers = [];
  this.buttons = [];
  this.delay = 0.25;

  var bg_camera = Object.create(Camera).init(0, 0);
  var bg = Object.create(Layer).init(bg_camera);
  this.bg = bg;

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);
  t.fg = fg;

  var titlebg1 = Object.create(Entity).init(CONFIG.width / 4, CONFIG.height / 2 - 80, CONFIG.width / 2, 40);
  titlebg1.color = "darksalmon";
  bg.add(titlebg1);

  var titlebg2 = Object.create(Entity).init(CONFIG.width / 4, CONFIG.height / 2 - 30, CONFIG.width / 2, 64);
  titlebg2.color = "darkcyan";
  bg.add(titlebg2);

  var title2 = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 64, "Bad", {align: "right", size: 64, color: "white"});
  fg.add(title2);

  var title3 = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2 - 16, "brakes", {align: "right", size: 96, color: "white"});
  fg.add(title3);  

  // buttons

  var bg_block = Object.create(Entity).init(CONFIG.width - 56, CONFIG.height - 18, 112, 32);
  bg_block.color = "#333";
  bg_block.z = -1;
  fg.add(bg_block);
  fg.add(Object.create(Text).init(CONFIG.width - 56, CONFIG.height - 10, "BEGIN", {size: 42, align: "center", color: "white"}));

  var begin_button = Object.create(Button).init(CONFIG.width - 56, CONFIG.height - 18, 112, 32);
  begin_button.family = "button";
  begin_button.trigger = function () {
    gameWorld.setScene(1);
  };
  begin_button.hover = function () {
    bg_block.color = "#999";
  };
  begin_button.unhover = function () {
    bg_block.color = "#333";
  };
  this.buttons.push(begin_button);
  fg.add(begin_button);

  var mute_block = Object.create(Entity).init(CONFIG.width - 48, 18, 96, 32);
  mute_block.color = "#333", mute_block.oldcolor = "#333";
  mute_block.z = -1;
  fg.add(mute_block);
  var mute_text = Object.create(Text).init(CONFIG.width - 4, 26, "MUTE", {size: 42, align: "right", color: "white"});
  fg.add(mute_text);

  var mute_button = Object.create(Button).init(CONFIG.width - 48, 18, 96, 32);
  mute_button.family = "button";
  mute_button.set = function () {
    if (gameWorld.muted && gameWorld.audioContext && gameWorld.audioContext.gn) {
      mute_text.text = "UNMUTE";
      mute_block.x = CONFIG.width - 64;
      mute_block.w = 128;
      gameWorld.audioContext.gn.gain.value = 0;
    } else if (gameWorld.audioContext && gameWorld.audioContext.gn) {
      mute_text.text = "MUTE";  
      mute_block.x = CONFIG.width - 48;
      mute_block.w = 96;    
      gameWorld.audioContext.gn.gain.value = 1;
    }
  }
  mute_button.set();
  mute_button.trigger = function () {
    gameWorld.muted = !gameWorld.muted;
    mute_button.set();
  };
  mute_button.hover = function () {
    if (mute_block.color != "#999") {
      mute_block.oldcolor = mute_block.color;
      mute_block.color = "#999";
    }
  };
  mute_button.unhover = function () {
    mute_block.color = mute_block.oldcolor;
  };
  this.buttons.push(mute_button);
  fg.add(mute_button);

  // 'best score' should be stored in localstorage && stored PER CAR type!
  if (gameWorld.score) {
    if (gameWorld.score > gameWorld.difficulties[gameWorld.difficulty].score) {
      console.log('better score');
      gameWorld.difficulties[gameWorld.difficulty].score = gameWorld.score;
      if (localStorage) {
        localStorage.setItem('shuffleData', JSON.stringify(gameWorld.difficulties));  
      }
    }
    var scoreText = Object.create(Text).init(8, 2 * CONFIG.height / 3, "You made it " + gameWorld.score + " miles!", {align: "left"});
    scoreText.addBehavior(FadeIn, {duration: 0.5});
    fg.add(scoreText);
  }
  if (localStorage) {
    if (!localStorage.shuffleData) {
      // new best score!
    }
    else {
      gameWorld.difficulties = JSON.parse(localStorage.shuffleData);
      var bestScoreText = Object.create(Text).init(8, 2 * CONFIG.height / 3 + 25, "Best distance: " + gameWorld.difficulties[gameWorld.difficulty].score + " miles!", {align: "left"});
      bestScoreText.addBehavior(FadeIn, {duration: 0.5});
      fg.add(bestScoreText); 
    }
  }

  this.selectors = [];
  this.selector_texts = [];

  console.log(gameWorld.difficulties);
  for (var i = 0; i < gameWorld.difficulties.length; i++) {
    var theta = (Math.PI / 6) * (i - gameWorld.difficulty);
    var dy = 96 * Math.sin(theta);
    var dx = 96 * Math.cos(theta);
    var d = Object.create(Sprite).init(CONFIG.width - 48, 2 * CONFIG.height / 3 + dy, Resources[gameWorld.difficulties[i].sprite]);
    d.addBehavior(Locked);
    d.level = i;
    d.opacity = (i == gameWorld.difficulty) ? 1 : 0.5;
    d.w *= (i == gameWorld.difficulty) ? 1 : 0.8;
    d.h *= (i == gameWorld.difficulty) ? 1 : 0.8;
    d.z = 2;
    this.selectors.push(d);
    fg.add(d);

    var st = [];
    var handling_text = Object.create(Text).init(CONFIG.width - 192, 2 * CONFIG.height / 3 - 12, "Handling", {align: "left", size: 24});
    st.push(handling_text);
    var h = Math.floor(10 * gameWorld.difficulties[i].handling / 500);
    for (var j = 0; j < 10; j++) {
      var e = Object.create(Entity).init(CONFIG.width - 192 + j * 10, handling_text.y + 12, 8, 8);
      e.color = j <= h ? "black" : "gray";
      st.push(e);
    }

    var speed_text = Object.create(Text).init(CONFIG.width - 192, 2 * CONFIG.height / 3 + 24, "Speed", {align: "left", size: 24});
    st.push(speed_text);
    var h = Math.floor(10 * gameWorld.difficulties[i].roadSpeed / 500);
    for (var j = 0; j < 10; j++) {
      var e = Object.create(Entity).init(CONFIG.width - 192 + j * 10, speed_text.y + 12, 8, 8);
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
      t1.z = 100;
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
      /*d.x = lerp(d.x, 72 + dx, lerpRate), */
      d.y = lerp(d.y, 2 * CONFIG.height / 3 + dy, lerpRate);
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
/*
  var block = Object.create(Entity).init(CONFIG.width / 8, CONFIG.height / 2, CONFIG.width / 4, CONFIG.height);
  block.blend = "difference";
  block.color = "#ddd";
  block.z = 10;
  fg.add(block);
*/

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
  this.onClick = function (e) {
    var b = t.fg.onButton(e.offsetX, e.offsetY);
    if (b) {
      if (b.trigger) b.trigger();
      return;
    }
  }
  this.onTouchEnd = function (e) {
    var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY;
    var b = t.fg.onButton(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    if (b) {
      if (b.trigger) b.trigger();
      return;
    }
    if (Math.abs(t.touch.y - y) < 10) {
      if (gameWorld.difficulty <= gameWorld.unlocked){
        //gameWorld.setScene(1);        
      }
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
  this.onMouseMove = function (e) {
    for (var i = 0; i < t.buttons.length; i++) {
      if (t.buttons[i].check(e.offsetX, e.offsetY)) {
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
  this.delay -= dt;
  this._gamepad.update(dt);
  if (this.doRefreshSelectors) this.refreshSelectors();
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};