{
	"scenes": [
		{
			"name": "mainmenu",
			"type": "menu",
			"map": {},
			"entities": [
				{"gridX":240,"gridY":160,"text":"Main Menu","type":"text", "speed": 100, "format": {"size":44}}
			]
		},
		{
			"name": "credits",
			"type": "menu",
			"map": {},
			"entities": [
				{"gridX":240,"gridY":60,"text":"Credits","type":"text", "speed": 100, "format": {"size": 44}},
				{"gridX":240,"gridY":110,"text":"Developed By Benny Heller","type":"text", "speed": 100, "format": {}},
				{"gridX":240,"gridY":136,"text":"Special thanks to JavaScript","type":"text", "speed": 100, "format": {}},
				{"gridX":240,"gridY":162,"text":"Find me at @littlegustv on twitter","type":"text", "speed": 100, "format": {}}
			]
		},
		{
			"name": "stagemenu",
			"type": "menu",
			"map": {},
			"entities": [
				{"gridX":240,"gridY":60,"text":"Stages","type":"text", "speed": 100, "format": {"size": 44}}
			]
		},
		{
			"name":"it started simple enough",
			"type":"level",
			"stage":"habitation",
			"max":2,
			"map":[],
			"entities":[
				{"gridX":4,"gridY":5,"type":"character"},
				{"gridX":6,"gridY":5,"type":"collectable"}
			]
		},
		{
			"name":"and for a while the fallout was only an inconvenience",
			"type":"level",
			"stage":"habitation",
			"max":20,
			"map":[{"gridX":"4","gridY":"6","type":"obstacle"}],
			"entities":[
				{"gridX":3,"gridY":6,"type":"character"},
				{"gridX":5,"gridY":6,"type":"collectable"}
			]
		},	
		{
			"name":"you can use obstacles to adjust your offest from your goal",
			"type":"level",
			"stage":"habitation",
			"max":20,
			"map":[{"gridX":"2","gridY":"4","type":"obstacle"},{"gridX":"9","gridY":"4","type":"obstacle"}],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"it matters which angle/side you approach from",
			"type":"level",
			"stage": "habitation",
			"max": 7,
			"map":[{"gridX":"8","gridY":"2","type":"obstacle"},{"gridX":"7","gridY":"6","type":"obstacle"}],
			"entities": [
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name": "don't waste time going in the wrong direction",
			"type": "level",
			"stage": "habitation",
			"max": 7,
			"map":[{"gridX":"6","gridY":"3","type":"obstacle"},{"gridX":"3","gridY":"4","type":"obstacle"},{"gridX":"6","gridY":"4","type":"obstacle"},{"gridX":"9","gridY":"4","type":"obstacle"},{"gridX":"2","gridY":"5","type":"obstacle"},{"gridX":"9","gridY":"5","type":"obstacle"},{"gridX":"4","gridY":"6","type":"obstacle"},{"gridX":"8","gridY":"6","type":"obstacle"},{"gridX":"3","gridY":"7","type":"obstacle"},{"gridX":"5","gridY":"7","type":"obstacle"},{"gridX":"6","gridY":"7","type":"obstacle"}],
			"entities": [
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"sometimes you have to reverse to go forward",
			"type": "level",
			"stage": "habitation",
			"max": 11,
			"map":[{"gridX":"3","gridY":"2","type":"obstacle"},{"gridX":"4","gridY":"2","type":"obstacle"},{"gridX":"6","gridY":"2","type":"obstacle"},{"gridX":"7","gridY":"2","type":"obstacle"},{"gridX":"4","gridY":"3","type":"obstacle"},{"gridX":"3","gridY":"5","type":"obstacle"},{"gridX":"3","gridY":"6","type":"obstacle"}],
			"entities": [
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"it might take longer, but sometimes you need space",
			"type":"level",
			"stage":"habitation",
			"max":20,
			"map":[{"gridX":"4","gridY":"2","type":"obstacle"},{"gridX":"3","gridY":"3","type":"obstacle"},{"gridX":"5","gridY":"3","type":"obstacle"},{"gridX":"7","gridY":"3","type":"obstacle"},{"gridX":"9","gridY":"4","type":"obstacle"},{"gridX":"3","gridY":"5","type":"obstacle"},{"gridX":"4","gridY":"5","type":"obstacle"},{"gridX":"5","gridY":"5","type":"obstacle"},{"gridX":"6","gridY":"5","type":"obstacle"},{"gridX":"7","gridY":"5","type":"obstacle"},{"gridX":"8","gridY":"5","type":"obstacle"}],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"avoid the obvious",
			"type":"level",
			"stage":"habitation",
			"max":20,
			"map":[{"gridX":"3","gridY":"1","type":"obstacle"},{"gridX":"7","gridY":"1","type":"obstacle"},{"gridX":"3","gridY":"2","type":"obstacle"},{"gridX":"6","gridY":"2","type":"obstacle"},{"gridX":"1","gridY":"4","type":"obstacle"},{"gridX":"2","gridY":"4","type":"obstacle"},{"gridX":"1","gridY":"6","type":"obstacle"},{"gridX":"4","gridY":"6","type":"obstacle"},{"gridX":"0","gridY":"7","type":"obstacle"},{"gridX":"4","gridY":"7","type":"obstacle"}],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"not sure about this one, to be honest",
			"type":"level",
			"stage":"habitation",
			"max":20,
			"map":[{"gridX":"5","gridY":"1","type":"obstacle"},{"gridX":"6","gridY":"1","type":"obstacle"},{"gridX":"5","gridY":"2","type":"obstacle"},{"gridX":"7","gridY":"2","type":"obstacle"},{"gridX":"2","gridY":"3","type":"obstacle"},{"gridX":"1","gridY":"4","type":"obstacle"},{"gridX":"6","gridY":"4","type":"obstacle"},{"gridX":"1","gridY":"5","type":"obstacle"},{"gridX":"3","gridY":"6","type":"obstacle"},{"gridX":"5","gridY":"6","type":"obstacle"},{"gridX":"2","gridY":"7","type":"obstacle"},{"gridX":"3","gridY":"7","type":"obstacle"}],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"the order you approach things matters",
			"type":"level",
			"stage":"habitation",
			"max":10,
			"map":[{"gridX":"7","gridY":"1","type":"obstacle"},{"gridX":"4","gridY":"2","type":"obstacle"},{"gridX":"7","gridY":"2","type":"obstacle"},{"gridX":"3","gridY":"3","type":"obstacle"},{"gridX":"7","gridY":"3","type":"obstacle"},{"gridX":"2","gridY":"4","type":"obstacle"},{"gridX":"7","gridY":"4","type":"obstacle"},{"gridX":"1","gridY":"5","type":"obstacle"},{"gridX":"9","gridY":"6","type":"obstacle"},{"gridX":"2","gridY":"7","type":"obstacle"},{"gridX":"8","gridY":"7","type":"obstacle"},{"gridX":"2","gridY":"8","type":"obstacle"},{"gridX":"7","gridY":"8","type":"obstacle"},{"gridX":"2","gridY":"9","type":"obstacle"},{"gridX":"6","gridY":"9","type":"obstacle"},{"gridX":"2","gridY":"10","type":"obstacle"}],
			"entities":[
				{"gridX":5,"gridY":5,"type":"character"},
				{"gridX":8,"gridY":5,"type":"collectable"},
				{"gridX":6,"gridY":8,"type":"collectable"}
			]
		},
		{
			"name":"entrance is important",
			"type":"level",
			"stage":"habitation",
			"max":14,
			"map":[{"gridX":"7","gridY":"2","type":"obstacle"},{"gridX":"8","gridY":"2","type":"obstacle"},{"gridX":"9","gridY":"2","type":"obstacle"},{"gridX":"6","gridY":"3","type":"obstacle"},{"gridX":"9","gridY":"3","type":"obstacle"},{"gridX":"1","gridY":"4","type":"obstacle"},{"gridX":"5","gridY":"4","type":"obstacle"},{"gridX":"9","gridY":"4","type":"obstacle"},{"gridX":"0","gridY":"5","type":"obstacle"},{"gridX":"5","gridY":"5","type":"obstacle"},{"gridX":"8","gridY":"5","type":"obstacle"},{"gridX":"0","gridY":"6","type":"obstacle"},{"gridX":"4","gridY":"6","type":"obstacle"},{"gridX":"6","gridY":"6","type":"obstacle"},{"gridX":"7","gridY":"6","type":"obstacle"},{"gridX":"5","gridY":"7","type":"obstacle"},{"gridX":"-1","gridY":"7","type":"obstacle"}],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":2,"gridY":5,"type":"collectable"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"engine room b",
			"type": "level",
			"stage": "habitation",
			"max": 20,
			"map":[],
			"entities": [
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]	
		},
		{
			"name":"when repetition is unavoidable",
			"type":"level",
			"stage":"hydroponics",
			"max":6,
			"map":[{"gridX":"7","gridY":"2","type":"obstacle"},{"gridX":"8","gridY":"3","type":"obstacle"},{"gridX":"6","gridY":"4","type":"undertow"},{"gridX":"4","gridY":"5","type":"obstacle"},{"gridX":"7","gridY":"5","type":"obstacle"},{"gridX":"5","gridY":"6","type":"obstacle"}],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":8,"gridY":4,"type":"collectable"},
				{"gridX":6,"gridY":6,"type":"collectable"}
			]
		},
		{
			"name":"when space is tight",
			"type":"level",
			"stage":"hydroponics",
			"max":9,
			"map":[{"gridX":"7","gridY":"0","type":"obstacle"},{"gridX":"7","gridY":"1","type":"obstacle"},{"gridX":"6","gridY":"2","type":"obstacle"},{"gridX":"5","gridY":"3","type":"obstacle"},{"gridX":"6","gridY":"3","type":"obstacle"},{"gridX":"6","gridY":"4","type":"undertow"},{"gridX":"4","gridY":"5","type":"obstacle"},{"gridX":"4","gridY":"6","type":"obstacle"},{"gridX":"4","gridY":"7","type":"obstacle"},{"gridX":"5","gridY":"7","type":"obstacle"},{"gridX":"5","gridY":"8","type":"obstacle"}],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"keep track of how many jumps",
			"type":"level",
			"stage":"hydroponics",
			"max":10,
			"map":[{"gridX":"6","gridY":"0","type":"obstacle"},{"gridX":"6","gridY":"1","type":"obstacle"},{"gridX":"6","gridY":"2","type":"obstacle"},{"gridX":"7","gridY":"2","type":"obstacle"},{"gridX":"5","gridY":"3","type":"obstacle"},{"gridX":"6","gridY":"4","type":"undertow"},{"gridX":"10","gridY":"4","type":"obstacle"},{"gridX":"4","gridY":"5","type":"obstacle"},{"gridX":"4","gridY":"6","type":"obstacle"},{"gridX":"3","gridY":"7","type":"obstacle"},{"gridX":"4","gridY":"7","type":"obstacle"},{"gridX":"3","gridY":"8","type":"obstacle"}],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			]
		},
		{
			"name":"when you have to choose",
			"type":"level",
			"stage":"hydroponics",
			"max":16,
			"map":[
				{"gridX":"4","gridY":"6","type":"undertow"},
				{"gridX":"2","gridY":"8","type":"obstacle"},
				{"gridX":"1","gridY":"9","type":"obstacle"},
				{"gridX":"2","gridY":"9","type":"obstacle"},
				{"gridX":"1","gridY":"10","type":"obstacle"},
				{"gridX":"1","gridY":"11","type":"obstacle"},
				{"gridX":"1","gridY":"12","type":"obstacle"},
				{"gridX":"2","gridY":"12","type":"obstacle"},
				{"gridX":"1","gridY":"13","type":"obstacle"}
			],
			"entities":[
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":2,"gridY":10,"type":"collectable"},
				{"gridX":-1,"gridY":11,"type":"collectable"}
			]
		}
	]
}
