window.addEventListener("DOMContentLoaded", function () {
	
	/* create a game world, including canvas, context and configuration... load resources */
	var gameWorld = Object.create(World).init();

/*
			loadResources: function (resourceInfo) {

			this.setupControls();
			this.resourceLoadCount = 0;
			this.resourceCount = resourceInfo.length;
			ctx.fillStyle = "gray";
			ctx.fillRect(canvas.width / 2 - 25 * this.resourceCount + i * 50, canvas.height / 2 - 12, 50, 25);			
			ctx.fillText("loading...", canvas.width / 2, canvas.height / 2 - 50);
			var w = this;

			for (var i = 0; i < resourceInfo.length; i++ ) {
				var res = resourceInfo[i].path;
				var e = res.indexOf(".");
				var name = res.substring(0, e);
				var ext = res.substring(e, res.length);
				if (ext == ".png") {
					Resources[name] = {image: new Image(), frames: resourceInfo[i].frames || 1, speed: resourceInfo[i].speed || 1};
					Resources[name].image.src = "res/" + res;
					Resources[name].image.onload = function () {
						w.progressBar();
					}
				}
				else if (ext == ".ogg") {
					Resources[name] = {sound: new Audio("res/" + res, streaming=false)};
					w.progressBar();
					Resources[name].sound.onload = function () {
						console.log("loaded sound");
					}
				}
				else if (ext == ".js") {
					var request = new XMLHttpRequest();
					request.open("GET", "res/" + res, true);
					request.onload = function () {
						w.sceneInfo = request.response;
						w.progressBar();
					};
					request.send();
				}
			}
		},
*/
});