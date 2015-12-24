var clearCacheMinsStorageName = "clearCacheMins";
var clearCacheOnExitStorageName = "clearCacheOnExit";
var rulesSetName = "rulesSet";

function Resource() {}
resources = Resource.prototype;

resources.getClearCacheMins = function() {
    return localStorage[clearCacheMinsStorageName];
};

resources.setClearCacheMins = function(value) {
    localStorage[clearCacheMinsStorageName] = value;
};

resources.getClearCacheOnExit = function() {
    return localStorage[clearCacheOnExitStorageName];
};

resources.setClearCacheOnExit = function(value) {
    localStorage[clearCacheOnExitStorageName] = value;
};

resources.getRulesSet = function() {
    return (localStorage[rulesSetName] !== undefined) 
        ? localStorage[rulesSetName].split(",")
        : [];
};

resources.setRulesSet = function(value) {
    localStorage[rulesSetName] = value;
};