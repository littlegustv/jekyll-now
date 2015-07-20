/**

**
TODO LIST: (how passé!)
-Tweak CSS a bit... and layout?  esp. on mobile (delete button)
-Make edit form/delete/resubmit/cancel edit more responsive, elegant
-Test on mobile
-Phonegap?... push notifications, dev builds, etc.
**

**/


$(document).ready( function ()
{

var times = {
	HOURS : 0,
	MINUTES: 1,
	AMPM: 2
};

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

function Blok (name, endTime, durationTime) {

	this.name = name;
	this.endTime = endTime;
	this.durationTime = durationTime;
	
	var s_hour = (endTime[0] - durationTime[0] - (endTime[1] < durationTime[1])).mod(12);
	var s_minutes = (endTime[1] - durationTime[1]).mod(60);
	
	var s_meridiem = endTime[2];
	
	if (endTime[0] < durationTime[0] || (endTime[0] == durationTime[0] && endTime[1] < durationTime[1]))
		s_meridiem = s_meridiem == "AM" ? "PM" : "AM";
	
	this.startTime = [s_hour, s_minutes, s_meridiem];

}

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

$("#add").click(function () {
    $("#addModal").slideToggle('fast', 'linear');
    $("#task").focus();
});

$(document).click(function (e) {
    m = $("#addModal");
	
    if (m[0] != e.target && m.has(e.target).length <= 0 && $("#add")[0] != e.target && $("#add").has(e.target).length <= 0) {
        e.preventDefault();
        m.slideUp('fast', 'linear');
    }
});

function createTask(blok)
{

		var eh = blok.endTime[0] == 0 ? 12 : (blok.endTime[0] < 10 ? "0" + blok.endTime[0] : blok.endTime[0]);
		var em = blok.endTime[1] < 10 ? "0" + blok.endTime[1] : blok.endTime[1];

		var sh = blok.startTime[0] == 0 ? 12 : (blok.startTime[0] < 10 ? "0" + blok.startTime[0] : blok.startTime[0]);
		var sm = blok.startTime[1] < 10 ? "0" + blok.startTime[1] : blok.startTime[1];
		
		var dh = blok.durationTime[0];// == 0 ? 12 : (blok.durationTime[0] < 10 ? "0" + blok.durationTime[0] : blok.durationTime[0]);
		var dm = blok.durationTime[1] < 10 ? "0" + blok.durationTime[1] : blok.durationTime[1];
				

		var newTask = $("<div class='task'><a class='edit' title='Edit'><i class='fa fa-edit'></i></a><span class='taskName'>" + blok.name +
        "</span><span class='duration'>" + dh + ":" + dm + "</span>" +
		"<span class='time'>" +
        "<span class='endtime'>" + eh + ":" + em + " " + blok.endTime[2] + "</span>" +
        "<span class='starttime'>" + sh + ":" + sm + " " + blok.startTime[2] + "</span>" +
        "</span></div>");

		newTask.find('.edit').click( function () {
		//$('.edit').click( function () {
			
			console.log("click response...");
		
			if ($('.editing').length > 0)
			{
				console.log("already editing");
				return
			}	
								
			var $task = $(this).parent('.task');

			var $name = $task.find('.taskName').text();
			var $time = $task.find('.duration').text().split(':');
			var $hours = $time[0];
			var $minutes = $time[1];
			
			var $editForm = $("<input type='text' name='edit-name' value='" + $name + "'></input>" +
							"<input type='number' name='edit-hours' value='" + $hours + "'></input>" + 
							"<input type='number' name='edit-minutes' value='" + $minutes + "'></input>" + 
							"<input type='submit' name='edit-submit' value='Update' id='edit-form-submit'></input>" + 
							"<button class='remove' title='Remove'><i class='fa fa-trash'></i></button>");

			$task.addClass('editing');
			console.log("here");
			$task.removeClass('past');
			$task.removeClass('current');
			
			$(this).parent('.task').html($editForm);
			
			$('#edit-form-submit').click(handleEdit);
			$('.remove').click( function () {
				if (confirm('Delete this block?')) {
					console.log("hi"); 
					$('.editing').remove(); 
					updateList()
				}
			});
			
		});
		
		//console.log("...inside", blok.name);
		
		return newTask;
}

function makeTask(name, duration_hours, duration_minutes, end_hours, end_minutes, start_hours, start_minutes) {

		var newTask = $("<div class='task'><a class='edit'><i class='fa fa-caret-square-o-down'></i></a><span class='taskName'>" + name +
        "</span><span class='time'>" +
        "<span class='endtime'>" + end_hours + ":" + end_minutes + "</span>" +
        "<span class='duration'>" + duration_hours + ":" + duration_minutes + "</span>" +
        "<span class='starttime'>" + start_hours + ":" + start_minutes + "</span>" +
        "</span></div>");

		$('.edit').click( function () {

			console.log("click response...");
		
			if ($('.editing').length > 0)
			{
				console.log("already editing");
				return
			}					
			var $task = $(this).parent('.task');

			var $name = $task.find('.taskName').text();
			var $time = $task.find('.duration').text().split(':');
			var $hours = $time[0];
			var $minutes = $time[1];
			
			var $editForm = $("<input type='text' name='edit-name' value='" + $name + "'></input>" +
							"<input type='number' name='edit-hours' value='" + $hours + "'></input>" + 
							"<input type='number' name='edit-minutes' value='" + $minutes + "'></input>" + 
							"<input type='submit' name='edit-submit' value='Change' id='edit-form-submit'></input>" +
							"<button class='remove'><i class='fa fa-trash'></i></button>");

			$task.addClass('editing');
			$(this).parent('.task').html($editForm);
			
			$('#edit-form-submit').click(handleEdit);
			$('.remove').click( function () {
				if (confirm('Delete this block?')) {
					console.log("hi"); 
					$('.editing').remove(); 
					updateList()
				}
			});
			
		});
		
		return newTask;
}

function updateTime() {

	var t = new Date();
	var th = t.getHours() % 12;
	var tm = t.getMinutes();
	
	$('.task').each( function (e) {

		end = $(this).find('.endtime').text();
		start = $(this).find('.starttime').text();
		
		current = new Date();
		current = current.toDateString();
		
		end = new Date(current + " " + end);
		start = new Date(current + " " + start);
		
		$(this).css('border-left-width');
		if ($(this).hasClass('editing'))
		{
			//pass
		}
		else if (t.getTime() > start.getTime() && t.getTime() < end.getTime())
		{
			$(this).removeClass('past');
			$(this).addClass('current');
		}
		else if (t.getTime() > end.getTime())
		{
			$(this).addClass('past');
			$(this).removeClass('current');
		}
		else
		{
			$(this).removeClass('past');
			$(this).removeClass('current');
		}
		/*
		if (th > eh || (th == eh && tm >= em))
			$(this).addClass('past');
		else if (th > sh || (th == sh && tm >= sm))
			$(this).addClass('current');
		*/
	});

}

function setupList(source) {

	$("#finaltime").val( source[0]);
	
	source.shift();
	
	source.forEach( function (e) {
	
		//newTask = makeTask(e.name, e.duration_hours, e.duration_minutes, e.end_hours, e.end_minutes, e.start_hours, e.start_minutes);
		newTask = createTask(e);
		
		$("#main-content").append(newTask);
		$("#main-content").find(".task:last").hide();
		$("#main-content").find(".task:last").slideDown();
	
	});
	
    $("#main-content").sortable({
        placeholder: 'task-placeholder',
		stop: updateList,
		items: '.task',
		axis: 'y',
		handle: '.taskName',
		helper: function (e, tr) {
			var $helper = tr.clone();
			$helper.width(tr.parent().width());
			$helper.height(tr.height() + 10);
			console.log(e, tr.height());
			return $helper
		}	
    });
    $("#main-content").disableSelection();
	updateTime();

}

function updateList() {
	$data_list = new Array();
	$data_list.push($("#finaltime").val());
	
    for (e = 0; e < $('.task').length; e++) {

        if (e > 0) 
			endTime = $(".task").eq(e - 1).find('.starttime').text().split(/[:\s]/);
        else 
		{
			endTime = $("#time input[name=time]")[0].value.split(':');
			endTime[2] = Number(endTime[0]) >= 12 ? "PM" : "AM";
        }
		endTime[0] = Number(endTime[0]) % 12;
        endTime[1] = Number(endTime[1]);

		endHours = endTime[0];
		endMinutes = endTime[1];
		
        duration = $('.task').eq(e).find('.duration').text().split(':');
		
        task = $(".task").eq(e).find('.taskName').text();
        duration[0] = Number(duration[0]);
        duration[1] = Number(duration[1]);
		
		hours = duration[0];
		minutes = duration[1];
		
		var b = new Blok(task, endTime, duration);
		//console.log("hi", b, e);
		/*
        startMinutes = (((endMinutes - minutes) % 60) + 60) % 60;
        startHours = endMinutes >= minutes ? endHours - hours : endHours - hours - 1;
        startHours = ((startHours % 12) + 12) % 12;

        startMinutes = startMinutes < 10 ? "0" + startMinutes : startMinutes;
        endMinutes = endMinutes < 10 ? "0" + endMinutes : endMinutes;
        minutes = minutes < 10 ? "0" + minutes : minutes;

		var element = {name: task, duration_hours: hours, duration_minutes: minutes,
						end_hours: endHours, end_minutes: endMinutes,
						start_hours: startHours, start_minutes: startMinutes}
		*/
		//$data_list.push(element);
		$data_list.push(b);

		//console.log(b);
		
		//newTask = makeTask(task, hours, minutes, endHours, endMinutes, startHours, startMinutes);
		newTask = createTask(b);
		//console.log("EACH", newTask.find(".edit"));
		//$('.task').eq(e).html(newTask.html());
		$('.task').eq(e).replaceWith(newTask);
    };
	localStorage.bloks_data = JSON.stringify($data_list);
	updateTime();
}

$("#finaltime").change(updateList);
$(".duration input[name=time]").change(updateList);

$("#addEvent").submit(function (e) {
    e.preventDefault();

    if ($(".task").length > 0) endTime = $(".task").eq($(".task").length - 1).find('.starttime').text().split(/[:\s]/);
    else 
	{
		endTime = $("#time input[name=time]")[0].value.split(':');
		endTime[2] = Number(endTime[0]) >= 12 ? "PM" : "AM";
	}
	//else endTime = $("#time input[name=time]")[0].value.split(':');

    endTime[0] = Number(endTime[0]) % 12;
    endTime[1] = Number(endTime[1]);

    task = $("#task")[0].value;
    durationTime = new Array();
	durationTime[0] = Number($("#hours")[0].value);
    durationTime[1] = Number($("#minutes")[0].value);

	/*
    startMinutes = (((endMinutes - minutes) % 60) + 60) % 60;
    startHours = endMinutes >= minutes ? endHours - hours : endHours - hours - 1;
    startHours = ((startHours % 12) + 12) % 12;

    startMinutes = startMinutes < 10 ? "0" + startMinutes : startMinutes;
    endMinutes = endMinutes < 10 ? "0" + endMinutes : endMinutes;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    console.log("and... ", endMinutes, endHours, startMinutes);

    newTask = makeTask(task, hours, minutes, endHours, endMinutes, startHours, startMinutes);
	*/
	
	var b = new Blok(task, endTime, durationTime);
	
	console.log(b.startTime, b.endTime);
	if (b.startTime[2] == "PM" && b.endTime[2] == "AM")
	{
		alert("There is not enough time left in the day...");
		return;
	}
	
	var newTask = createTask(b);
	
    $("#main-content").append(newTask);
    $("#addEvent")[0].reset();
    $("#addModal").slideUp();
    $("#main-content").find(".task:last").hide();
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
			console.log(e, tr.parent().width());
			return $helper
		}		
    });
    $("#main-content").disableSelection();
    $("#main-content").find(".task:last").slideDown();
/*
	var element = {name: task, duration_hours: hours, duration_minutes: minutes,
				end_hours: endHours, end_minutes: endMinutes,
				start_hours: startHours, start_minutes: startMinutes}
*/
	$data_list.push(b);
	
	localStorage.bloks_data = JSON.stringify($data_list);
	updateTime();

});

function handleEdit()
{
	var $name = $('.editing input[name="edit-name"]').val();
	var $hours = $('.editing input[name="edit-hours"]').val();
	var $minutes = $('.editing input[name="edit-minutes"]').val();
		
	var durationTime = [Number($hours), Number($minutes)];
		
	var b = new Blok($name, [0,0,"AM"], durationTime);
		
	var newTask = createTask(b);
		
	//var $newtask = makeTask($name, $hours, $minutes, 0,0,0,0);
	$('.editing').html(newTask.html());
	$('.editing').removeClass('editing');
	updateList();
}

setInterval(updateTime, 30000);

});