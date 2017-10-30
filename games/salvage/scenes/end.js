var onStart =  function () {
  //Resources.music = Resources.menu;

  var fg = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
  var bg = fg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  bg.color = "black";
  bg.z = -10;
  var grid = fg.add(Object.create(TiledBackground).init(MIN.x, MIN.y, 2 * Math.ceil(WIDTH / TILESIZE) * TILESIZE, 2 * Math.ceil(HEIGHT / TILESIZE) * TILESIZE, Resources.grid));
  grid.z = -9;

  fg.add(Object.create(SpriteFont).init(8, gameWorld.height / 2 - 16, Resources.expire_font, ENDINGS[gameWorld.ending], {spacing: -2, align: "left"}));
  fg.add(Object.create(SpriteFont).init(8, gameWorld.height / 2, Resources.expire_font, "Ending " + (gameWorld.ending + 1) + " of " + ENDINGS.length, {spacing: -2, align: "left"})).opacity = 0.8;

  fg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height - 6, gameWorld.width, 12, Resources.ground));
  
  if (gameWorld.ending === 2 || gameWorld.ending === 3) {

    var gate = fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height - 8, Resources.gate));
    gate.z = 10;
    gate.animation = 2;
    gate.angle = PI;

    var player = fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height - 32, Resources.viper));
    player.angle = -PI / 2;
    player.addBehavior(Velocity);
    player.addBehavior(Accelerate);
    player.velocity = {x: 0, y: -10};
    player.acceleration = {x: 0, y: -80};
    player.addBehavior(Periodic, {period: 0.2, callback: function () {
      var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.dust));
      d.z = this.entity.z - 1;
      d.behaviors[0].onEnd = function () {
        this.entity.alive = false;
      };
      d.addBehavior(Velocity);
      d.velocity = {x: 0, y: - this.entity.velocity.y};
    }});
  } else if (gameWorld.ending === 4) {
    // insurrection
    var wreck = fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height - 12, Resources.boss));
    wreck.angle = PI / 6;
    wreck.addBehavior(Periodic, {period: 0.1, callback: function () {
      if (Math.random() > 0.5) {        
        var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.dust));
        d.z = this.entity.z - 1;
        d.behaviors[0].onEnd = function () {
          this.entity.alive = false;
        };
        d.addBehavior(Velocity);
        d.velocity = {x: 0, y: - 40};
      }
    }});
  } else {
    var wreck = fg.add(Object.create(Sprite).init(gameWorld.width / 2, gameWorld.height - 12, Resources.viper));
    wreck.angle = PI / 6;
    wreck.addBehavior(Periodic, {period: 0.1, callback: function () {
      if (Math.random() > 0.5) {        
        var d = this.entity.layer.add(Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.dust));
        d.z = this.entity.z - 1;
        d.behaviors[0].onEnd = function () {
          this.entity.alive = false;
        };
        d.addBehavior(Velocity);
        d.velocity = {x: 0, y: - 40};
      }
    }});
    // add tombstone    
  }

  var b = fg.add(Object.create(SpriteFont).init(48, gameWorld.height - 24, Resources.expire_font, "menu", {spacing: -2, align: "center"}));
  var button = fg.add(Object.create(Entity).init(48, gameWorld.height - 24, gameWorld.width, 16));
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