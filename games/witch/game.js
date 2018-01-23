var game = Object.create(World).init(320, 180, "index.json");

var min = {x: 0, y: 20};
var TILESIZE = 16;

function at(a, b) {
  return a.x === b.x && a.y === b.y;
}

function toGrid(p) {
  return {x: Math.floor((p.x - min.x) / TILESIZE), y: Math.floor((p.y - min.y) / TILESIZE)};
}
function fromGrid(p) {
  return {x: min.x + p.x * TILESIZE, y: min.y + p.y * TILESIZE};
}

var movesolid = function (p) {
  for (var i = 0; i < this.layer.entities.length; i++) {
      if (this.layer.entities[i].x === this.x + p.x && this.layer.entities[i].y === this.y + p.y && this.layer.entities[i].solid) return false;
  }
  this.x += p.x;
  this.y += p.y;
};

var Fire = {
  square: function (entity, points) {
    for (var i = 0; i < points.length; i++) {
      var flame = entity.layer.add(Object.create(Sprite).init(Resources.fire)).set({turns: 2, x: points[i].x + TILESIZE / 2, y: points[i].y, color: "orange", z: entity.z - 1, family: 'fire'});      
      game.scene.summons.push(flame); // fix me: bad global(ish) object reliance! -> make this a subset of Spell behavior??
    }
  },
  line: function (entity, points) {
    for (var i = 0; i < points.length; i++) {
      if (points[i].x + TILESIZE / 2 === entity.x && points[i].y === entity.y) {
        // none
      } else {
        var flame = entity.layer.add(Object.create(Sprite).init(Resources.fire)).set({turns: 2, x: points[i].x + TILESIZE / 2, y: points[i].y, color: "orange", z: entity.z - 1, family: 'fire'});
        game.scene.summons.push(flame);        
      }
    }
  },
};

