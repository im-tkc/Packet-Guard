var tabsArray = {};

function TabsRecorder() {}

tabsRecorder=TabsRecorder.prototype;
tabsRecorder.bindListener = function() {
    chrome.tabs.query({}, function(results) {
        results.forEach(function(tab) {
            tabsArray[tab.id] = tab;
        });
    });

    chrome.tabs.onUpdated.addListener(function onUpdatedListener(tabId, changeInfo, tab) {
        tabsArray[tab.id] = tab;
    });

    chrome.tabs.onRemoved.addListener(function onRemovedListener(tabId) {
        delete tabsArray[tabId];
    });
}

tabsRecorder.getTab = function(tabId) {
    return tabsArray[tabId];
}