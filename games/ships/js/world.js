var AudioContext = window.AudioContext || window.webkitAudioContext;
		
var World = {
	init: function () {
		this.height = CONFIG.height, this.width = CONFIG.width;
		this.createCanvas();
		this.scenes = [];
		this.scene = undefined;
//		this.loadScenes();
		this.loadResources();
		return this;
	},
	step: function () {
		var newTime = new Date();
		var dt = ( newTime - this.startTime ) / 1000;
		this.startTime = newTime;

		this.update(dt);
		this.draw();

		var t = this;

		window.requestAnimationFrame(function() { t.step() });
	},
	createCanvas: function () {
		this.canvas = document.createElement("canvas");
		this.canvas.height = this.height, this.canvas.width = this.width;
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
		// FIX ME: cross-browser
		this.ctx.imageSmoothingEnabled = false;
	},
	update: function (dt) {
		debug.fps = Math.floor(100 / dt) / 100;
		if (this.scene) {
			this.scene.update(dt);
		}
	},
	draw: function () {
		this.ctx.clearRect(0, 0, this.width, this.height);
		if (this.scene) {
			this.scene.draw(this.ctx);
		}
	},
	progressBar: function () {
		var n = Math.floor((this.width - 50) / this.resourceCount);
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(25 + this.resourceLoadCount * n, this.height / 2 - 12, n, 25);
		this.resourceLoadCount += 1;
		var t = this;
		if (this.resourceLoadCount >= this.resourceCount) {
			if (this.scene) {
				setTimeout( function () {
					t.beginTime();
					t.step();
				}, 100);
			} else {
				this.loadScenes();
			}
		}
	},
	beginTime: function () {
		this.startTime = new Date();
		var t = this;
		document.addEventListener("visibilitychange", function (e) { 
			/*if (document.visibilityState == "hidden") {
				//if (AudioContext) audioContext.suspend();
				//else window.muted = true;
			}
			else {
				//if (AudioContext) audioContext.resume();
				//else window.muted = false;
			}*/
			t.startTime = new Date(); 
		});
	},
	loadScenes: function () {
		var t = this;
		var request = new XMLHttpRequest();
		request.open("GET", "index.json", true);
		request.onload = function (data) {
			var sceneData = JSON.parse(request.response).scenes;
			for (var i = 0; i < sceneData.length; i++) {
				// strip off quotation marks and .json extension
				var sceneName = sceneData[i].substring(0, sceneData[i].length - 5);
				var s = Object.create(Scene).init(sceneName);
				s.world = t;
				t.scenes.push(s);

				if (sceneName == CONFIG.startScene) {
					t.setScene(s);
					t.progressBar();
				}
			}
		}
		request.send();
	},
	setScene: function (scene) {
		this.scene = scene;
		this.addEventListeners(scene);
	},
	addEventListeners: function (scene) {
		var t = this;
		if (scene.ready) {
			if (scene.onClick) this.canvas.addEventListener('click', scene.onClick);
			if (scene.onMouseMove) this.canvas.addEventListener('mousemove', scene.onMouseMove);
			if (scene.onMouseDown) this.canvas.addEventListener('mousedown', scene.onMouseDown);
			if (scene.onMouseUp) this.canvas.addEventListener('mouseup', scene.onMouseUp);
			if (scene.onKeyDown) this.canvas.addEventListener('keydown', scene.onKeyDown);
			if (scene.onKeyUp) this.canvas.addEventListener('keyup', scene.onKeyUp);
			if (scene.onKeyPress) this.canvas.addEventListener('keypress', scene.onKeyPress);
		} else {
			// fix me: is there maybe a more elegant way of checking whether the scene is loaded?
			setTimeout(function () { t.addEventListeners(scene), 500});
		}
	},
	initAudio: function () {
		var a = new Audio();
		this.audioType = a.canPlayType("audio/ogg");

		if (AudioContext) AudioContext.createGain = AudioContext.createGain || AudioContext.createGainNode;

		if (AudioContext) {
			this.audioContext = new AudioContext();
			this.audioContext.gn = this.audioContext.createGain();
		}
	},
	/* FIX ME: loads image, sound and data assets into global Resources array -> is there a better place to do this? */
	loadResources: function () {
		if (!RESOURCES) return;
		//this.setupControls();
		this.initAudio();

		this.resourceLoadCount = 0;
		this.resourceCount = RESOURCES.length;
		this.ctx.fillStyle = "gray";
		this.ctx.fillRect(this.width / 2 - 25 * this.resourceCount + i * 50, this.height / 2 - 12, 50, 25);			
		this.ctx.fillText("loading...", this.width / 2, this.height / 2 - 50);
		var w = this;

		for (var i = 0; i < RESOURCES.length; i++ ) {
			var res = RESOURCES[i].path;
			var e = res.indexOf(".");
			var name = res.substring(0, e);
			var ext = res.substring(e, res.length);
			if (ext == ".png") {
				Resources[name] = {image: new Image(), frames: RESOURCES[i].frames || 1, speed: RESOURCES[i].speed || 1, animations: RESOURCES[i].animations || 1 };
				Resources[name].image.src = "res/" + res;
				Resources[name].image.onload = function () {
					w.progressBar();
				}
			}
			else if (ext == ".ogg") {
				this.loadOGG(res, name);
/*				Resources[name] = {sound: new Audio("res/" + res, streaming=false)};
				w.progressBar();
				Resources[name].sound.onload = function () {
					console.log("loaded sound");
				}*/
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
	loadOGG: function (res, name) {
		// cant play ogg, load mp3
		if (name == "soundtrack" || name == "soundtrackFast") {
			this.progressBar();
		}
		if (this.audioType.length <= 0) {
			res = res.replace("ogg", "mp3");
			//console.log("replaced?");
		}
		//console.log("NEW", res);
		if (!AudioContext) {
			Resources[name] = new Audio("res/" + res, streaming=false);
			//Resources[name].src = "res/" + res;
			w.progressBar();
			return;
		}
		var request = new XMLHttpRequest();
		request.open('GET', "res/" + res, true);
		request.responseType = 'arraybuffer';

		var w = this;
		request.onload = function() {
			w.audioContext.decodeAudioData(request.response, function(b) {
				Resources[name] = {buffer: b, play: false};
				if (name == "soundtrack" || name == "soundtrackFast") {
//					if (AudioContext && Resources.soundtrack && name == "soundtrack") w.musicLoop();
				} else {
					w.progressBar();
				}
			}, function () {console.log("ERROR with decoding audio");});
		};
		request.send();
	},
	playSound: function(sound)
	{
		if (AudioContext) {

			var buffer = sound.buffer;
			var source = this.audioContext.createBufferSource();
			source.buffer = buffer;
			
			source.connect(this.audioContext.gn);
			this.audioContext.gn.connect(this.audioContext.destination);
			source.start(0);
			
			return source;
		} else {
			if (window.muted) {
				return;
			}
			else {
				sound.play();
				debug = sound;
				return sound;
			}
		}
	}
};