var onStart = function () {
  var s = this;
  this.bg = this.addLayer(Object.create(Layer).init(320,180));
  this.bg.paused = true;
  this.grid = [];

  this.light_layer = this.addLayer(Object.create(Layer).init(320,180));

  // grid
  for (var i = 0; i < 8; i++) {
    this.grid.push([]);
    for (var j = 0; j < 8; j++) {
      var g = {};
      //var g = this.bg.add(Object.create(Entity).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j, TILESIZE, TILESIZE));
      if (randint(0,10) < 1) {
        g.solid = true;
        //g.color = "darkgreen";
      } else if (randint(0, 10) < 1) {
        g.swamp = true;
        //g.color = "darkcyan";
      }
      this.grid[i].push({solid: g.solid, swamp: g.swamp});        
    }
  }
  var map = [];
  for (var i = 0; i < this.grid.length; i++) {
    map.push([]);
    for (var j = 0; j < this.grid.length; j++) {
      if (this.grid[i][j].solid) map[i].push({x: 2, y: 0});
      else if (this.grid[i][j].swamp) map[i].push({x: 1, y: 0});
      else map[i].push({x: 0, y: 0});
    }
  }
  var t = this.bg.add(Object.create(TileMap).init(gameWorld.width / 2, gameWorld.height / 2, Resources.tiles, map));

  this.player = this.bg.add(Object.create(Sprite).init(170,40,Resources.wisp));
  this.player.grid = this.player.addBehavior(Knight, {min: {x: OFFSET.x, y: OFFSET.y}, rate: 5, max: {x: 115, y: 80}, tilesize: TILESIZE, callback: function () {
    s.bg.paused = true;
    s.lit();
  }, grid: this.grid});
  var p = this.player;
  this.mobs = [];
  for (var i = 0; i < 10; i++) {
    var m = this.bg.add(Object.create(Entity).init(randint(0,8) * TILESIZE + OFFSET.x, randint(0,8) * OFFSET.y + TILESIZE, 8, 8));
    m.color = "tomato";
    m.grid = m.addBehavior(Pawn, {min: {x: OFFSET.x, y: OFFSET.y}, max: {x: gameWorld.width - OFFSET.x - TILESIZE, y: gameWorld.height - OFFSET.y}, rate: 5, tilesize: TILESIZE, grid: this.grid, callback: function () {
    var g = this.toGrid(this.entity);
    if (this.grid[g.x] && this.grid[g.x][g.y] && this.grid[g.x][g.y].swamp) this.entity.alive = false;
    }});
    m.hungry = m.addBehavior(Hungry, {target:p});
    this.mobs.push(m);
  }

  // light tiles
  this.light_layer.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      var l = this.light_layer.add(Object.create(Entity).init(OFFSET.x + i * TILESIZE, OFFSET.y + j * TILESIZE, TILESIZE, TILESIZE));
      l.color = "white";
      l.opacity = 1 - (distance(l.x, l.y, this.player.x, this.player.y) / 160);
      l.blend = "destination-out";
    }
  }
  this.lit = function () {
    for (var i = 0; i < this.light_layer.entities.length; i++) {
      var l = this.light_layer.entities[i];
      if (l.color == "white") {
        l.opacity = 1 - (distance(l.x, l.y, this.player.x, this.player.y) / 160);
      }
    }
  }


  // event listeners

  s.onClick = function (e) {
  }
  s.onMouseDown = function (e) {
    s.player.grid.show = true;
  }
  s.onMouseUp = function (e) {
    s.player.grid.show = false;
    s.player.grid.select(e);
    if (s.player.grid.target) {
      s.player.layer.paused = false;
      for (var i = 0; i < s.mobs.length; i++) {
        s.mobs[i].hungry.setTarget();
      }
    }
  }
  s.onKeyDown = function (e) {
  }
}
var onUpdate = function (dt) {
}