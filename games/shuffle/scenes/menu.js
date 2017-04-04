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
    gameWorld.engineLoop = function () {
      gameWorld.engine = gameWorld.playSound(Resources.engineloop);
      gameWorld.engine.onended = gameWorld.engineLoop;
    }
    gameWorld.engineLoop();
  }

  this.buttons = [];
  this.delay = 0.25;

  var bg = Object.create(Layer).init(160, 90);
  this.bg = bg;

  var fg = Object.create(Layer).init(160, 90);
  t.fg = fg;

  fg.add(Object.create(SpriteFont).init(CONFIG.width / 2, 6, Resources.expire_font, "The Jersey Shuffle", {align: "center", spacing: -2}));


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

  var score_sprite = fg.add(Object.create(Sprite).init(10, 4, Resources.score));
  score_sprite.removeBehavior(score_sprite.behaviors[0]);

  var score_button = Object.create(Button).init(20, 6, 40, 12);
  score_button.family = "button";
  score_button.trigger = function () {
    gameWorld.setScene(3);
  };
  score_button.hover = function () {
    score_sprite.frame = 1;
  };
  score_button.unhover = function () {
    score_sprite.frame = 0;
  };
  this.buttons.push(score_button);
  fg.add(score_button);

  // 'best score' should be stored in localstorage && stored PER CAR type!
  if (gameWorld.score) {
    if (gameWorld.score > gameWorld.difficulties[gameWorld.difficulty].score) {
      console.log('better score');
      gameWorld.difficulties[gameWorld.difficulty].score = gameWorld.score;
      ngio.callComponent('ScoreBoard.postScore', {id: gameWorld.difficulties[gameWorld.difficulty].board, value: gameWorld.score}, function (result) {
        console.log(result);
      });
    }
    if (localStorage) {
      console.log('setting...');
      localStorage.setItem('shuffleData', JSON.stringify({scores: gameWorld.difficulties.map(function (d) {
        return {score: d.score}
      }), unlocked: gameWorld.unlocked, difficulty: gameWorld.difficulty, muted: gameWorld.muted}));  
    }
/*    var scoreText = Object.create(Text).init(8, 2 * CONFIG.height / 3, "You made it " + gameWorld.score + " miles!", {align: "left"});
    scoreText.addBehavior(FadeIn, {duration: 0.5});
    fg.add(scoreText);*/
  }
  
  

  this.selectors = [];

  for (var i = 0; i < gameWorld.difficulties.length; i++) {
    var theta = gameWorld.difficulty - i;

    var d = Object.create(Sprite).init(44 - 8 * theta, gameWorld.height / 4 + 24, Resources[gameWorld.difficulties[i].sprite]);
    
    d.level = i;
    d.addBehavior(Locked);
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

  var d_name = fg.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height / 4 + 2, Resources.expire_font, "", {align: "center", spacing: -2}));
  d_name.z = 20;

  var d_speed = fg.add(Object.create(EntityRight).init(Math.floor(gameWorld.width / 2) + 16, 40.5, 0, 11));
  var d_handling = fg.add(Object.create(EntityRight).init(Math.floor(gameWorld.width / 2) + 16, 52.5, 0, 11));
 
  var d_score = fg.add(Object.create(Entity).init(Math.floor(gameWorld.width / 4), 74.5, gameWorld.width / 2 - 8, 11));
  d_score.color = "darksalmon";

  var last_score = fg.add(Object.create(Entity).init(Math.floor(3 * gameWorld.width / 4), 74.5, gameWorld.width / 2 - 8, 11));
  last_score.color = "#03a9f4";

  fg.add(Object.create(Sprite).init(gameWorld.width / 2 + 26, 40.5, Resources.power)).z = 10;
  fg.add(Object.create(Sprite).init(gameWorld.width / 2 + 26, 52.5, Resources.handling)).z = 10;
  //fg.add(Object.create(Sprite).init(gameWorld.width / 2 + 18, 48.5, Resources.score)).z = 10;
  //fg.add(Object.create(Sprite).init(2 * gameWorld.width / 3 + 28, 2 * gameWorld.height / 3 - 6, Resources.distance)).z = 10;
  var last_score_text = fg.add(Object.create(SpriteFont).init(
    last_score.x, 
    last_score.y, 
    Resources.expire_font, 
    "Last: " + gameWorld.score + "m", 
    {align: "center", spacing: -3}
  ));
  last_score_text.z = 10;
  var best_score_text = fg.add(Object.create(SpriteFont).init(
    d_score.x, 
    d_score.y, 
    Resources.expire_font,
    "Best: " + gameWorld.score + "m",
    {align: "center", spacing: -3}
  ));
  best_score_text.z = 10;

  d_speed.lerp = d_speed.addBehavior(Lerp, {goal: 0, field: "w", rate: 5, object: d_speed});
  d_handling.lerp = d_handling.addBehavior(Lerp, {goal: 0, field: "w", rate: 5, object: d_handling});
  //d_score.lerp = d_score.addBehavior(Lerp, {goal: 0, field: "w", rate: 5, object: d_score});

  this.doRefreshSelectors = true;
  this.refreshSelectors = function () {
    var lerpRate = 0.2;
    var done = 0;
    for (var i = 0; i < this.selectors.length; i++) {
      var theta = gameWorld.difficulty - i;
      var d = this.selectors[i];
      var dx = 60 - 32 * Math.sin((PI2 * theta) / gameWorld.difficulties.length);
      d.x = lerp(d.x, dx, lerpRate);
      d.scale = 2.4 * Math.abs(Math.cos(PI * theta / gameWorld.difficulties.length));

      d.opacity = 1 - Math.abs(Math.sin(PI * theta / gameWorld.difficulties.length));
      d.z = 10 - Math.abs(Math.sin(PI * theta / gameWorld.difficulties.length));

      d_name.text = "'" + gameWorld.difficulties[gameWorld.difficulty].name + "'";
      d_speed.lerp.goal = Math.floor(gameWorld.difficulties[gameWorld.difficulty].roadSpeed / 3);
      d_handling.lerp.goal = Math.floor(gameWorld.difficulties[gameWorld.difficulty].handling / 3);
      //d_score.lerp.goal = Math.floor(gameWorld.difficulties[gameWorld.difficulty].score * 16 + 11);

      //last_score.h = 10 + 16 * gameWorld.score;
      //console.log('mm', (Math.floor(gameWorld.score * 16 * 10) / 10))
      last_score_text.text = "Last: " + gameWorld.score + "m";
      best_score_text.text = "Best: " + gameWorld.difficulties[gameWorld.difficulty].score + "m";
      last_score.color = gameWorld.difficulties[gameWorld.difficulty].secondary;
      d_score.color = gameWorld.difficulties[gameWorld.difficulty].primary;

      if (Math.abs(d.x - dx) < 1.5) {
        d.x = dx;
        done += 1;
        if (done == gameWorld.difficulties.length) {
          this.doRefreshSelectors = false;          
        }
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
      gameWorld.difficulty = modulo(gameWorld.difficulty - 1, gameWorld.difficulties.length);
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      t.doRefreshSelectors = true;
      return false;
    } else if (e.keyCode == 40) {
      //e.preventDefault();
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = modulo(gameWorld.difficulty + 1, gameWorld.difficulties.length);
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      t.doRefreshSelectors = true;
      return false;
    } else if (e.keyCode == 32) {
      //e.preventDefault();
      if (gameWorld.difficulty <= gameWorld.unlocked) {
        if (gameWorld.difficulty < gameWorld.difficulties.length - 1) {
          gameWorld.setScene(1, true);
        } else {
          gameWorld.setScene(2, true);
        }
        gameWorld.playSound(Resources.squeal);
      }
      else {
        //gameWorld.playSound(Resources.error);
      }
      return false;
    }
  }

  this._gamepad.buttons.a.onStart = function (dt) {
    if (t.delay <= 0)
      if (gameWorld.difficulty <= gameWorld.unlocked)
        if (gameWorld.difficulty < gameWorld.difficulties.length - 1) {
          gameWorld.setScene(1, true);
        } else {
          gameWorld.setScene(2, true);
        }
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
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.max(0, gameWorld.difficulty - 1);
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      this.delay = 0.3;
      t.doRefreshSelectors = true;
    } else if (this.y > 0.3) {
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeOut() });
      gameWorld.difficulty = Math.min(gameWorld.difficulty + 1, gameWorld.difficulties.length - 1);  
      //t.selector_texts[gameWorld.difficulty].forEach( function (st) { st.fadeIn() });
      this.delay = 0.3;
      t.doRefreshSelectors = true;
    }
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
  this.doRefreshSelectors = true;    
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