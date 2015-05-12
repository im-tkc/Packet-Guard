chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
        resources.setHttpReferer("suppress");
        resources.setClearCacheMins(120);
        resources.setClearCacheOnExit("false");
    }
});