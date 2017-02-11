var onStart = function () {

  ngio.callComponent("ScoreBoard.getScores", {id: 7512}, function (result) {
    scores = result.scores;
    for (var i = 0; i < 10; i++) {
      var name = i < scores.length ? scores[i].user.name : "[EMPTY]";
      var score_text = i < scores.length ? scores[i].value : "0";

      var n = Object.create(Text).init(48, 140 + i * 20, (i + 1) + ":", {align: "right", color: "black"});
      n.opacity = 0;
      n.addBehavior(FadeIn, {duration: 0.5});
      ui.add(n);

      var t = Object.create(Text).init(64, 140 + i * 20, name, {align: "left", color: "black"});
      t.opacity = 0;
      t.addBehavior(FadeIn, {duration: 0.5});
      ui.add(t);
      
      var s = Object.create(Text).init(CONFIG.width - 16, 140 + i * 20, score_text, {align: "right", color: "black"});
      s.opacity = 0;
      s.addBehavior(FadeIn, {duration: 0.5});
      ui.add(s);
    }
  });

  var ui_camera = Object.create(Camera).init(0, 0);
  var ui = Object.create(Layer).init(ui_camera);
  this.layers.push(ui);

  ui.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }

  var back_text = Object.create(Text).init(64, 12, "MAIN MENU", {size: 24, color: "black"});
  ui.add(back_text);

  var back_button = Object.create(Button).init(64, 12, 200, 18);
  back_button.trigger = function () {
    var overlay = Object.create(Entity).init(CONFIG.width + CONFIG.width / 2, CONFIG.height / 2, CONFIG.width, CONFIG.height);
    overlay.color = "#222";
    overlay.z = 100;
    overlay.addBehavior(Lerp, {goal: {x: CONFIG.width / 2, y: CONFIG.height / 2}, rate: 10});
    overlay.addBehavior(Delay, {duration: 1, callback: function () {
      gameWorld.setScene(0);
    }});
    ui.add(overlay);
  };
  back_button.hover = function () {
    back_text.color = "rgba(150,150,150,0.6)";
  };
  back_button.unhover = function () {
    back_text.color = "black";
  };
  ui.add(back_button);

  var title = Object.create(Text).init(CONFIG.width / 2, 80, "HIGH SCORES!", {size: 80, color: "black"});
  title.z = 5;
  ui.add(title);

  var wave = Object.create(TiledBackground).init(0, CONFIG.height - GLOBALS.scale * 8, CONFIG.width * 3, GLOBALS.scale * 32, Resources.wave_tile1);
  var w = wave.addBehavior(Oscillate, {field: "x", constant: 32, time: Math.random() * Math.PI, initial: Math.floor(Math.random() * 32), object: wave});
  //wave.opacity = 0.3;
  ui.add(wave);

  for (var i = 0; i < 2; i++) {
    var cloud = Object.create(Sprite).init(Math.random() * (CONFIG.width - 96) + 48, Math.random() * 100 + (title.y - 50), Resources.cloud);
    cloud.addBehavior(Wrap, {min: {x: 0, y: -CONFIG.height}, max: {x: CONFIG.width, y: CONFIG.height}});
    cloud.addBehavior(Velocity);
    cloud.z = -2;
    cloud.velocity = {x: Math.random() * SPEED.ship / 4 - SPEED.ship / 8, y: 0};
    ui.add(cloud);
  }

  //ui.add(Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2, "COMING SOON!", {size: 36, color: "black"}));

  this.buttons = [];
  this.buttons.push(back_button);

  this.onKeyDown = function (e) {
    e.preventDefault();
    return false;
  }
  var t = this;
  this.onMouseMove = function (e) {
    e.preventDefault();
    for (var i = 0; i < t.buttons.length; i++) {
      if (t.buttons[i].check(e.offsetX / gameWorld.scale, e.offsetY / gameWorld.scale)) {
        t.buttons[i].hover();
      } else {
        t.buttons[i].unhover();
      }
    }
  }

  this.onClick = function (e) {
    if (!e.offsetX) {
      e.offsetX = e.clientX - e.originalTarget.offsetLeft, e.offsetY = e.clientY - e.originalTarget.offsetTop;
    }
    var b = ui.onButton(e.offsetX, e.offsetY);
    if (b) {
      if (b.trigger) b.trigger();
      return;
    }
  }

};

var onUpdate = function (dt) {
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};