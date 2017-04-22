var onStart = function () {
  var s = this;
  this.bg = this.addLayer(Object.create(Layer).init(320,180));
  this.bg.paused = true;

  this.fg = this.addLayer(Object.create(Layer).init(320,180));
  this.fg.paused = false;

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

  this.player = this.fg.add(Object.create(Sprite).init(170,40,Resources.wisp));
  this.player.grid = this.player.addBehavior(Knight, {min: {x: OFFSET.x, y: OFFSET.y}, rate: 5, max: {x: 115, y: 80}, tilesize: TILESIZE, callback: function () {
    for (var i = 0; i < s.mobs.length; i++) {
      var g = s.mobs[i].grid.toGrid(s.mobs[i]);
      if (s.lights[g.x][g.y].opacity > 0.15) {
        s.mobs[i].hungry.setTarget();
      }
    }
    console.log(s.lights[g.x][g.y]);
    s.bg.paused = false;
    s.lit();
    this.entity.addBehavior(Delay, {duration: 0.8, callback: function () {
      s.bg.paused = true;
    }});
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
  this.lights = [];
  for (var i = 0; i < 8; i++) {
    this.lights.push([]);
    for (var j = 0; j < 8; j++) {
      var l = this.light_layer.add(Object.create(Entity).init(OFFSET.x + i * TILESIZE, OFFSET.y + j * TILESIZE, TILESIZE, TILESIZE));
      l.color = "white";
      l.opacity = 1 - (distance(l.x, l.y, this.player.x, this.player.y) / 160);
      l.blend = "destination-out";
      this.lights[i].push(l);
    }
  }
  // iffy!
  this.lit = function () {
    // get player x,y
    var coord = s.player.grid.toGrid(s.player);
    var opacity = [1,1,1,1,1,1,1,1,1];
    for (var i = 0; i < this.light_layer.entities.length; i++) {
      if (this.light_layer.entities[i].w < 34)
        this.light_layer.entities[i].opacity = 0.15;
    }
    for (var i = 0; i < 8; i++) {
      var o = 0;
      for (var j = -1; j <= 1; j++) {
        for (var k = -1; k <= 1; k++) {
          var x = clamp(coord.x + j * i, 0, 7), y = clamp(coord.y + k   * i, 0, 7);
          if (this.grid[x][y].solid) opacity[o] = 0;
          else opacity[o] -= 0.05;
          this.lights[x][y].opacity = opacity[o] + 0.1;
          o++;
          console.log(o);       
        }       
      }
    }
  }


  // event listeners

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