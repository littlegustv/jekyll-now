/*

todo:

SIMPLE
x- specific floor destinations for passengers
x- visual indicator of requested floors, elevator current up/down status
x- delayed exit destination on reaching floor
- health for passengers (i.e. they can tolerate 3 mistakes)

TRICKY:
- two teams as passenger 'spawner'
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

THOUGHT:
- likely have to be 'stairs' - once a certain time limit runs out, they take the stairs and gradually get to their destination anyway
  
WHAT IS THE STRATEGY?? WHAT ARE THE 'RESOURCES' BEING MANAGED? HOW DO YOU MIN/MAX YOUR WAY TO VICTORY?

 */


this.onStart = function () {
  this.fg = this.add(Object.create(Layer).init(game.w, game.h));
  this.floors = [];
  var s = this;

  this.fg.add(Object.create(Entity).init()).set({x: game.w / 2, y: game.h / 2, w: game.w, h: game.h, color: "limegreen", z: 0});

  this.fg.add(Object.create(TiledBackground).init(Resources.ground)).set({x: game.w / 2, y: game.h - 3, w: game.w, h: 6, z: 1});

  this.fg.add(Object.create(TiledBackground).init(Resources.building)).set({x: 32, y: game.h - (FLOORS / 4) * 32, w: 32, h: (FLOORS / 2) * 32, z: 2});

  this.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({x: game.w / 2, y: 32, align: "center", spacing: -2, text: "The Mezzanine", z: 2});

  for (var i = 0; i < FLOORS; i++) {
    this.floors.push(this.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({passengers: [], x: 8, y: game.h - i * FLOORSIZE - 8, align: "center", spacing: -2, text: (i === 0 ? 'M' : "" + i), z: 2}));
  }

  game.elevator = this.fg.add(Object.create(Entity).init()).set({direction: "up", passengers: [], x: game.w - 16, y: game.h - 8, w: 32, h: FLOORSIZE, color: "white", z: 3, floor: 0});
  game.elevator.indicator = this.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({text: game.elevator.direction, spacing: -2, align: "center"});
  game.elevator.indicator.add(Follow, {target: game.elevator, offset: {x: 0, y: -9, z: 1 }});

  this.onMouseDown = function (e) {
    var i = tofloor(e.y);
    game.elevator.floor = i;
    // move to floor
    game.elevator.y = s.floors[i].y;
    // remove old passengers
    for (var j = game.elevator.passengers.length - 1; j >= 0; j--) {
      // redundant code, but unfortunately the 'follow' behavior doesn't always happen between setting elevator Y and here (why would it!)
      game.elevator.passengers[j].y = game.elevator.y;
      if (game.elevator.passengers[j].direction() !== game.elevator.direction) {
        var p = game.elevator.passengers.splice(j, 1)[0];
        //p.follow.target = s.floors[i];
        p.x = game.w / 2 + s.floors[i].passengers.length * 8;
        s.floors[i].passengers.push(p);
        if (p.destination !== 0 && i === p.destination) {
          p.add(Delay, {duration: 1, callback: function () {
            this.entity.destination = 0;
            this.entity.text = "" + this.entity.destination;
            this.entity.remove(this);
          }});
        } else if (p.destination === 0 && i === 0) {
          p.alive = false;
        }
      }
    }
    // check for new passengers
    for (var j = s.floors[i].passengers.length - 1; j >= 0; j--) {
      if (s.floors[i].passengers[j].direction() === game.elevator.direction) {
        var p = s.floors[i].passengers.splice(j, 1)[0];
        //p.follow.target = game.elevator;
        //p.follow.offset.x = -game.elevator.passengers.length * 8;
        p.x = game.elevator.x - game.elevator.passengers.length * 8
        //console.log(p.follow.offset);
        game.elevator.passengers.push(p);
      }
    }
  };
  this.onMouseMove = function (e) {
    var i = tofloor(e.y);
    for (var j = 0; j < s.floors.length; j++) s.floors[j].opacity = 1;
    s.floors[i].opacity = 0.5;
  };

  this.onKeyDown = function (e) {
    switch(e.keyCode) {
      case 32:
        game.elevator.direction = (game.elevator.direction === "up" ? "down" : "up");
        game.elevator.indicator.text = game.elevator.direction;
        break;
      case 81:
        var d = randint(1, FLOORS);
        var n = s.fg.add(Object.create(SpriteFont).init(Resources.expire_font)).set({x: game.w / 2, y: game.h - 8, z: 5, destination: d, text: "" + d});
        n.direction = function () {
          var f = tofloor(this.y);
          console.log(f, this.destination);
          return this.destination > f ? "up" : (this.destination < f ? "down" : "at");
        }
        //n.follow = n.add(Follow, {target: s.floors[0], offset: {x: game.w / 2, y: 0, z: 1}});
        s.floors[0].passengers.push(n);
        break;
    }
  };

};
this.onUpdate = function (dt) {
};