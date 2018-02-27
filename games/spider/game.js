// globals... probably a mistake??
var playerinfo = undefined;
var GRIDSIZE = 16;
var WALKSPEED = 40;
var WIDTH = 320;
var HEIGHT = 180;
var MIN = {x: 0, y: 0};

function sign (n) {
  return n > 0 ? 1 : (n < 0 ? -1 : 0);
}

function toGrid(x, y) {
  return {x: Math.round((x - MIN.x) / GRIDSIZE), y: Math.round((y - MIN.y) / GRIDSIZE)};
}

function toCoord(x, y) {
  return {x: MIN.x + x * GRIDSIZE, y: MIN.y + y * GRIDSIZE};
}

// raindrop
function round(n, interval) {
  return Math.round(n / interval) * interval;
}

// raindrop - is this really an 'ease' function??
EASE.constant = function (start, end, t) {
  return start + (end - start) * t;
};


var Crawl = Object.create(Behavior);
Crawl.update = function (dt) {
  if (this.entity.locked > 0) {
    this.entity.locked -= this.rate * dt;
    //console.log(this.goal.x);
    for (var key in this.goal) {
      if (round(this.entity[key], this.threshold) !== this.goal[key]) {
        this.entity[key] = EASE.constant(this.start[key], this.goal[key], 1 - this.entity.locked);
        
        // fix: add rounded handling for outer turn
        // 
        // EASE.linear for jump looks kinda nice?

        /*if (this.goal.angle !== undefined && this.goal.x !== undefined) {
          this.entity[key] = EASE.linear(this.entity[key], this.goal[key], 1 - this.entity.locked);
        } else {
        }*/

      } else {
        this.entity[key] = this.goal[key];
      }
    }
    return;
  } else if (this.jump) {
    var normal = {x: this.entity.direction.y, y: -this.entity.direction.x };
    var c = toGrid(this.entity.x, this.entity.y);
    var distance = false;
    this.jump = false;
    if (this.grid[c.x + normal.x * 1] !== undefined && this.grid[c.x + normal.x * 1][c.y + normal.y * 1]) {
      distance = 0;
    } else if (this.grid[c.x + normal.x * 2] !== undefined && this.grid[c.x + normal.x * 2][c.y + normal.y * 2]) {
      distance = 1;
    } else if (this.grid[c.x + normal.x * 3] !== undefined && this.grid[c.x + normal.x * 3][c.y + normal.y * 3]) {
      distance = 2;
    } else { // too far away!
      console.log('jumping failed');
      return;
    }
    this.entity.locked = 1;
    this.start = {x: this.entity.x, y: this.entity.y, angle: this.entity.angle};
    this.goal = {x: c.x + distance * normal.x, y: c.y + distance * normal.y};
    this.goal = toCoord(this.goal.x, this.goal.y);
    this.goal.angle = round(this.entity.angle + PI, PI / 2);
    //console.log('jumping succeeded');
    this.entity.direction = {x: -this.entity.direction.x, y: -this.entity.direction.y};
    return;
  } else {
    console.log('setting goal');
    var c = toGrid(this.entity.x, this.entity.y);
    
    // blocked - inner rotate
    if (this.grid[c.x + this.entity.direction.x] !== undefined && this.grid[c.x + this.entity.direction.x][c.y + this.entity.direction.y] !== false) {
      this.goal = {angle: round(this.entity.angle - PI / 2, PI / 2)};
      this.start = {angle: this.entity.angle};
      
      this.entity.direction = {x: this.entity.direction.y, y: -this.entity.direction.x};
    }
    // no floor - outer rotate
    else if (this.grid[c.x - this.entity.direction.y + this.entity.direction.x] !== undefined && this.grid[c.x - this.entity.direction.y + this.entity.direction.x][c.y + this.entity.direction.x + this.entity.direction.y] === false) {
      var goal = toCoord(c.x - this.entity.direction.y + this.entity.direction.x, c.y + this.entity.direction.x + this.entity.direction.y);
      this.goal = {angle: round(this.entity.angle + PI / 2, PI / 2), x: goal.x, y: goal.y};
      this.start = {angle: this.entity.angle, x: this.entity.x, y: this.entity.y};
      this.entity.direction = {x: -this.entity.direction.y, y: this.entity.direction.x};
    }

    else {
      this.goal = {x: this.entity.x + GRIDSIZE * this.entity.direction.x, y: this.entity.y + GRIDSIZE * this.entity.direction.y};
      this.start = {x: this.entity.x, y: this.entity.y};
    }
    this.entity.locked = 1;
  }
};

// push to raindrop: loader fix! (closure)
World.loadResources = function () {
  if (!this.gameInfo.resources) return;
  //this.setupControls();
  this.initAudio();

  this.resourceLoadCount = 0;
  this.resourceCount = this.gameInfo.resources.length;
  this.ctx.fillStyle = "gray";
  this.ctx.fillRect(this.width / 2 - 25 * this.resourceCount + i * 50, this.height / 2 - 12, 50, 25);      
  this.ctx.fillText("loading...", this.width / 2, this.height / 2 - 50);
  var w = this;

  for (var i = 0; i < this.gameInfo.resources.length; i++ ) {
    (function () {
      var res = w.gameInfo.resources[i].path;
      var e = res.indexOf(".");
      var name = res.substring(0, e);
      var ext = res.substring(e, res.length);
      if (ext == ".png") {
        Resources[name] = {image: new Image(), frames: w.gameInfo.resources[i].frames || 1, speed: w.gameInfo.resources[i].speed || 1, animations: w.gameInfo.resources[i].animations || 1 };
        Resources[name].image.src = "res/" + res;
        Resources[name].image.onload = function () {
          w.progressBar();
        }
      }
      else if (ext == ".ogg") {
        w.loadOGG(res, name);
  /*        Resources[name] = {sound: new Audio("res/" + res, streaming=false)};
        w.progressBar();
        Resources[name].sound.onload = function () {
          console.log("loaded sound");
        }*/
      }
      else if (ext == ".wav") {
        w.loadOGG(res, name);
      }
      else if (ext == ".js") {
        var request = new XMLHttpRequest();
        request.open("GET", "res/" + res, true);
        request.onload = function () {
          w.sceneInfo = request.response;
          w.progressBar();
        };
        request.send();
      }
      else if (ext == ".json") {
        var request = new XMLHttpRequest();
        request.open("GET", "res/" + res, true);
        request.onload = function () {
          Resources[name] = JSON.parse(request.response);
          w.progressBar();
        };
        request.send();
      }
    })();
  }
};

