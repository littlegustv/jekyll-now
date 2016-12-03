// CONSTANTS

// first bug: setScene reloads (THIS) js file, you can see it keep adding script tags to the HTML :/

var LANE_SIZE = 32, MAX_SPEED = 200, THRESHOLD = 2.5, ROAD_SPEED = 160, LANE_OFFSET = 128;

var onStart = function () {

  this._gamepad = Object.create(Gamepad).init();

  this.layers = [];

  var t = this;
  this.distance = 0;
  this.interval = 0;

  var bg_camera = Object.create(Camera).init(0, 0);
  var bg = Object.create(Layer).init(bg_camera);
  this.bg = bg;

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);
  t.fg = fg;

  var title1 = Object.create(Text).init(CONFIG.width / 2 - 12, CONFIG.height / 2 - 12, "The", {align: "right", size: 48, color: "black"});
  fg.add(title1);

  var title2 = Object.create(Text).init(CONFIG.width / 2 - 12, CONFIG.height / 2 - 12, "Jersey", {align: "left", size: 96, color: "black"});
  fg.add(title2);

  var title3 = Object.create(Text).init(CONFIG.width / 2 - 80, CONFIG.height / 2 + 38, "Shuffle", {align: "left", size: 108, color: "black"});
  fg.add(title3);  

  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }
  //this.fg = fg;

  for (var i = 0; i < 2; i ++) {

    var trees = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 10 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE, Resources.trees);
    trees.velocity = {x: - 1 * ROAD_SPEED / 3, y: 0};
    trees.addBehavior(Velocity);
    trees.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    trees.z = -10;
    fg.add(trees);

    var ground_low = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 11 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    fg.add(ground_low);
    ground_low.addBehavior(Velocity);
    ground_low.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    ground_low.velocity = {x: -1 * ROAD_SPEED / 2, y: 0};
  }

  this.onKeyDown = function (e) {
    e.preventDefault();
    gameWorld.setScene(1);
    return false;
  }

  this._gamepad.buttons.a.onStart = function (dt) {
    gameWorld.setScene(1);
  }

  this.layers.push(bg);
  this.layers.push(fg);
};

var onUpdate = function (dt) {
  this._gamepad.update(dt);
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};