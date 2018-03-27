/*

"Tricks"

Directions: In this example, jumping will
result in going up RIGHT side, meaning LEFT side
is inaccessible unless you can change your direction.

       #
       #
       #

    * ->
###############

Folding Back: Jumping from current wall to itself will
CHANGE DIRECTION

          
        # <-*#
 * ->   #    #
##############

Odd Numbers: Similarly, making an 'odd' number of jumps

      ### -> # -> #
             #    #
 * ->  ^          #
###################

While 'even' retains the same orientation


Possibilities: 
 - Enter a whole sub-area just to change direction, then have to maintain it on the way out
 - Enemies vulnerable on one side
 - 

 */


this.onStart = function () {
  var s = this;
  //console.log(Resources.levels[current_room]);
  this.buffer = undefined;
  var fg = s.add(Object.create(Layer).init(120 * GRIDSIZE, 120 * GRIDSIZE));
  var ui = s.add(Object.create(Layer).init(game.w, game.h));
  //fg.add(Object.create(Entity).init()).set({x: 0, y: 0, w: 100 * 16, h: 100 * 16, z: -1, color: "#eee"});
  
  //console.log(Resources.a);

  //fg.add(Object.create(Entity).init()).set({x: 60*GRIDSIZE, y: 60* GRIDSIZE, w: 400 * GRIDSIZE, h: 400* GRIDSIZE, color: "white", z: -1});

  this.tilemaps = [];

  for (var i = 0; i < Resources.a.layers.length - 1; i++) { // not including object layer
    this.tilemaps.push(fg.add(Object.create(TiledMap).init(Resources.tileset, Resources.a.layers[i])).set({x: 25 * GRIDSIZE - GRIDSIZE / 2, y: 25 * GRIDSIZE - GRIDSIZE / 2, z: i * 0.5}));
  }

  this.score = ui.add(Object.create(SpriteFont).init(Resources.font)).set({x: game.w - 10, y: 16, align: "right", spacing: -2, text: "10"});
  this.message = ui.add(Object.create(SpriteFont).init(Resources.font)).set({x: game.w / 2, y: game.h / 4, align: "center", spacing: -2, text: ""});

  this.enemies = [];
  this.exits = [];

  this.switches = [];
  this.blocks = [];
  this.grid = [];

  for (var i = 0; i < Resources.a.layers[1].data.length; i++) { // solids currently inferred as being on layer[1]
    //var x = i % 50;
    //var y = Math.floor(i / 50);
    if (!this.grid[i % 50]) this.grid[i % 50] = [];
    if (Resources.a.layers[1].data[i] != 0) {
      this.grid[i % 50][Math.floor(i / 50)] = true; //fg.add(Object.create(Sprite).init(Resources.tile).set({opacity: 0, x: MIN.x + (i % 50) * GRIDSIZE, y: MIN.y + round(i / 50, 1) * GRIDSIZE, z: 4, solid: true}));
    } else {
      this.grid[i % 50][Math.floor(i / 50)] = false;
    }
  }
  
  //var enemyinfo = Resources.a.layers[3].objects.filter(function (o) { return o.name == "Enemy"; });
  var objects = Resources.a.layers[3].objects;

  for (var i = 0; i < objects.length; i++) {
    if (objects[i].name == "Enemy") {
      var key = objects[i].properties.crawl ? "ghost" : "spikes";
      var enemy = fg.add(Object.create(Sprite).init(Resources[key])).set({x: objects[i].x, y: objects[i].y, z: 3, team: 0});
      enemy.direction = {x: objects[i].properties.directionx, y: objects[i].properties.directiony};
      enemy.angle = objects[i].properties.angle * PI2 / 360;
      if (objects[i].properties.crawl) {   
        enemy.locked = 0;
        enemy.add(Crawl, {goal: {}, rate: 2, threshold: 2, grid: this.grid});
      }
      this.enemies.push(enemy);
      enemy.setCollision(Polygon);
      enemy.setVertices([{x: -5, y: -5}, {x: -5, y: 5}, {x: 5, y: 5}, {x: 5, y: -5}]);
    } else if (objects[i].name == "Player") {
      var player = fg.add(Object.create(Sprite).init(Resources.spider)).set({x: objects[i].x, y: objects[i].y, z: 3 });
      game.player = player;
      this.player = player;
      player.direction = {x: objects[i].properties.directionx, y: objects[i].properties.directiony};
      player.angle = round(objects[i].properties.angle * PI / 180, PI / 2);
      player.movement = player.add(Crawl, {goal: {}, rate: 3, threshold: 2, grid: this.grid});
      player.setCollision(Polygon);
      player.collision.onHandle = function (obj, other) {
        if (other.team === TEAMS.enemy) {
          console.log('restarting');
          game.setScene(0, true);          
        }
      }
      player.arrow = fg.add(Object.create(Sprite).init(Resources.arrow));
      player.arrow.add(Behavior, { target: player, update: function (dt) {
        if (!this.target.movement.jump && !this.target.movement.goal.angle) {
          this.entity.opacity = 1;
          this.entity.x = this.target.x + this.target.direction.x * GRIDSIZE;
          this.entity.y = this.target.y + this.target.direction.y * GRIDSIZE;
          this.entity.angle = Math.atan2(this.target.direction.y, this.target.direction.x);
        } else {
          this.entity.opacity = 0;
        }
      }});
      player.setVertices([{x: -5, y: -5}, {x: -5, y: 5}, {x: 5, y: 5}, {x: 5, y: -5}]);
    } else if (objects[i].name == "Switch") {
      var lever = fg.add(Object.create(Sprite).init(Resources.tile)).set({x: objects[i].x, y: objects[i].y, z: 2, target: objects[i].properties.target});
      lever.setCollision(Polygon);
      lever.collision.onHandle = function (obj, other) {
        var targets = s.blocks.filter(function (b) { return b.team === obj.target});
        for (var i = 0; i < targets.length; i++) {
          targets[i].alive = false;
          var c = toGrid(targets[i].x, targets[i].y);
          if (s.grid[c.x]) s.grid[c.x][c.y] = true;
          if (s.tilemaps[1].data.data) s.tilemaps[1].data.data[c.x + 50 * c.y] = 1;
          // solids
          // change tileset
        }
      }
      this.switches.push(lever);
    } else if (objects[i].name == "Trapdoor") {
      var trapdoor = fg.add(Object.create(Sprite).init(Resources.trapdoor).set({x: objects[i].x, y: objects[i].y, z: 4, direction: {x: objects[i].properties.directionx, y: objects[i].properties.directiony}}));
      trapdoor.angle = objects[i].properties.angle * PI2 / 360;
      trapdoor.setCollision(Polygon);
      trapdoor.setVertices([
        {x: -8, y: -16},
        {x: 8, y: -16},
        {x: 8, y: 8},
        {x: -8, y: 8}
      ]);
      trapdoor.timeout = trapdoor.add(Behavior, {time: 0, update: function (dt) {
        if (this.time > 0) this.time -= dt;
      }});
      trapdoor.collision.onHandle = function (obj, other) {
        if (obj.timeout.time <= 0) {
          if (-1 * round(Math.cos(other.angle), 1) === obj.direction.x && -1 * round(Math.sin(other.angle), 1) === obj.direction.y ) {
            other.movement.trapdoor = true; 
            obj.timeout.time = 2;
          }
        }
      };
      this.switches.push(trapdoor);    
    } else if (objects[i].name == "Block") {
      var block = fg.add(Object.create(Entity).init()).set({x: objects[i].x, y: objects[i].y, w: GRIDSIZE, h: GRIDSIZE, z: 3, color: "red",opacity: 0.2, team: objects[i].properties.team});
      this.blocks.push(block);
    } else if (objects[i].name == "Message") {
      var message = fg.add(Object.create(Entity).init()).set({message: objects[i].properties.message, x: objects[i].x, y: objects[i].y, w: GRIDSIZE, h: GRIDSIZE, color: "orange", z: 10, opacity: 0.1 });
      message.setCollision(Polygon);
      this.switches.push(message);
      console.log('creating message');
      message.collision.onHandle = function (obj, other) {
        obj.alive = false;
        s.switches.splice(s.switches.indexOf(obj), 1);
        console.log('handling message');
        s.message.text = obj.message;
      }
    }
  }

  fg.camera.add(LerpFollow, {target: player, offset: {x: -game.w / 2, y: -game.h / 2}, rate: 2});

  this.onKeyDown = function (e) {
    switch(e.keyCode) {
      case 38:
        player.movement.paused = true;
        break;
    }
  };
  this.onKeyUp = function (e) {
    switch(e.keyCode) {
      case 38:
        player.movement.paused = false;
        player.movement.jump = true;
        player.behaviors[0].paused = false;        
        break;
    }
  }
};
this.onUpdate = function (dt) {
  this.player.checkCollisions(0, this.enemies);
  this.player.checkCollisions(0, this.switches);
};