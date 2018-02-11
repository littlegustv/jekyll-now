/*

todo:

BUGS:
 x- sometimes controls seem unresponsive, but no error message??
 - sometimes staircase goes past correct floor, and just keeps going (up)
 - floor passenger lengths are not resetting/removing passengers properly
 - not properly 'checking' floors...

SIMPLE
x- specific floor destinations for passengers
x- visual indicator of requested floors, elevator current up/down status
x- delayed exit destination on reaching floor
x- health for passengers (i.e. they can tolerate 3 mistakes, X seconds waiting...)
  x- once exhausted, will start 'staircasing', i.e. going up/down one floor at a time until reaching destination (can all be done with one variable, one behavior, and a couple checkpoints?)
  x- 'wait' time effect on health
  x- all health-damaging conditions (x-gone past, x-elevator changes direction [not far enough], waiting)
  x- troubleshoot all cases
    x- waiting once destination := 0
  x- trigger on/off check when passenger appears on floor/changes destination
  x- elevator max passenger count, positioning
  x- elevator movement direction restriction

  x- light up floor indicator to show which floors are requested

TRICKY:
x- two teams as passenger 'spawner'
- new destination = random floor from remaining 'unchecked' floors
- limited pool (i.e. if some are stuck on floors)
- once found, all destinations will be on that floor
- once all on the floor, game will end

THEN:
- fighting behavior (can force teams to fight by isolating them on a floor; giving numbers advantage to one - but will they ALWAYS fight?)
- disgruntled passengers will damage YOUR health; grateful ones might repair you?
  - can press all the buttons, making it hard to know where to go?
  - can disable your floor/in-elevator camera, so you can't tell who is who
- complications: once the ritual requires more steps, does the game get more interesting?

  
WHAT IS THE STRATEGY?? WHAT ARE THE 'RESOURCES' BEING MANAGED? HOW DO YOU MIN/MAX YOUR WAY TO VICTORY?

*/


