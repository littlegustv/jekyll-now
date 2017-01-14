// CONSTANTS

// speeds... 300, 260 is quite fast!
// 230, 200 is 'normal?'

// these variables are conflicting between 'exit' and 'game' - find a better place for them!!!
var LANE_SIZE = 32, MAX_SPEED = 230, THRESHOLD = 2.5, ROAD_SPEED = 200, LANE_OFFSET = 128;
var GOAL_DISTANCE = 0.01, goal_passed = false;

//var sign_texts = ["Hoboken", "Hackensack", "Camden", "Trenton"];
var cars = ["smart"];
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

    var ground_low = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, 11 * LANE_SIZE - 8, CONFIG.width + LANE_SIZE, LANE_SIZE / 2, Resources.ground);
    fg.add(ground_low);
    ground_low.addBehavior(Velocity);
    ground_low.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    ground_low.velocity = {x: -1 * ROAD_SPEED, y: 0};
  }

  // make BG scroll, using velocity
  for (var i = 0; i < bg.entities.length; i++) {
    bg.entities[i].addBehavior(Velocity);
    bg.entities[i].addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    if (!bg.entities[i].velocity.x)
      bg.entities[i].velocity = {x: -2 * ROAD_SPEED, y: 0};
  }

  var player = Object.create(Sprite).init(64, /*CONFIG.height - 5 * LANE_SIZE*/CONFIG.height / 2, Resources[gameWorld.difficulties[gameWorld.difficulty].sprite]);
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
    if (other.exit) {
      other.alive = false;
      console.log('exiting!');
      gameWorld.setScene(2);
    } else {
      gameWorld.playSound(Resources.crash);
      gameWorld.playSound(Resources.explode);
      player.crashed = true;
      player.addBehavior(Crash, {duration: 2, callback: endGame});
      player.collision.onHandle = function (object, other) {};
    }
  }
  //CONFIG.player = player;
  //CONFIG.debug = true;
  CONFIG.scene = this;
/*
  var Tracks = Object.create(Behavior);
  Tracks.update = function (dt) {
    for (var i = 0; i < 2; i++) {
      var e = Object.create(Entity).init(this.entity.x - 12 + i * 24, this.entity.y + 16, 4, 4);
      e.color = "#111";
      e.addBehavior(FadeOut, {duration: 3});
      e.addBehavior(Velocity);
      e.velocity = {x: -ROAD_SPEED, y: 0};
      e.addBehavior(Crop, {min: {x: -100, y: 0,}, max: {x: 10000, y: 10000}});
      e.z = -1;
      t.fg.add(e);
    }
  };
  player.addBehavior(Tracks, {});
*/
  var laning = player.addBehavior(LaneMovement, {lane_size: LANE_SIZE, max_speed: MAX_SPEED, threshold: THRESHOLD});
  this.laning = laning;
  fg.add(player);

  this.last_lane = 0;

  // - add 'tricks'; where there are 'two' destinations but only ONE is real
  // - further jumble 'non-essential' cars
  // - increase difficulty!
  this.loadPattern = function () {
    var start = 100, lane = this.last_lane;
    var t = this;
    // choose new lane
    var destination = modulo(lane + Math.floor(Math.random() * 7), 7);
    
    // create 'fakes' -> up to... two?
    var fakes = [];
    var fake_chance = Math.random();
    if (fake_chance < 0.4)
      fakes.push(modulo(destination + Math.floor(Math.random() * 6) + 1, 7))
    if (fake_chance < 0.2)  
      fakes.push(modulo(destination + Math.floor(Math.random() * 6) + 1, 7))
    
    // choose the amount of space required (number of lanes * 20)
    start += Math.abs(destination - lane) * 25;
    for (var i = 0; i <= 6; i++) {
      // fill in all the lanes except the destination with cars
      var x = undefined;
      if ((i > destination && i <= lane) || (i < destination && i >= lane)) {
        // offset them appropriately
        x = start + Math.abs(destination - i) * 20;
        // creates the car
        
      } else if (i != destination && fakes.indexOf(i) == -1) {
        x = start + (Math.floor(Math.random() * 4) - 2) * 15;
      } else if (i != destination) {
        // create exit, sometimes
        if (Math.random() * 100 < 100) {
          console.log('creating exit');
          var exit = Object.create(Entity).init(CONFIG.width + start + (Math.floor(Math.random() * 4) - 2) * 15, i * LANE_SIZE + LANE_OFFSET, 2 * LANE_SIZE, LANE_SIZE);
          exit.color = "red";
          exit.setCollision(Polygon);
          exit.exit = true;
          exit.addBehavior(Velocity);
          exit.addBehavior(Crop, {min: {x: -40, y: 0}, max: {x: 10000, y: 1000}});
          exit.velocity = {x: -(ROAD_SPEED + 20), y: 0};
          this.fg.add(exit);
        }
      }

      if (x) {
        // unlocks next 'level' if passed!
        if (gameWorld.difficulty < 2 && this.miles() > GOAL_DISTANCE && !this.goal_passed && Math.random() <= 0.3) {
          var c = Object.create(Sprite).init(CONFIG.width + x, i * LANE_SIZE + LANE_OFFSET, Resources[gameWorld.difficulties[gameWorld.difficulty + 1].sprite]);
          c.addBehavior(Unlock, {level: gameWorld.difficulty + 1});
          this.goal_passed = true;
        } else {
          var c = Object.create(Sprite).init(CONFIG.width + x, i * LANE_SIZE + LANE_OFFSET, Resources[choose(cars)]);
        }
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
        this.fg.add(c);
      }
    }
    this.interval = start;
    this.last_lane = destination;
  }

  this.onKeyDown = function (e) {
    if (player.crashed) {
      e.preventDefault();
      gameWorld.setScene(0);
      return false;
    }
    if (e.keyCode == 38) {
      e.preventDefault();
      //if (player.direction == 0)
      //  gameWorld.playSound(Resources.pass);
      player.direction = -1;
      player.angle = Math.PI / 18 * -1;
      return false;
    } else if (e.keyCode == 40) {
      e.preventDefault();
      //if (player.direction == 0)
      //  gameWorld.playSound(Resources.pass);
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

  if (this.goal && this.distance > this.goal.x) {
    console.log('passed goal!!');
    this.goal = null;
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