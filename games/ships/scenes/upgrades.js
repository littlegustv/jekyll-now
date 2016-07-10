var fullscreen = false;

var onStart = function () {

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

  this.onClick = function (e) {
    var b = fg.onButton(e.offsetX, e.offsetY);
    if (b) {
      if (b.trigger) b.trigger();
      return;
    } else {
      gameWorld.setScene(1, true);
    }
  }
  this.onMouseMove = function (e) {
    var b = fg.onButton(e.offsetX, e.offsetY);
    if (b) {
      if (b.trigger) {
        b.frame = 1;
      }
      return;
    }
  }

  this.onTouchStart = function (e) {
    gameWorld.setScene(1, true);
    if (!fullscreen) requestFullScreen();
  }
  
}

var onUpdate = function (dt) { 
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};