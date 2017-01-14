// CONSTANTS

// first bug: setScene reloads (THIS) js file, you can see it keep adding script tags to the HTML :/

var LANE_SIZE = 32, MAX_SPEED = 200, THRESHOLD = 2.5, ROAD_SPEED = 320, LANE_OFFSET = 128;
var fullscreen = false;

var onStart = function () {

  this._gamepad = Object.create(Gamepad).init();

  this.layers = [];

  var t = this;

  this.distance = 0;
  this.max_distance = 2;

  var bg_camera = Object.create(Camera).init(0, 0);
  var bg = Object.create(Layer).init(bg_camera);
  this.bg = bg;

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);
  t.fg = fg;

  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }
  bg.drawOrder = fg.drawOrder;

  for (var i = 0; i < 2; i ++) {

    var trees = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 6 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE, Resources.trees);
    trees.velocity = {x: - 2 * ROAD_SPEED / 3, y: 0};
    trees.addBehavior(Velocity);
    trees.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    trees.z = -10;
    bg.add(trees);

    var ground_low = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 7 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    bg.add(ground_low);
    ground_low.z = 1;
    ground_low.addBehavior(Velocity);
    ground_low.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    ground_low.velocity = {x: - ROAD_SPEED, y: 0};

    var road = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 8 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE, Resources.road);
    bg.add(road);
    road.addBehavior(Velocity);
    road.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    road.velocity = {x: - ROAD_SPEED, y: 0};

    var ground_lowest = Object.create(TiledBackground).init(i * CONFIG.width, 8.25 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    fg.add(ground_lowest);
    ground_lowest.addBehavior(Velocity);
    ground_lowest.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    ground_lowest.velocity = {x: - ROAD_SPEED, y: 0};
  }

  var ground_blank = Object.create(Entity).init(CONFIG.width / 2, 11 * LANE_SIZE, CONFIG.width, 5 * LANE_SIZE);
  fg.add(ground_blank);

  var player = Object.create(Sprite).init(5 * LANE_SIZE, 7 * LANE_SIZE, Resources[gameWorld.difficulties[gameWorld.difficulty].sprite]);
  player.setCollision(Polygon);
  player.setVertices([{x: -8, y: 6},
    {x: 8, y: 6},
    {x: 8, y: 12},
    {x: -8, y: 12}
  ]);
  player.jump = player.addBehavior(Jump);
  fg.add(player);
  this.player = player;

  var fade1 = Object.create(Entity).init(CONFIG.width / 2, CONFIG.height / 2, CONFIG.width, CONFIG.height);
  fade1.addBehavior(FadeOut, {duration: 0.2});
  fade1.z = 10;
  fade1.color = "white";
  fg.add(fade1);

  this.onKeyDown = function (e) {
    if (e.keyCode == 38) {
      e.preventDefault();
      return false;
    } else if (e.keyCode == 40) {
      e.preventDefault();
      console.log('mhm!');
      t.player.jump.jump();
      return false;
    } else if (e.keyCode == 32) {
      e.preventDefault();
      return false;
    }
  }

  this._gamepad.buttons.a.onStart = function (dt) {
  }
  this._gamepad.aleft.onUpdate = function (dt) {
  }

  this.touch = {x: 0, y: 0, delay: 0};
  this.onTouchStart = function (e) {
  }
  this.onTouchEnd = function (e) {
    var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY;
  }

  this.layers.push(bg);
  this.layers.push(fg);
};

var onUpdate = function (dt) {
  this._gamepad.update(dt);
  this.distance += dt;
  var t = this;
  if (this.distance > this.max_distance && !this.exiting) {
    var e = Object.create(Entity).init(CONFIG.width + 16, this.player.y, 16, 32);
    e.addBehavior(Velocity);
    e.velocity = {x: -ROAD_SPEED, y: 0};
    e.setCollision(Polygon);
    e.collision.onHandle = function (object, other) {
      if (other == t.player) {
        gameWorld.setScene(1, false);
      }
    }
    e.z = 100;
    e.color = "red";
    this.exiting = true;
    this.fg.add(e);
  }

  if (Math.random() * 100 <= 1) {
    var balloon = Object.create(Sprite).init(CONFIG.width + 4 * LANE_SIZE, 4 * LANE_SIZE, Resources.balloon);
    var color = randomColor();
    balloon.addBehavior(Velocity);
    balloon.velocity = {x: -ROAD_SPEED, y: 0};
    // offset.y should be -64 or something, or however much higher the balloon IS than the car
    balloon.rope = balloon.addBehavior(Rope, {length: 128, width: 4, color: color, offset: {x: Math.random() * 128 - 64, y: - Math.random() * 64 - 32}});
    balloon.addBehavior(Colorize, {color: color, h: balloon.h - 8, w: balloon.w - 8});
    balloon.addBehavior(Crop, {min: {x: -40, y: 0}, max: {x: 10000, y: 1000}});
    //balloon.addBehavior(Oscillate, {object: balloon.offset, field: "y", constant: 8, rate: 3, time: 0});
    balloon.setCollision(Polygon);
    balloon.setVertices(
      [
        {x: -8, y: 32},
        {x: 8, y: 32},
        {x: 8, y: 40},
        {x: -8, y: 40}
      ]
    );
    balloon.collision.onHandle = function (object, other) {
      if (other.rope) return;
      object.rope.target = other;
      // y velocity => some value, to make it 'float'
      object.velocity = {x: 0, y: 0};
    }
    this.fg.add(balloon);
  }
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};