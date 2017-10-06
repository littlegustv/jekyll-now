Entity.remove = function (obj) {
	var i = this.behaviors.indexOf(obj);
	obj.end();
	this.behaviors.splice(i, 1);
	return obj; // should this chain the behavior or the entity?
};
Entity.removeBehavior = Entity.remove;

var game = Object.create(World).init(320, 180, "index.json");