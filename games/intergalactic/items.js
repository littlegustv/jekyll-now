var Item = Object.create(Entity);
Item.radius = 16;
Item.draw = function (ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
	ctx.fillStyle = this.color;
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.fillText(this.name, this.x, this.y);
};
Item.update = function (dt) {
};
Item.position = function (x, y) {
	this.x = x, this.y = y;
	return this;
};
Item.handleCollision = function (other) {
	other.inventory.push(this);
	entities.splice(entities.indexOf(this), 1);
};

var Weapon = Object.create(Item);
Weapon.init = function (name, weight, cost, damage) {
	this.type = "weapon";
	this.name = name;
	this.weight = weight;
	this.cost = cost;
	this.damage = damage;
	this.color = "#CC0000";
	return this;
}
Weapon.attacks = [
	function (obj) {
		if (obj.canShoot(25)) {
			var theta = obj.angle;
			var b = Object.create(Missile).init(obj.getX(), obj.getY(), theta, 400, obj.team);
			entities.push(b);
			obj.cooldown = 0.2;
			obj.temperature += 25;
		}
	},
	function (obj) {
		if (obj.canShoot(65)) {
			var theta = obj.angle;
			var b = Object.create(Projectile).init(obj.getX(), obj.getY(), theta, 1000, obj.team);
			entities.push(b);
			var b = Object.create(Projectile).init(obj.getX(), obj.getY(), theta + Math.PI / 12, 1000, obj.team);
			entities.push(b);
			var b = Object.create(Projectile).init(obj.getX(), obj.getY(), theta - Math.PI / 12, 1000, obj.team);
			entities.push(b);
			obj.cooldown = 0.35;
			obj.temperature += 65;
		}			
	}
];

var Gun = Object.create(Weapon);
Gun.attacks = [
	function (obj) {
		if (obj.canShoot(2)) {
			var theta = obj.angle;
			var b = Object.create(Bullet).init(obj.getX(), obj.getY(), theta, 1000, obj.team);
			entities.push(b);
			obj.cooldown = 0.05;
			obj.temperature += 2;
		}
	},
	Weapon.attacks[1]
]

var Shield = Object.create(Item);
Shield.init = function (name, weight, cost, range) {
	this.name = name;
	this.weight = weight;
	this.cost = cost;
	this.range = range;
	this.angle = 0;
	this.active = false;
	this.color = "#00CC00";
	this.type = "shield";
	return this;
},
Shield.drawUse = function (ctx, player) {
	ctx.lineWidth = 6;
	ctx.fillStyle = "rgba(0,200,0,0.4)";
	if (this.active) {
		ctx.beginPath();
		ctx.arc(player.x, player.y, player.radius, this.angle - this.range/2, this.angle + this.range/2, false);
		ctx.lineTo(player.x, player.y);
		ctx.closePath();
		ctx.fill();
	}
}
Shield.inRange = function (theta) {
	var a = theta;//(theta % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
	var b = this.angle;//(this.angle % (2 * Math.PI) + 2 * Math.PI) % (2 % Math.PI);
	console.log(a * 180 / Math.PI, b * 180 / Math.PI, this.angle * 180 / Math.PI, theta * 180 / Math.PI);
	return (Math.PI * 2 - (Math.abs(a - b) % (Math.PI * 2)) < this.range / 2 || (Math.abs(a - b) % (Math.PI * 2)) < this.range / 2);
}

var Engine = Object.create(Item);
Engine.init = function (name, weight, cost, boost) {
	this.name = name, this.weight = weight, this.cost = cost, this.boost = boost, this.timer = 0;
	this.color = "#0000CC";
	this.type = "engine";
	return this;
}
Engine.updateUse = function (dt, player) {
	if (this.timer > 0) {
		this.timer -= dt;
		player.acel = ACEL;
	} else { player.acel = 0; }
}