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

  //this.layers = [];
  this.buttons = [];
  this.delay = 0.25;

  //var bg_camera = Object.create(Camera).init(0, 0);
  var bg = Object.create(Layer).init(160, 90);
  this.bg = bg;

  //var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(160, 90);
  t.fg = fg;

  fg.add(Object.create(SpriteFont).init(CONFIG.width / 2, 31, Resources.expire_font, "The NJ Turnpike", {align: "center"}));
  fg.add(Object.create(SpriteFont).init(CONFIG.width / 2, 40, Resources.expire_font, "2032 A.D.", {align: "center"}));

  //fg.add(Object.create(SpriteFont).init(10, 36, Resources.expire_font, "Welcome, to the", {}));
  //fg.add(Object.create(SpriteFont).init(10, 46, Resources.expire_font, "JERSEY", {}));
  //fg.add(Object.create(SpriteFont).init(10, 56, Resources.expire_font, "SHUFFLE", {}));


//  fg.add(Object.create(Text).init(CONFIG.width / 2, 6, "THE YEAR IS 2032", {align: "center", color: "black", size: 8}));
//  fg.add(Object.create(Text).init(CONFIG.width / 2, 12, "THE ROAD IS THE JERSEY TURNPIKE", {align: "center", color: "black", size: 8}));

//  fg.add(Object.create(Text).init(CONFIG.width / 2, 24, "THE", {align: "center", color: "black", size: 24}));
//  fg.add(Object.create(Text).init(CONFIG.width / 2, 34, "JERSEY", {align: "center", color: "black", size: 24}));
//  fg.add(Object.create(Text).init(CONFIG.width / 2, 44, "SHUFFLE", {align: "center", color: "black", size: 24}));

  // buttons

  var bg_block = Object.create(Entity).init(CONFIG.width - 25, CONFIG.height - 7, 50, 14);
  bg_block.color = "black";
  bg_block.z = 3;
  fg.add(bg_block);
  var begin_text = Object.create(SpriteFont).init(CONFIG.width, CONFIG.height - 7, Resources.expire_font, "BEGIN", {align: "right"});
  begin_text.z = 4;
  fg.add(begin_text);

  var begin_button = Object.create(Button).init(CONFIG.width - 25, CONFIG.height - 7, 50, 14);
  begin_button.family = "button";
  begin_button.trigger = function () {
    gameWorld.setScene(1);
  };
  begin_button.hover = function () {
    bg_block.color = "darkcyan";
  };
  begin_button.unhover = function () {
    bg_block.color = "black";
  };
  this.buttons.push(begin_button);
  fg.add(begin_button);

  var mute_block = Object.create(Entity).init(CONFIG.width - 20, 6, 40, 12);
  mute_block.color = "black", mute_block.oldcolor = "black";
  mute_block.z = -1;
  fg.add(mute_block);
  var mute_text = Object.create(SpriteFont).init(CONFIG.width, 5, Resources.expire_font, "MUTE", {align: "right"});
  fg.add(mute_text);

  var mute_button = Object.create(Button).init(CONFIG.width - 20, 6, 40, 12);
  mute_button.family = "button";
  mute_button.set = function () {
    if (gameWorld.muted && gameWorld.audioContext && gameWorld.audioContext.gn) {
      mute_text.text = "UNMUTE";
      mute_block.x = CONFIG.width - 30;
      mute_block.w = 60;
      gameWorld.audioContext.gn.gain.value = 0;
    } else if (gameWorld.audioContext && gameWorld.audioContext.gn) {
      mute_text.text = "MUTE";  
      mute_block.x = CONFIG.width - 20;
      mute_block.w = 40;    
      gameWorld.audioContext.gn.gain.value = 1;
    }
  }
  mute_button.set();
  mute_button.trigger = function () {
    gameWorld.muted = !gameWorld.muted;
    mute_button.set();
  };
  mute_button.hover = function () {
    if (mute_block.color != "darksalmon") {
      mute_block.oldcolor = mute_block.color;
      mute_block.color = "darksalmon";
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
      var bestScoreText = Object.create(Text).init(CONFIG.width / 2, 2 * CONFIG.height / 3 + 8, "Best distance: " + gameWorld.difficulties[gameWorld.difficulty].score + " miles!", {align: "center", size: 12});
      bestScoreText.addBehavior(FadeIn, {duration: 0.5});
      fg.add(bestScoreText); 
    }
  }

  this.selectors = [];

  for (var i = 0; i < gameWorld.difficulties.length; i++) {
    var theta = gameWorld.difficulty - i;

    var d = Object.create(Sprite).init(CONFIG.width / 2 - 16 * theta, CONFIG.height / 2 + 8, Resources[gameWorld.difficulties[i].sprite]);

    d.level = i;
    d.opacity = (i == gameWorld.difficulty) ? 1 : 0.5;

    d.z = 2;
    this.selectors.push(d);
    fg.add(d);
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
      var theta = gameWorld.difficulty - i;
      var d = this.selectors[i];
      var dx = CONFIG.width / 2 - 16 * theta;
      d.x = lerp(d.x, dx, lerpRate);

      d.opacity = (i == gameWorld.difficulty) ? 1 : 0.5;

      if (Math.abs(d.x - dx) < 1.5) {
        d.x = dx;
        this.doRefreshSelectors = false;
      }
    }
  }

  for (var i = 0; i < 2; i ++) {

    var trees = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - LANE_SIZE, CONFIG.width + LANE_SIZE, 2 * LANE_SIZE, Resources.trees);
    trees.velocity = {x: - 1 * ROAD_SPEED / 3, y: 0};
    trees.addBehavior(Velocity);
    trees.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    trees.z = -10;
    fg.add(trees);

    var ground_low = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - 2, CONFIG.width + LANE_SIZE, 4, Resources.ground);
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
      //e.preventDefault();
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.max(0, gameWorld.difficulty - 1);
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      t.doRefreshSelectors = true;
      return false;
    } else if (e.keyCode == 40) {
      //e.preventDefault();
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.min(gameWorld.difficulty + 1, gameWorld.difficulties.length - 1);  
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      t.doRefreshSelectors = true;
      return false;
    } else if (e.keyCode == 32) {
      //e.preventDefault();
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
    var b = t.fg.onButton(e.x, e.y);
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
  this.delay -= dt;
  this._gamepad.update(dt);
  if (this.doRefreshSelectors) this.refreshSelectors();
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};