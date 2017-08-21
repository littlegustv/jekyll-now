/* global Layer, Entity, Sprite, Follow, Oscillate, OFFSET, TILESIZE, gameWorld, Resources, Circle, Delay, Knight, COLUMNS, ROWS, randint */

var onStart = function () {
  var s = this;
  this.water_layer = this.addLayer(Object.create(Layer).init(320, 180));
  this.bg = this.addLayer(Object.create(Layer).init(320,180));
  this.bg.paused = true;

  this.fg = this.addLayer(Object.create(Layer).init(320,180));
  this.fg.paused = false;

  this.grid = [];

  this.light_layer = this.addLayer(Object.create(Layer).init(320,180));
  
  var water = this.water_layer.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  water.color = "#cb3d44";
  water.z = 1;
  
  this.mobs = [];
  
  for (var i = 0; i < COLUMNS; i++) {
    this.grid.push([]);
    for (var j = 0; j < ROWS; j++) {
      var g = {};
      var r = Resources.levels.levels[current_level][i][j];
      if (r >= 10) {
        r -= 10;
        this.player = this.fg.add(Object.create(Sprite).init(i * TILESIZE, j *TILESIZE, Resources.wisp));
        this.player.family = "action";
        this.player.point_light = this.light_layer.add(Object.create(Circle).init(this.player.x, this.player.y, TILESIZE));
        this.player.point_light.blend = "destination-out";
        this.player.point_light.addBehavior(Follow, {target: this.player, offset: {x: 0, y: -8}});
        this.player.point_light.addBehavior(Oscillate, {object: this.player.point_light, field: "radius", constant: 2, initial: TILESIZE, rate: 5});
        
        this.player.grid = this.player.addBehavior(Knight, {min: {x: OFFSET.x, y: OFFSET.y}, rate: 5, max: {x: OFFSET.x + TILESIZE * COLUMNS, y: OFFSET.y + TILESIZE * ROWS}, tilesize: TILESIZE, callback: function () {
          s.lit();
          var found = 0;
          for (var i = 0; i < s.mobs.length; i++) {
            var m = s.mobs[i].grid.toGrid(s.mobs[i]);
            if (s.lights[m.x][m.y].opacity >= 1) {
              s.mobs[i].hungry.setTarget();
              found += 1;
            }
          }
          gameWorld.playSound(Resources.step);
          s.bg.paused = false;
          this.entity.addBehavior(Delay, {duration: 0.8, callback: function () {
            s.bg.paused = true;
          }});
          
          // have to be visible to someone to not lose
          if (found <= 0) {
            var done = s.fg.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height / 2, Resources.expire_font, "you lose...", {align: "center", spacing: -2}));
            done.addBehavior(Delay, {duration: 0.6, callback: function () {
              gameWorld.setScene(1, true);
            }})
          }
          
        }, grid: this.grid});
        var p = this.player;
      }
      switch(r) {
        case 0:
          g.swamp = true;
          g.solid = false;
          break;
        case 1:
          g.swamp = false;
          g.solid = true;
          var solid = this.bg.add(Object.create(Sprite).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j - 4, Resources.box));//TILESIZE - 2, TILESIZE - 2));
          solid.z = 200;
          solid.family = "action";
          break;
        case 2:
          g.swamp = false;
          g.solid = false;
          break;
        case 3:
          g.swamp = false;
          g.solid = false;
          var m = this.bg.add(Object.create(Sprite).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j - 8, Resources.person));
          m.color = "tomato";
          m.grid = m.addBehavior(Pawn, {min: {x: OFFSET.x, y: OFFSET.y - 8}, max: {x: gameWorld.width - OFFSET.x - TILESIZE, y: gameWorld.height - OFFSET.y - 8}, rate: 5, tilesize: TILESIZE, grid: this.grid, callback: function () {
            var g = this.toGrid(this.entity);
            var p_g = s.player.grid.toGrid(s.player);
            if (g.x === p_g.x && g.y === p_g.y) {
              var done = s.fg.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height / 2, Resources.expire_font, "you lose...", {align: "center", spacing: -2}));
              done.addBehavior(Delay, {duration: 0.6, callback: function () {
                gameWorld.setScene(1, true);
              }});
            } else if (this.grid[g.x] && this.grid[g.x][g.y] && this.grid[g.x][g.y].swamp) {
              this.entity.alive = false;
              s.mobs.splice(s.mobs.indexOf(this.entity), 1);
              if (s.mobs.length <= 0) {
                // level over!
                var done = s.fg.add(Object.create(SpriteFont).init(gameWorld.width / 2, gameWorld.height / 2, Resources.expire_font, "complete...", {align: "center", spacing: -2}));
                done.addBehavior(Delay, {duration: 0.6, callback: function () {
                  current_level = (current_level + 1) % Resources.levels.levels.length;
                  gameWorld.setScene(1, true);
                }})
              }
            }
          }});
          m.z = 200;
          m.family = "action";
          this.mobs.push(m);
          break;
      }
      
      if (!g.swamp) {
        g.x = 0, g.y = 0;
        // fix me: need to clear and refresh this on map edit... or maybe it's trivial, since that's only for editor
        var ripple = this.water_layer.add(Object.create(Entity).init(OFFSET.x + TILESIZE * i, OFFSET.y + TILESIZE * j + 4, TILESIZE + 2, TILESIZE + 2));
        ripple.z = 2;
        ripple.addBehavior(Oscillate, {object: ripple, field: "w", constant: 2, initial: TILESIZE + 4, rate: 5});
        ripple.addBehavior(Oscillate, {object: ripple, field: "h", constant: 2, initial: TILESIZE + 4, rate: 5});
        ripple.color = "#751217";
      } else if (this.grid[i][j-1] && !this.grid[i][j-1].swamp) {
        if (this.grid[i-1] && !this.grid[i-1][j].swamp) {
          g.x = 1, g.y = 1;
        } else {
          g.x = 0, g.y = 1;
        }
      } else {
        if (this.grid[i-1] && !this.grid[i-1][j].swamp) {
          g.x = 1, g.y = 0;
        } else {
          g.x = 4, g.y = 0;
        }
      }
      this.grid[i].push({solid: g.solid, swamp: g.swamp, x: g.x, y: g.y});
    }  
  }

  for (var i = 0; i < this.mobs.length; i++) {
    this.mobs[i].hungry = this.mobs[i].addBehavior(Hungry, {target: this.player});
  }
  
  this.map = this.bg.add(Object.create(TileMap).init(COLUMNS * TILESIZE / 2 - 8, ROWS * TILESIZE / 2 - 8, Resources.werelight, this.grid));
  this.map.z = 2;

  var dark = this.light_layer.add(Object.create(Entity).init(gameWorld.width / 2, gameWorld.height / 2, gameWorld.width, gameWorld.height));
  dark.z = 9;;
  dark.opacity = 1;
  
  // lights.. need to go out of 8x8 grid if 'floating island effect' is wanted... (FIX ME)
  this.lights = [];
  for (var i = 0; i <= Math.ceil(gameWorld.width / TILESIZE); i++) {
    this.lights.push([]);
    for (var j = 0; j <= Math.ceil(gameWorld.height / TILESIZE); j++) {
      var l = this.light_layer.add(Object.create(Entity).init(TILESIZE * i, TILESIZE * j, TILESIZE, TILESIZE));
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
    for (var i = p.x; i < this.grid.length; i++) {
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
    for (var i = p.y; i < this.grid[p.x].length; i++) {
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

  // game editor
  if (true) {
    this.ui = this.addLayer(Object.create(Layer).init(gameWorld.width, gameWorld.height));
    
    // button to move object
    
    var menu = this.ui.add(Object.create(Entity).init(20, 10, 32, 14));
    menu.opacity = 0;
    menu.family = "button";
    menu.hover = btn_hover;
    menu.unhover = btn_unhover;
    menu.text = this.ui.add(Object.create(SpriteFont).init(menu.x, menu.y, Resources.expire_font, "menu", {align: "center", spacing: -2}));
    menu.trigger = function () {
      gameWorld.setScene(0);
    }
    
    var move = this.ui.add(Object.create(Entity).init(gameWorld.width - 30, 10, 46, 14));
    move.color = "green";
    move.family = "button";
    move.shown = this.ui.add(Object.create(TileMap).init(move.x, move.y, Resources.keys, [[{x: 1, y: 1}], [{x: 2, y: 1}], [{x: 3, y: 1}]]));
    move.text = this.ui.add(Object.create(SpriteFont).init(move.x, move.y, Resources.expire_font, "Move", {align: "center", spacing: -3}));
    move.text.z = 102;
    move.shown.z = 100;
    move.hover = btn_hover;
    move.unhover = btn_unhover;
    move.z = 101;
    move.trigger = function () {
      console.log('move');
      s.grabbing = true;
      s.action = "move";
    };
    
    // button to delete object
    
    var remove = this.ui.add(Object.create(Entity).init(gameWorld.width - 30, 30, 46, 14));
    remove.color = "red";
    remove.family = "button";
    remove.hover = btn_hover;
    remove.unhover = btn_unhover;
    remove.shown = this.ui.add(Object.create(TileMap).init(remove.x, remove.y, Resources.keys, [[{x: 1, y: 1}], [{x: 2, y: 1}], [{x: 3, y: 1}]]));
    remove.text = this.ui.add(Object.create(SpriteFont).init(remove.x, remove.y, Resources.expire_font, "remove", {align: "center", spacing: -3}));
    remove.text.z = 102;
    remove.shown.z = 100;
    remove.z = 101;
    remove.trigger = function () {
      console.log('remove');
      s.grabbing = true;
      s.action = "remove";
    };
    
    // button to add solid
    
    var addsolid = this.ui.add(Object.create(Entity).init(gameWorld.width - 30, 50, 46, 14));
    addsolid.color = "gray";
    addsolid.family = "button";
    addsolid.hover = btn_hover;
    addsolid.unhover = btn_unhover;
    addsolid.shown = this.ui.add(Object.create(TileMap).init(addsolid.x, addsolid.y, Resources.keys, [[{x: 1, y: 1}], [{x: 2, y: 1}], [{x: 3, y: 1}]]));
    addsolid.text = this.ui.add(Object.create(SpriteFont).init(addsolid.x, addsolid.y, Resources.expire_font, "+solid", {align: "center", spacing: -3}));
    addsolid.text.z = 102;
    addsolid.shown.z = 100;
    addsolid.z = 101;
    addsolid.trigger = function () {
      console.log('addsolid');
      s.adding = true;
      s.action = "solid";
    };
    
    // button to add water
    // button to add person
    
    var addperson = this.ui.add(Object.create(Entity).init(gameWorld.width - 30, 70, 46, 14));
    addperson.color = "darksalmon";
    addperson.family = "button";
    addperson.hover = btn_hover;
    addperson.unhover = btn_unhover;
    addperson.z = 101;
    addperson.shown = this.ui.add(Object.create(TileMap).init(addperson.x, addperson.y, Resources.keys, [[{x: 1, y: 1}], [{x: 2, y: 1}], [{x: 3, y: 1}]]));
    addperson.text = this.ui.add(Object.create(SpriteFont).init(addperson.x, addperson.y, Resources.expire_font, "+person", {align: "center", spacing: -3}));
    addperson.text.z = 102;
    addperson.shown.z = 100;
    addperson.trigger = function () {
      console.log('addperson');
      s.adding = true;
      s.action = "person";
    };
    
    var addswamp = this.ui.add(Object.create(Entity).init(gameWorld.width - 30, 90, 46, 14));
    addswamp.color = "darkslategray";
    addswamp.family = "button";
    addswamp.hover = btn_hover;
    addswamp.unhover = btn_unhover;
    addswamp.z = 101;
    addswamp.shown = this.ui.add(Object.create(TileMap).init(addswamp.x, addswamp.y, Resources.keys, [[{x: 1, y: 1}], [{x: 2, y: 1}], [{x: 3, y: 1}]]));
    addswamp.text = this.ui.add(Object.create(SpriteFont).init(addswamp.x, addswamp.y, Resources.expire_font, "+swamp", {align: "center", spacing: -3}));
    addswamp.text.z = 102;
    addswamp.shown.z = 100;
    addswamp.trigger = function () {
       console.log('addswamp');
       s.adding = true;
      s.action = "swamp";
    };
    
    var addfloor = this.ui.add(Object.create(Entity).init(gameWorld.width - 30, 110, 46, 14));
    addfloor.color = "#eeeeee";
    addfloor.family = "button";
    addfloor.hover = btn_hover;
    addfloor.unhover = btn_unhover;
    addfloor.z = 101;
    addfloor.shown = this.ui.add(Object.create(TileMap).init(addfloor.x, addfloor.y, Resources.keys, [[{x: 1, y: 1}], [{x: 2, y: 1}], [{x: 3, y: 1}]]));
    addfloor.text = this.ui.add(Object.create(SpriteFont).init(addfloor.x, addfloor.y, Resources.expire_font, "+floor", {align: "center", spacing: -3}));
    addfloor.text.z = 102;
    addfloor.shown.z = 100;
    addfloor.trigger = function () {
      console.log('addfloor');
      s.adding = true;
      s.action = "floor";
    };
    
    // button to toggle between editor and game
    var toggleui = this.ui.add(Object.create(Entity).init(gameWorld.width - 30, gameWorld.height - 10, 46, 14));
    toggleui.color = "cyan";
    toggleui.family = "button";
    toggleui.hover = btn_hover;
    toggleui.unhover = btn_unhover;
    toggleui.z = 101;
    toggleui.shown = this.ui.add(Object.create(TileMap).init(toggleui.x, toggleui.y, Resources.keys, [[{x: 1, y: 1}], [{x: 2, y: 1}], [{x: 3, y: 1}]]));
    toggleui.text = this.ui.add(Object.create(SpriteFont).init(toggleui.x, toggleui.y, Resources.expire_font, "toggle", {align: "center", spacing: -3}));
    toggleui.text.z = 102;
    toggleui.shown.z = 100;
    toggleui.trigger = function () {
      console.log('toggle');
      s.editor = !s.editor;
      s.bg.paused = !s.editor;
    };
    
    var save = this.ui.add(Object.create(Entity).init(gameWorld.width - 30, gameWorld.height - 30, 46, 14));
    save.color = "purple";
    save.family = "button";
    save.hover = btn_hover;
    save.unhover = btn_unhover;
    save.z = 101;
    save.shown = this.ui.add(Object.create(TileMap).init(save.x, save.y, Resources.keys, [[{x: 1, y: 1}], [{x: 2, y: 1}], [{x: 3, y: 1}]]));
    save.text = this.ui.add(Object.create(SpriteFont).init(save.x, save.y, Resources.expire_font, "@save", {align: "center", spacing: -3}));
    save.text.z = 102;
    save.shown.z = 100;
    save.trigger = function () {
      var data = s.grid.map(function (col) { return col.map( function (cell) { return cell.swamp ? 0 : (cell.solid ? 1 : 2); }); });
      for (var i = 0; i < s.mobs.length; i++) {
        var coord = s.mobs[i].grid.toGrid(s.mobs[i]);
        if (data[coord.x] && data[coord.x][coord.y]) {
          data[coord.x][coord.y] = 3;
        }
      }
      var p = s.player.grid.toGrid(s.player);
      data[p.x][p.y] += 10;
      console.log('saving', JSON.stringify(data));
    };
  }
  s.ui.buttons = [save, toggleui, addfloor, addperson, addswamp, addsolid, move, remove];
  s.ui.resetButtons = function () {
    this.selected = undefined;
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].unhover();
    }
    s.adding = false;
    s.action = undefined;
    s.grabbing = false;
    s.grabbed = undefined;
  };

  s.onClick = function (e) {
    var b = s.ui.onButton(e.x, e.y);
    if (b) {
      console.log('triggering')
      s.ui.resetButtons();
      b.trigger();
      s.ui.selected = b;
      return;
    }
    else if (!s.editor) {
      console.log('wrong mode');
      return;
    } else if (s.grabbing) {
      console.log('grabbing');
      var entity = select([s.fg, s.bg], e, "action");
      if (entity) {
        if (s.action == "move") {
          s.grabbing = false;
          s.grabbed = entity;
        } else if (s.action == "remove") {
          // bg has to be unpaused for this to work...
          entity.alive = false;
        }
      } else {
        console.log('no entity');
      }
    } else if (s.grabbed) {
      s.grabbed = undefined;
      s.grabbing = true;
    } else if (s.adding) {
      var x = Math.round((e.x - OFFSET.x) / TILESIZE), y = Math.round((e.y - OFFSET.y) / TILESIZE);
      if (s.action == "solid") {
        var box = s.bg.add(Object.create(Sprite).init(x * TILESIZE + OFFSET.x, y * TILESIZE + OFFSET.y - 4, Resources.box));
        box.z = 200;
        box.family = "action";
        s.grid[x][y].solid = true;
        // update grid
      } else if (s.action == "person") {
        var m = s.bg.add(Object.create(Sprite).init(x * TILESIZE + OFFSET.x, y * TILESIZE + OFFSET.y - 8, Resources.person));
        m.color = "tomato";
        m.grid = m.addBehavior(Pawn, {min: {x: OFFSET.x, y: OFFSET.y - 8}, max: {x: gameWorld.width - OFFSET.x - TILESIZE, y: gameWorld.height - OFFSET.y - 8}, rate: 5, tilesize: TILESIZE, grid: this.grid, callback: function () {
          var g = this.toGrid(this.entity);
          if (this.grid[g.x] && this.grid[g.x][g.y] && this.grid[g.x][g.y].swamp) {
            this.entity.alive = false;
          }
        }});
        m.hungry = m.addBehavior(Hungry, {target:p});
        m.z = 200;
        m.family = "action";
        s.mobs.push(m);
        // add behaviors!
      } else if (s.action == "swamp") {
        // set water
        s.grid[x][y].swamp = true;
        s.grid[x][y].solid = false; // incompatible !
      } else if (s.action == "floor") {
        s.grid[x][y].swamp = false;
      }
      //s.adding = false;
      // reconstruct tiledmap appearance
      for (var k = 0; k <= 1; k++) {
        for (var l = 0; l <= 1; l++) {
          var i = x + k, j = y + l;
          
          if (i >= s.grid.length) {}
          else if (j >= s.grid[i].length) {}
          else {
            var g = s.grid[i][j];
            if (!g.swamp) {
              g.x = 0, g.y = 0;
            } else if (s.grid[i][j-1] && !s.grid[i][j-1].swamp) {
              if (s.grid[i-1] && !s.grid[i-1][j].swamp) {
                g.x = 1, g.y = 1;
              } else {
                g.x = 0, g.y = 1;
              }
            } else {
              if (s.grid[i-1] && !s.grid[i-1][j].swamp) {
                g.x = 1, g.y = 0;
              } else {
                g.x = 4, g.y = 0;
              }
            }
          }
        }
      }
    }
    s.map.map = s.grid;
    s.lit();
    //s.ui.selected = undefined;
  }
  
  s.onMouseMove = function (e) {
    if (s.grabbed) {
      var offset = s.grabbed === s.player ? 0 : 8;
      s.grabbed.x = Math.round((e.x - OFFSET.x) / TILESIZE) * TILESIZE + OFFSET.x;
      s.grabbed.y = Math.round((e.y - OFFSET.y) / TILESIZE) * TILESIZE + OFFSET.y - offset;
    }
    var b = s.ui.onButton(e.x, e.y);
    if (b) {
      b.hover();
    }
    var buttons = s.ui.entities.filter(function (e) { return e.family === "button" });
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i] !== b && buttons[i] !== s.ui.selected) {
        buttons[i].unhover();
      }
    }
  }
  
  s.onMouseDown = function (e) {
    if (s.editor) return;
    else if (s.bg.paused) {
      s.player.grid.show = true;
    }
  }
  s.onMouseUp = function (e) {
    if (s.editor) return;
    else if (s.bg.paused) {
      s.player.grid.show = false;
      s.player.grid.select(e);
      gameWorld.playSound(Resources.jump);
    }
  }
  s.onKeyDown = function (e) {
  }
  
  
}
var onUpdate = function (dt) {
  var s = this;
  
  // rain --> ugly, but functional for now
  /*var rain = this.fg.add(Object.create(Entity).init(randint(-32, gameWorld.width + 32), randint(-gameWorld.width / 2, gameWorld.height), 8, 2));
  rain.angle = 100 * PI / 180;
  rain.addBehavior(Velocity);
  rain.color = "#751217";
  rain.z = 100;
  rain.velocity = {x: Math.cos(rain.angle) * 40, y: Math.sin(rain.angle) * 40};
  rain.addBehavior(Delay, {duration: 2, callback: function () {
    this.entity.alive = false;
    var splash = s.water_layer.add(Object.create(Entity).init(this.entity.x, this.entity.y, 8, 8));
    splash.color = "#751217";
    splash.addBehavior(FadeOut, {duration: 1});
  }});*/
  
}