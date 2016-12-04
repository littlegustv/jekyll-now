// CONSTANTS

// speeds... 300, 260 is quite fast!
// 230, 200 is 'normal?'

var LANE_SIZE = 32, MAX_SPEED = 230, THRESHOLD = 2.5, ROAD_SPEED = 200, LANE_OFFSET = 128;

//var sign_texts = ["Hoboken", "Hackensack", "Camden", "Trenton"];
var cars = ["car"];
var buildings = ["building2", "box", "cathedral", "house"];

var onStart = function () {

  this._gamepad = Object.create(Gamepad).init();
  if (!gameWorld.score) gameWorld.score = 0;

  this.layers = [];

  this.miles = function () {
    return Math.floor(200 * this.distance / (2 * 5280)) / 100;
  }

  MAX_SPEED = gameWorld.difficulties[gameWorld.difficulty].handling;
  ROAD_SPEED = gameWorld.difficulties[gameWorld.difficulty].roadSpeed;

  var t = this;
  this.distance = 0;
  this.interval = 0;
  this.bg_interval = 0;

  var bg_camera = Object.create(Camera).init(0, 0);
  var bg = Object.create(Layer).init(bg_camera);
  this.bg = bg;

  var fg_camera = Object.create(Camera).init(0, 0);
  var fg = Object.create(Layer).init(fg_camera);
  t.fg = fg;

  var ui_camera = Object.create(Camera).init(0, 0);
  var ui = Object.create(Layer).init(ui_camera);
  this.ui = ui;

  var odometer = Object.create(Text).init(20,20,"0 miles", {align: "left"});
  ui.add(odometer);
  t.odometer = odometer;

  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }
  bg.drawOrder = fg.drawOrder;
  //this.fg = fg;

  for (var i = 0; i < 2; i ++) {  
    var trees = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 2.5 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE, Resources.trees);
    trees.velocity = {x: - 3 * ROAD_SPEED, y: 0};
    trees.z = -10;
    bg.add(trees);

    var road = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, (CONFIG.height + 3 * LANE_SIZE) / 2, CONFIG.width + LANE_SIZE, CONFIG.height - 5 * LANE_SIZE, Resources.road);
    bg.add(road);

    var ground = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 3.5 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    bg.add(ground);

    var ground_low = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 11 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    fg.add(ground_low);
    ground_low.addBehavior(Velocity);
    ground_low.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    ground_low.velocity = {x: -1 * ROAD_SPEED, y: 0};
  }

  // temporary!!!
  /*
  var b2 = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width / 48) * 48, 2.75 * LANE_SIZE, Resources.building2);
  bg.add(b2);
  var b3 = Object.create(Sprite).init(b2.x + 96, 2.75 * LANE_SIZE, Resources.box);
  bg.add(b3);
  var b4 = Object.create(Sprite).init(b2.x - 96, 2.75 * LANE_SIZE, Resources.cathedral);
  bg.add(b4);
  var b4 = Object.create(Sprite).init(b2.x - 192, 2.75 * LANE_SIZE, Resources.house);
  bg.add(b4); 
*/
  // make BG scroll, using velocity
  for (var i = 0; i < bg.entities.length; i++) {
    bg.entities[i].addBehavior(Velocity);
    bg.entities[i].addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    if (!bg.entities[i].velocity.x)
      bg.entities[i].velocity = {x: -2 * ROAD_SPEED, y: 0};
  }

  var player = Object.create(Sprite).init(64, CONFIG.height / 2, Resources[gameWorld.difficulties[gameWorld.difficulty].sprite]);
  player.addBehavior(Velocity);
  player.addBehavior(Bound, {min: {x: 0, y: 4 * LANE_SIZE}, max: {x: CONFIG.width, y: CONFIG.height - LANE_SIZE}});
  player.velocity = {x: 0, y: 0};
  player.setVertices([{x: -8, y: 6},
    {x: 8, y: 6},
    {x: 8, y: 12},
    {x: -8, y: 12}
  ]);
  player.offset = {x: 0, y: -12};
  this.player = player;

  var endGame = function () {
    for (var i = 0; i < bg.entities.length; i++) {
      bg.entities[i].velocity.x = 0;
      bg.entities[i].velocity.y = 0;
    }
    for (var i = 0; i < fg.entities.length; i++) {
      fg.entities[i].velocity.x = 0;
      fg.entities[i].velocity.y = 0;
      if (fg.entities[i].oscillate) fg.entities[i].removeBehavior(fg.entities[i].oscillate);
    }
  }

  player.setCollision(Polygon);
  player.collision.onHandle = function(object, other) {
    player.crashed = true;
    player.addBehavior(Crash, {duration: 2, callback: endGame});
    player.collision.onHandle = function (object, other) {};
  }
  //CONFIG.player = player;
  //CONFIG.debug = true;
  CONFIG.scene = this;

  var laning = player.addBehavior(LaneMovement, {lane_size: LANE_SIZE, max_speed: MAX_SPEED, threshold: THRESHOLD});
  fg.add(player);

  this.patterns = [
    [
      {x: 120, y: 1}, {x: 110, y: 2}, {x: 100, y: 3}, {x: 110, y: 4}, {x: 120, y: 5}, 
      {x: 260, y: 0}, {x: 270, y: 1}, {x: 280, y: 2}, {x: 280, y: 4}, {x: 270, y: 5}, {x: 260, y: 6}
    ],
    [
      {x: 100, y: 0}, {x: 210, y: 1}, {x: 100, y: 2}, {x: 210, y: 3}, {x: 100, y: 4}, {x: 210, y: 5}, {x: 100, y: 6}
    ],
    [
      {x: 200, y: 1}, {x: 180, y: 2}, {x: 160, y: 3}, {x: 140, y: 4}, {x: 120, y: 5}, {x: 100, y: 6},
      {x: 340, y: 0}, {x: 360, y: 1}, {x: 380, y: 2}, {x: 400, y: 3}, {x: 420, y: 4}, {x: 440, y: 5}
    ],
    [
      {x: 100, y: 0}, {x: 100, y: 1}, {x: 100, y: 4}, {x: 100, y: 5}, {x: 240, y: 5}, {x: 240, y: 6}, {x: 240, y: 3}, {x: 240, y: 2}
    ],
    [
      {x: 100, y: 0}, {x: 100, y: 2}, {x: 160, y: 0}, {x: 160, y: 3}, {x: 100, y: 4}, {x: 100, y: 6}, {x: 160, y: 6}, 
      {x: 220, y: 1}, {x: 220, y: 3}, {x: 220, y: 5} 
    ]
  ]
  this.loadPattern = function () {

    var max = 0, min = 10000;
    var pattern = choose(this.patterns);
    for (var i = 0; i < pattern.length; i++) {
      var c = Object.create(Sprite).init(CONFIG.width + pattern[i].x, pattern[i].y * LANE_SIZE + LANE_OFFSET, Resources[choose(cars)]);
      c.setCollision(Polygon);
      c.offset = {x: 0, y: -12};
      c.setVertices([{x: -8, y: 6},
        {x: 8, y: 6},
        {x: 8, y: 12},
        {x: -8, y: 12}
      ]);
      c.addBehavior(Velocity);
      c.addBehavior(Crop, {min: {x: -40, y: 0}, max: {x: 10000, y: 1000}});
      c.velocity = {x: -(ROAD_SPEED + 20), y: 0};
      t.fg.add(c);
      max = Math.max(max, pattern[i].x);
      min = Math.min(min, pattern[i].x);
    }
    t.interval = max;
  }

  this.onKeyDown = function (e) {
    if (player.crashed) {
      e.preventDefault();
      gameWorld.setScene(0);
      return false;
    }
    if (e.keyCode == 38) {
      e.preventDefault();
      player.direction = -1;
      player.angle = Math.PI / 18 * -1;
      return false;
    } else if (e.keyCode == 40) {
      e.preventDefault();
      player.direction = 1;
      player.angle = Math.PI / 18 * 1;
      return false;
    }
  }

  this.onKeyUp = function (e) {
    if (e.keyCode == 38) {
      e.preventDefault();
      laning.setLane();
      return false;
    } else if (e.keyCode == 40) {
      e.preventDefault();
      laning.setLane();
      return false;
    }
  }

  // gamepad!

  var t = this;
  this._gamepad = Object.create(Gamepad).init();
  this._gamepad.aleft.onUpdate = function (dt) {
    if (Math.abs(this.y) > 0.3) {
      this.active = true;
      if (this.y < -0.3) {
        player.direction = -1;
        player.angle = Math.PI / 18 * -1;
      } else {
        player.direction = 1;
        player.angle = Math.PI / 18 * 1;
      }
    } else if (this.active) {
      laning.setLane();
      this.active = false;
    }
  }
  this._gamepad.buttons.a.onStart = function (dt) {
    if (player.crashed) {
      gameWorld.setScene(0);
    }
  }

  this.touch = {x: 0, y: 0};
  // on touch start, create a 'center point' that you swipe up or down from
  this.onTouchStart = function (e) {
    if (player.crashed) {
      gameWorld.setScene(0);
      return false;
    }
    t.touch.x = e.changedTouches[0].pageX, t.touch.y = e.changedTouches[0].pageY;
  }
  this.onTouchMove = function (e) {
    var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY;
    if (Math.abs(t.touch.y - y) < 10) {
      laning.setLane();
      return;
    }
    if (y > t.touch.y) {
      player.direction = 1;
      player.angle = Math.PI / 18 * 1;
    } else {
      player.direction = -1;
      player.angle = Math.PI / 18 * -1;
    }
  }
  this.onTouchEnd = function (e) {
    laning.setLane();
  }

  this.layers.push(bg);
  this.layers.push(fg);
  this.layers.push(ui);
};

