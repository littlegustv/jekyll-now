/**
todo:
 - test (browser/mobile)
 - phonegap
 - tutorial/tips for first time use
 
features:
 - ability to set date for final time
 - arrow pointer shows progress in current block
 - alerts
 
stretch goals
 - themes (colors schemes)
 - analytics (graphs)
 - labels
 
 **/


$(document).ready( function ()
{

var CURRENT = new Date();

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

function finalTime () {
	var ft = $("#finaltime").val().split(":");
	var result = new Date();
	result.setHours(ft[0]);
	result.setMinutes(ft[1]);
	result.setSeconds(0);
	return result.getTime();
}

finalTime();

if(typeof(Storage) !== "undefined") {
	console.log("possible");	    // Code for chromestorage
} else {
	console.log("impossible!"); 	// Sorry! No Web Storage support..
}


//LOAD FROM STORAGE, if applicable:

try
{
	//var data_list;
	
	if (chrome.storage) {
		chrome.storage.local.get(function (d) {
			load(d.blocks_data);
			//data_list = JSON.parse(d);
		});
	} else {
		var data_list = localStorage.blocks_data;
		load(data_list);	
	}
	//var data_list = JSON.parse(chrome.storage.local.blocks_data);

	//load(data_list);
}
catch (e)
{
	console.log("No valid JSON source in local storage.", e);
}

function save () {
	var json = JSON.stringify(createJSON());
	if (chrome.storage) {
		chrome.storage.local.set({"blocks_data": json});
	} else {
		localStorage.blocks_data = json;
	}
}

function load(data) {
	try {
		data = JSON.parse(data);
		for (var i = 0; i < data.length; i++) {
			var n = createTask(data[i].name, data[i].duration);
			$("#main-content").append(n);
		}
		setSortable();
		updateList();
	}
	catch (e) {
		console.log("ERROR ON LOAD", e);
	}
}

function setSortable () {
    $("#main-content").sortable({
		placeholder: 'task-placeholder',
        stop: updateList,
		items: '.task',
		axis: 'y',
		handle: '.taskName',
		helper: function (e, tr) {
			var $helper = tr.clone();
			$helper.width(tr.parent().width());
			$helper.height(tr.prev().height());
			//console.log(e, tr.parent().width());
			return $helper
		}		
    });
    $("#main-content").disableSelection();
}

function createJSON () {
	var blocks = [];
	for (var i = 0; i < $(".task").length; i++) {
		var t = $(".task").eq(i);
		blocks.push({name: t.attr("task"), duration: t.attr("duration")});
	}
	return blocks;
}

// add modal, click to open, then click anywhere to close

$("#add").click(function () {
    $("#addModal").slideToggle('fast', 'linear');
    $("#addModal .name").focus();
});

$("#addModal").click(function (e) {
	m = $("#addEvent");
	
    if (m[0] != e.target && m.has(e.target).length <= 0 && $("#add")[0] != e.target && $("#add").has(e.target).length <= 0) {
        e.preventDefault();
        $(this).slideUp('fast', 'linear');
    }
});

$("#editModal").click(function (e) {
	m = $("#editEvent");
	
    if (m[0] != e.target && m.has(e.target).length <= 0 && $(".edit")[0] != e.target && $(".edit").has(e.target).length <= 0) {
        e.preventDefault();
        $(this).slideUp('fast', 'linear');
    }
});

function createTask(task, duration) {
	var n = $("<div class='task'>" +
					"<a class='edit' title='Edit'><i class='fa fa-edit'></i></a>" + 
					"<span class='taskName'>" + task + "</span>" + 
					"<span class='duration'></span>" +
					"<span class='time'>" +
						"<span class='endtime'></span>" +
						"<span class='starttime'></span>" +
					"</span></div>");
					
	n.attr("duration", duration);
	n.attr("task", task);
	
	n.find(".edit").click ( function (e) {
		// Remove any previous lingering event listeners
		$("#editModal .submit").off("click");
		$("#editModal #delete").off("click");
		
		$("#editModal").slideToggle('fast', 'linear');
		$("#editModal .name").focus();
		$("#editModal .name").val(n.attr("task"));
		$("#editModal .hours").val(toHours(n.attr("duration")));
		$("#editModal .minutes").val(toMinutes(n.attr("duration")));
		
		//Rebind submit event to edit this particular task
		$("#editModal .submit").on("click", function (e) {
			e.preventDefault();
			var hours = $("#editModal .hours").val();
			var minutes = $("#editModal .minutes").val();
			var duration = 3600000 * hours + 60000 * minutes;
			
			n.attr("task", $("#editModal .name").val());
			n.find(".taskName").text($("#editModal .name").val());
			n.attr("duration", duration);
			
			$("#editEvent")[0].reset();
			$("#editModal").slideUp();			
			updateList();
		});
		
		$("#editModal #delete").on("click", function (e) {
			e.preventDefault();
			var d = confirm("Are you sure you want to delete this item?");
			if (d) {
				n.remove();
				$("#editEvent")[0].reset();
				$("#editModal").slideUp();	
				updateList();
			}
		});
	});
	return n;
}

$("#finaltime").change(updateList);
//$(".duration input[name=time]").change(updateList);

$("#addModal .submit").click(function (e) {
    e.preventDefault();

	var hours = $("#addModal .hours").val();
	var minutes = $("#addModal .minutes").val();
	var duration = 3600000 * hours + 60000 * minutes;

	var task = $("#addModal .name").val();
	
	var newTask = createTask(task, duration);
	
	$("#main-content").append(newTask);

	newTask.hide();
	$("#addEvent")[0].reset();
    $("#addModal").slideUp();
	setSortable();
	newTask.slideDown();
	
	updateList();
		
});



function timeString(time) {
	var d = new Date(Number(time));
	var mer = d.getHours() > 12 ? "PM" : "AM";
	var hours = d.getHours() % 12;
	var minutes = d.getMinutes();
	if (hours == 0) hours = "12";
	if (minutes < 10) minutes = "0" + String(minutes);
	return hours + ":" + minutes + " " + mer;
}

// millisecond chunks of time to hours or minutes

function toHours(time) {
	return Math.floor(Number(time) / 3600000);
}

function toMinutes(time) {
	return Math.floor((Number(time) % 3600000) / 60000);	
}

function durationString(time) {
	//var d = Number(time);
	var hours = toHours(time);		//= Math.floor(d / 3600000);
	var minutes  = toMinutes(time);	//= Math.floor((d % 3600000) / 60000);
	if (minutes < 10) minutes = "0" + String(minutes);
	return hours + ":" + minutes;
}

function updateList() {
	CURRENT = new Date().getTime();
	for (var i = 0; i < $(".task").length; i++) {
		var e = $(".task").eq(i);
		var p = e.prev(".task");
		if (p.attr("endtime") != undefined) {
			e.attr("endtime", p.attr("starttime"));			
		} else {
			e.attr("endtime", finalTime());
		}
		e.attr("starttime", e.attr("endtime") - e.attr("duration"));
		e.find(".duration").html(durationString(e.attr("duration")));
		e.find(".endtime").html(timeString(e.attr("endtime")));
		e.find(".starttime").html(timeString(e.attr("starttime")));
		if (CURRENT > e.attr("starttime") && CURRENT < e.attr("endtime")) {
			e.removeClass("past");
			e.addClass("current");
		} else if (CURRENT > e.attr("endtime")) {
			e.removeClass("current");
			e.addClass("past");
		} else {
			e.removeClass("current");
			e.removeClass("past");			
		}
	}
	save();
}

setInterval(updateList, 5000);

});