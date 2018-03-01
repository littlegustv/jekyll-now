/*

new movement:
  - round-out "outer" angle turn
  x- handle BOTH clockwise and counterclockwise movement (jumping should toggle between them);
  - is there a better way to handle jumping?
  
*/
this.onStart = function () {
  var s = this;
  //console.log(Resources.levels[current_room]);
  this.buffer = undefined;
  var fg = s.add(Object.create(Layer).init(120 * GRIDSIZE, 120 * GRIDSIZE));
  var ui = s.add(Object.create(Layer).init(game.w, game.h));
  fg.add(Object.create(Entity).init()).set({x: 0, y: 0, w: 100 * 16, h: 100 * 16, z: -1, color: "#eee"});
  
  this.score = ui.add(Object.create(SpriteFont).init(Resources.font)).set({x: game.w - 10, y: 16, align: "right", spacing: -2, text: "10"});
  
  this.enemies = [];
  this.exits = [];

  this.grid = [];

  for (var i = 0; i < 100; i++) {
    this.grid.push([]);
    for (var j = 0; j < 100; j++) {
      if (false)
        this.grid[i].push(fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + i * GRIDSIZE, y: MIN.y + j * GRIDSIZE, z: 4, solid: true})));
      else {
        this.grid[i].push(false);
      }
    }
  }

  for (var k = 15; k < 25; k++) {
    this.grid[25][k] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 25 * GRIDSIZE, y: MIN.y + k * GRIDSIZE, z: 4, solid: true}));
    this.grid[29][k - 1] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 29 * GRIDSIZE, y: MIN.y + (k - 1) * GRIDSIZE, z: 4, solid: true}));
  }

  for (var k = 20; k < 30; k++) {
    this.grid[k][8] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + k * GRIDSIZE, y: MIN.y + 8 * GRIDSIZE, z: 4, solid: true}));
    this.grid[k][12] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + k * GRIDSIZE, y: MIN.y + 12 * GRIDSIZE, z: 4, solid: true}));
  }

  this.grid[26][22] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 26 * GRIDSIZE, y: MIN.y + 22 * GRIDSIZE, z: 4, solid: true}));
  this.grid[24][15] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 24 * GRIDSIZE, y: MIN.y + 15 * GRIDSIZE, z: 4, solid: true}));
  this.grid[23][15] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 23 * GRIDSIZE, y: MIN.y + 15 * GRIDSIZE, z: 4, solid: true}));
  this.grid[22][15] = fg.add(Object.create(Sprite).init(Resources.tile).set({x: MIN.x + 22 * GRIDSIZE, y: MIN.y + 15 * GRIDSIZE, z: 4, solid: true}));

  var enemy = fg.add(Object.create(Sprite).init(Resources.ghost)).set({x: 28 * GRIDSIZE, y: 16 * GRIDSIZE, z: 3});
  enemy.direction = {x: 0, y: -1};
  enemy.locked = 0;
  enemy.angle = PI;
  enemy.add(Crawl, {goal: {}, rate: 2, threshold: 2, grid: this.grid});
  this.enemies.push(enemy);
  enemy.setCollision(Polygon);

  var player = fg.add(Object.create(Sprite).init(Resources.spider)).set({x: 26 * GRIDSIZE, y: 24 * GRIDSIZE, z: 3 });
  game.player = player;
  this.player = player;
  player.direction = {x: 0, y: -1};
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