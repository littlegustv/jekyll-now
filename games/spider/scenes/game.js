/*

new movement:
  - round-out "outer" angle turn
  x- handle BOTH clockwise and counterclockwise movement (jumping should toggle between them);
  - is there a better way to handle jumping?

DUNGEON DESIGN:
  - item or ability that recontextualizes - unblocks obstacles you were passing previously
  - one-way movement, to keep you from wandering without cost and force you to mentally map the dungeon
  - 
  
*/
this.onStart = function () {
  var s = this;
  //console.log(Resources.levels[current_room]);
  this.buffer = undefined;
  var fg = s.add(Object.create(Layer).init(120 * GRIDSIZE, 120 * GRIDSIZE));
  var ui = s.add(Object.create(Layer).init(game.w, game.h));
  //fg.add(Object.create(Entity).init()).set({x: 0, y: 0, w: 100 * 16, h: 100 * 16, z: -1, color: "#eee"});
  
  console.log(Resources.a);

  for (var i = 0; i < Resources.a.layers.length - 1; i++) { // not including object layer
    fg.add(Object.create(TiledMap).init(Resources.tileset, Resources.a.layers[i])).set({x: 25 * GRIDSIZE - GRIDSIZE / 2, y: 25 * GRIDSIZE - GRIDSIZE / 2, z: i * 0.5}); 
  }

  this.score = ui.add(Object.create(SpriteFont).init(Resources.font)).set({x: game.w - 10, y: 16, align: "right", spacing: -2, text: "10"});
  
  this.enemies = [];
  this.exits = [];

  this.grid = [];

  for (var i = 0; i < Resources.a.layers[1].data.length; i++) { // solids currently inferred as being on layer[1]
    if (!this.grid[i % 50]) this.grid[i % 50] = [];
    if (Resources.a.layers[1].data[i] == 1) {
      this.grid[i % 50][round(i / 50, 1)] = true; //fg.add(Object.create(Sprite).init(Resources.tile).set({opacity: 0, x: MIN.x + (i % 50) * GRIDSIZE, y: MIN.y + round(i / 50, 1) * GRIDSIZE, z: 4, solid: true}));
    } else {
      this.grid[i % 50][round(i / 50, 1)] = false;
    }
  }
  
  var enemyinfo = Resources.a.layers[3].objects.filter(function (o) { return o.name == "Enemy"; });
  for (var i = 0; i < enemyinfo.length; i++) {
    var enemy = fg.add(Object.create(Sprite).init(Resources.ghost)).set({x: enemyinfo[i].x, y: enemyinfo[i].y, z: 3});
    enemy.direction = {x: enemyinfo[i].properties.directionx, y: enemyinfo[i].properties.directiony};
    enemy.locked = 0;
    enemy.angle = enemyinfo[i].properties.angle * PI2 / 360;
    enemy.add(Crawl, {goal: {}, rate: 2, threshold: 2, grid: this.grid});
    this.enemies.push(enemy);
    enemy.setCollision(Polygon);
  }

  var playerinfo = Resources.a.layers[3].objects.filter(function (o) { return o.name == "Player"; })[0];

  var player = fg.add(Object.create(Sprite).init(Resources.spider)).set({x: playerinfo.x, y: playerinfo.y, z: 3 });
  game.player = player;
  this.player = player;
  player.direction = {x: playerinfo.properties.directionx, y: playerinfo.properties.directiony};
  player.angle = playerinfo.properties.angle;
  player.movement = player.add(Crawl, {goal: {}, rate: 3, threshold: 2, grid: this.grid});
  player.setCollision(Polygon);
  player.collision.onHandle = function (obj, other) {
    game.setScene(0, true);
  }

  fg.camera.add(Follow, {target: player, offset: {x: -game.w / 2, y: -game.h / 2}});

  this.onKeyDown = function (e) {
    switch(e.keyCode) {
      case 38:
        player.movement.jump = true;
        break;
    }
  };
};
this.onUpdate = function (dt) {
  this.player.checkCollisions(0, this.enemies);
};