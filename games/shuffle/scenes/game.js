/*

TODO:

1. record backup of audio from piano, backup to USB as well!

functional:::

1. car collisions, offsets, and bounds
2. scene.reload is not working/triggering

3. localstorage (max distance for each car)
4. controls (esp. touch/gamepad for buttons)
5. GW bridge level (maybe car-> GW BRIDGE REPAIR VEHICLE)
6. 'unlock' behavior finalized (i.e. you unlock the new car, keep current car, see how far you can go?)

flavor:

1. car names, visuals (handling? speed?), trees appearance, houses/decoration
2. scene transitions
3. permanance ('wrecks' of failde attampts? or failed LAST attempt?)
  - upsides down, smoke particle effect?
4. descriptive text? visuals?
5. more cars? how many?
6. logo/title image

publishing:

1. cross-browser compat. (esp. sound files!)s
2. performance testing
3. promo images/gifs/mini video clips
4. links!

*/


// CONSTANTS

// speeds... 300, 260 is quite fast!
// 230, 200 is 'normal?'

// these variables are conflicting between 'exit' and 'game' - find a better place for them!!!

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

  HANDLING = gameWorld.difficulties[gameWorld.difficulty].handling;
  ROAD_SPEED = gameWorld.difficulties[gameWorld.difficulty].roadSpeed;
  CAR_SPEED =  gameWorld.difficulties[gameWorld.difficulty].roadSpeed + 5;

  var t = this;
  this.distance = 0;
  this.tenth_distance = 0;
  this.goal_distance = GOAL_DISTANCE;
  this.interval = 0;
  this.bg_interval = 0;

  var bg = Object.create(Layer).init(320, 180);
  this.bg = bg;

  var fg = Object.create(Layer).init(320, 180);
  t.fg = fg;

  var ui = Object.create(Layer).init(320, 180);
  this.ui = ui;

