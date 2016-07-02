var Layer = {
  init: function (camera) {
    this.camera = camera;
    this.entities = [];
    return this;
  },
  add: function (e) {
    e.layer = this;
    this.entities.push(e);
  },
  remove: function (e) {
    var index = this.entities.indexOf(e);
    if (e != -1) {
      this.entities.splice(index, 1);
    }
  },
  draw: function (ctx) {
    // FIX ME: ctx.save/restore in place for camera, is there a better place for it?
    ctx.save();
    this.camera.draw(ctx);
    
    if (this.drawOrder) {
      var entities = this.drawOrder();
    } else {
      var entities = this.entities;
    }

    for (var i = 0; i < entities.length; i++) {
      entities[i].draw(ctx);
    }
    ctx.restore();
  },
  update: function (dt) {
    // update
    this.camera.update(dt);
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].update(dt);
    }
    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].checkCollisions(i, this.entities);
    }
    for (var i = 0; i < this.entities.length; i++) {
      if (!this.entities[i].alive) {
        this.entities[i].end();
        this.entities.splice(i, 1);
      }
    }
  }
};