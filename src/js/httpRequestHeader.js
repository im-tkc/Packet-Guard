function HTTP_RequestHeader() {}

hRequestHeader=HTTP_RequestHeader.prototype;
hRequestHeader.bindListener = function () {
    chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
        var newHeader = details.requestHeaders;
        var tab = tabsRecorder.getTab(details.tabId);
        var packetUrl = inputHelper.getDomainOnly(details.url);
        var tabUrl = inputHelper.getDomainOnly(tab.url);

        for (var i = 0; i < details.requestHeaders.length; ++i) {
            newHeader = hReferer.performHTTPRefererModification(newHeader, i, tabUrl, packetUrl);
            newHeader = userAgent.performUserAgentModification(newHeader, i, tabUrl, packetUrl);
            newHeader = etag.performEtagModification(newHeader, i, tabUrl, packetUrl);
        }

        return {requestHeaders: newHeader};
    },{urls: ["<all_urls>"]},["blocking", "requestHeaders"]);
};