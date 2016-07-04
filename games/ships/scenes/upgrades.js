var fullscreen = false;

var onStart = function () {

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);

  var text = Object.create(Text).init(CONFIG.width / 2, CONFIG.height / 2, "Upgrades", {align: "center", color: "indigo"});
  fg.add(text);

  this.layers.push(fg);

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