/*

new movement:
x- grid system
x- camera follow player
x- player auto-move

- player 'jump'

- smooth and polish movement (awkward transitions!!)
  - figure out distances for various turns, create a 'constant' movement?
  - or should it be all grid-based, so you can jump smoothly?

*/
this.onStart = function () {
  var s = this;
  //console.log(Resources.levels[current_room]);
  this.buffer = undefined;
  var fg = s.add(Object.create(Layer).init(120 * GRIDSIZE, 120 * GRIDSIZE));
  var ui = s.add(Object.create(Layer).init(game.w, game.h));
  fg.add(Object.create(Entity).init()).set({x: 0, y: 0, w: 100 * 16, h: 100 * 16, z: -1, color: "#f5f5f5"});
  
  this.score = ui.add(Object.create(SpriteFont).init(Resources.font)).set({x: game.w - 10, y: 16, align: "right", spacing: -2, text: "10"});
  
  this.solids = [];
  this.enemies = [];
  this.exits = [];
  this.webs = [];

  this.grid = [];

  for (var i = 0; i < 100; i++) {
    this.grid.push([]);
    for (var j = 0; j < 100; j++) {
      if (false)
        this.grid[i].push(fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + i * GRIDSIZE, y: MIN.y + j * GRIDSIZE, z: 4, solid: true})));
      else {
        this.grid[i].push(false);
      }
    }
  }

  for (var k = 15; k < 25; k++) {
    this.grid[25][k] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 25 * GRIDSIZE, y: MIN.y + k * GRIDSIZE, z: 4, solid: true}));
  }
  this.grid[26][25] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 26 * GRIDSIZE, y: MIN.y + 25 * GRIDSIZE, z: 4, solid: true}));
  // solids
  /*for (var i = 0; i < Resources[current_room].layers[0].data.length; i++) {
    if (Resources[current_room].layers[0].data[i] === 1) {
      var solid = fg.add(Object.create(Sprite).init(Resources.tile)).set({x: 16 * (i % 10), y: 16 * Math.floor(i / 10), solid: true, z: 4, strands: [], id: i });
      this.solids.push(solid);      
    }
  }*/
