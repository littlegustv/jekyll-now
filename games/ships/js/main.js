var gameWorld, scale;

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
  gameWorld.scale = scale;
}
var ngio, medals, scoreboards, scores;

window.addEventListener("DOMContentLoaded", function () {
  /* create a game world, including canvas, context and configuration... load resources */
  gameWorld = Object.create(World).init();

  // add to raindrop startup
  resizeCanvas(gameWorld.canvas);
  window.addEventListener('resize', function () { resizeCanvas(gameWorld.canvas); });

  //var s = Object.create(Scene).init("mainmenu");
  //gameWorld.scene = s;

  ngio = new Newgrounds.io.core("45503:G28PLTU7", "Nmg+7HXypANBgdE5kxFPgw==");

  ngio.getValidSession(function() {
    if (ngio.user) {
        /* 
         * If we have a saved session, and it has not expired, 
         * we will also have a user object we can access.
         * We can go ahead and run our onLoggedIn handler here.
         */
      console.log('logged in');
    //    onLoggedIn();
    } else {
        /*
         * If we didn't have a saved session, or it has expired
         * we should have been given a new one at this point.
         * This is where you would draw a 'sign in' button and
         * have it execute the following requestLogin function.
         */
      console.log('not logged in');
    }

  });

  /* vars to record any medals and scoreboards that get loaded */

  /* handle loaded medals */
  function onMedalsLoaded(result) {
    if (result.success) medals = result.medals;
  }

  /* handle loaded scores */
  function onScoreboardsLoaded(result) {
    if (result.success) scoreboards = result.scoreboards;
  }



  /* load our medals and scoreboards from the server */
  ngio.queueComponent("Medal.getList", {}, onMedalsLoaded);
  //ngio.queueComponent("ScoreBoard.getBoards", {}, onScoreboardsLoaded);
  ngio.executeQueue();

}); 