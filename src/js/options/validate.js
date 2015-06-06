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
};

function validateImportedData(clearCacheMins, clearCacheOnExit) {
    var overallValidate = false;
    var isValidInputs = [false, false];
    isValidInputs[0] = (/^[0-9]+$/.test(clearCacheMins)) ? true : false;
    isValidInputs[1] = clearCacheOnExit;

    if (isValidInputs.indexOf(false) == -1) overallValidate = true;

    return overallValidate;
}