var onUpdate = function (dt) {
  this._gamepad.update(dt);

  if (!this.player.crashed) {
    this.distance += ROAD_SPEED * dt;
    gameWorld.score = this.miles();
  }

  var spacing = 72;
  var distance_in_blocks = Math.floor(this.distance / spacing) * spacing;
  if (this.bg_interval < distance_in_blocks) {
    this.bg_interval = distance_in_blocks;
    if (Math.random() * 100 < 40) {
      var b = Object.create(Sprite).init(CONFIG.width + 96, 2.75 * LANE_SIZE, Resources[choose(buildings)]);
      b.addBehavior(Velocity);
      b.velocity = {x: -2 * ROAD_SPEED, y: 0};
      b.addBehavior(Crop, {min: {x: - CONFIG.width, y: 0}, max: {x: 2 * CONFIG.width, y: CONFIG.height}});
      b.z = 2;
      this.bg.add(b);
    }
  }

  this.odometer.text = this.miles() + " miles";
  if (this.interval > 0) {
    this.interval -= ROAD_SPEED * dt;
  } else if (!this.player.crashed) {
    this.loadPattern();
    /*
    if (Math.random() * 1000 <= 400) {
      var rs = Object.create(RoadSign).init(CONFIG.width + 64, 2 * LANE_SIZE, choose(sign_texts));
      rs.addBehavior(Velocity);
      rs.velocity = {x: -ROAD_SPEED, y: 0};
      this.bg.add(rs);
    }*/
  }

};

var onEnd = function () {
};

var onDraw = function (ctx) {
};