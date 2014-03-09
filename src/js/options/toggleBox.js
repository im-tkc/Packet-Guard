//Deprecated
$(function() {
    $('div.domainQA').each(function() {
        var trigger = $('p.question', this);
        var popup = $('div.popup', this);
		
        $(trigger.get(0)).click(function () {
            $(popup.get(0)).toggle("slow");
        });
    });
});