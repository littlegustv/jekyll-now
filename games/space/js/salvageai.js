var Loop = Object.create(Behavior);
Loop.start = function () {
  this.time = 0;
  this.position = {x: this.entity.x, y: this.entity.y};
}
Loop.update = function (dt) {
  if (this.time < this.duration) {
    this.time += dt;
    this.entity.x = this.position.x + this.offset(true);
    this.entity.y = this.position.y + this.offset(false);
  }
}
Loop.offset = function (x) {
  if (x)
    return this.radius - this.radius * Math.cos(this.time / (this.duration / (2 * Math.PI)));
  else
    return this.radius * Math.sin(this.time / (this.duration / (2 * Math.PI)));
}

var Bounce = Object.create(Behavior);
Bounce.start = function () {
  this.time = 0;
  this.position = {x: this.entity.x, y: this.entity.y};
}
Bounce.update = function(dt) {
  if (this.time < this.duration) {
    this.time += dt;
    this.entity.y = this.position.y + this.offset();
  }
}
Bounce.offset = function () {
  return (this.max / (1 + this.time)) * Math.sin(Math.PI * 2 * this.time);
}


var Flare = Object.create(Entity);
Flare.init = function (x, y, angle, duration) {
  this.x = x, this.y = y, this.duration = duration, this.angle = angle, this.radius = 1, this.time = 0;
  return this;
}
Flare.draw = function (ctx) {
  ctx.globalAlpha = this.opacity;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
  ctx.fillStyle = Math.floor(this.time) % 2 == 0 ? "red" : "black";
  ctx.fill();
  ctx.globalAlpha = 1;
}
Flare.update = function (dt) {
  this.time += dt;
  if (this.time > this.duration) this.alive = false;
  this.opacity = 1 - this.time / this.duration;
  this.radius += dt * 20;
  this.x += Math.cos(this.angle) * SPEED.ship * dt / 4;
  this.y += Math.sin(this.angle) * SPEED.ship * dt / 4;
}
var Beacon = Object.create(Behavior);
Beacon.start = function () {
  if (this.target) {
    var theta = Math.atan2((this.target.y - this.entity.y), (this.target.x - this.entity.x));
    console.log("mhm", theta, this.target);
    var flare = Object.create(Flare).init(this.entity.x, this.entity.y, theta, 10);
    this.entity.layer.add(flare);
  }
}

// uses: target
var Home = Object.create(Behavior);
Home.update = function (dt) {
  this.entity.angle = angle(this.entity.x, this.entity.y, this.target.x, this.target.y);
  var d = distance(this.entity.x,this.entity.y,this.target.x,this.target.y);
  var dx = this.target.x - this.entity.x, dy = this.target.y - this.entity.y;
  this.entity.velocity = {x: 0.6 * SPEED.ship * dx / d, y: 0.6 * SPEED.ship * dy / d};
}
var Warning = Object.create(Behavior);
Warning.update = function (dt) {
  if (distance(this.entity.x, this.entity.y, this.target.x, this.target.y) < this.margin) {
    this.entity.alive = false;
    this.entity.layer.add(Object.create(Flare).init(this.entity.x, this.entity.y, 0, 2));
  }
}


var WarningShot = Object.create(Behavior);
WarningShot.start = function () {
  var missile = Object.create(Sprite).init(this.entity.x, this.entity.y, Resources.projectile);
  missile.addBehavior(Velocity);
  missile.addBehavior(Home, {target: this.target});
  missile.addBehavior(Warning, {target: this.target, margin: 100});
  missile.setCollision(Polygon);
  missile.collision.onHandle = function (object, other) {
    object.alive = false;
    object.layer.add(Object.create(Flare).init(object.x, object.y, 0, 2));
  }
  missile.family = "enemy";
  this.entity.layer.add(missile);
}

// requires target

var Goal = {
  init: function (state) {
    this.state = state;
    return this;
  },
  state: function () {
    return 0;
  },
  regress: function (n) {
    return 1 / (1 + Math.exp(-n));
  } 
}

