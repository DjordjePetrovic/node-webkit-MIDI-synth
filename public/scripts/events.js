var socket = io.connect('http://127.0.0.1:3500');


socket.on('keyboardModel',function(keyboardModel){
	$('.keyboard_name').html(keyboardModel)
});

socket.on('drumUpdates',function(data){
	switch(data['type']) {

		// DRUM PADS
	    case 'drum_pads':
	        var elementID 		= data['id'],
			elementSelector = data['pad'];
			$(elementID).find(elementSelector).trigger('click');
	    break;

	    // BASIC CONTROLS
	    case 'play_stop':
		    var elementSelector = data['selector'];
		    $(elementSelector).trigger('click');
	    break;
	}
});

socket.on('lfoRateUpdate',function(data){
	console.log(data);
	if(data<99) {
		$("#lfo-rate").val('0.'+data).trigger('change');
	}
});

socket.on('lfoUpdate',function(data){
	console.log(data);
	if(data<99) {
		$("#osc-lfo").val('0.'+data).trigger('change');
	}
});
socket.on('cutOffUpdate',function(data){
	console.log(data);
	if(data<99) {
		$("#lpf-freq").val('0.'+data).trigger('change');
	}
});
socket.on('envRelease',function(data){
	console.log(data);
	if(data<99) {
		$("#env-release").val('0.'+data).trigger('change');
	}
});
socket.on('keysUpdate',function(keyData){
	  $("[data-note='" + keyData['data-note'] + "']").mousedown();
      setTimeout(function(){ $("[data-note='" + keyData['data-note'] + "']").mouseup()}, 100);
});

socket.on('osc_shape_down',function(){
	var osc_shape = $('#osc-shape').val();
	osc_shape = parseInt(osc_shape) - 1;
	if(osc_shape >= 0) {
		$('#osc-shape').val(osc_shape);
	}
});
socket.on('osc_shape_up',function(){
	var osc_shape = $('#osc-shape').val();
	osc_shape = parseInt(osc_shape) + 1;
	if(osc_shape <= 4) {
		$('#osc-shape').val(osc_shape);
	}
});
socket.on('shape_down',function(){
	var shape = $('#lfo-shape').val();
	shape = parseInt(shape) - 1;
	if(shape >= 0) {
		$('#lfo-shape').val(shape);
	}
});
socket.on('shape_up',function(){
	var shape = $('#lfo-shape').val();
	shape = parseInt(shape) + 1;
	if(shape <= 4) {
		$('#lfo-shape').val(shape);
	}
});