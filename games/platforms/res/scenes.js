{
	"scenes": [
		{
			"name": "mainmenu",
			"type": "menu",
			"map": {},
			"entities": [
				{"gridX":297,"gridY":198,"text":"Main Menu","type":"text", "speed": 100, "format": {"size":44}},
				{"gridX":297,"gridY":256,"text":"Press SPACE to start","type":"text", "format": {}}
			],
			"exits": [
				{"condition": "space", "destination": 1}
			]
		},
		{
			"name": "intro",
			"type": "cutscene",
			"map": {},
			"entities": [
				{"gridX":10,"gridY":34,"text":">> Cryosystems interrupted, multiple errors detected","type":"text","speed": 50,
					"format": {"align": "left"}
				},
				{"gridX":10,"gridY":60,"text":">> Hull temperature exceeds recommended threshold","type":"text","speed": 50, "delay": 3000,
					"format": {"color": "#330000", "align": "left"}
				},
				{"gridX":10,"gridY":86,"text":">> (V) Verbose mode enabled","type":"text","speed": 50, "delay": 5500,
					"format": {"size": 24, "color": "black", "align": "left"}
				},
				{"gridX":10,"gridY":112,"text":">> - - - Max Temperature - - - 1800 °C","type":"text", "delay": 8000,
					"format": {"align": "left"}
				},
				{"gridX":10,"gridY":138,"text":">> - - - Cur Temperature - - - 5505 °C","type":"text", "delay": 8000,
					"format": {"align": "left", "color": "red"}
				},
				{"gridX":10,"gridY":164,"text":">> - - - Multiple Modules Unresponsibe","type":"text", "delay": 8000,
					"format": {"align": "left"}
				},
				{"gridX":10,"gridY":190,"text":">> Running diagnostics scan...","type":"text", "delay": 8000, "speed": 50,
					"format": {"align": "left"}
				},
				{"gridX":10,"gridY":216,"text":">> Reconnaisance ... OPERATIONAL","type":"text", "delay": 10000, "speed": 50,
					"format": {"align": "left"}
				},
				{"gridX":10,"gridY":242,"text":">> Habitiation ... UNRESPONSIVE","type":"text", "delay": 12000, "speed": 50,
					"format": {"align": "left", "color": "#CC0000"}
				},
				{"gridX":10,"gridY":268,"text":">> Hydroponics ... UNRESPONSIVE","type":"text", "delay": 14000, "speed": 50,
					"format": {"align": "left", "color": "#CC0000"}
				},
				{"gridX":10,"gridY":294,"text":">> Operations ... UNRESPONSIVE","type":"text", "delay": 16000, "speed": 50,
					"format": {"align": "left", "color": "#CC0000"}
				},
				{"gridX":10,"gridY":320,"text":">> Engineering ... UNRESPONSIVE","type":"text", "delay": 18000, "speed": 50,
					"format": {"align": "left", "color": "#CC0000"}
				},
				{"gridX":10,"gridY":346,"text":">> Medical ... ... ... ...","type":"text", "delay": 20000, "speed": 50,
					"format": {"align": "left", "color": "#FF0000"}
				}																	
			],
			"exits": [
				{"condition": "space", "destination": 2}
			]
		},
		{
			"name": "engine room a",
			"type": "level",
			"map":[{"gridX":"6","gridY":"3","type":"obstacle"},{"gridX":"3","gridY":"4","type":"obstacle"},{"gridX":"6","gridY":"4","type":"obstacle"},{"gridX":"9","gridY":"4","type":"obstacle"},{"gridX":"2","gridY":"5","type":"obstacle"},{"gridX":"9","gridY":"5","type":"obstacle"},{"gridX":"4","gridY":"6","type":"obstacle"},{"gridX":"8","gridY":"6","type":"obstacle"},{"gridX":"3","gridY":"7","type":"obstacle"},{"gridX":"5","gridY":"7","type":"obstacle"},{"gridX":"6","gridY":"7","type":"obstacle"}],
			"entities": [
				{"gridX":297,"gridY":320,"text":"Engine Room A","type":"text", "format": {}},
				{"gridX":4,"gridY":4,"type":"character"},
				{"gridX":7,"gridY":4,"type":"collectable"}
			],
			"exits": [
				{"condition": "esc", "destination": 0}
			]
		}
	]
}