var FAMILY = {enemy: 1};

var Hybrid = Object.create(Lerp);
Hybrid.update = function (dt) {
  if (this.object === undefined) this.object = this.entity;
  if (this.stopped) return;
  var done = true;
  for (var field in this.goals) {
    if (field == "angle") // n/a noop for angle for now...
      this.object[field] = lerp_angle(this.object[field], this.goals[field], this.rate * dt);
    else {
      this.object[field] = Math.abs(this.object[field] - this.goals[field]) <= this.threshold ? lerp(this.object[field], this.goals[field], this.rate * dt) : this.object[field] + sign(this.goals[field] - this.object[field]) * this.speed * dt;
    }
    if (this.object[field] != this.goals[field]) done = false;
  }
  if (done && this.callback) {
    this.stopped = true;
    this.callback();
  }
};

Polygon.onCheck = function (o1, o2) {
  if (!o1.getVertices || !o2.getVertices) return false;
  else if (o1 == o2) return false;
  //else if (distance(o1.x, o1.y, o2.x, o2.y) > Math.max(o1.h, o1.w) + Math.max(o2.h, o2.w)) return false;
  var v1 = o1.getVertices(), v2 = o2.getVertices();
  var a1 = o1.getAxes(), a2 = o2.getAxes();

  var separate = false;

  for (var i = 0; i < a1.length; i++) {
    var p1 = project(a1[i], v1);
    var p2 = project(a1[i], v2);

    if (!overlap(p1, p2)) return false;
  }

  for (var i = 0; i < a2.length; i++) {
    var p1 = project(a2[i], v1);
    var p2 = project(a2[i], v2);

    if (!overlap(p1, p2)) return false;
  }
  return true;
}

var rotate = function (scene, entity, angle) {
  var goal = {
    x: entity.anchor.x + Math.round(16 * Math.cos(entity.angle + angle)), 
    y: entity.anchor.y + Math.round(16 * Math.sin(entity.angle + angle)), 
    angle: entity.angle + angle
  };
  var block = {
    x: entity.x + Math.round(16 * Math.cos(entity.angle + angle)),
    y: entity.y + Math.round(16 * Math.sin(entity.angle + angle))
  };
  for (var i = 0; i < scene.solids.length; i++) {
    if ((scene.solids[i].x === block.x) && (scene.solids[i].y === block.y)) {
      console.log('blocked');
      goal.x = entity.x;
      goal.y = entity.y
      goal.angle = entity.angle - angle;
      entity.anchor = scene.solids[i];
      break;
    }
    if (scene.solids[i].x === goal.x && scene.solids[i].y === goal.y) {
      console.log('slide');
      goal.x = scene.solids[i].x + Math.round(16 * Math.cos(entity.angle));
      goal.y = scene.solids[i].y + Math.round(16 * Math.sin(entity.angle));
      goal.angle = entity.angle;
      entity.anchor = scene.solids[i];
    }
  }
  
  entity.locked = true;
  entity.add(Lerp, {rate: 10, goals: {x: goal.x, y: goal.y, angle: Math.round(goal.angle / (PI / 2)) * PI / 2}, callback: function () {
    this.entity.locked = false;
    this.entity.remove(this);
    if (this.entity.exit) this.entity.exit();
  }});
};

Sprite.drawDebug = function (ctx) {
  if (DEBUG) {
    ctx.strokeStyle = "red";
    if (this.getVertices) {
      var v = this.getVertices();
      ctx.beginPath();
      ctx.moveTo(v[0].x, v[0].y);
      for (var i = 1; i < v.length; i++) {
        ctx.lineTo(v[i].x, v[i].y);
      }
      ctx.closePath();
      ctx.stroke();

      /*var a = this.getAxes();
      ctx.strokeStyle = "green";
      ctx.beginPath();
      for (var i = 0; i < a.length; i++) {
        ctx.moveTo(this.x + a[i].x, this.y + a[i].y);
        ctx.lineTo(100 * a[i].x + this.x, 100 * a[i].y + this.y);
      }
      ctx.closePath();
      ctx.stroke();*/
    }
    /*ctx.fillStyle = "red";
    ctx.fillText(Math.floor(this.x) + ", " + Math.floor(this.y), this.x, this.y);

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.strokeStyle = "blue";
    ctx.lineTo(this.x + 200 * Math.cos(this.angle), this.y + 200 * Math.sin(this.angle));
    ctx.stroke();*/
  }
}
Entity.drawDebug = Sprite.drawDebug;

// PUSH TO RAINDROP ALREADY???
Layer.draw = function (ctx) {
  //this.ctx.fillStyle = this.bg;
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.save();
  this.camera.draw(this.ctx);

  var entities = this.drawOrder();

  for (var i = 0; i < entities.length; i++) {
    entities[i].draw(this.ctx);
  }
  this.ctx.restore();
}

var current_room = 0;
var game = Object.create(World).init(180, 320, "index.json");
//DEBUG = true;