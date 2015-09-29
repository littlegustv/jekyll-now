{
	"start": 1,
	"scenes":[
		{
			"name": "tutorial",
			"controls": "autoHorizontal",
			"condition": {
				"type": "time",
				"value": 10
			},
			"messages": {
				"0": "welcome to the game",
				"2": "hi there, this is the first message"				
			}
		},
		{
			"name": "4way",
			"controls": "dir4",
			"condition": {
				"type": "health",
				"value": 2
			},
			"messages" : {}
		},
		{
			"name": "gravity",
			"controls": "dir4Gravity",
			"condition" : {
				"type": "vertical",
				"value": 1000
			},
			"messages": {}
		}
	]
}