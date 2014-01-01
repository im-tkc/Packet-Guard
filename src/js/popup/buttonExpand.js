var current_h = $('#clearAllCookies').height();
var current_w = $('#clearAllCookies').width();
$('#clearAllCookies').hover(function() {
	$(this).stop(true, false).animate({
		width: (current_w * 1.3),
		height: (current_h * 1.3)
	}, 300);
}, function() {
	$(this).stop(true, false).animate({
		width: current_w + 'px',
		height: current_h + 'px'
	}, 300);
});