// gridsize, offset
var Spell = Object.create(Behavior);
Spell.set = function (point) {
  this.points.push(point);
};
Spell.shapes = [
  {
    name: 'line',
    points: [
      {d: 1, theta: 0},
    ]
  },
  {
    name: 'line',
    points: [
      {d: 1, theta: PI / 2},
    ]
  },
  // square
  {
    name: 'square',
    points: [
      {d: 1, theta: 0},
      {d: 1, theta: PI / 2},
      {d: 1, theta: PI},
      {d: 1, theta: 3 * PI / 2}
    ]
  },
  // staircase
  {
    name: 'staircase',
    points: [
      {d: 1, theta: PI / 2},
      {d: 1, theta: 0},
      {d: 1, theta: PI / 2},
      {d: 1, theta: 0}
    ]
  },
  // u
  {
    name: 'u',
    points: [
      {d: 1, theta: PI / 2},
      {d: 1, theta: 0},
      {d: 1, theta: 3 * PI / 2}
    ]
  },
  {
    name: 'triangle-down',
    points: [
      {d: Math.sqrt(0.5), theta: PI / 4},
      {d: Math.sqrt(0.5), theta: 7 * PI / 4},
      {d: 1, theta: PI}
    ]
  }
];
// fix me: ALSO check reverse
Spell.match = function (spell, attempt) {
  var min = 1000;
  for (var i = 0; i < spell.points.length; i++) {
    var m = spell.points.slice(i, spell.points.length).concat(spell.points.slice(0, i)).reduce(function (acc, cur, index) { return acc + Math.abs(attempt[index].theta - cur.theta) + Math.abs(attempt[index].d - cur.d); }, 0)
    if (m < min) {
      min = m;
    }
  }
  // try the spell in reverse
  var reverse = spell.points.slice(0).reverse();
  for (var i = 0; i < reverse.length; i++) {
    var m = reverse.slice(i, reverse.length).concat(reverse.slice(0, i)).reduce(function (acc, cur, index) { return acc + Math.abs(attempt[index].theta - ((PI + cur.theta) % PI2)) + Math.abs(attempt[index].d - cur.d); }, 0)
    if (m < min) {
      min = m;
    }
  }
  delete reverse;
  return min;
}
// pattern match various shapes
Spell.check = function () {
  var points = [];
  var t = this;
  var max_distance = 0;
  for (var i = 0; i < this.points.length; i++) {
    var p = this.points[i];
    if (i + 1 < this.points.length) {
      var q = this.points[(i + 1)];    
    } else {
      var q = {x: this.entity.x, y: this.entity.y};    
    }
    var new_point = {d: distance(p.x, p.y, q.x, q.y), theta: modulo(angle(p.x, p.y, q.x, q.y), PI2)}
    if (new_point.d > max_distance) max_distance = new_point.d;
    points.push(new_point);
  }
  // normalize distances
  for (var i = 0; i < points.length; i++) {
    points[i].d = points[i].d / max_distance;
  }  
  
  // start by assuming shape start is always the same (figure out rotations later)
  var shapes = this.shapes.filter(function (shape) { return shape.points.length == points.length; });
  if (shapes.length <= 0) console.log('no matching size');
  else {
    shapes = shapes.sort(function (a, b) { 
      return t.match(a, points) - t.match(b, points);
        //b.points.reduce(function (acc, cur, index) { return acc + Math.abs(points[index].theta - cur.theta); }, 0);
    });
    var delta = t.match(shapes[0], points);
    if (delta > this.threshold) {
      console.log('too different, sorry!', delta, shapes[0].name, shapes[0], points, this.points);
    } else {
      console.log('matched', shapes[0].name);
      if (Fire[shapes[0].name]) {
        Fire[shapes[0].name](this.entity, this.lines());
      }      
    }    
  }
}
Spell.reset = function () {
  this.check();
  this.points = [];
}
Spell.update = function (dt) {
  if (this.time === undefined) this.time = 0;
  //this.time += 10 * dt;
  //if (this.time >= TILESIZE) this.time = 0;
}
/* https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm */
/* get all the tiles to draw on here... */
Spell.lines = function () {
  var points = [];
  for (var i = 0; i < this.points.length; i++) {
    var p0 = toGrid(this.points[i]);
    if (i < this.points.length - 1) var p1 = toGrid(this.points[i + 1]);
    else var p1 = toGrid(this.entity);
    var dx = p1.x - p0.x;
    var dy = p1.y - p0.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      var derr = Math.abs(dy / dx);
      var y = p0.y;
      var error = 0;
      for (var x = p0.x; (sign(dx) == 1 ? x <= p1.x : x >= p1.x); (sign(dx) == 1 ? x++ : x--)) {
        var pout = fromGrid({x: x, y: y});
        points.push(pout);
        error += derr;
        while (error >= 0.5) {
          y = y + sign(dy) * 1;
          error = error - 1;
        }
      }
    } else {
      var derr = Math.abs(dx / dy);
      var error = 0;
      var x = p0.x;
      for (var y = p0.y; (sign(dy) == 1 ? y <= p1.y : y >= p1.y); (sign(dy) == 1 ? y++ : y--)) {
        var pout = fromGrid({x: x, y: y});
        points.push(pout);
        error += derr;
        while (error >= 0.5) {
          x = x + sign(dx) * 1;
          error = error - 1;
        }
      }
    }
  }
  return points;
};
Spell.draw = function (ctx) {
  ctx.fillStyle = this.color;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 2;
  var points = this.lines();
  for (var i = 0; i < points.length; i++) {
    ctx.fillRect(points[i].x, points[i].y, TILESIZE, TILESIZE);
    ctx.drawImage(Resources.icon.image, points[i].x, points[i].y);    
  }
};

// enemy behaviors
var Simple = Object.create(Behavior);
Simple.move = function () {
  if (!this.resting) {
    if (Math.abs(this.target.x - this.entity.x) > Math.abs(this.target.y - this.entity.y)) {
      this.entity.move({x: sign(this.target.x - this.entity.x) * TILESIZE, y: 0});
    } else {
      this.entity.move({x: 0, y: sign(this.target.y - this.entity.y) * TILESIZE});
    }
    this.resting = true;
  } else {
    this.resting = false;
  }
};