var Motivation = {
  init: function (behavior, initial) {
    this.memory = [initial],
    this.behavior = behavior;
    return this;
  },
  add: function (n) {
    this.memory.push(n);
  },
  apply: function () {
    this.behavior.start();
    return this.behavior.duration || 2;
  },
  success: function () {
    return this.memory.reduce( function (a, b) { return a + b; }, 0) / (this.memory.length);
  }
}

var SalvageAI = Object.create(Behavior);
SalvageAI.start = function () {
  this.debug = document.createElement('div');
  this.debug.style.height = "100px";
  this.debug.style.width = "100%";
  this.debug.style.border = "1px solid black";
  document.body.appendChild(this.debug);

  this.time = 0;
  this.delay = 1;
  this.error = 0.01;

  this.loop = this.entity.addBehavior(Loop, {duration: 2, radius: 40});
  this.bounce = this.entity.addBehavior(Bounce, {duration: 4, max: 40});
  this.beacon = this.entity.addBehavior(Beacon, {target: this.target});
  this.warning = this.entity.addBehavior(WarningShot, {target: this.target});

  this.motivations = [
    Object.create(Motivation).init(this.loop, 1),
    Object.create(Motivation).init(this.bounce, 0.6),
    Object.create(Motivation).init(this.beacon, 0.5),
    Object.create(Motivation).init(this.warning, 0.5)    
  ];

  console.log(this.beacon);
}
SalvageAI.getCurrentMotivation = function () {
  var max = 0;
  var choice = 0;
  for (var i = 0; i < this.motivations.length; i++) {
    var success = this.motivations[i].success();
    if (success > max) {
      max = success;
      choice = i;
    }
  }
  return this.motivations[choice];
}
SalvageAI.doDebug = function () {
  var output = "";
  for (var i = 0; i < this.motivations.length; i++) {
    output += "<b>" + i + ":</b> " + this.motivations[i].success() + ",<i>" + this.motivations[i].memory.length + "</i><br>"
  }
  this.debug.innerHTML = output;
}
SalvageAI.createGoal = function (state) {
  if (!this.goal) this.goal = Object.create(Goal).init(state);
}
SalvageAI.update = function (dt) {
  if (!this.loop) this.start();
  
  this.doDebug();
  this.time += dt;
  if (this.time > this.delay) {
    this.time = 0;
    //if (!this.goal);// this.createGoal(function () {});

    /* 1. if Node some distance away */
    if (this.node) {
      // roughly speaking, it's 'off screen'
      if (!onscreen(this.node.x, this.node.y)) {
        // if AI is oncreen, start moving towards node
        if (onscreen(this.entity.x, this.entity.y, -100)) {
          // create goal, that player moves closer to node
          if (!this.goal) {
          var p = this.player, n = this.node;
          this.createGoal(function () {
            if (!this.lastDistance) {
              this.lastDistance = distance(p.x, p.y, n.x, n.y);
              return null;
            } else {
              var d =  distance(p.x, p.y, n.x, n.y);
              var dd = this.lastDistance - d;
              this.lastDistance = d;
              return Goal.regress(dd);
            }
          });
          }

          if (this.entity.pathfind.target != this.node) {
            console.log('pathfinding new target');
            this.entity.pathfind.new(this.node);
          }
        } 
        // otherwise, start moving towards 
        else {
          if (this.entity.pathfind.target != this.player) {
            console.log('pathfinding player');
            this.entity.pathfind.new(this.player);
          }
        }

        // check that we're not already doing this...
      } 
    }

    if (this.goal) {
      console.log('we got a goal');
      var state = this.goal.state();
      if (state === null);
      else {
        this.getCurrentMotivation().add(state);
        if (state >= (1 - this.error)) {
          // done!
          console.log('and now we done');
          this.goal = undefined;
        } else {
          this.delay = this.getCurrentMotivation().apply();
        }
      }
    }
  }
}