this.onStart = function () {
  var s = this;
  this.buffer = undefined;
  var fg = s.add(Object.create(Layer).init(game.w, game.h));
  var ui = s.add(Object.create(Layer).init(game.w, game.h));
  fg.add(Object.create(Entity).init()).set({x: 0, y: 0, w: 100 * 16, h: 100 * 16, z: -1, color: "#f5f5f5"});
  
  this.score = ui.add(Object.create(SpriteFont).init(Resources.font)).set({x: game.w - 10, y: 16, align: "right", spacing: -2, text: "10"});
  
  this.solids = [];
  this.enemies = [];
  this.webs = [];
  // solids
  for (var i = 0; i < 100; i++) {
    var x = randint(-20, 20) * 16, y = randint(-20, 20) * 16;
    x = 160 + 128 * (i % 2);
    y = Math.floor(i / 2) * 16;
    this.solids.push(fg.add(Object.create(Sprite).init(Resources.tile)).set({x: x, y: y, solid: true, z: 4, strands: [] }));
  }
  // enemies
  for (var i = 6; i <= 6; i++) {   
    var enemy = fg.add(Object.create(Sprite).init(Resources.ghost)).set({x: this.solids[i].x + 16, y: this.solids[i].y, z: 3, family: FAMILY.enemy});
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
  }

  var player = fg.add(Object.create(Sprite).init(Resources.spider)).set({x: this.solids[0].x + 16, y: this.solids[0].y, z: 3, anchor: this.solids[0], angle: PI / 2});
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
        {x: -1, y: -this.entity.h / 2},
        {x: 1, y: -this.entity.h / 2},
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
  fg.camera.add(Follow, {target: player, offset: { x: -game.w / 2, y: -game.h / 2}});
  
  this.onKeyDown = function (e) {
    if (player.locked) {
      s.buffer = e;
      return;
    }
    switch(e.keyCode) {
      case 37:
        // check for wall
        var goal = {
          x: player.anchor.x + Math.round(16 * Math.cos(player.angle - PI)), 
          y: player.anchor.y + Math.round(16 * Math.sin(player.angle - PI)), 
          angle: player.angle - PI / 2
        };
        var block = {
          x: player.x + Math.round(16 * Math.cos(player.angle - PI)), 
          y: player.y + Math.round(16 * Math.sin(player.angle - PI))
        }
        for (var i = 0; i < s.solids.length; i++) {
          if (s.solids[i].x === block.x && s.solids[i].y === block.y) {
            goal.x = player.x;
            goal.y = player.y
            goal.angle = player.angle + PI / 2;
            player.anchor = s.solids[i];
            break;
          }
          if (s.solids[i].x === goal.x && s.solids[i].y === goal.y) {
            console.log('should only be ONCE');
            goal.x = s.solids[i].x + Math.round(16 * Math.cos(player.angle - PI / 2));
            goal.y = s.solids[i].y + Math.round(16 * Math.sin(player.angle - PI / 2));
            goal.angle = player.angle;
            player.anchor = s.solids[i];
          }
        }
        
        player.locked = true;
        player.add(Lerp, {rate: 10, goals: {x: goal.x, y: goal.y, angle: Math.round(goal.angle / (PI / 2)) * PI / 2}, callback: function () {
          this.entity.locked = false;
          this.entity.remove(this);
        }});
        break;
      case 39:
        var goal = {
          x: player.anchor.x + Math.round(16 * Math.cos(player.angle)), 
          y: player.anchor.y + Math.round(16 * Math.sin(player.angle)),
          angle: player.angle + PI / 2
        };
        var block = {
          x: player.x + Math.round(16 * Math.cos(player.angle)), 
          y: player.y + Math.round(16 * Math.sin(player.angle))
        };
        for (var i = 0; i < s.solids.length; i++) {
          if (s.solids[i].x === block.x && s.solids[i].y === block.y) {
            goal.x = player.x;
            goal.y = player.y
            goal.angle = player.angle - PI / 2;
            player.anchor = s.solids[i];
            break;
          }
          if (s.solids[i].x === goal.x && s.solids[i].y === goal.y) {
             console.log('should Only be ONCE');
            goal.x = s.solids[i].x + Math.round(16 * Math.cos(player.angle - PI / 2));
            goal.y = s.solids[i].y + Math.round(16 * Math.sin(player.angle - PI / 2));
            goal.angle = player.angle;
            player.anchor = s.solids[i];
          }
        }
        
        player.locked = true;
        player.add(Lerp, {rate: 10, goals: {x: goal.x, y: goal.y, angle: Math.round(goal.angle / (PI / 2)) * PI / 2}, callback: function () {
          this.entity.locked = false;
          this.entity.remove(this);
        }});
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