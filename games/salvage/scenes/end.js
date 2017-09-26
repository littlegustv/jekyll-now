var onStart =  function () {
  var fg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  fg.add(Object.create(SpriteFont).init(8, gameWorld.height / 2, Resources.expire_font, "the END", {spacing: -2, align: "left"}));

  fg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 6, gameWorld.width, 12, Resources.ground));

  var b = fg.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height - 24, Resources.expire_font, "menu", {spacing: -2, align: "center"}));
  var button = fg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height - 24, gameWorld.width, 16));
  button.family = "button";
  button.opacity = 0;
  button.text = b;
  button.hover = function () { this.text.scale = 2;};
  button.unhover = function () { this.text.scale = 1; };
  button.trigger = function () {
    gameWorld.setScene(0, true);
  };

  this.onClick = function (e) {
    var b = fg.onButton(e.x, e.y);
    if (b) {
      b.trigger();
    }
  };
  this.onMouseMove = function (e) {
    var buttons = fg.entities.filter(function (e) { return e.family === "button"; });
    var b = fg.onButton(e.x, e.y);
    for (var i = 0; i < buttons.length; i++) {
      if (b == buttons[i]) b.hover();
      else buttons[i].unhover();
    }
  };
  this.onTouchMove = function (e) {
    if (fullscreen) {
      e.x = e.touch.x; e.y = e.touch.y;
      this.onMouseMove(e);
    }
  };
  this.onTouchEnd = function (e) {
    if (!fullscreen) {
      requestFullScreen();
      return;
    } else {
      e.x = e.touch.x; e.y = e.touch.y;
      var b = fg.onButton(e.x, e.y);
      console.log(e, b);
      if (b) {
        b.trigger();
      }
    }
  };
};

var onUpdate = function () {
};