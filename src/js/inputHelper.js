function InputHelper() {}
inputHelper = InputHelper.prototype;

inputHelper.splitEachRule = function(array) {
    return array.match(/(?:[^\s"]+|"[^"]*")+/g);
};

inputHelper.capitalizeFirstXLetters = function(string, firstXNumber) {
    return string.substring(0, firstXNumber).toUpperCase() + string.slice(firstXNumber);
};