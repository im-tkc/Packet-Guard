function CacheCleaner() {
	this.cacheAlarmName = "Clear cache";
}

cacheCleaner = CacheCleaner.prototype;
cacheCleaner.bindListener = function() {
	cacheCleanerPointer = this;
	
	chrome.alarms.onAlarm.addListener(function(alarm) {
		if (alarm.name == cacheCleanerPointer.cacheAlarmName) {
			cacheCleanerPointer.removeCache();
		}
	});

	chrome.windows.onRemoved.addListener(function () {
		cacheCleanerPointer.removeCache();
	});
}

cacheCleaner.removeCache = function() {
	chrome.browsingData.remove({}, {
		cache: true
	});
}

cacheCleaner.createTimer = function(clearCacheMins) {
	if (clearCacheMins != 0) {
		chrome.alarms.create(this.cacheAlarmName, {periodInMinutes: clearCacheMins});
	} else {
		chrome.alarms.clear(this.cacheAlarmName);
	}
}

cacheCleaner = new CacheCleaner();
cacheCleaner.bindListener();