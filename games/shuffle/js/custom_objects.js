var RoadSign = Object.create(Entity);
RoadSign.size = 32;
RoadSign.init = function (x, y, text) {
  this.x = x, this.y = y, this.text = text;
  this.behaviors = [];
  return this;
}
RoadSign.draw = function (ctx) {
  ctx.font = "900 " + this.size + "px " + "Visitor";
  ctx.textAlign = "center";
  var w = ctx.measureText(this.text).width + 12;
  var h = this.size + 12;
  ctx.fillStyle = "black";
  ctx.fillRect(this.x - w / 2, this.y -h / 2, w, h);
  ctx.fillRect(this.x - w / 3 - 6, this.y + h / 2, 12, h - 4);
  ctx.fillRect(this.x + w / 3 - 6, this.y + h / 2, 12, h - 4);
  ctx.fillStyle = "white";
  ctx.fillText(this.text, this.x, this.y);
  ctx.font = "600 " + this.size / 2 + "px Visitor";
  ctx.fillText("next exit", this.x, this.y + 12);
}