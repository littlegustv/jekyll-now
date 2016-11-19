// CONSTANTS

// first bug: setScene reloads (THIS) js file, you can see it keep adding script tags to the HTML :/

var LANE_SIZE = 32, MAX_SPEED = 200, THRESHOLD = 2.5, ROAD_SPEED = 160, LANE_OFFSET = 128;

var sign_texts = ["Hoboken", "Hackensack", "Camden", "Trenton"];
var cars = ["accent", "fiesta", "figaro", "outback", "porter cab", "prius"];

var onStart = function () {
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

  fg.drawOrder = function () {
    return this.entities.sort(function (a, b) { 
      if (a.z && b.z && b.z != a.z) return a.z - b.z;
      else if (a.y && b.y && a.y != b.y) return a.y - b.y;
      else return a.x - b.x;
    });
  }
  //this.fg = fg;

  for (var i = 0; i < 2; i ++) {  
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
  var b2 = Object.create(Sprite).init(Math.floor(Math.random() * CONFIG.width / 48) * 48, 2.75 * LANE_SIZE, Resources.building2);
  bg.add(b2);
  var b3 = Object.create(Sprite).init(b2.x + 96, 2.75 * LANE_SIZE, Resources.box);
  bg.add(b3);
  var b4 = Object.create(Sprite).init(b2.x - 96, 2.75 * LANE_SIZE, Resources.cathedral);
  bg.add(b4);
  var b4 = Object.create(Sprite).init(b2.x - 192, 2.75 * LANE_SIZE, Resources.house);
  bg.add(b4); 

  // make BG scroll, using velocity
  for (var i = 0; i < bg.entities.length; i++) {
    bg.entities[i].addBehavior(Velocity);
    bg.entities[i].addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    bg.entities[i].velocity = {x: -1 * ROAD_SPEED, y: 0};
  }

  var player = Object.create(Sprite).init(64, CONFIG.height / 2, Resources.accent);
  player.addBehavior(Velocity);
  player.addBehavior(Bound, {min: {x: 0, y: 4 * LANE_SIZE}, max: {x: CONFIG.width, y: CONFIG.height - LANE_SIZE}});
  player.velocity = {x: 0, y: 0};
  player.setVertices([{x: -8, y: 6},
    {x: 8, y: 6},
    {x: 8, y: 12},
    {x: -8, y: 12}
  ]);
  player.setCollision(Polygon);
  player.collision.onHandle = function(object, other) {
    gameWorld.setScene(0);
    //t.onStart();
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
      {x: 100, y: 0}, {x: 120, y: 1}, {x: 140, y: 2}, {x: 160, y: 3}, {x: 180, y: 4}, {x: 200, y: 5}
    ],
    [
      {x: 200, y: 1}, {x: 180, y: 2}, {x: 160, y: 3}, {x: 140, y: 4}, {x: 120, y: 5}, {x: 100, y: 6}
    ]
  ]
  this.loadPattern = function () {

    var max = 0;
    var pattern = choose(this.patterns);
    for (var i = 0; i < pattern.length; i++) {
      var c = Object.create(Sprite).init(CONFIG.width + pattern[i].x, pattern[i].y * LANE_SIZE + LANE_OFFSET, Resources[choose(cars)]);
      c.setCollision(Polygon);
      c.setVertices([{x: -8, y: 6},
        {x: 8, y: 6},
        {x: 8, y: 12},
        {x: -8, y: 12}
      ]);
      c.addBehavior(Velocity);
      c.addBehavior(Crop, {min: {x: -40, y: 0}, max: {x: 1000, y: 1000}});
      c.velocity = {x: -180, y: 0};
      t.fg.add(c);
      max = Math.max(max, pattern[i].x);
    }
    t.interval = max;
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
  if (this.interval > 0) {
    this.interval -= ROAD_SPEED * dt;
  } else {
    this.loadPattern();
    if (Math.random() * 1000 <= 400) {
      var rs = Object.create(RoadSign).init(CONFIG.width + 64, 2 * LANE_SIZE, choose(sign_texts));
      rs.addBehavior(Velocity);
      rs.velocity = {x: -ROAD_SPEED, y: 0};
      this.bg.add(rs);
    }
  }

};

var onEnd = function () {
};

var onDraw = function (ctx) {
};