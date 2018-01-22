this.onStart = function () {
  var s = this;
  var fg = s.add(Object.create(Layer).init(game.w, game.h));
  this.enemies = [];
  this.summons = [];
  var wall = fg.add(Object.create(TiledBackground).init(Resources.wall).set({x: game.w / 2, y: min.y, z: 9, w: game.w, h: 32}));

  var witch = fg.add(Object.create(Sprite).init(Resources.witch)).set({x: min.x + 2 * TILESIZE - 8, y: min.y + TILESIZE * 2, z: 10});
  witch.spell = witch.add(Spell, {points: [], color: "darkorange", threshold: 0.1});
  this.witch = witch;
  witch.add(Bound, {min: {x: 8, y: min.y + 16}, max: {x: game.w - 8, y: game.h - 16}});
  var monster = fg.add(Object.create(Sprite).init(Resources.monster)).set({x: min.x + 12 * TILESIZE - 8, y: min.y + 4 * TILESIZE, z: 9});
  monster.enemy = monster.add(Simple, {target: witch});
  this.enemies.push(monster);
  fg.add(Object.create(TiledBackground).init(Resources.floor)).set({x: game.w / 2, y: min.y + 4.5 * 16 + 16, z: 8, w: game.w, h: 9 * 16});
  this.onClick = function () {
    //alert('hey');
  };
  this.onKeyDown = function (e) {
    switch (e.keyCode) {
      case 37:
        witch.x -= 16;
        break;
      case 39:
        witch.x += 16;
        break;
      case 38:
        witch.y -= 16;
        break;
      case 40:
        witch.y += 16;
        break;
      case 81:
        witch.spell.set({x: witch.x, y: witch.y});
        break;
      case 87:
        witch.spell.reset();
        break;
    }
    s.enemies.forEach(function (e) { e.enemy.move(); });
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
          this.enemies[i].alive = false;
          this.enemies.splice(i, 1);
          break;
        }
      }
    }
  }
};