this.onStart = function () {
  this.fg = this.add(Object.create(Layer).init(game.w, game.h));
  this.floors = [];
  var s = this;

  this.fg.add(Object.create(Entity).init()).set({x: game.w / 2, y: game.h / 2, w: game.w, h: game.h, color: "limegreen", z: 0});

  this.fg.add(Object.create(TiledBackground).init(Resources.ground)).set({x: game.w / 2, y: game.h - 3, w: game.w, h: 6, z: 1});

  this.fg.add(Object.create(TiledBackground).init(Resources.building)).set({x: 32, y: game.h - (FLOORS / 4) * 32, w: 32, h: (FLOORS / 2) * 32, z: 2});

  this.fg.add(Object.create(TiledBackground).init(Resources.stair)).set({x: 64, y: game.h - (FLOORS / 4) * 32 + 10, w: 32, h: (FLOORS / 2) * 32 - 8, z: 3});

  this.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({x: game.w / 2, y: 48, align: "center", spacing: -2, text: "The Mezzanine", z: 2});

  var openers = this.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({x: game.w / 4, y: 12, align: "center", spacing: -2, name: "Opener", text: "Opener 5", z: 2, available: 5, checked: new Array(FLOORS).fill(0).map(function (a, i) { return i }) });
  var closers = this.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({x: 3 * game.w / 4, y: 12, align: "center", spacing: -2, name: "Closer", text: "Closer 5", z: 2, available: 5, checked: new Array(FLOORS).fill(0).map(function (a, i) { return i }) });

  game.openers = openers;

  for (var i = 0; i < FLOORS; i++) {
    var f = this.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({passengers: [], x: 8, y: game.h - i * FLOORSIZE - 8, align: "center", spacing: -2, text: (i === 0 ? 'M' : "" + i), z: 2});
    f.add(Behavior, {draw: function (ctx) {
      if (this.entity.requested) {
        ctx.beginPath();
        ctx.arc(this.entity.x, this.entity.y, 8, 0, PI2, true);
        ctx.fillStyle = "gold";
        ctx.fill();
      }
    }});
    this.floors.push(f);
  }

  this.newpassenger = function () {
    //var f = randint(0, openers.available + closers.available) <= openers.available ? openers : closers;
    var f = openers;
    f.available -= 1;
    f.text = f.name + " " + f.available;
    var d = choose(f.checked);

    //var d = randint(1, FLOORS);
    //var n = s.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({health: 3, x: game.w / 2, y: game.h - 8, z: 5, destination: d, text: "" + d});
    var n = s.fg.add(Object.create(Sprite).init(Resources[f.name.toLowerCase()])).set({faction: f, health: 3, x: game.w / 2, y: game.h - 8, z: 5, destination: d});
    n.direction = function () {
      var f = tofloor(this.y);
      //console.log(f, this.destination);
      return this.destination > f ? DIR.up : (this.destination < f ? DIR.down : DIR.at);
    };
    n.add(Behavior, {time: 0, patience: 5, update: function (dt) {
      if (this.entity.onelevator) return;
      else {            
        this.time += dt;
        if (this.time > this.patience) {
          console.log('damage');
          this.time = 0;
          this.entity.damage();
        }
      }
    }});
    n.damage = function () {
      this.health = Math.max(0, this.health - 1);
      this.opacity = 0.25 + 0.25 * this.health;
      var i = tofloor(this.y);
      // staircase
      if (this.health == 0) {
        this.add(Periodic, {direction: sign(this.destination - i), floor: i, period: 0.5, callback: function () {
          if (!s.floors[this.floor]) {
            console.warn('Tried to go to a floor not in range.', this.floor);
            return;
          }

          this.direction = sign(this.entity.destination - i);

          var n = s.floors[this.floor].passengers.indexOf(this.entity);
          s.floors[this.floor].passengers.splice(n, 1);
          this.floor += this.direction;
          if (s.floors[this.floor]) {
            s.floors[this.floor].passengers.push(this.entity);
            this.entity.y = s.floors[this.floor].y;
          }
          if (this.floor == this.entity.destination) {
            this.entity.remove(this);
            this.entity.arrive(this.floor);
            // fix me: trigger 'on arrive' actions -> for passenger
          }
        }});
      }
    };
    n.arrive = function (i) {
      this.onelevator = false;
      if (this.destination === 0 && i === 0) { // remove passenger from building
        this.alive = false; // fix me: remove from FLOOR as well; make more generic check/bejavior?  
        this.faction.available += 1;
        this.faction.text = this.faction.name + " " + this.faction.available;
        return;
      }

      this.x = game.w / 2 + s.floors[i].passengers.length * 8;
      s.floors[i].passengers.push(this);
      if (i === this.destination) {
        this.faction.checked.splice(this.destination, 1);
        console.log(this.faction.checked);
        this.add(Delay, {duration: 1, callback: function () {
          var j = this.entity.destination;
          this.entity.destination = 0;
          s.floors[j].requested = true;
          this.entity.text = "" + this.entity.destination;
          //this.entity.remove(this);
          if (game.elevator.floor === j) game.elevator.fill(j);
        }});
      } else { // gone past floor
        this.damage();
      }
    };
    n.x = game.w / 2 + s.floors[0].passengers.length * 8;
    //n.follow = n.add(Follow, {target: s.floors[0], offset: {x: game.w / 2, y: 0, z: 1}});
    s.floors[0].passengers.push(n);
    s.floors[0].requested = true;
    if (game.elevator.floor === 0) game.elevator.fill(0);
    return n;
  };

  game.elevator = this.fg.add(Object.create(Sprite).init(Resources.elevator)).set({direction: DIR.up, passengers: [], x: game.w - 16, y: game.h - 8, z: 3, floor: 0});
  game.elevator.indicator = this.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({text: "up", spacing: -2, align: "center"});
  game.elevator.indicator.add(Follow, {target: game.elevator, offset: {x: 0, y: -12, z: 1 }});
  game.elevator.scene = s;
  game.elevator.unfill = function (i) {

    for (var j = this.passengers.length - 1; j >= 0; j--) {
      // redundant code, but unfortunately the 'follow' behavior doesn't always happen between setting elevator Y and here (why would it!)
      this.passengers[j].y = this.y;
      if (this.passengers[j].direction() !== this.direction) {
        var p = this.passengers.splice(j, 1)[0];
        p.arrive(i);
      }
    }
    s.floors[i].requested = false;
  }
  game.elevator.fill = function (i) {
    for (var j = s.floors[i].passengers.length - 1; j >= 0; j--) {
      if (this.passengers.length >= CAPACITY) return;
      
      if (s.floors[i].passengers[j].direction() === this.direction) {
        var p = s.floors[i].passengers.splice(j, 1)[0];
        s.floors[p.destination].requested = true;
        //p.follow.target = game.elevator;
        //p.follow.offset.x = -game.elevator.passengers.length * 8;
        p.x = this.x + this.w / 2 - p.w - this.passengers.length * 6;
        p.onelevator = true;
        //console.log(p.follow.offset);
        this.passengers.push(p);
      }
    }
  }
  game.elevator.move = function (i) {

    if (s.floors[i]) {
      this.floor = i;
      // move to floor

      this.y = s.floors[i].y;
      // remove old passengers
      this.unfill(i);    
      // check for new passengers
      this.fill(i);
    }
  }

  this.onMouseDown = function (e) {
    console.log('mousedown', game.elevator);
    var i = tofloor(e.y);
    if ((game.elevator.direction === DIR.up && i >= game.elevator.floor) || (game.elevator.direction === DIR.down && i <= game.elevator.floor)) {
      game.elevator.move(i);      
    }
  };
  this.onMouseMove = function (e) {
    var i = tofloor(e.y);
    for (var j = 0; j < s.floors.length; j++) {
      s.floors[j].opacity = 1;
    }
    if (s.floors[i]) s.floors[i].opacity = 0.5;
  };

  this.onKeyDown = function (e) {

    console.log('keydown', e.keyCode, game.elevator);
    switch(e.keyCode) {
      case 32:
      console.log(game.elevator.direction);
        game.elevator.direction = (game.elevator.direction === DIR.up ? DIR.down : DIR.up);
      console.log(game.elevator.direction);   
        game.elevator.indicator.text = game.elevator.direction === DIR.up ? "up" : "down";
        var i = tofloor(game.elevator.y);
        game.elevator.unfill(i);    
        game.elevator.fill(i);
        break;
      case 81:
        // create new passenger at mezzanine
        s.newpassenger();
        break;
    }
  };

};
this.onUpdate = function (dt) {

};