var fullscreen = false;

var onStart = function () {

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);

  var text = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2, "Upgrades", {align: "center", color: "indigo"});
  fg.add(text);


  var doubleButton = Object.create(Sprite).init(64, 64, Resources.ship2);
  doubleButton.behaviors = [];
  doubleButton.addBehavior(HighLight, {duration: 0.5});
  doubleButton.family = 'button';
  doubleButton.trigger = function () {
    currentShoot = doubleShoot;
  };
  fg.add(doubleButton);

  this.layers.push(fg);

  this.onClick = function (e) {
    var b = fg.onButton(e.offsetX, e.offsetY);
    if (b) {
      if (b.trigger) b.trigger();
      return;
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
  this.onClick = function (e) {
    gameWorld.setScene(1, true);
  };
  
}

var onUpdate = function (dt) { 
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};