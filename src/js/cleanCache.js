function CacheCleaner() {}

cacheCleaner = CacheCleaner.prototype;
cacheCleaner.getCacheAlarmName = function() {
    return "Clear cache";
};

cacheCleaner.bindListener = function() {
    cacheCleanerPointer = this;
    this.createTimer;
    
    chrome.alarms.onAlarm.addListener(function(alarm) {
        if (alarm.name == cacheCleanerPointer.getCacheAlarmName()) {
            cacheCleanerPointer.removeCache();
        }
    });
    
    if (resources.getClearCacheOnExit() == "true") {
        cacheCleanerPointer.removeCache();
    }
};

cacheCleaner.removeCache = function() {
    chrome.browsingData.remove({}, {
        cache: true
    });
};

cacheCleaner.createTimer = function(clearCacheMins) {
    if (clearCacheMins != 0) {
        chrome.alarms.create(this.getCacheAlarmName(), {periodInMinutes: clearCacheMins});
    } else {
        chrome.alarms.clear(this.getCacheAlarmName());
    }
};