/*
  for (var i = 0; i < Resources[current_room].layers[1].objects.length; i++) {
    var info = Resources[current_room].layers[1].objects[i];
    if (info.name == "Exit") {
      var exit = fg.add(Object.create(Entity).init()).set({x: info.x, y: info.y, z: 5, color: "red", opacity: 0.5, goal: {x: info.properties.goalx, y: info.properties.goaly, level: info.properties.level}});
      this.exits.push(exit);
    }
    if (info.type == "Enemy") {
      var enemy = fg.add(Object.create(Sprite).init(Resources.ghost)).set({x: info.x, y: info.y, z: 3, family: FAMILY.enemy});
      enemy.setCollision(Polygon);
      enemy.setVertices([{x: -4, y: -4}, {x: -4, y: 4}, {x: 4, y: 4}, {x: 4, y: -4}]);
      this.enemies.push(enemy);
        
      if (info.name == "Horizontal") {
        enemy.add(Hybrid, {threshold: 16, speed: 96, rate: 8, start: {x: enemy.x}, goals: {x: info.properties.goalx}, callback: function () {
          this.goals.x = this.start.x;
          this.stopped = false;
          this.start.x = this.entity.x;
        }});
      } else if (info.name == "Vertical") {
        enemy.add(Hybrid, {threshold: 16, speed: 96, rate: 8, start: {y: enemy.y}, goals: {y: info.properties.goaly}, callback: function () {
          this.goals.y = this.start.y;
          this.stopped = false;
          this.start.y = this.entity.y;
        }});
      } else if (info.name == "Wallhugger") {
        enemy.anchor = this.solids.sort(function (a, b) { return distance(a.x, a.y, enemy.x, enemy.y) - distance(b.x, b.y, enemy.x, enemy.y)})[0];
        enemy.angle = angle(enemy.anchor.x, enemy.anchor.y, enemy.x, enemy.y);
        enemy.add(Behavior, {update: function (dt) {
          if (!this.entity.locked) {
            rotate(s, this.entity, PI / 2);
          }
        }});
      }
    }
  }*/


 // var playerinfo = Resources.levels[current_room].layers[3].objects[0];
  //var anchor = this.solids[19]; //this.solids.filter(function (e) { return e.id == playerinfo.properties.Anchor; })[0];
  if (playerinfo === undefined) {
    //playerinfo = Resources[current_room].layers[1].objects.filter(function (o) { return o.name === "Player"; })[0];
  }

  var player = fg.add(Object.create(Sprite).init(Resources.spider)).set({x: 26 * GRIDSIZE, y: 20 * GRIDSIZE, z: 3 });
  //player.add(Velocity);
  game.player = player;
  player.direction = {x: 0, y: 1};
  //player.velocity = {x: 0, y: WALKSPEED};
  player.add(Behavior, {update: function (dt) {
    if (this.entity.locked > 0) {
      this.entity.locked -= dt;
      return;
    }
    var c = toGrid(this.entity.x, this.entity.y);
    //this.entity.direction = {x: sign(this.entity.velocity.x), y: sign(this.entity.velocity.y)};
    
    // check for floor (outer angle)
    //console.log(c.x, c.y, direction.x, direction.y, s.grid[c.x - direction.y][c.y + direction.x]);
    
    // blocked - inner rotate
    if (s.grid[c.x + this.entity.direction.x] !== undefined && s.grid[c.x + this.entity.direction.x][c.y + this.entity.direction.y] !== false) {
      /*this.entity.velocity = {x: 0, y: 0};
      this.entity.locked = true;
      var goal = toCoord(c.x, c.y);
      goal.angle = this.entity.angle - PI / 2;
      this.entity.add(Lerp, {rate: 10, goals: {x: goal.x, y: goal.y, angle: round(goal.angle, PI / 2)}, callback: function () {
        this.entity.locked = false;
        this.entity.direction = {x: this.entity.direction.y, y: -this.entity.direction.x};
        this.entity.velocity = {x: this.entity.direction.x * WALKSPEED, y: this.entity.direction.y * WALKSPEED};
        this.entity.remove(this);
      }});*/
      this.entity.angle = round(this.entity.angle - PI / 2, PI / 2);
      this.entity.direction = {x: this.entity.direction.y, y: -this.entity.direction.x};
    }
    // no floor - outer rotate
    else if (s.grid[c.x - this.entity.direction.y + this.entity.direction.x] !== undefined && s.grid[c.x - this.entity.direction.y + this.entity.direction.x][c.y + this.entity.direction.x + this.entity.direction.y] === false) {
      /*var coords = toCoord(c.x, c.y);
      this.entity.x = coords.x;
      this.entity.y = coords.y;
      this.entity.velocity = {x: 0, y: 0};
      this.entity.locked = true;
      var goal = toCoord(c.x - this.entity.direction.y + this.entity.direction.x, c.y + this.entity.direction.x + this.entity.direction.y);
      goal.angle = round(this.entity.angle + PI / 2, PI / 2);
      this.entity.add(Lerp, {rate: 10, goals: {x: goal.x, y: goal.y, angle: goal.angle}, callback: function () {
        this.entity.locked = false;
        this.entity.direction = {x: -this.entity.direction.y, y: this.entity.direction.x};
        this.entity.velocity = {x: this.entity.direction.x * WALKSPEED, y: this.entity.direction.y * WALKSPEED};
        this.entity.remove(this);
      }});*/
      var goal = toCoord(c.x - this.entity.direction.y + this.entity.direction.x, c.y + this.entity.direction.x + this.entity.direction.y);
      this.entity.x = goal.x;
      this.entity.y = goal.y;
      this.entity.angle = round(this.entity.angle + PI / 2, PI / 2);
      this.entity.direction = {x: -this.entity.direction.y, y: this.entity.direction.x};
    }

    else {
      this.entity.x += GRIDSIZE * this.entity.direction.x;
      this.entity.y += GRIDSIZE * this.entity.direction.y;      
    }
    this.entity.locked = 0.3;

  }});
  /*player.anchor = this.solids.sort(function (a, b) { return distance(a.x, a.y, player.x, player.y) - distance(b.x, b.y, player.x, player.y)})[0];
  player.angle = angle(player.anchor.x, player.anchor.y, player.x, player.y);
  playerinfo = undefined;

  this.player = player;
  player.add(Behavior, {draw: function (ctx) {
    if (this.entity.locked && this.entity.root && this.entity.anchor) {
      ctx.fillStyle = "black";
      ctx.globalAlpha = 0.2;
      ctx.fillRect(this.entity.root.x - 1, this.entity.root.y - 1, (this.entity.x - this.entity.root.x) + 2, (this.entity.y - this.entity.root.y) + 2);
      ctx.globalAlpha = 1;
    }
  }, update: function (dt) {
    if (this.entity.locked && this.entity.root && this.entity.anchor) {
      var d = distance(this.entity.x, this.entity.y, this.entity.root.x, this.entity.root.y);
      this.entity.setVertices([
        {x: d, y: 1},
        {x: d, y: -1},
        {x: -this.entity.w / 2, y: -this.entity.h / 2},
        {x: -this.entity.w / 2, y: this.entity.h / 2},
        /*{x: -this.entity.w / 2, y: -this.entity.h / 2},
        {x: -this.entity.w / 2, y: this.entity.h / 2},
        {x: this.entity.w / 2, y: this.entity.h / 2},
        {x: this.entity.w / 2, y: -this.entity.h / 2},
      ]);
    } else {
      this.entity.setVertices();
    }
  }});
  player.exit = function () {
    for (var i = 0; i < s.exits.length; i++) {
      if (this.x === s.exits[i].x && this.y === s.exits[i].y) {
        current_room = s.exits[i].goal.level;
        game.setScene(0, true);
        playerinfo = {};
        playerinfo.x = s.exits[i].goal.x;
        playerinfo.y = s.exits[i].goal.y;
      }
    }
  }
  player.setCollision(Polygon);
  player.collision.onHandle = function (obj, other) {
    console.log('enemy hit??');
    if (other.family === FAMILY.enemy) game.setScene(0, true);
  };*/

  //fg.camera.add(Follow, {target: player, offset: { x: -game.w / 2, y: -game.h / 2}});
  //fg.camera.x -= 18;
  //fg.camera.y -= 8;
  fg.camera.x = player.x - game.w / 2;
  fg.camera.y = player.y - game.h / 2;

  this.onKeyDown = function (e) {
    if (player.locked) {
      s.buffer = e;
      return;
    }
    switch(e.keyCode) {
      case 37:
        //rotate(s, player, -PI / 2);
        break;
      case 39:
       // rotate(s, player, PI / 2);
        break;
      case 38:
        /*var destinations = s.solids.filter(function (solid) {
          return (player.anchor.x !== solid.x || player.anchor.y !== solid.y) && between(modulo(angle(player.anchor.x, player.anchor.y, solid.x, solid.y), PI2), modulo(player.angle, PI2) - 0.01, modulo(player.angle, PI2) + 0.01);
        }).sort(function (a, b) { return distance(player.anchor.x, player.anchor.y, a.x, a.y) - distance(player.anchor.x, player.anchor.y, b.x, b.y); });
        if (destinations.length > 0) {
          player.root = player.anchor;
          player.anchor = destinations[0];
          player.angle = modulo(Math.round((player.angle + PI) / (PI / 2)) * PI / 2, PI2);
          var goal = {x: player.anchor.x + Math.round(16 * Math.cos(player.angle)), y: player.anchor.y + Math.round(16 * Math.sin(player.angle))};
          player.locked = true;
          player.add(Hybrid, {threshold: 32, speed: 192, rate: 8, goals: {x: goal.x, y: goal.y}, callback: function () {
            this.entity.locked = false;
            this.entity.remove(this);
            // strand - first check that the two blocks aren't already connected...
            var w = Math.max(Math.abs(this.entity.root.x - this.entity.anchor.x), Math.abs(this.entity.root.y - this.entity.anchor.y))
            if (this.entity.root.strands.indexOf(this.entity.anchor) === -1 && this.entity.anchor.strands.indexOf(this.entity.root) === -1) {              
              var e = this.entity.layer.add(Object.create(TiledBackground).init(Resources.web)).set({
                z: this.entity.z - 1,
                x: Math.floor((this.entity.root.x + this.entity.anchor.x) / 2) + 0.5,
                y: Math.floor((this.entity.root.y + this.entity.anchor.y) / 2) + 0.5,
                w: w,
                h: 4,
                angle: this.entity.angle,
                opacity: 0.8,
                root: this.entity.root,
                anchor: this.entity.anchor
              });
              // NOTE: make sure to REMOVE these connections, once strands can break...
              this.entity.root.strands.push(this.entity.anchor);
              this.entity.anchor.strands.push(this.entity.root);
              
              e.setCollision(Polygon);
              s.webs.push(e);
              e.collision.onHandle = function (obj, oth) {
                oth.behaviors = [];
                s.enemies.splice(s.enemies.indexOf(oth), 1);
                s.score.text = s.enemies.length + "";
                //if (s.enemies.length <= 0) game.setScene(0, true);
              };
            }

            this.entity.root = undefined;
            this.entity.exit();
          }});
        }*/
        break;
    }
  };
};
this.onUpdate = function (dt) {
  /*if (this.buffer && this.player.locked === false) {
    this.onKeyDown(this.buffer);
    this.buffer = undefined;
  }
  //this.player.checkCollisions(0, this.enemies);
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].checkCollisions(0, this.webs);
  }*/
};