this.onStart = function () {
  var s = this;
  console.log(Resources.levels);
  this.buffer = undefined;
  var fg = s.add(Object.create(Layer).init(game.w, game.h));
  var ui = s.add(Object.create(Layer).init(game.w, game.h));
  fg.add(Object.create(Entity).init()).set({x: 0, y: 0, w: 100 * 16, h: 100 * 16, z: -1, color: "#f5f5f5"});
  
  this.score = ui.add(Object.create(SpriteFont).init(Resources.font)).set({x: game.w - 10, y: 16, align: "right", spacing: -2, text: "10"});
  
  this.solids = [];
  this.enemies = [];
  this.webs = [];
  // solids
  for (var i = 0; i < Resources.levels.layers[1].objects.length; i++) {
    var solidinfo = Resources.levels.layers[1].objects[i];
    this.solids.push(fg.add(Object.create(Sprite).init(Resources.tile)).set({x: solidinfo.x, y: solidinfo.y, solid: true, z: 4, strands: [], id: solidinfo.id }));
  }
/*
  for (var i = 0; i < 100; i++) {
    var x = randint(-20, 20) * 16, y = randint(-20, 20) * 16;
    //y = 160 + 128 * (i % 2);
    //x = Math.floor(i / 2) * 16;
    this.solids.push(fg.add(Object.create(Sprite).init(Resources.tile)).set({x: x, y: y, solid: true, z: 4, strands: [] }));
  }*/
  // enemies
  for (var i = 0; i < Resources.levels.layers[2].objects.length; i++) {
    var enemyinfo = Resources.levels.layers[2].objects[i];
    var enemy = fg.add(Object.create(Sprite).init(Resources.ghost)).set({x: enemyinfo.x, y: enemyinfo.y, z: 3, family: FAMILY.enemy});
    enemy.setCollision(Polygon);
    enemy.setVertices([{x: -4, y: -4}, {x: -4, y: 4}, {x: 4, y: 4}, {x: 4, y: -4}]);
    this.enemies.push(enemy);
    if (enemyinfo.name == "Horizontal") {
      enemy.add(Hybrid, {threshold: 16, speed: 96, rate: 8, start: {x: enemy.x}, goals: {x: enemyinfo.properties.goalx}, callback: function () {
        this.goals.x = this.start.x;
        this.stopped = false;
        this.start.x = this.entity.x;
      }});
    } else if (enemyinfo.name == "Vertical") {
      enemy.add(Hybrid, {threshold: 16, speed: 96, rate: 8, start: {y: enemy.y}, goals: {y: enemyinfo.properties.goaly}, callback: function () {
        this.goals.y = this.start.y;
        this.stopped = false;
        this.start.y = this.entity.y;
      }});
    } else if (enemyinfo.name == "Wallhugger") {
      console.log('unimplemented');
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

  var playerinfo = Resources.levels.layers[3].objects[0];
  var anchor = this.solids.filter(function (e) { return e.id == playerinfo.properties.Anchor; })[0];
  var player = fg.add(Object.create(Sprite).init(Resources.spider)).set({x: playerinfo.x, y: playerinfo.y, z: 3, anchor: anchor, angle: PI / 2 + PI2 * (playerinfo.rotation / 360) });
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
        {x: 1, y: -d},
        {x: -1, y: -d},
        {x: -this.entity.w / 2, y: this.entity.h / 2},
        {x: this.entity.w / 2, y: this.entity.h / 2},
        /*{x: -this.entity.w / 2, y: -this.entity.h / 2},
        {x: -this.entity.w / 2, y: this.entity.h / 2},
        {x: this.entity.w / 2, y: this.entity.h / 2},
        {x: this.entity.w / 2, y: -this.entity.h / 2},*/
      ]);
    } else {
      this.entity.setVertices();
    }
  }});
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
        rotate(s, -PI);
        break;
      case 39:
        rotate(s, 0);
        break;
      case 38:
        var destinations = s.solids.filter(function (solid) {
          return (player.anchor.x !== solid.x || player.anchor.y !== solid.y) && between(modulo(angle(player.anchor.x, player.anchor.y, solid.x, solid.y), PI2), modulo(player.angle - PI / 2, PI2) - 0.01, modulo(player.angle - PI / 2, PI2) + 0.01);
        }).sort(function (a, b) { return distance(player.anchor.x, player.anchor.y, a.x, a.y) - distance(player.anchor.x, player.anchor.y, b.x, b.y); });
        if (destinations.length > 0) {
          player.root = player.anchor;
          player.anchor = destinations[0];
          player.angle = modulo(Math.round((player.angle + PI) / (PI / 2)) * PI / 2, PI2);
          var goal = {x: player.anchor.x + Math.round(16 * Math.cos(player.angle - PI / 2)), y: player.anchor.y + Math.round(16 * Math.sin(player.angle - PI / 2))};
          player.locked = true;
          player.add(Hybrid, {threshold: 32, speed: 192, rate: 8, goals: {x: goal.x, y: goal.y}, callback: function () {
            this.entity.locked = false;
            this.entity.remove(this);
            // strand - first check that the two blocks aren't already connected...
            if (this.entity.root.strands.indexOf(this.entity.anchor) === -1 && this.entity.anchor.strands.indexOf(this.entity.root) === -1) {              
              var e = this.entity.layer.add(Object.create(Entity).init()).set({
                z: this.entity.z - 1,
                x: (this.entity.root.x + this.entity.anchor.x) / 2,
                y: (this.entity.root.y + this.entity.anchor.y) / 2,
                w: Math.abs(this.entity.root.x - this.entity.anchor.x) + 2,
                h: Math.abs(this.entity.root.y - this.entity.anchor.y) + 2,
                opacity: 0.2,
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