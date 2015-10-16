{
	"scenes": [
		{
			"name": "mainmenu",
			"map": {},
			"entities": [
				{"size":44,"gridX":5,"gridY":5,"text":"Main Menu","type":"text"}
			],
			"exits": [
				{"condition": "space", "destination": 1}
			]
		},
		{
			"name": "engine room a",
			"map":[{"gridX":"6","gridY":"3","type":"obstacle"},{"gridX":"3","gridY":"4","type":"obstacle"},{"gridX":"6","gridY":"4","type":"obstacle"},{"gridX":"9","gridY":"4","type":"obstacle"},{"gridX":"2","gridY":"5","type":"obstacle"},{"gridX":"9","gridY":"5","type":"obstacle"},{"gridX":"4","gridY":"6","type":"obstacle"},{"gridX":"8","gridY":"6","type":"obstacle"},{"gridX":"3","gridY":"7","type":"obstacle"},{"gridX":"5","gridY":"7","type":"obstacle"},{"gridX":"6","gridY":"7","type":"obstacle"}],
			"entities": [
				{"size":24,"gridX":1,"gridY":11,"text":"Engine Room A","type":"text"},
				{"gridX":4,"gridY":4,"type":"character"}
			],
			"exits": [
				{"condition": "esc", "destination": 0}
			]
		}
	]
}
