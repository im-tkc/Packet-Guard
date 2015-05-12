$(function() {
    $('input.numeric').each(function() {
        $(this).numberOnly();
        $(this).getOriginalValueIfInvalid(resources.getClearCacheMins());
    });
});

$.fn.numberOnly = function() {
    $(this).focusout(function () {
        var value = $(this).val();
        var newValue = value.split(/[^\d]/)[0];
        $(this).val(newValue);
    });
};

$.fn.getOriginalValueIfInvalid = function(originalValue) {
    $(this).focusout(function () {
        if ($(this).val() == "") {
            $(this).val(originalValue);
        }
    });
}