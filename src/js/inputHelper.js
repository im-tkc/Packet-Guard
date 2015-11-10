function InputHelper() {}
inputHelper = InputHelper.prototype;

inputHelper.splitEachRule = function(array) {
    return array.match(/(?:[^\s"]+|"[^"]*")+/g);
};

inputHelper.capitalizeFirstXLetters = function(string, firstXNumber) {
    return string.substring(0, firstXNumber).toUpperCase() + string.slice(firstXNumber);
};

inputHelper.removeAllInstance = function(array, termToBeRemoved) {
    var pos = array.indexOf(termToBeRemoved);
    while (pos != -1) {
        array.splice(pos, 1);
        var pos = array.indexOf(termToBeRemoved);
    }

    return array;
};

inputHelper.diffArray = function(array1, array2) {
    return array1.filter(function(i) {return array2.indexOf(i) < 0;});
};

inputHelper.findMatchInArray = function(array, match) {
    return array.filter(function(item){
        if (typeof item == 'string' && item.indexOf(match) > -1) {
            return array[item.indexOf(match)];
        }
    });
}

inputHelper.getDomainOnly = function(url) {
    return url.replace(/^.*:\/\//g, '').split('/')[0];
}