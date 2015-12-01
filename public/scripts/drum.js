var playing = false,
	curBeat = 0;
window.curTempo = 100;

var Play = function() {
	if (playing !== false) {
		var nextBeat = 60000 / window.curTempo / 4;
		$("li.block").removeClass("ef");
		$("li.block.col_" + curBeat).addClass("ef");
		$("#tracker li.block").removeClass("active");
		$("#tracker li.block.col_" + curBeat).addClass("active");
		
		var tmpAudio;
		$(".soundrow[id^=box] li.block.active.col_" + curBeat).each(function(i){
			tmpAudio = document.getElementById($(this).data('sound_id'));
			if (!tmpAudio.paused) {
				tmpAudio.pause();
				tmpAudio.currentTime = 0.0;
			}
			tmpAudio.play();
		});
		curBeat = (curBeat + 1) % 8;
	}
};
var Stop = function() {
		$(".soundrow[id^=box] li.active").removeClass('active');
		clearInterval(playing);
		playing = false;
		$('.soundrow li').removeClass('ef');
}

$(document).ready(function(){
	$("audio").each(function(i){
		var self = this;
		var $ul = $('<ul id="box_' + this.id + '" class="soundrow">');
		for (j = 0; j < 8; j++) {
			var $li =
				$('<li class="block col_'+j+'">'+self.id+'</li>')
				.click(function(){
					$(this).toggleClass('active');
				})
				.data('sound_id', self.id);
			$ul.append($li);
		} 
		$('<li>').append($ul).appendTo('#beat');
	});

	$(".play").click(function(){

		if (playing === false) {
			curBeat = 0;
			playing = setInterval(Play, 60000 / window.curTempo / 4);
		} else {
			clearInterval(playing);
			playing = false;
			$("#tracker li.block").removeClass("active");
			$("audio").each(function(){
				this.pause();
			});
		}
	});

	$('.stop').click(function(){
		Stop();
	});
	$('.pause').click(function(){
		clearInterval(playing);
	});
	$('#tempovalue').html(window.curTempo);
	$('#temposlider').slider({
		'value': window.curTempo,
		'min': 30,
		'max': 127,
		'step': 10,
		'change': function(e, ui) {
			window.curTempo = ui.value;
			$('#tempovalue').html(window.curTempo);
			if (playing !== false) {
				clearInterval(playing);
				playing = setInterval(Play, 60000 / curTempo / 4);
			}
		},
		'stop': function(e, ui) {
		}
	});
	socket.on('bpmUpdate',function(data){
		$('#tempovalue').html(data);
		$('#temposlider').slider({'value':data});
		$('#temposlider').trigger('slidechange');
		window.curTempo = data;
	});
	
  	$('.control_btn').on('click',function(){
  		$(this).fadeTo( "fast" , 0.2, function() {
    		$(this).fadeTo('fast',0.9);
  		});
  	});

  	var blink = function(selector){
	$(selector).fadeOut('200', function(){
	    $(this).fadeIn('200', function(){
	       blink(this);
	    });
	});
	}
  	blink('.bulb');
});
