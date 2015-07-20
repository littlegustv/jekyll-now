/**
todo:
 - add edit/remove
 - localstorage
 - test (browser/mobile)
 - phonegap
 
features:
 - ability to set date for final time
 - arrow pointer shows progress in current block
 - alerts
 **/


$(document).ready( function ()
{

var CURRENT = new Date();

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

function finalTime () {
	var ft = $("#finaltime").val().split(":");
	console.log(ft);
	var result = new Date();
	result.setHours(ft[0]);
	result.setMinutes(ft[1]);
	result.setSeconds(0);
	console.log(result.getTime());
	return result.getTime();
}

finalTime();

if(typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
	console.log("possible");

} else {
	console.log("impossible!");
    // Sorry! No Web Storage support..
}

blok_list = new Array();

$data_list = new Array();
$data_list.push($("#finaltime").val());

//LOAD FROM STORAGE, if applicable:

try
{
	$data_list = JSON.parse(localStorage.bloks_data);
	setupList($data_list);
}
catch (e)
{
	console.log("No valid JSON source in local storage.", e);
}

// add modal, click to open, then click anywhere to close

$("#add").click(function () {
    $("#addModal").slideToggle('fast', 'linear');
    $("#task").focus();
});

$("#addModal").click(function (e) {
	m = $("#addEvent");
	
    if (m[0] != e.target && m.has(e.target).length <= 0 && $("#add")[0] != e.target && $("#add").has(e.target).length <= 0) {
        e.preventDefault();
        $(this).slideUp('fast', 'linear');
    }
});

$("#finaltime").change(updateList);
//$(".duration input[name=time]").change(updateList);

$("#addEvent").submit(function (e) {
    e.preventDefault();

	var hours = $("#hours").val();
	var minutes = $("#minutes").val();
	var duration = 3600000 * hours + 60000 * minutes;

	var task = $("#task").val();
	
	var newTask = $("<div class='task'>" +
					"<a class='edit' title='Edit'><i class='fa fa-edit'></i></a>" + 
					"<span class='taskName'>" + task + "</span>" + 
					"<span class='duration'></span>" +
					"<span class='time'>" +
						"<span class='endtime'></span>" +
						"<span class='starttime'></span>" +
					"</span></div>");
					
	newTask.attr("duration", duration);
	newTask.attr("task", task);
	
	$("#main-content").append(newTask);
	$("#addEvent")[0].reset();
    $("#addModal").slideUp();
	newTask.hide();
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

function durationString(time) {
	var d = Number(time);
	var hours = Math.floor(d / 3600000);
	var minutes  = Math.floor((d % 3600000) / 60000);
	if (hours == 0) hours = "12";
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
}

});