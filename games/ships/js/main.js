var gameWorld;

// add to raindrop
function resizeCanvas(canvas) {
  canvas.style.width = "", canvas.style.height = "";
  var ratio = canvas.width / canvas.height;
  // wider
  if (window.innerWidth / window.innerHeight > ratio)
  {
    canvas.style.height = window.innerHeight + "px";
    scale = window.innerHeight / canvas.height;
  } else {
    canvas.style.width = window.innerWidth + "px";
    scale = window.innerWidth / canvas.width;
  }
}

window.addEventListener("DOMContentLoaded", function () {
	/* create a game world, including canvas, context and configuration... load resources */
	gameWorld = Object.create(World).init();

  // add to raindrop startup
  resizeCanvas(gameWorld.canvas);
  window.addEventListener('resize', function () { resizeCanvas(gameWorld.canvas); });

	//var s = Object.create(Scene).init("mainmenu");
	//gameWorld.scene = s;

});