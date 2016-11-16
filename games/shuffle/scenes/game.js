// CONSTANTS

var LANE_SIZE = 32, MAX_SPEED = 200, THRESHOLD = 2.5;

var onStart = function () {

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

  var c = Object.create(Circle).init(Math.random() * CONFIG.width, LANE_SIZE * 3, LANE_SIZE * 2);
  c.color = "white";
  bg.add(c);

  for (var i = 0; i < 2; i ++) {  
    var o = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, (CONFIG.height + 4 * LANE_SIZE) / 2, CONFIG.width + LANE_SIZE, CONFIG.height - 4 * LANE_SIZE, Resources.road);
    o.addBehavior(Velocity);
    o.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    o.velocity = {x: -160, y: 0};
    bg.add(o);

    var ground = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 3.5 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    ground.addBehavior(Velocity);
    ground.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    ground.velocity = {x: -150, y: 0};
    bg.add(ground);
  }

  // make all BG elements scroll, wrap


  // move to separate, parallax layer

  var b2 = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width), 2.75 * LANE_SIZE, Resources.building2);
  bg.add(b2);
  var b3 = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width), 2.75 * LANE_SIZE, Resources.box);
  bg.add(b3);
  var b4 = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width), 2.75 * LANE_SIZE, Resources.cathedral);
  bg.add(b4);  

  var player = Object.create(Sprite).init(64, CONFIG.height / 2, Resources.accent);
  player.addBehavior(Velocity);
  player.addBehavior(Bound, {min: {x: 0, y: 4 * LANE_SIZE}, max: {x: CONFIG.width, y: CONFIG.height}});
  player.velocity = {x: 0, y: 0};
  var laning = player.addBehavior(LaneMovement, {lane_size: LANE_SIZE, max_speed: MAX_SPEED, threshold: THRESHOLD});
  fg.add(player);

  var cars = ["accent", "fiesta", "figaro", "malibu", "outback", "porter cab", "prius"];

  // this will be replaced by car patterns
  for (var i = 0; i < 20; i++) {
    var car = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width), Math.floor(Math.random() * (-4 + CONFIG.height / LANE_SIZE) + 4) * LANE_SIZE, Resources[choose(cars)]);
    car.addBehavior(Velocity);
    car.addBehavior(Wrap, {min: {x: 0, y: 0}, max: {x: CONFIG.width, y: CONFIG.height}});
    car.velocity = {x: - (Math.floor(Math.random() * 75) + 65), y: 0};
    fg.add(car);
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
};

var onEnd = function () {
};

var onDraw = function (ctx) {
};