/*  var odometer = Object.create(Text).init(20,20,"0 miles", {align: "left"});
  ui.add(odometer);
  t.odometer = odometer;*/

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
    
    var trees = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - 8 * LANE_SIZE, CONFIG.width + LANE_SIZE, LANE_SIZE * 2, Resources.trees);
    trees.velocity = {x: - 2.5 * ROAD_SPEED, y: 0};
    trees.z = -10;
    bg.add(trees);

    var road = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - 7 * LANE_SIZE / 2, CONFIG.width + LANE_SIZE, 7 * LANE_SIZE, Resources.road);
    bg.add(road);

    var ground = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - 7 * LANE_SIZE - 2, CONFIG.width + LANE_SIZE, 4, Resources.ground);
    bg.add(ground);

    var ground_low = Object.create(TiledBackground).init(i * CONFIG.width + CONFIG.width / 2, CONFIG.height - 2, CONFIG.width + LANE_SIZE, 4, Resources.ground);
    fg.add(ground_low);
    ground_low.addBehavior(Velocity);
    ground_low.addBehavior(Wrap, {min: {x: -CONFIG.width / 2, y: 0}, max: {x: CONFIG.width + CONFIG.width / 2, y: CONFIG.height}});
    ground_low.velocity = {x: -2 * ROAD_SPEED, y: 0};
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
  //player.addBehavior(Bound, {min: {x: 0, y: 4.5 * LANE_SIZE}, max: {x: CONFIG.width, y: CONFIG.height - LANE_SIZE / 2}});
  player.velocity = {x: 0, y: 0};
  player.setVertices([{x: -4, y: 3},
    {x: 4, y: 3},
    {x: 4, y: 6},
    {x: -4, y: 6}
  ]);
  player.addBehavior(Trail, {});
  player.offset = {x: 0, y: -6};
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
/*
  player.setCollision(Polygon);
  player.collision.onHandle = function(object, other) {
    if (other.rescue) {
      gameWorld.playSound(Resources.beepbeep);
      var old_sprite = object.sprite, old_position = {x: object.x, y: object.y};
      object.sprite = other.sprite;
      object.x = other.x, object.y = other.y;
      other.sprite = old_sprite, other.x = old_position.x, other.y = old_position.y;
      other.addBehavior(FadeOut, {duration: 0.5, remove: true});
      object.addBehavior(Delay, {duration: 0.5, callback: function () {
        fg.paused = 3, bg.paused = 3;
        //goalMessage(ui, true);
      }});
      gameWorld.difficulty += 1;
      CAR_SPEED = gameWorld.difficulties[gameWorld.difficulty].roadSpeed + 20;
      ROAD_SPEED = gameWorld.difficulties[gameWorld.difficulty].roadSpeed;
      HANDLING = gameWorld.difficulties[gameWorld.difficulty].handling;
      //object.velocity.x = CAR_SPEED;
      gameWorld.unlocked = gameWorld.difficulty;
    }
    else {
      gameWorld.playSound(Resources.crash);
      gameWorld.playSound(Resources.explode);
      player.crashed = true;
      //player.addBehavior(Crash, {duration: 2, callback: endGame});
      player.collision.onHandle = function (object, other) {};
      endGame();
      var expl = Object.create(Sprite).init(player.x, player.y + 1, Resources.explosion);
      player.layer.add(expl);
      expl.addBehavior(Delay, {duration: 1, callback: function () {
        this.entity.alive = false;
        gameWorld.setScene(0);
      }})
    }
  }*/
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
  player.addBehavior(Tracks, {});*/

  // buttons

  this.buttons = [];

  var mute_block = Object.create(Entity).init(CONFIG.width - 20, 6, 40, 12);
  mute_block.color = "black", mute_block.oldcolor = "black";
  mute_block.z = -1;
  ui.add(mute_block);
  var mute_text = Object.create(SpriteFont).init(CONFIG.width, 5, Resources.expire_font, "MUTE", {align: "right"});
  ui.add(mute_text);

  var mute_button = Object.create(Button).init(CONFIG.width - 20, 6, 40, 12);
  mute_button.family = "button";
  mute_button.set = function () {
    if (gameWorld.muted && gameWorld.audioContext && gameWorld.audioContext.gn) {
      mute_text.text = "UNMUTE";
      mute_block.x = CONFIG.width - 30;
      mute_block.w = 60;
      gameWorld.audioContext.gn.gain.value = 0;
    } else if (gameWorld.audioContext && gameWorld.audioContext.gn) {
      mute_text.text = "MUTE";  
      mute_block.x = CONFIG.width - 20;
      mute_block.w = 40;    
      gameWorld.audioContext.gn.gain.value = 1;
    }
  }
  mute_button.set();
  mute_button.trigger = function () {
    gameWorld.muted = !gameWorld.muted;
    mute_button.set();
  };
  mute_button.hover = function () {
    if (mute_block.color != "darksalmon") {
      mute_block.oldcolor = mute_block.color;
      mute_block.color = "darksalmon";
    }
  };
  mute_button.unhover = function () {
    mute_block.color = mute_block.oldcolor;
  };
  this.buttons.push(mute_button);
  ui.add(mute_button);


  var laning = player.addBehavior(LaneMovement, {lane_size: LANE_SIZE, max_speed: HANDLING, threshold: THRESHOLD});
  this.laning = laning;
  player.laning = laning;
  fg.add(player);

  this.last_lane = 0;

  this.difficultyFormula = function () {
    // pure 'base-line' possiblity = CAR_SPEED * LANE_SIZE / HANDLING (too hard, though!!)
    return 2 * CAR_SPEED * LANE_SIZE / HANDLING;
  }

  // - add 'tricks'; where there are 'two' destinations but only ONE is real
  // - further jumble 'non-essential' cars
  // - increase difficulty!
  this.loadPattern = function () {
    // not if we are 'exiting' the level...
    if (this.player.transition) return;
    if (this.fg.paused > 0) return;

    var lane = this.last_lane;
    var t = this;
    if (this.distance >= this.goal_distance) {
      // should only happen once
      this.goal_distance += GOAL_DISTANCE;
      var s = Object.create(Sprite).init(CONFIG.width * 1.5, LANE_OFFSET + 3 * LANE_SIZE, Resources[gameWorld.difficulties[(gameWorld.difficulty + 1) % gameWorld.difficulties.length].sprite]);
      s.rescue = true;
      s.addBehavior(Velocity);
      s.setCollision(Polygon);
      s.offset = {x: 0, y: -12};
      s.setVertices([{x: -8, y: -CONFIG.height / 2},
        {x: 8, y: -CONFIG.height / 2},
        {x: 8, y: CONFIG.height / 2},
        {x: -8, y: CONFIG.height / 2}
      ]);
      s.addBehavior(Crop, {min: {x: -40, y: 0}, max: {x: 10000, y: 1000}});
      s.velocity = {x: -CAR_SPEED, y: 0};
      this.fg.add(s);
      this.interval = CONFIG.width * 1.5;
      console.log(s, this.interval);
      return;
    }

    // choose new lane
    var destination = this.NEXT || modulo(lane + Math.floor(Math.random() * 5 + 1), 7);
    var start = Math.abs(destination - lane) * this.difficultyFormula();
    for (var i = 0; i <= 6; i++) {
    	if (i != destination) {
        var s = start - start * Math.abs(i - destination) / 7;
				var c = Object.create(Sprite).init(CONFIG.width + s, i * LANE_SIZE + LANE_OFFSET, Resources[choose(cars)]);
    		c.setCollision(Polygon);
        c.offset = {x: 0, y: -12};
        c.setVertices([{x: -4, y: 3},
          {x: 4, y: 3},
          {x: 4, y: 6},
          {x: -4, y: 6}
        ]);        
        c.addBehavior(Velocity);
        c.addBehavior(Crop, {min: {x: -40, y: 0}, max: {x: 10000, y: 1000}});
        c.velocity = {x: -CAR_SPEED, y: 0};
        this.fg.add(c);
      }
    }
    this.interval = start + 24;
    this.last_lane = destination;
    /*
    var d = Object.create(Entity).init(CONFIG.width + this.interval / 2, CONFIG.height / 2, this.interval + 8, CONFIG.height);
    d.color = choose(["green", "red", "blue"]);
    d.opacity = 0.8;
    d.addBehavior(Velocity);
    d.addBehavior(Crop, {min: {x: -40 - this.interval / 2, y: 0}, max: {x: 10000, y: 1000}});
    d.velocity = {x: -CAR_SPEED, y: 0};
    d.blend = "screen";
    this.fg.add(d);
*/
  }

  this.onKeyDown = function (e) {
    if (fg.paused > 0) {
      for (var i = 0; i < t.goal_messages.length; i++) {
        t.goal_messages[i].alive = false;
      }
      fg.paused = 0;
    }
    if (bg.paused > 0) bg.paused = 0;

    if (player.crashed) {
//      e.preventDefault();
      gameWorld.setScene(0);
      return false;
    }
    if (e.keyCode == 38) {
//      e.preventDefault();
      //if (player.direction == 0)
      //  gameWorld.playSound(Resources.pass);
      player.direction = -1;
      //laning.move(-1);
      player.angle = Math.PI / 18 * -1;
      return false;
    } else if (e.keyCode == 40) {
      //e.preventDefault();
      //if (player.direction == 0)
      //  gameWorld.playSound(Resources.pass);
      player.direction = 1;
      //laning.move(1);
      player.angle = Math.PI / 18 * 1;
      return false;
    }
  }

  this.onKeyUp = function (e) {
    if (e.keyCode == 38) {
      //e.preventDefault();
      laning.setLane();
      return false;
    } else if (e.keyCode == 40) {
      //e.preventDefault();
      laning.setLane();
      return false;
    }
  }

  // gamepad!

  var t = this;
  this._gamepad = Object.create(Gamepad).init();
  this._gamepad.aleft.onUpdate = function (dt) {
    console.log('bad');
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
    console.log('bad');
    if (player.crashed) {
      gameWorld.setScene(0);
    }
    if (fg.paused > 0) fg.paused = 0;
    if (bg.paused > 0) bg.paused = 0; 
  }

  this.touch = {x: 0, y: 0};
  // on touch start, create a 'center point' that you swipe up or down from
  this.onTouchStart = function (e) {
    console.log('bad');
    if (player.crashed) {
      gameWorld.setScene(0);
      return false;
    }
    var b = t.ui.onButton(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    if (b) {
      if (b.trigger) b.trigger();
      return;
    }

    t.touch.x = e.changedTouches[0].pageX, t.touch.y = e.changedTouches[0].pageY;
  }
  this.onTouchMove = function (e) {
    console.log('bad');
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
    console.log('bad');
    laning.setLane();
  }
  this.onClick = function (e) {
    var b = t.ui.onButton(e.offsetX, e.offsetY);
    if (b) {
      if (b.trigger) b.trigger();
      return;
    }
  }
  this.onMouseMove = function (e) {
    for (var i = 0; i < t.buttons.length; i++) {
      if (t.buttons[i].check(e.offsetX, e.offsetY)) {
        t.buttons[i].hover();
      } else {
        t.buttons[i].unhover();
      }
    }    
  }

  this.layers.push(bg);
  this.layers.push(fg);
  this.layers.push(ui);

  //this.goal_messages = goalMessage(ui);
  //fg.paused = 3, bg.paused = 3;
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
  /*
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
  }*/

  var t = Math.floor(this.distance / 528);
  /*
  if (t > this.tenth_distance) {
    // create sign
    var sign_bg = Object.create(Entity).init(CONFIG.width, 64, 64, 40);
    sign_bg.addBehavior(Velocity);
    sign_bg.velocity = {x: -2 * ROAD_SPEED, y: 0};
    sign_bg.addBehavior(Crop, {min: {x: - CONFIG.width, y: 0}, max: {x: 2 * CONFIG.width, y: CONFIG.height}});    
    sign_bg.z = 4;
    sign_bg.color = ["darksalmon", "darkcyan", "darkgreen"][10 * this.tenth_distance % 3]
    this.bg.add(sign_bg);

    var sign_stem = Object.create(Entity).init(CONFIG.width, 96, 8, 64);
    sign_stem.addBehavior(Velocity);
    sign_stem.velocity = {x: -2 * ROAD_SPEED, y: 0};
    sign_stem.addBehavior(Crop, {min: {x: - CONFIG.width, y: 0}, max: {x: 2 * CONFIG.width, y: CONFIG.height}});    
    sign_stem.z = 3;
    sign_stem.color = "black";
    this.bg.add(sign_stem);
    
    var sign_text = Object.create(Text).init(CONFIG.width, 62, t/10, {align: "center", color: "white", size: 32});
    sign_text.addBehavior(Velocity);
    sign_text.velocity = {x: -2 * ROAD_SPEED, y: 0};
    sign_text.addBehavior(Crop, {min: {x: - CONFIG.width, y: 0}, max: {x: 2 * CONFIG.width, y: CONFIG.height}});    
    sign_text.z = 5;
    this.bg.add(sign_text);

    var sign_text2 = Object.create(Text).init(CONFIG.width, 76, "miles", {align: "center", color: "white", size: 24});
    sign_text2.addBehavior(Velocity);
    sign_text2.velocity = {x: -2 * ROAD_SPEED, y: 0};
    sign_text2.addBehavior(Crop, {min: {x: - CONFIG.width, y: 0}, max: {x: 2 * CONFIG.width, y: CONFIG.height}});    
    sign_text2.z = 5;
    this.bg.add(sign_text2);

    this.tenth_distance = t;
  }*/


//  this.odometer.text = this.miles() + " miles";
  if (this.interval > 0 && this.fg.paused <= 0) {
    this.interval -= CAR_SPEED * dt;
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
