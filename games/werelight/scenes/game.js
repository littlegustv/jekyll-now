var onStart = function () {
  var s = this;
  this.bg = this.addLayer(Object.create(Layer).init(320,180));
  this.bg.paused = true;

  this.fg = this.addLayer(Object.create(Layer).init(320,180));
  this.fg.paused = false;

  this.grid = [];

  this.light_layer = this.addLayer(Object.create(Layer).init(320,180));
  var water = this.bg.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, 8 * TILESIZE, 8 * TILESIZE));
  water.color = "#2f4f4f"; // darkslategray
  water.z = 1;

  for(var i = 0; i < 3; i++) {
    var l = this.bg.add(Object.create(TiledMap).init(gameWorld.width / 2, gameWorld.height / 2, Resources.werelight, Resources.levels.layers[i]));
    l.z = (i + 2);
  }
  
  this.mobs = [];
  
  this.player = this.fg.add(Object.create(Sprite).init(OFFSET.x + 2 * TILESIZE, OFFSET.y + 2 *TILESIZE,Resources.wisp));
  this.player.family = "action";
  this.player.point_light = this.light_layer.add(Object.create(Circle).init(this.player.x, this.player.y, TILESIZE));
  this.player.point_light.blend = "destination-out";
  this.player.point_light.addBehavior(Follow, {target: this.player, offset: {x: 0, y: -8}});
  
  this.player.grid = this.player.addBehavior(Knight, {min: {x: OFFSET.x, y: OFFSET.y}, rate: 5, max: {x: OFFSET.x + 7 * TILESIZE, y: OFFSET.y + 7 * TILESIZE}, tilesize: TILESIZE, callback: function () {
    s.lit();
    for (var i = 0; i < s.mobs.length; i++) {
      var m = s.mobs[i].grid.toGrid(s.mobs[i]);
      if (s.lights[m.x][m.y].opacity >= 1) {
        s.mobs[i].hungry.setTarget();
      }
    }
    s.bg.paused = false;
    this.entity.addBehavior(Delay, {duration: 0.8, callback: function () {
      s.bg.paused = true;
    }});
  }, grid: this.grid});
  var p = this.player;
  
  for (var i = 0; i < 8; i++) {
    this.grid.push([]);
    for (var j = 0; j < 8; j++) {
      var g = {};
      if (Resources.levels.layers[1].data[i + j * 8] === 0) {
        g.swamp = true;
        /*var swamp = this.bg.add(Object.create(Entity).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j,TILESIZE - 2, TILESIZE - 2));
        swamp.z = 200;
        swamp.color = "darkgreen";*/
      } else if (randint(0, 10) <= 1) {
        g.solid = true;
        var solid = this.bg.add(Object.create(Sprite).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j - 4, Resources.box));//TILESIZE - 2, TILESIZE - 2));
        solid.z = 200;
        solid.family = "action";
      } else {
        // mobs; eventually load from data
        if (randint(0,10) <= 1) {
          var m = this.bg.add(Object.create(Entity).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j - 8, 8, 16));
          m.color = "tomato";
          m.grid = m.addBehavior(Pawn, {min: {x: OFFSET.x, y: OFFSET.y - 8}, max: {x: gameWorld.width - OFFSET.x - TILESIZE, y: gameWorld.height - OFFSET.y - 8}, rate: 5, tilesize: TILESIZE, grid: this.grid, callback: function () {
            var g = this.toGrid(this.entity);
            if (this.grid[g.x] && this.grid[g.x][g.y] && this.grid[g.x][g.y].swamp) this.entity.alive = false;
          }});
          m.hungry = m.addBehavior(Hungry, {target:p});
          m.z = 201;
          m.family = "action";
          this.mobs.push(m);
        }
      }
      /*
      if (!g.swamp) {
        var ripple = this.bg.add(Object.create(Entity).init(land.x, land.y, TILESIZE + 2, TILESIZE + 2));
        ripple.z = 1;
        ripple.addBehavior(Oscillate, {object: ripple, field: "w", constant: 2, initial: TILESIZE + 2, rate: 5});
        ripple.addBehavior(Oscillate, {object: ripple, field: "h", constant: 2, initial: TILESIZE + 2, rate: 5});
        ripple.color = "#555555";
      }
      */
      this.grid[i].push({solid: g.solid, swamp: g.swamp});        
    }  
  }

  var dark = this.light_layer.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  dark.z = 9;;
  
  var l = this.light_layer.add(Object.create(Entity).init(gameWorld.width / 2, OFFSET.y - TILESIZE / 2, 8 * TILESIZE, TILESIZE));
  l.color = "white";
  l.blend = "destination-out";
  l.z = 10;
  l.opacity = 0.5;
  
  // lights
  this.lights = [];
  for (var i = 0; i < 8; i++) {
    this.lights.push([]);
    for (var j = 0; j < 8; j++) {
      var l = this.light_layer.add(Object.create(Entity).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j, TILESIZE, TILESIZE));
      l.color = "white";
      l.blend = "destination-out";
      l.z = 10;
      l.opacity = 0.5;
      this.lights[i].push(l);
    }
  }
  this.lit = function () {
    var p = this.player.grid.toGrid(this.player);
    for (var i = 0; i < this.lights.length; i++) {
      for (var j = 0; j < this.lights[i].length; j++) {
        this.lights[i][j].opacity = 0.5;
      }
    }
    for (var i = p.x; i < 8; i++) {
      if (this.grid[i][p.y].solid) {
        break;
      } else {
        this.lights[i][p.y].opacity = 1;
      }
    }
    for (var i = p.x; i >= 0; i--) {
      if (this.grid[i][p.y].solid) {
        break;
      } else {
        this.lights[i][p.y].opacity = 1;
      }
    }
    for (var i = p.y; i < 8; i++) {
      if (this.grid[p.x][i].solid) {
        break;
      } else {
        this.lights[p.x][i].opacity = 1;
      }
    }
    for (var i = p.y; i >= 0; i--) {
      if (this.grid[p.x][i].solid) {
        break;
      } else {
        this.lights[p.x][i].opacity = 1;
      }
    }
  }
  
  
  this.lit();
  
  this.player.offset = {x: 0, y: -6};
  this.player.z = 10;
  for (var i = 0; i < 10; i++) {
    
  }

  // game editor
  if (true) {
    this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
    var bg = this.ui.add(Object.create(Entity).init(gameWorld.width - 24, gameWorld.height / 2, 48, gameWorld.height));
    bg.color = "white";
    bg.z = 99;
    
    // button to toggle between editor and game
    
    // button to move object
    
    var move = this.ui.add(Object.create(Entity).init(gameWorld.width - 24, 6, 48, 12));
    move.color = "green";
    move.family = "button";
    move.hover = btn_hover;
    move.unhover = btn_unhover;
    move.z = 100;
    move.trigger = function () {
      s.grabbing = true;
      s.action = "move";
    };
    
    // button to delete object
    
    var remove = this.ui.add(Object.create(Entity).init(gameWorld.width - 24, 18, 48, 12));
    remove.color = "red";
    remove.family = "button";
    remove.hover = btn_hover;
    remove.unhover = btn_unhover;
    remove.z = 100;
    remove.trigger = function () {
      s.grabbing = true;
      s.action = "remove";
    };
    
    // button to add solid
    
    var addsolid = this.ui.add(Object.create(Entity).init(gameWorld.width - 24, 30, 48, 12));
    addsolid.color = "gray";
    addsolid.family = "button";
    addsolid.hover = btn_hover;
    addsolid.unhover = btn_unhover;
    addsolid.z = 100;
    addsolid.trigger = function () {
      s.adding = true;
      s.action = "solid";
    };
    
    // button to add water
    // button to add person
    
    var addperson = this.ui.add(Object.create(Entity).init(gameWorld.width - 24, 42, 48, 12));
    addperson.color = "darksalmon";
    addperson.family = "button";
    addperson.hover = btn_hover;
    addperson.unhover = btn_unhover;
    addperson.z = 100;
    addperson.trigger = function () {
      s.adding = true;
      s.action = "person";
    };
    
    var addswamp = this.ui.add(Object.create(Entity).init(gameWorld.width - 24, 54, 48, 12));
    addswamp.color = "darkslategray";
    addswamp.family = "button";
    addswamp.hover = btn_hover;
    addswamp.unhover = btn_unhover;
    addswamp.z = 100;
    addswamp.trigger = function () {
      s.adding = true;
      s.action = "swamp";
    };
  }

  s.onClick = function (e) {
    var b = s.ui.onButton(e.x, e.y);
    if (b) {
      b.trigger();
    }
    else if (s.grabbing) {
      var entity = select([s.fg, s.bg], e, "action");
      if (entity) {
        s.grabbing = false;
        if (s.action == "move") {
          s.grabbed = entity;
        } else if (s.action == "remove") {
          // bg has to be unpaused for this to work...
          entity.alive = false;
        }
      }
    } else if (s.grabbed) {
      s.grabbed = undefined;
    } else if (s.adding) {
      var x = Math.round((e.x - OFFSET.x) / TILESIZE), y = Math.round((e.y - OFFSET.y) / TILESIZE);
      if (s.action == "solid") {
        var box = s.bg.add(Object.create(Sprite).init(x * TILESIZE + OFFSET.x, y * TILESIZE + OFFSET.y - 4, Resources.box));
        box.z = 200;
        box.family = "action";
        s.grid[x][y].solid = true;
        s.lit();
        s.adding = false;
        // update grid
      } else if (s.action == "person") {
        var person = s.bg.add(Object.create(Entity).init(x * TILESIZE + OFFSET.x, y * TILESIZE + OFFSET.y - 8, 8, 16));
        person.color = "darksalmon";
        person.z = 201;
        person.family = "action";
        s.adding = false;

        // add behaviors!
      } else if (s.action == "swamp") {
        // set water
        s.grid[x][y].swamp = true;
        s.grid[x][y].solid = false; // incompatible !
        s.adding = false;

        // fix me: reconstruct tiledmap appearance
      }
    }
  }
  
  s.onMouseMove = function (e) {
    if (s.grabbed) {
      s.grabbed.x = Math.round((e.x - OFFSET.x) / TILESIZE) * TILESIZE + OFFSET.x;
      s.grabbed.y = Math.round((e.y - OFFSET.y) / TILESIZE) * TILESIZE + OFFSET.y;
    }
  }
  /*
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
  }*/
  
  
}
var onUpdate = function (dt) {
  /* rain (needs work)
  for (var i = 0; i < 5; i++) {
    var rain = this.fg.add(Object.create(Entity).init(randint(0, OFFSET.x + 8 * TILESIZE), randint(0, OFFSET.y + 8 * TILESIZE), 2, 8));
    rain.addBehavior(Velocity);
    rain.velocity = {x: 0, y: 20};
    rain.color = "darkslategray";
    rain.opacity = 0.6;
    rain.addBehavior(FadeOut, {duration: 0, delay: 1});
  }*/
}