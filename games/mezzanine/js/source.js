/*

DIFFERENT FLOORS: i.e. a 'food court', an 'observation' (?), different offices (businesses)... basement? etc.

*/


$(document).ready( function () {


//var nw = require('nw.gui');

//var win = nw.Window.get();

var music = new Audio('./media/audio/music.ogg');
music.loop = true;
//music.play();

var bellTone = new Audio('./media/audio/bell-tone.ogg');

music.onended = function(){music.play()};

/**

### GLOBALS ###

**/

var TIPPING_POINT = 3;

var dayLength = 300; // in seconds
var dayTime = 0;

var endDay = 30;
var currentDay = 20;

var isActive = false;

var dialogueChoices = {};

var request = new XMLHttpRequest();
request.open('GET', './media/dialogue.json');
request.onload = function() {
	dialogueChoices = JSON.parse(request.response).dialogue;
};
request.send();

var leftOffset = 40;
var topOffset = 30;

var maxFloors = 8;
var baseWidth = 240;
var baseHeight = 70;

var maxFactionNumber = 2;

var floors = new Array();
var persons = new Array();

var openers = new Array();
var closers = new Array();

var dialogueCurrent = null;
var dialogueContent = null;

var baseTimer = 25;

var suspicions = {"neutral": 0, "opener": 0, "closer": 0};

var fps = 1000 / 60;

var speech = $('<div class="triangle-isosceles top"></div>');
$("#content").append(speech);

function Floor(index, height, width, x, y, bg)
{
	this.index = index;
	this.height = height;
	this.width = width;
	this.bg = bg;
	this.y = y;
	this.x = x;//leftOffset + (baseWidth - this.width) / 2;
	this.depth = 2;
	this.persons = new Array();
	this.faction = 0.0;
	this.tempFaction = 0.0;

	this.getY = function() { return this.y + this.height - this.depth;};
	this.update = function (dt) {

		for (var i = 0; i < this.persons.length; i++)
		{
			this.persons[i].destX = this.x + this.width / 2 + (35 + Math.floor(i / 2) * 20) * (2 * (i % 2) - 1) - this.persons[i].width * (i % 2 ==0);
			this.persons[i].update(dt, this.getY());
		}
		if (this.faction > 0)
		{
			this.element.removeClass("closer");
			this.element.addClass("opener");
		}
		else if (this.faction < 0)
		{
			this.element.removeClass("opener");
			this.element.addClass("closer");
		}
		else
		{
			this.element.removeClass("opener");
			this.element.removeClass("closer");
		}
	}
	this.element = $('<div class="floor" floor="' + (this.index == 0 ? 'M' : this.index)  + '"></div>');
	this.overlay = $('<div class="floor-overlay"></div>');
	this.element.append(this.overlay);
	this.element.css({	"height": this.height,
						"width": this.width,
						"left": this.x,
						"top": this.y,
						"border-width": this.depth,
						"border-top-width": this.depth / 2,
						//"transform": "skew(" + skew + "deg, " + -1 * skew / 2 + "deg)",
						//"background": "rgb(" + 30 * this.index + "," + 30 * this.index + "," + 30 * this.index + ")"
						});
	$('#main').append(this.element);
}

function Elevator(x, y)
{
	this.floor = 1;
	this.destination = 1;
	this.y = y;
	this.x = x;
	this.height = 64;
	this.width = 64;
	this.velY = 0;
	this.persons = new Array();


	this.getY = function() {return this.y + this.height; };

	this.update = function (dt)
	{
	//CHECK IF WE ARE NOT AT DESTINATION

		if (this.floor != this.destination)
		{
			if (Math.abs(this.getY() - floors[this.destination].getY()) <= 5)
			{
				this.floor = this.destination;
				this.velY = 0;
				this.y = floors[this.destination].y + (floors[this.destination].height - this.height) - floors[this.destination].depth;
			}
			else if (this.getY() <= floors[this.destination].getY() - 5)
			{
				this.velY = 180;
				this.floor = "moving";
			}
			else if (this.getY() >= floors[this.destination].getY() + 5)
			{
				this.velY = -180;
				this.floor = "moving";
			}
		}

		/**	PREVENT ELEVATOR FROM MOVING IF PASSENGERS ARE BOARDING/EXITING**/
		if (this.persons.filter(function (e) {return e.velX != 0; }).length == 0)
		{
			this.y += this.velY * dt;
			window.scrollTo(this.x, this.y - 240);
		}

		for (var i = 0; i < this.persons.length; i++)
		{
			this.persons[i].destX = this.x + 15 * i - 10;
			this.persons[i].update(dt, this.getY());
		}

		$('.cable').css("height", Math.round(this.y) - topOffset);
		this.element.css({"top": Math.round(this.y)});

	}

	this.element = $('<div class="elevator">');
	this.element.css({	"height": this.height,
						"width": this.width,
						//"background": "#fffdc4",
						"left": x,
						"top": this.y});

	//shaft and cable
	$('#main').append($('<div class="shaft"><i class="fa fa-gear faa-spin animated"></i></div>'));
	$('#main').append($('<div class="cable"></div>'));
	$('#main').append(this.element);
}

function Person(destination, y, faction, sprite)
{
	this.floor = 0;
	this.destination = destination;
	this.faction = faction;
	this.sprite = sprite;
	this.duration = Math.random() * 10 + 10;
	//this.name = names[Math.floor(Math.random() * names.length)];

	this.timer = 0;

	this.x = -10;
	this.destX = null;
	this.velX = 0;
	this.y = y;
	this.width = 36;

	this.delay = 1.0 / 16;
	this.frame = 0;
	this.maxFrames = 16;

	this.element = $('<div class="person"></div>');
	this.element.attr("destination", this.destination);
	this.element.addClass(this.faction);

	var r = this;
	this.element.click( function (e) {

		//console.log(r.x, r.velX, r.destX);

	});

	this.setDestination = function( d )
	{
		this.destination = d;
		this.element.attr('destination', this.destination);
	}

	this.update = function(dt, y)
	{
		if (this.destination != this.floor)
		{
			if (this.element.css("opacity") < 1)
			{
				this.element.css("opacity", "+=0.02");
			}
			this.timer += dt;
			this.element.css({"border-bottom-width": (this.timer / baseTimer) * 10,
												"border-bottom-color": "rgba(200,0,0," + (this.timer / baseTimer) / 2 + ")"});
		}
		else if (this.element.css("opacity") > 0.5)
		{
			this.element.css("opacity", "-=0.01");
		}
		// Has returned to lobby again; time to leave
		if (this.destination == 0 && this.floor == 0)
		{
			this.destX = -100;
		}
		// Otherwise...
		if (this.x < this.destX - 4) this.velX = Math.floor(Math.random() * 50 + 70);
		else if (this.x > this.destX + 4) this.velX = -1 * Math.floor(Math.random() * 50 + 70);
		else {this.velX = 0; this.x = this.destX;}

		/**		FRAMES AND ANIMATION	**/

		if (this.velX != 0)
		{
			this.delay -= dt;
			if (this.delay <= 0)
			{
				this.delay = 1.0 / 16;
				this.frame = (this.frame + 1) % this.maxFrames;
				this.element.css("background-position-x", -1 * this.frame * this.width - 9);
			}
		}
		else
		{
			this.frame = 0;
		}

		/**		MIRROR DEPENDING ON DIRECTION	**/

		if (this.velX > 0)
		{
			this.element.removeClass("flipped");
		}
		else if (this.velX < 0)
		{
			this.element.addClass("flipped");
		}

		/**   Decrease wait time, if at destination   **/
		if (this.destination == this.floor)
		{
			this.duration -= dt;
			if (this.duration <= 0)
			{
				this.destination = 0;
				this.element.attr("destination", this.destination);
			}
		}

		this.y = y;
		this.x += this.velX * dt;

		this.element.css({	"left": Math.round(this.x),
							"top": Math.round(this.y) - 48 });

		if (this.x < -25)
		{
			this.element.remove();
			var index = floors[0].persons.indexOf(this);
			//console.log("REMOVED", this.name, this.faction);
			floors[0].persons.splice(index, 1);
			var index = persons.indexOf(this);
			var swap = persons.splice(index, 1)[0];
			swap.element.css("opacity", 1);

			/**		UPDATE THE SUSPICION LEVEL OF THE APPROPRIATE FACTION**/
			suspicions[this.faction] += this.timer > baseTimer ? 1 : 0;

			if (this.faction == "opener")
				openers.push(swap);
			else if (this.faction == "closer")
				closers.push(swap);
		}
	}

	this.reset = function () {

		this.duration = Math.random() * 10 + 10;

		this.x = -10;
		this.destX = null;
		this.velX = 0;
		this.timer = 0;

		this.element.css({	"left": this.x,
						"top": this.y - 40 });
		$('#main').append(this.element);
	};

	this.element.css({	"left": this.x,
						"top": this.y - 40 });
	$('#main').append(this.element);

}


/*DIALOGUE STRUCTURE

1. List of people (1 to 4)
2. List of 'lists' (1 to 4) -- one list for each person (each sub-list contains strings - the dialogue to be spoken).

While a dialogue object is in the current slot, iterate through ... person1 say p1-list[0], person2 say p2-list[0], person1 say p1-list[1], etc.

If anyone within exits the elevator, the dialogue is aborted with a... 'we'll continue this later'

*/

function Dialogue(people, dialogues, floor)
{
	this.people = people;
	this.dialogues = dialogues;
	this.floor = floor;

	this.index = 0;
	this.speaking = -1;

	this.Next = function ()
	{
		this.speaking++;
		if (this.speaking >= this.people.length)
		{
			this.speaking = 0;
			this.index++;
			if (this.index >= this.dialogues[0].length)
			{
				return false;
			}
		}
		else if (this.dialogues[this.speaking][this.index] == undefined) {
			return false;
		}
		else if (this.dialogues[this.speaking][this.index].length <= 0) {
			return false;
		}
		return {
		'person': this.people[this.speaking],
		'text': this.dialogues[this.speaking][this.index],
		'duration': this.dialogues[this.speaking][this.index].length * 0.125 //((this.dialogues[this.speaking][this.index].match(/\s/g) || []).length + 1) * 1.0
		};
	}
}



/**

#### CREATE FLOORS ####

**/

var descriptions = ["Mezzanine", "Human Resources", "Public Relations", "Cafeteria", "Support", "Management", "Research", "Development", "Utility"];

var totalHeight = topOffset;
for (var i = maxFloors; i >= 0; i--)
{
	var h = baseHeight + (i < 1) * 30;
	var w = baseWidth - (i>=1) * 24 - (i >= 3) * 36 - (i >= 6) * 16;
	var x = leftOffset + (0 < i && i < 3) * 5 + (3 <= i) * 37 + (6 <= i) * 4;
	var y = totalHeight;
	totalHeight += h;
	var f = new Floor(i, h, w, x, y, "bgimage");
	f.element.attr("description", descriptions[i]);
	floors.unshift(f);
}

var clock2 = $('<div class="clock-2"><div class="m-hand"></div><div class="h-hand"></div></div>');
floors[0].element.append(clock2);

var elev1 = new Elevator(leftOffset + baseWidth / 2 - 64 / 2, floors[1].getY() - 72);
$('.shaft').eq(0).css({"top": 0, "left": elev1.x - 2, "height": totalHeight - topOffset + 30, "width": elev1.width + 4});
//$('.shaft').eq(1).css({"top": topOffset, "left": 390 - 2, "height": totalHeight - topOffset, "width": elev1.width + 4});
$('.cable').css({"top": topOffset, "left": elev1.x + elev1.width / 2 - 2, "height": elev1.y - topOffset, "width": 4});


/**

#### POPULATE FACTIONS ###

**/

for (var i = 0; i < maxFactionNumber; i++)
{
	var o = new Person(Math.floor(Math.random() * 8 + 1), floors[0].getY(), "opener", "bleh");
	var c = new Person(Math.floor(Math.random() * 8 + 1), floors[0].getY(), "closer", "bleh");
	openers.push(o);
	closers.push(c);
}

/**

#### SETUP EVENT LISTENERS ####

**/

$('.floor').on("click", function () {

	elev1.destination = maxFloors - $(this).index();
	var t = $(this);
	$('.floor').removeClass("destination");
	$('.floor').css('border-right-width');
	t.addClass("destination");
	//console.log(elev1.destination);
	//console.log("LENGTH", elev1.persons);
});

$('.clock-1').click(function () {
	if (currentDay <= endDay)
	{
		isActive = true;
		dayTime = 0;
		currentDay += 1;
		$(".window").fadeOut(700);
		$("#exterior").fadeOut(1500);
		$('.ending').fadeOut();
	}
});

$('.stop').click(function () {
	if (elev1.velY != 0)
		return;
	else
	{
		elev1.persons.forEach(function (p) {p.destination = elev1.floor; p.element.attr("destination", p.destination);});
	}
});

$('.alarm').click(function () {
	if (elev1.velY != 0)
		return;
	else
	{
		elev1.persons.forEach(function (p) {p.destination = 0; p.element.attr("destination", p.destination);});
		floors[elev1.floor].persons.forEach(function (p) {p.destination = 0; p.element.attr("destination", p.destination);});
	}
});

/**	SETUP PAUSE WINDOW EFFECT	**/

var start = new Date();

function onchange()
{
	start = new Date();
	/*
	if (music.paused)
		music.play();
	else
		music.pause();
	*/
}

document.addEventListener("visibilitychange", onchange);

//win.on("blur", function() {isActive = false; onchange();});
//win.on("focus", function() {isActive = true; onchange();});

/**

##### GAME LOOP #####

**/

function doEnding()
{
	isActive = false;
	$(".window").fadeIn();
	$("#exterior").fadeIn();

	if (currentDay == endDay)
	{
		var total = 0;
		for(var i = 0; i < floors.length; i++)
		{
			total += floors[i].faction;
		}
		$('.ending').text('The game is over... ' + total).fadeIn();
	}
	else
	{
		//UPDATE ALL THE FLOORS WITH THE NEW FACTION RATINGS
		//floors.forEach( function (f) {
			/*
			if (f.tempFaction > 0)
				f.faction += 0.1;
			else if (f.tempFaction < 0)
				f.faction -= 0.1;
			f.tempFaction = 0.0;
			*/
			//UPDATE THE OVERLAY OPACITY

		//});
		$('.ending').text('April ' + (currentDay + 1) + ', 2055').fadeIn();
	}
}

function changeDialogue()
{
	var color = dialogueContent.person.faction == "opener" ? "#CC0000" : dialogueContent.person.faction == "closer" ? "#12AA21" : "gray";
	var p = dialogueContent.person;
	var position = {"left": Math.floor(p.x), "top": Math.floor(p.y)};
	speech.html(dialogueContent.text);
	position.left -= speech.width() / 2;
	speech.css(position);
	speech.fadeIn();
	dialogueContent.person.element.addClass('selected');
}

function doDialogue(dt)
{
	/**		INITIATE DIALOGUE AND ASSIGN TO PEOPLE RIDING ELEVATOR		**/

	if (dialogueCurrent == null && dialogueContent == null)
	{
		if (Math.random() * 100 < 1 && elev1.persons.length > 0)
		{
			console.log("DIALOGUE");

			var dialogueFloor = elev1;
			
			var maxInDialogue = Math.floor(Math.random() * (elev1.persons.length)) + 1;
			var peopleInDialogue = elev1.persons.slice().sort(function() {return 0.5 - Math.random() }).slice(0, maxInDialogue);
			var sampleDialogue = new Array();

			var dialogueOptions = dialogueChoices.trusting.filter(function(element) {return element.length == peopleInDialogue.length;});
			if (dialogueOptions.length <= 0) return;
			
			//remove the dialogue from the list, so we don't repeat dialogue and all that...
			var d = dialogueOptions[Math.floor(Math.random()*dialogueOptions.length)];
			dialogueChoices.trusting.splice(dialogueChoices.trusting.indexOf(d), 1);
			
			dialogueCurrent = new Dialogue(peopleInDialogue, d);

			dialogueContent = dialogueCurrent.Next();

			changeDialogue();
		}
	}

	/**	TRANSITION THROUGH MULTI-PART DIALOGUES	**/

	else
	{
		//CHECK THAT ALL STILL ON SAME FLOOR
		if (dialogueCurrent != null)
		{
			for (var i = 0; i < dialogueCurrent.people.length; i++)
			{
				if (dialogueCurrent.people[i].floor != dialogueCurrent.people[0].floor ||
					(dialogueCurrent.people[i].floor == 0 && dialogueCurrent.people[i].destination == 0))
				{
					//END THE DIALOGUE, SOMEONE HAS LEFT THE FLOOR

					dialogueContent.duration = 3;
					speech.fadeOut(function () {

						dialogueContent.text = "Let's continue this later."
						speech.html(dialogueContent.text);
						speech.fadeIn();

					})

					//Remove remaining dialogue
					dialogueCurrent = null;
					break;
				}
			}
		}

		//OTHERWISE, CONTINUE WITH THE NEXT BIT OF DIALOGUE

		if (-10 < dialogueContent.duration && dialogueContent.duration <= 0)
		{
			dialogueContent.duration = -10;
			speech.fadeOut( function () {
				dialogueContent.person.element.removeClass('selected');
				if (dialogueCurrent != null)
					dialogueContent = dialogueCurrent.Next();
				else
				{
					dialogueCurrent = null;
					dialogueContent = null;
					speech.fadeOut();
					return;
				}
				if (!dialogueContent)
				{
					dialogueCurrent = null;
					dialogueContent = null;
					speech.fadeOut();
				}
				else
				{
					changeDialogue();
				}
			});
		}

		//TICK DOWN THE TIMER, UPDATE SPEECH BUBBLE POSITION

		else
		{
			//UPDATE SPEECH BUBBLE Y POSITION
			dialogueContent.duration -= dt;

			var position = {"left": Math.floor(dialogueContent.person.x), "top": Math.floor(dialogueContent.person.y)};
			position.left -= Math.floor(speech.width() / 2);
			speech.css(position);
		}
	}
}

function doSpawn(dt)
{
//	var gauss = 3 * Math.pow(Math.E, -1*(Math.pow((dayTime / (dayLength / 4) - 2), 2)));
//	console.log("GAUESS", gauss);

	var maxSpawn = Math.ceil(-1 * Math.abs(dayTime / (dayLength / 10) - 4) + 5);

	if (Math.random() * 100 < 2 && floors[0].persons.length < maxSpawn)
	{
		var choice = Math.random() * 100;
		if (choice <= 20 && openers.length > 0)
		{
			var p = openers.shift();
			console.log("OPENER", p);
			p.setDestination( Math.floor(Math.random() * 8 + 1));
			floors[0].persons.push(p);
			persons.push(p);
		}
		else if (choice >= 80 && closers.length > 0)
		{
			var p = closers.shift();
			console.log("CLOSER", p);
			p.setDestination( Math.floor(Math.random() * 8 + 1));
			floors[0].persons.push(p);
			persons.push(p);
		}
		else
		{
			var p = new Person(Math.floor(Math.random() * 8 + 1), floors[0].getY(), "neutral", "bleh");
			floors[0].persons.push(p);
			persons.push(p);
		}

		/**		RE-ADD the DOM element to the page, if it is not already there	**/
		if ($('#main').find(p.element).length == 0)
		{
			p.reset();
		}
	}
}

function update()
{
	var timestamp = new Date();
	var dt = (timestamp - start) / 1000;
	start = timestamp;

	var totalMinutes = (dayTime / dayLength) * 480; //for 8 hour day;

	if (dayTime > dayLength && persons.length <= 0)
	{
		doEnding();
		return;
	}
	else if (dayTime > dayLength)
	{
		dayTime += dt / 100;
		$('.m-hand').css({'transform': 'rotate(' + (totalMinutes % 60) * 6 + 'deg)'});
		$('.h-hand').css({'transform': 'rotate(' + (totalMinutes / 60) * 30 + 'deg)'});
	}
	else
	{
		dayTime += dt;
		$('.m-hand').css({'transform': 'rotate(' + (totalMinutes % 60) * 6 + 'deg)'});
		$('.h-hand').css({'transform': 'rotate(' + (totalMinutes / 60) * 30 + 'deg)'});
	}

	//music.playbackRate = (1 / 4) * Math.pow(Math.sin(dayTime / 12), 2) + (3 / 4);
	//$("#debug").html("Opener: " + suspicions.opener + "<br />" + "Closer: " + suspicions.closer + "<br />" +"Neutral: " + suspicions.neutral + "<br />" + Math.round(100 / dt) / 100);

	/**	SPIN GEAR**/
	if (elev1.velY != 0)
		$('.fa-gear').addClass('animated');
	else
		$('.fa-gear').removeClass('animated');


	/*UPDATES*/

	elev1.update(dt);
	floors.forEach( function (e) {e.update(dt);});

	/**		SPAWNING PERSONS		**/

	doSpawn(dt);

	/** 	DIALOGUE		**/
	doDialogue(dt);

	/** 	LOAD PEOPLE TO/FROM ELEVATOR	**/
	if (elev1.velY == 0)
	{
		elev1.persons.forEach( function (e) {
			if (e == null)
			{
				return;
			}
			//GET OFF ELEVATOR
			if (e.destination == elev1.floor)
			{
				var index = elev1.persons.indexOf(e);
				elev1.persons.splice(index, 1);
				e.floor = elev1.floor;
				floors[elev1.floor].persons.push(e);

				//Adjust faction level for the floor...

				if (elev1.floor != 0)
				{
					floors[elev1.floor].faction += (e.faction == "opener") - (e.faction == "closer");
					if (floors[elev1.floor].faction % TIPPING_POINT == 0 && e.faction != 'neutral')
					{
						if (floors[elev1.floor].faction > 0)
							bellTone.play();
						else if (floors[elev1.floor].faction < 0)
							bellTone.play();
						else
							console.log("nothing");
						
						var ffaction = Math.abs(Math.floor(floors[elev1.floor].faction / TIPPING_POINT));
						floors[elev1.floor].element.find('.floor-overlay').animate({"opacity": Math.min(0.5, ffaction / 20)}, 500, function() {});
					}
				}
			}
		});

		var available = floors[elev1.floor].persons.filter( function (e) {
			return e.destination != e.floor;
		});
		//GET ON ELEVATOR
		while (elev1.persons.length < 4 && available.length > 0)
		{
			var e = available.shift();
			var index = floors[elev1.floor].persons.indexOf(e);
			floors[elev1.floor].persons.splice(index, 1);
			e.floor = "Elevator";
			elev1.persons.push(e);
		}

	}

	//console.log("E1", elev1.persons, elev1.persons.length);
	/**		SCROLL TO ELEVATOR? 	**/
}

function gameStart()
{
	if (!document.hidden && isActive)
	{
		update();
	}
	setTimeout(function () {window.requestAnimationFrame(gameStart);}, 1000 / 60);
}

window.requestAnimationFrame(gameStart);

});
