function HTTP_RequestHeader() {}

hRequestHeader=HTTP_RequestHeader.prototype;
hRequestHeader.bindListener = function () {   
    chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
        var newHeader = details.requestHeaders;
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            var url = details.url;
            newHeader = hReferer.performHTTPRefererModification(newHeader, i, url);
            newHeader = userAgent.performUserAgentModification(newHeader, i, url);
            newHeader = etag.performEtagModification(newHeader, i, url);
        }

        return {requestHeaders: newHeader};
    },{urls: ["<all_urls>"]},["blocking", "requestHeaders"]);
};