domainsLocalStorageName = "domainsAllowed";
clearCacheMinsStorageName = "clearCacheMins";
clearCacheOnExitStorageName = "clearCacheOnExit";
httpRefererStorageName = "httpReferer";

function Resource() {}
resources = Resource.prototype;

resources.getDomainsAllowed = function() {
    return localStorage[domainsLocalStorageName];
}

resources.setDomainsAllowed = function(value) {
    localStorage[domainsLocalStorageName] = value;
}

resources.getClearCacheMins = function() {
    return localStorage[clearCacheMinsStorageName];
}

resources.setClearCacheMins = function(value) {
    localStorage[clearCacheMinsStorageName] = value;
}

resources.getClearCacheOnExit = function() {
    return localStorage[clearCacheOnExitStorageName];
}

resources.setClearCacheOnExit = function(value) {
    localStorage[clearCacheOnExitStorageName] = value;
}

resources.getHttpReferer = function() {
    return localStorage[httpRefererStorageName];
}

resources.setHttpReferer = function(value) {
    localStorage[httpRefererStorageName] = value;
}