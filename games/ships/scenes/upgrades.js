var fullscreen = false;

var onStart = function () {

  var scene = this;

  this.mouse = {x: -1, y: -1};

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);

  var text = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2, "Upgrades", {align: "center", color: "indigo"});
  fg.add(text);


  var doubleButton = Object.create(Button).init(64, 64, Resources.icon_upgrade);
  doubleButton.trigger = function () {
    currentShoot = doubleShoot;
  };
  fg.add(doubleButton);

  var scatterButton = Object.create(Button).init(128, 64, Resources.icon_upgrade);
  scatterButton.trigger = function () {
    currentShoot = scatterShoot;
  };
  fg.add(scatterButton);

  this.layers.push(fg);
  this.fg = fg;

  this.onClick = function (e) {
    scene.mouse = {x: e.offsetX, y: e.offsetY};    
    var b = fg.onButton(scene.mouse.x, scene.mouse.y);
    if (b) {
      if (b.trigger) b.trigger();
      return;
    } else {
      gameWorld.setScene(1, true);
    }
  }

  this.onMouseMove = function (e) {
    scene.mouse = {x: e.offsetX, y: e.offsetY};
  }

  this.onTouchStart = function (e) {
    gameWorld.setScene(1, true);
    if (!fullscreen) requestFullScreen();
  }
  
}

var onUpdate = function (dt) { 
  var b = this.fg.onButton(this.mouse.x, this.mouse.y);
  if (b) {
    if (b.trigger) {
      b.frame = 1;
    }
    return;
  }
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};