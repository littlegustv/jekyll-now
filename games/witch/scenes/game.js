this.onStart = function () {
  var s = this;
  var fg = s.add(Object.create(Layer).init(game.w, game.h));

  //var ui = s.add(Object.create(Layer).init(game.w, game.h));  

  this.enemies = [];
  this.summons = [];
  var wall = fg.add(Object.create(TiledBackground).init(Resources.barrel).set({x: game.w / 2, y: min.y + 8, z: 9, w: game.w, h: 16}));

  var witch = fg.add(Object.create(Sprite).init(Resources.witch)).set({x: min.x + 2 * TILESIZE - 8, y: min.y + TILESIZE * 2, z: 10, move: movesolid, usedmana: 0, mana: 4, maxmana: 4});
  witch.add(Behavior, {draw: function (ctx) {
    for (var i = 0; i < this.entity.maxmana; i++) {
      if (i < (this.entity.mana - this.entity.usedmana)) {        
        ctx.fillStyle = "blue";
      } else if (i < this.entity.mana) {
        ctx.fillStyle = "lightblue";
      } else {
        ctx.fillStyle = "aliceblue";
      }
      ctx.fillRect(game.w - 16 - 16 * i, game.h - 16, 14, 14);
    }
  }});
  witch.spell = witch.add(Spell, {points: [], color: "darkorange", threshold: 0.1, regen: 2});
  this.witch = witch;
  witch.add(Bound, {min: {x: 8, y: min.y + 16}, max: {x: game.w - 8, y: game.h - 16}});
  var monster = fg.add(Object.create(Sprite).init(Resources.slime)).set({x: min.x + 12 * TILESIZE - 8, y: min.y + 4 * TILESIZE, z: 9, move: movesolid});
  monster.enemy = monster.add(Simple, {target: witch});
  this.enemies.push(monster);

  var solid = fg.add(Object.create(Sprite).init(Resources.barrel)).set({x: witch.x, y: witch.y + 2 * TILESIZE, z: 10, solid: true});

  fg.add(Object.create(TiledBackground).init(Resources.floor)).set({x: game.w / 2, y: min.y + 4 * 16 + 16, z: 8, w: game.w, h: 10 * 16});
  this.onClick = function () {
    //alert('hey');
  };
  this.onKeyDown = function (e) {
    var moved = false
    switch (e.keyCode) {
      case 27:
        game.setScene(0, true);
        break;
      case 37:
        moved = witch.move({x: -16, y: 0});
        witch.animation = 2;
        break;
      case 39:
        moved = witch.move({x: 16, y: 0});
        witch.animation = 3;
        break;
      case 38:
        moved = witch.move({x: 0, y: -16});
        witch.animation = 1;
        break;
      case 40:
        moved = witch.move({x: 0, y: 16});
        witch.animation = 0;
        break;
      case 81:
        moved = witch.spell.set({x: witch.x, y: witch.y});
        break;
      case 87:
        moved = witch.spell.reset();
        break;
    }
    if (moved) {
      for (var i = s.summons.length - 1; i >= 0; i--) {
        s.summons[i].turns -= 1;
        if (s.summons[i].turns <= 0) {
          s.summons[i].alive = false;
          var dust = s.summons[i].layer.add(Object.create(Sprite).init(Resources.dust)).set({x: s.summons[i].x, y: s.summons[i].y, animation: 3, z: s.summons[i].z});
          dust.behaviors[0].onEnd = function () {
            this.entity.alive = false;
          };
          s.summons.splice(i, 1);
        }
      }
      s.enemies.forEach(function (e) { e.enemy.move(); });
    }
  };
  this.ready = true; // needed since not loaded from file, to add event listeners
};
this.onUpdate = function (dt) {
  var s = this;
  if (this.enemies) {
    for (var i = this.enemies.length - 1; i >= 0; i--) {
      if (at(this.enemies[i], this.witch)) {
        console.log('game over');
        game.setScene(0, true);
      }
      for (var j = 0; j < this.summons.length; j++) {
        if (at(this.enemies[i], this.summons[j])) {
          var dust = this.enemies[i].layer.add(Object.create(Sprite).init(Resources.dust)).set({x: this.enemies[i].x, y: this.enemies[i].y, animation: 0, z: this.enemies[i].z});
          dust.behaviors[0].onEnd = function () {
            this.entity.alive = false;
          };
          this.enemies[i].alive = false;
          this.enemies.splice(i, 1);
          break;
        }
      }
    }
  }
};