/**

settings:
notifications:
- confirm when deleting a task?
- when 'checking' off a task, offer to update end time
	- settings "tooltips" can turn this on or off

DESIGN: interface for ALL modals

PLAN:
- notifications
	- 'check' should only be available for past/current
	- otherwise, 'edit' -> can't edit current task?  seems ok REMOVE DOUBLECLICK EFFECT 
		-> have both, hide/show to avoid confusion
	- on reaching final, fade (in cascade) all checked tasks, the rest can stay (for next time)
		- if a task is checked AFTER finaltime, it should fade as well (or maybe on update?)
- add/edit/final modal design improvements

chrome app:
 
 - test (browser/mobile)
 - credits, chrome app specifics (sync)
 - finalize design/splash screen
 - graphics/screenshots/icons

mobile:
 - all sorts of stuff
 - android first
 - then ios

stretch goals (premium)
- 'start now' button which sets end time so will start now
 - download record of tasks achieved (receipt, like)
 - multiple days / calendar
 - analytics (graphs)
 - labels / tags
 - themes (colors schemes)

**/

function toMinutes(n) {
	return Math.floor(n / 60000);
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

$(document).ready( function ()
{

var seed = Math.floor(Math.random() * 10000 + 10000);
var notified = {};

var settings = {
	alertTime: 300000,
	notifyOn: true,
	notifyBefore: true,
	notifyEnd: true
}
/*
$("#alertTime").change( function () {
	settings.alertTime = Number($(this).val()) * 60 * 1000;
	// should save this as well
});
$("#notifyBefore").change( function () {
	settings.notifyBefore = $(this).prop("checked");
});
$("#notifyOn").change( function () {
	settings.notifyOn = $(this).prop("checked");
});
$("#notifyEnd").change( function () {
	settings.notifyEnd = $(this).prop("checked");
});*/

var CURRENT = new Date().getTime();

function finalTime () {
	return Number($("#time").attr("time"));
}

function setFinalTime () {
	var ft = $("#finaltime").val().split(":");
	var result = new Date();
	result.setHours(ft[0]);
	result.setMinutes(ft[1]);
	result.setSeconds(0);
	$("#time").text(timeString(result.getTime()));
	$("#time").attr("time", result.getTime());
	return result.getTime();
}

//LOAD FROM STORAGE, if applicable:

try
{
	//var data_list;
	chrome.storage.local.get(function (d) {
		$("#finaltime").val(d.blocks_time ? d.blocks_time : "17:00");
		load(d.blocks_data);
		if (d.blocks_settings) settings = JSON.parse(d.blocks_settings);
		setup();
		//data_list = JSON.parse(d);
	});
}
catch (e) {
	if (e instanceof ReferenceError || e instanceof TypeError) {
		var data_list = localStorage.blocks_data;
		if (localStorage.blocks_settings) settings = JSON.parse(localStorage.blocks_settings);
		$("#finaltime").val(localStorage.blocks_time ? localStorage.blocks_time : "17:00");
		load(data_list);
		setup();
	} else {
		console.log("No valid JSON source in local storage.", e);	
	}
}

function setup () {
	setFinalTime();
	var menu = $("#menuContent").find("input");
	for (var i = 0; i < menu.length; i++) {
		var m = menu.eq(i);
		var mid = m.attr("id").replace("#", "");
		if (mid in settings) {
			if (settings[mid] === true || settings[mid] === false) {
				m.prop("checked", settings[mid]);
			} else {
				m.val(settings[mid] / (1000 * 60));
			}
		}
	}
	console.log(settings);
	/*
	$("#alertTime").val(settings.alertTime / (1000 * 60));
	$("#notifyOn").prop("checked", settings.notifyOn);
	$("#notifyBefore").prop("checked", settings.notifyBefore);*/
	updateList();
}

function save () {
	var data_json = JSON.stringify(createJSON());
	var settings_json = JSON.stringify(settings);
	try {
		chrome.storage.local.set({"blocks_settings": settings_json});
		chrome.storage.local.set({"blocks_data": data_json});
		chrome.storage.local.set({"blocks_time": $("#finaltime").val() });
	} 
	catch (e) {
		if (e instanceof ReferenceError || e instanceof TypeError){
			localStorage.blocks_settings = settings_json;
			localStorage.blocks_data = data_json;
			localStorage.blocks_time = $("#finaltime").val();
		} else {
			console.log(e);
		}
	}
}

function load(data) {
	if (!data) return;
	try {
		data = JSON.parse(data);
		for (var i = 0; i < data.length; i++) {
			var n = createTask(data[i].name, data[i].duration);
			$("#main-content").append(n);
		}
		setSortable();
	}
	catch (e) {
		console.log("ERROR ON LOAD", e, data);
	}
}

function setSortable () {
    $("#main-content").sortable({
		placeholder: 'task-placeholder',
        stop: function () { updateList(true) },
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


/**

#### OPEN AND CLOSE MODAL MENUS

**/

// menu
$("#time").click(function () {
	$("#finalModal").slideToggle('fast', 'linear');
});

$("#finalModal").click(function (e) {
	m = $("#finalContent");
	
    if (m[0] != e.target && m.has(e.target).length <= 0 && $("#menu")[0] != e.target && $("#menu").has(e.target).length <= 0) {
        e.preventDefault();
        $(this).slideUp('fast', 'linear');
        setFinalTime();
        updateList();
    }
});

$("#finalModal .submit").click( function (e) {
    e.preventDefault();
    $("#finalModal").slideUp('fast', 'linear');
    setFinalTime();
    updateList();
})

// menu
$("#menu").click(function () {
	$("#menuModal").slideToggle('fast', 'linear');
});

$("#menuModal").click(function (e) {
	m = $("#menuContent");
	
    if (m[0] != e.target && m.has(e.target).length <= 0 && $("#menu")[0] != e.target && $("#menu").has(e.target).length <= 0) {
    	notificationPermission();
    	setSettings();
        e.preventDefault();
        $(this).slideUp('fast', 'linear');
    }
});

function notificationPermission () {
	if (! "Notification" in window) return;
	if (Notification.permission == "granted") return;
	if ($("#menuContent input:checked").length <= 0) return;
	Notification.requestPermission (function (permission) {
				if (permission == "granted") {
					console.log("permissions granted");
				} else {
					console.log("notification permission not granted (confirmed)");
				}
	});
}

function setSettings () {
	var menu = $("#menuContent").find("input");
	for (var i = 0; i < menu.length; i++) {
		var m = menu.eq(i);
		var mid = m.attr("id").replace("#", "");
		console.log("setSettings", mid);
		if (m.attr("type") == "checkbox") {
			settings[mid] = m.prop("checked");
		} else if (m.attr("type") == "number") {
			settings[mid] = m.val()* (1000 * 60);
		}
	}
	save();
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
					"<a class='check' title='Completed' data-toggle='tooltip'><i class='fa fa-check'></i></a>" + 
					"<a class='edit' title='Edit Task' data-toggle='tooltip'><i class='fa fa-edit'></i></a>" + 
					"<span class='taskName'>" + task + "</span>" + 
					"<span class='duration'></span>" +
					"<span class='time'>" +
						"<span class='endtime'></span>" +
						"<span class='starttime'></span>" +
					"</span></div>");
					
	n.attr("duration", duration);
	n.attr("task", task);
	n.attr("uid", seed);
	seed += 1;

	n.find('.check').click (function (e) {
		if (n.hasClass('checked')) {
			n.removeClass('checked');
		} else {
			n.addClass('checked');
		}
	});

//	n.dblclick( function (e) {

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
			updateList(true);
		});
		
		$("#editModal #delete").confirm({
			text: "Are you sure you want to delete that comment?",
		    title: "Confirmation required",
		    confirm: function(button) {
				n.remove();
				$("#editEvent")[0].reset();
				$("#editModal").slideUp();	
				updateList();
		    },
		    cancel: function(button) {
		        // nothing to do
		    },
		    confirmButton: "Yes I am",
		    cancelButton: "No",
		});

	});
	n.tooltip();
	return n;
}

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
    $('[data-toggle="tooltip"]').tooltip();

	updateList();
		
});

