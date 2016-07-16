var fullscreen = false;

function requestFullScreen () {
// we've made the attempt, at least
  fullscreen = true;
  var body = document.documentElement;
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.webkitRequestFullscreen) {
    body.webkitRequestFullscreen();
  } else if (body.mozRequestFullscreen) {
    body.mozRequestFullscreen();
  } else if (body.msRequestFullscreen) {
    body.msRequestFullscreen();
  }
}

var onStart = function () {

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);

  var text = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2, "Main Menu", {align: "center", color: "indigo"});
  fg.add(text);

  this.layers.push(fg);

  var wave = Object.create(TiledBackground).init(0, CONFIG.height - GLOBALS.scale * 8, this.width * 3, GLOBALS.scale * 32, Resources.wave_tile1);
  wave.addBehavior(Shift, {field: 'x', constant: 0.5, time: Math.random() * Math.PI});
  //wave.opacity = 0.9;
  wave.z = 3;

  var ship = Object.create(Sprite).init(200, CONFIG.height - GLOBALS.scale * 27, Resources.ship1);
  var a = ship.addBehavior(Oscillate, {field: 'angle', constant: PI / 18, time: Math.random() * Math.PI});
  ship.addBehavior(Shift, {field: 'y', constant: 0.035, time: a.time});
  
  ship.z = 2;

  var ship2 = Object.create(Sprite).init(480, CONFIG.height - GLOBALS.scale * 27, Resources.ship3);
  var a = ship2.addBehavior(Oscillate, {field: 'angle', constant: PI / 36, time: Math.random() * Math.PI});
  ship2.addBehavior(Shift, {field: 'y', constant: 0.01, time: a.time});
  ship2.opacity = 0.3;
  ship2.z = 1;
  ship2.mirrored = true;

  fg.add(ship2);
  fg.add(ship);
  fg.add(wave);

  this.onKeyDown = function (e) {
    if (e.keyCode == 13) {
      gameWorld.setScene(1, true);
    }
  }

  this.onTouchStart = function (e) {
    gameWorld.setScene(1, true);
    if (!fullscreen) requestFullScreen();
  }
  this.onClick = function (e) {
    gameWorld.setScene(1, true);
  };
  
  this._gamepad = Object.create(Gamepad).init();
  this._gamepad.buttons.start.onStart = function () {
    console.log('hey!');
    gameWorld.setScene(1, true);
  }
}

var onUpdate = function (dt) {
  this._gamepad.update(dt);

};

var onEnd = function () {
};

var onDraw = function (ctx) {
};