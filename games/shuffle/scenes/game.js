// CONSTANTS

var LANE_SIZE = 32, MAX_SPEED = 200, THRESHOLD = 2.5, INTERVAL = 2.5, LANE_OFFSET = 128;

var onStart = function () {

  this.interval = 0;

  var bg_camera = Object.create(Camera).init(0, 0);
  var bg = Object.create(Layer).init(bg_camera);

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);
  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }
  this.fg = fg;

  for (var i = 0; i < 2; i ++) {  
    var o = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, (CONFIG.height + 4 * LANE_SIZE) / 2, CONFIG.width + LANE_SIZE, CONFIG.height - 4 * LANE_SIZE, Resources.road);
    bg.add(o);

    var ground = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 3.5 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    bg.add(ground);
  }

  var b2 = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width), 2.75 * LANE_SIZE, Resources.building2);
  bg.add(b2);
  var b3 = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width), 2.75 * LANE_SIZE, Resources.box);
  bg.add(b3);
  var b4 = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width), 2.75 * LANE_SIZE, Resources.cathedral);
  bg.add(b4); 

  for (var i = 0; i < bg.entities.length; i++) {
    bg.entities[i].addBehavior(Velocity);
    bg.entities[i].addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    bg.entities[i].velocity = {x: -140, y: 0};
  }
  // make all BG elements scroll, wrap


  // move to separate, parallax layer


  var player = Object.create(Sprite).init(64, CONFIG.height / 2, Resources.accent);
  player.addBehavior(Velocity);
  player.addBehavior(Bound, {min: {x: 0, y: 4 * LANE_SIZE}, max: {x: CONFIG.width, y: CONFIG.height}});
  player.velocity = {x: 0, y: 0};
  var laning = player.addBehavior(LaneMovement, {lane_size: LANE_SIZE, max_speed: MAX_SPEED, threshold: THRESHOLD});
  fg.add(player);

  this.patterns = [
    [{x: 20, y: 1}, {x: 10, y: 2}, {x: 0, y: 3}, {x: 160, y: 0}, {x: 170, y: 1}, {x: 180, y: 2}]
  ]
  this.loadPattern = function () {
    var cars = ["accent", "fiesta", "figaro", "malibu", "outback", "porter cab", "prius"];

    var pattern = choose(this.patterns);
    for (var i = 0; i < pattern.length; i++) {
      var c = Object.create(Sprite).init(CONFIG.width + pattern[i].x, pattern[i].y * LANE_SIZE + LANE_OFFSET, Resources[choose(cars)]);
      c.addBehavior(Velocity);
      c.addBehavior(Crop, {min: {x: -40, y: 0}, max: {x: 1000, y: 1000}});
      c.velocity = {x: -180, y: 0};
      this.fg.add(c);
    }

  }

  this.onKeyDown = function (e) {
    e.preventDefault();
    if (e.keyCode == 38) {
      player.direction = -1;
      player.angle = Math.PI / 18 * -1;
    } else if (e.keyCode == 40) {
      player.direction = 1;
      player.angle = Math.PI / 18 * 1;
    }
    return false;
  }

  this.onKeyUp = function (e) {
    e.preventDefault();
    if (e.keyCode == 38) {
      laning.setLane();
    } else if (e.keyCode == 40) {
      laning.setLane();
    }
    return false;
  }

  this.layers.push(bg);
  this.layers.push(fg);
};

var onUpdate = function (dt) {
  if (Math.floor(this.time / INTERVAL) * INTERVAL > this.interval) {
    this.interval += INTERVAL;
    this.loadPattern();
  }
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};