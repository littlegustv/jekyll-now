var Scene = {
	resourceCount: 1,
	resourceLoadCount: 0,
	init: function (name) {
		this.name = name;
		this.entities = [];
		this.loadData();
		return this;
	},
	onStart: function () {},
	onUpdate: function () {},
	onEnd: function () {},
	addEntity: function (e) {
		this.entities.push(e);
	},
	loadProgress: function () {
		this.resourceLoadCount += 1;
		if (this.resourceLoadCount >= this.resourceCount) {
			this.onStart();
		}
	},
	loadData: function () {
		var t = this;

		var request  = new XMLHttpRequest();
		request.open("GET", "scenes/" + this.name + ".json", true);
		request.onload = function () {
			t.data = JSON.parse(request.response);
			t.width = t.data.width, t.height = t.data.height;
			if (t.data.script) {
				t.resourceCount += 1;
				t.loadBehavior(t.data.script)
			}
			t.loadProgress();
		};
		request.send();
	},
	loadBehavior: function (script) {
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.src = "scenes/" + script;
		document.body.appendChild(s);

		// FIX ME: cross browser support
		var t = this;

		s.onload = function () {
			t.onStart = onStart;
			t.onUpdate = onUpdate;
			t.onEnd = onEnd;
			t.onDraw = onDraw;
			t.loadProgress();
		};
	},
	draw: function (ctx) {
		// FIX ME: ctx.save/restore in place for camera, is there a better place for it?
		ctx.save();
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].draw(ctx);
		}
		ctx.restore();
		if (this.onDraw) this.onDraw(ctx);
	},
	update: function (dt) {
		// update
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].update(dt);
		}
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].checkCollisions(i, this.entities);
		}
		this.onUpdate(dt);
		// clean up
		for (var i = 0; i < this.entities.length; i++) {
			if (!this.entities[i].alive) {
				this.entities.splice(i, 1);
			}
		}
	}
};