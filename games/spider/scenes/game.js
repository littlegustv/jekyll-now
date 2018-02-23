this.onStart = function () {
  var s = this;
  //console.log(Resources.levels[current_room]);
  this.buffer = undefined;
  var fg = s.add(Object.create(Layer).init(game.w, game.h));
  var ui = s.add(Object.create(Layer).init(game.w, game.h));
  fg.add(Object.create(Entity).init()).set({x: 0, y: 0, w: 100 * 16, h: 100 * 16, z: -1, color: "#f5f5f5"});
  
  this.score = ui.add(Object.create(SpriteFont).init(Resources.font)).set({x: game.w - 10, y: 16, align: "right", spacing: -2, text: "10"});
  
  this.solids = [];
  this.enemies = [];
  this.exits = [];
  this.webs = [];
  // solids
  /*
  for (var i = 0; i < Resources.levels[current_room].layers[1].objects.length; i++) {
    var solidinfo = Resources.levels[current_room].layers[1].objects[i];
    var solid = fg.add(Object.create(Sprite).init(Resources.tile)).set({x: solidinfo.x, y: solidinfo.y, solid: true, z: 4, strands: [], id: solidinfo.id });
    solid.setCollision(Polygon);
    this.solids.push(solid);
  }*/

  for (var i = 0; i < Resources[current_room].layers[0].data.length; i++) {
    if (Resources[current_room].layers[0].data[i] === 1) {
      var solid = fg.add(Object.create(Sprite).init(Resources.tile)).set({x: 16 * (i % 10), y: 16 * Math.floor(i / 10), solid: true, z: 4, strands: [], id: i });
      this.solids.push(solid);      
    }
  }

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
  }


  /*
  for (var i = 1; i <= 10; i++) {   
    var enemy = fg.add(Object.create(Sprite).init(Resources.ghost)).set({x: this.solids[i].x + 16, y: this.solids[i].y + 16, z: 3, family: FAMILY.enemy});
    enemy.add(Behavior, {speed: 96, moved: 0, range: 128, direction: randint(0,4) * PI / 2, update: function (dt) {
      if (this.moved > this.range) {
        this.direction = modulo(this.direction + PI / 2, PI2);
        this.entity.velocity = {x: this.speed * Math.cos(this.direction), y: this.speed * Math.sin(this.direction)};
        this.moved = 0;
      }
      this.moved += this.speed * dt;
    }});
    enemy.add(Velocity);
    enemy.setCollision(Polygon);
    enemy.setVertices([{x: -4, y: -4}, {x: -4, y: 4}, {x: 4, y: 4}, {x: 4, y: -4}]);
    this.enemies.push(enemy);
  }*/

 // var playerinfo = Resources.levels[current_room].layers[3].objects[0];
  //var anchor = this.solids[19]; //this.solids.filter(function (e) { return e.id == playerinfo.properties.Anchor; })[0];
  if (playerinfo === undefined) {
    playerinfo = Resources[current_room].layers[1].objects.filter(function (o) { return o.name === "Player"; })[0];
  }

  var player = fg.add(Object.create(Sprite).init(Resources.spider)).set({x: playerinfo.x, y: playerinfo.y, z: 3 });
  player.anchor = this.solids.sort(function (a, b) { return distance(a.x, a.y, player.x, player.y) - distance(b.x, b.y, player.x, player.y)})[0];
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
        {x: this.entity.w / 2, y: -this.entity.h / 2},*/
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
  };
  //fg.camera.add(Follow, {target: player, offset: { x: -game.w / 2, y: -game.h / 2}});
  fg.camera.x -= 18;
  fg.camera.y -= 8;
    
  this.onKeyDown = function (e) {
    if (player.locked) {
      s.buffer = e;
      return;
    }
    switch(e.keyCode) {
      case 37:
        rotate(s, player, -PI / 2);
        break;
      case 39:
        rotate(s, player, PI / 2);
        break;
      case 38:
        var destinations = s.solids.filter(function (solid) {
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
        }
        break;
    }
  };
};
this.onUpdate = function (dt) {
  if (this.buffer && this.player.locked === false) {
    this.onKeyDown(this.buffer);
    this.buffer = undefined;
  }
  this.player.checkCollisions(0, this.enemies);
  for (var i = 0; i < this.enemies.length; i++) {
    this.enemies[i].checkCollisions(0, this.webs);
  }
};