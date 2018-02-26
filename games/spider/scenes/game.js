/*

new movement:
x- grid system
x- camera follow player
x- player auto-move

x- player 'jump'

- smooth and polish movement (awkward transitions!!)
  x- figure out distances for various turns, create a 'constant' movement?
  - round-out "outer" angle turn
  x- make sure we don't stray from the desired path! (which is happening)
  
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
    this.grid[28][k] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 28 * GRIDSIZE, y: MIN.y + k * GRIDSIZE, z: 4, solid: true}));
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
  player.movement = player.add(Behavior, {goal: {}, rate: 3, threshold: 2, update: function (dt) {
    if (this.entity.locked > 0) {
      this.entity.locked -= this.rate * dt;
      for (var key in this.goal) {
        if (round(this.entity[key], this.threshold) !== this.goal[key]) {
          this.entity[key] = EASE.constant(this.start[key], this.goal[key], 1 - this.entity.locked);          
        } else {
          this.entity[key] = this.goal[key];
        }
      }
      return;
    }
    var c = toGrid(this.entity.x, this.entity.y);
    
    // blocked - inner rotate
    if (s.grid[c.x + this.entity.direction.x] !== undefined && s.grid[c.x + this.entity.direction.x][c.y + this.entity.direction.y] !== false) {
      this.goal = {angle: round(this.entity.angle - PI / 2, PI / 2)};
      this.start = {angle: this.entity.angle};
      
      this.entity.direction = {x: this.entity.direction.y, y: -this.entity.direction.x};
    }
    // no floor - outer rotate
    else if (s.grid[c.x - this.entity.direction.y + this.entity.direction.x] !== undefined && s.grid[c.x - this.entity.direction.y + this.entity.direction.x][c.y + this.entity.direction.x + this.entity.direction.y] === false) {
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

  }});
  
  fg.camera.x = player.x - game.w / 2;
  fg.camera.y = player.y - game.h / 2;

  this.onKeyDown = function (e) {
    switch(e.keyCode) {
      case 38:
        var normal = {x: player.direction.y, y: -player.direction.x };
        var c = toGrid(player.x, player.y);
        console.log(c, normal);
        if (player.movement.goal.angle !== undefined) {

        } else if (s.grid[c.x + normal.x * 2] !== undefined && s.grid[c.x + normal.x * 2][c.y + normal.y * 2]) {
          player.angle += PI;
          player.movement.goal.x = player.movement.goal.x + normal.x * GRIDSIZE;
          player.movement.goal.y = player.movement.goal.y + normal.y * GRIDSIZE;
          player.direction = {x: -player.direction.x, y: -player.direction.y};
          //console.log('mhm', coords, player.movement.start, player.movement.goal);
        } else {
          //console.log(s.grid[c.x + normal.x * 2][c.y + normal.y * 2]);
        }
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

};