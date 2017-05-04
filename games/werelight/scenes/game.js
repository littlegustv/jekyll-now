var onStart = function () {
  var s = this;
  this.bg = this.addLayer(Object.create(Layer).init(320,180));
  this.bg.paused = true;

  this.fg = this.addLayer(Object.create(Layer).init(320,180));
  this.fg.paused = false;

  this.grid = [];

  this.light_layer = this.addLayer(Object.create(Layer).init(320,180));
  var water = this.bg.add(Object.create(TiledBackground).init(gameWorld.width / 2, gameWorld.height / 2, 8 * TILESIZE, 8 * TILESIZE, Resources.water));
  water.z = -1;

  // grid
  for (var i = 0; i < 8; i++) {
    this.grid.push([]);
    for (var j = 0; j < 8; j++) {
      var g = {};
      //var g = this.bg.add(Object.create(Entity).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j, TILESIZE, TILESIZE));
      if (randint(0,10) < 1) {
        g.solid = true;
        //g.color = "darkgreen";
        this.bg.add(Object.create(Sprite).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j, Resources.post));
      } else if (randint(0, 10) < 1) {
        g.swamp = true;
        //g.color = "darkcyan";
      } else {
        this.bg.add(Object.create(Sprite).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j, Resources.tile));
      }
      this.grid[i].push({solid: g.solid, swamp: g.swamp});        
    }
  }/*
  var map = [];
  for (var i = 0; i < this.grid.length; i++) {
    map.push([]);
    for (var j = 0; j < this.grid.length; j++) {
      if (this.grid[i][j].solid) map[i].push({x: 2, y: 0});
      else if (this.grid[i][j].swamp) map[i].push({x: 1, y: 0});
      else map[i].push({x: 0, y: 0});
    }
  }*/
  //var t = this.bg.add(Object.create(TileMap).init(gameWorld.width / 2, gameWorld.height / 2, Resources.tiles, map));

  this.player = this.fg.add(Object.create(Sprite).init(170,40,Resources.wisp));
  this.player.grid = this.player.addBehavior(Knight, {min: {x: OFFSET.x, y: OFFSET.y}, rate: 5, max: {x: OFFSET.x + 7 * TILESIZE, y: OFFSET.y + 7 * TILESIZE}, tilesize: TILESIZE, callback: function () {
    for (var i = 0; i < s.mobs.length; i++) {
      s.mobs[i].hungry.setTarget();
    }
    //console.log(s.lights[g.x][g.y]);
    s.bg.paused = false;
    //s.lit();
    this.entity.addBehavior(Delay, {duration: 0.8, callback: function () {
      s.bg.paused = true;
    }});
  }, grid: this.grid});
  var p = this.player;
  this.player.offset = {x: 0, y: -6};
  this.player.z = 10;
  this.mobs = [];
  for (var i = 0; i < 10; i++) {
    var m = this.bg.add(Object.create(Entity).init(randint(0,8) * TILESIZE + OFFSET.x, randint(0,8) * OFFSET.y + TILESIZE, 8, 8));
    m.color = "tomato";
    m.grid = m.addBehavior(Pawn, {min: {x: OFFSET.x, y: OFFSET.y}, max: {x: gameWorld.width - OFFSET.x - TILESIZE, y: gameWorld.height - OFFSET.y}, rate: 5, tilesize: TILESIZE, grid: this.grid, callback: function () {
      var g = this.toGrid(this.entity);
      if (this.grid[g.x] && this.grid[g.x][g.y] && this.grid[g.x][g.y].swamp) this.entity.alive = false;
    }});
    m.hungry = m.addBehavior(Hungry, {target:p});
    m.z = 2;
    this.mobs.push(m);
  }

  s.onClick = function (e) {
  }
  s.onMouseDown = function (e) {
    if (s.bg.paused) {
      s.player.grid.show = true;
    }
  }
  s.onMouseUp = function (e) {
    if (s.bg.paused) {
      s.player.grid.show = false;
      s.player.grid.select(e);
    }
  }
  s.onKeyDown = function (e) {
  }
}
var onUpdate = function (dt) {
}