function timeString(time) {
	var d = new Date(Number(time));
	var mer = d.getHours() >= 12 ? "PM" : "AM";
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

function doCurrentPointer() {
	var cp = $("#currentPointer");
	if ($(".current").length > 0) {
		var o = $(".current").offset();
		var h = $(".current").outerHeight(), w = $(".current").outerWidth();
		var percentage = (CURRENT - Number($(".current").attr("starttime"))) / Number($(".current").attr("duration"));
		cp.offset({top: o.top + h - Math.floor(h * percentage) - cp.height() / 2, left: o.left + w - 14});
		cp.show();
	} else {
		cp.hide();
	}
}

function notifyBefore() {
	return {title: toMinutes($(".current").attr("endtime") - CURRENT) + " Minutes Left", body: "You have " + toMinutes($(".current").attr("endtime") - CURRENT) + " minutes to complete: " + $(".current").attr("task")};
}

function notifyOn () {
	return {title: $(".current").attr("task") + " is starting now.", body: "It is time to start the next task: " + $(".current").attr("task")};
}

function notifyEnd () {
	return {title: "Finished!", body: "You've reached the end of the day.  It's time to stop working."};
}

function doNotifications(type) {

	var n;
	if (type == "before" && settings.notifyBefore && !notified[$(".current").attr("uid")]) {
		n = notifyBefore();
		notified[$(".current").attr("uid")] = true;
	}
	else if (type == "on" && settings.notifyOn) {
		n = notifyOn();
	}
	else if (type == "end" && settings.notifyEnd && !notified["end"]) {
		n = notifyEnd();
		notified["end"] = true;
	}
	if (!n) return;
	try {
		chrome.notifications.create({
			type: "basic",
			iconUrl: "./media/images/blocks_icon.png",
			title: n.title,
			message: n.body
		});
	} 
	catch (e) {
		if (! "Notification" in window) {
			console.log("notification API not available");
		} else if (Notification.permission == "granted") {
			var n = new Notification(n.title, {icon: "./media/images/blocks_icon.png", body: n.body});
		} else if (Notification.permission !== "denied") {
			Notification.requestPermission (function (permission) {
				if (permission == "granted") {
					var n = new Notification(n.title, {icon: "./media/images/blocks_icon.png", body: n.body});
				} else {
					console.log("notification permission not granted (confirmed)");
				}
			});
		} else {
			console.log("notification permission not granted (default)");
		}
	}
}

function updateList(resetNotifications) {
	//$('[data-toggle="tooltip"]').tooltip();
	CURRENT = new Date().getTime();
	var ft = finalTime();
	var cid = $(".current").attr("uid");
	if (resetNotifications) notified = {};
	for (var i = 0; i < $(".task").length; i++) {
		// get current task
		
		var e = $(".task").eq(i);
		var p = e.prev(".task");
		if (p.attr("endtime") != undefined) {
			e.attr("endtime", p.attr("starttime"));			
		} else {
			e.attr("endtime", ft);
		}

		// update the time values

		e.attr("starttime", e.attr("endtime") - e.attr("duration"));
		e.find(".duration").html(durationString(e.attr("duration")));
		e.find(".endtime").html(timeString(e.attr("endtime")));
		e.find(".starttime").html(timeString(e.attr("starttime")));
		
		// update task status accordingly

		if (CURRENT > e.attr("starttime") && CURRENT < e.attr("endtime")) {
			if (e.hasClass("past")) {

			}
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
	// create appropriate notifications

	if (cid != $(".current").attr("uid") && Math.abs($('.current').attr("starttime") - CURRENT) < 60 * 1000) {
		doNotifications("on");
	}
	if ($(".current").attr("endtime") - CURRENT < settings.beforeAlert) {
		doNotifications("before");		
	}
	console.log(CURRENT, ft);
	if (CURRENT >= ft) {
		doNotifications("end");
	}

	setTimeout(doCurrentPointer(), 100);
	
	save();
}

$('[data-toggle="tooltip"]').tooltip();
setInterval(updateList, 5000);

});