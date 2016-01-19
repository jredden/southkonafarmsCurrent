var celestialCycle = {};
celestialCycle._hour = 0;

$(function(){
	var sb1 = parseFloat($('#sidebar-first').height());
	var sb2 = parseFloat($('#sidebar-last').height());
	var dynamicMinHeight = sb1+sb2+"px";
	$('.content-inner').css('min-height',dynamicMinHeight);

	var servertime = parseFloat( $("input#servertime").val() ) * 1000;
	servertime += 2*60*60*1000;
	$("#time").clock({"timestamp":servertime,"calendar":"false"});
	
	/*var nowHour = new Date();
	celestialCycle._hour = nowHour.getHours();
	
	setTimeout(celestialCycle.checkForRefresh, 60000*5);
	
	$('#enews-form').submit(function() {
		submit_enews();
		return false;
	});*/
});

celestialCycle.checkForRefresh = function(){
	var nowHour = new Date();
	if(nowHour.getHours() != celestialCycle._hour){
		var flashClock = $("#header-clock").get(0);
		flashClock.setTime(nowHour.getHours());
		celestialCycle.detectCycleChange();
	}
}

celestialCycle.refresh = function(){
	location.reload(true);
}

celestialCycle.detectCycleChange = function(){
	var nowHour = new Date().getHours();
	var oldHour = celestialCycle._hour;
	if(oldHour >= 0 && oldHour <=4 && nowHour > 4){celestialCycle.refresh();}
	if(oldHour >= 5 && oldHour <=9 && nowHour > 9){celestialCycle.refresh();}
	if(oldHour >= 10 && oldHour <=15 && nowHour > 15){celestialCycle.refresh();}
	if(oldHour >= 16 && oldHour <=19 && nowHour > 19){celestialCycle.refresh();}
	if(oldHour >= 20 && oldHour <=23 && nowHour > 0){celestialCycle.refresh();}
}

function submit_enews(){
	/*$.post("http://www.email_advert.com/email_intrest.do", $('#enews-form').serialize(),
			function (data){
				$('#enews-form').hide();
				$('#enews-thank_you').show();
			});*/
}