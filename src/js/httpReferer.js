function HTTP_Referer() {}

HReferer=HTTP_Referer.prototype;
HReferer.bindListener = function () {
    var hRefererPointer = this;
    
    chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            url = details.url;
            if (details.requestHeaders[i].name === resources.capitalizeFirstLetter(string.getReferer())) {
                var newHeader = hRefererPointer.editBasedOnRefererPref(details.requestHeaders, i, url);
                break;
            }
        }
        return {requestHeaders: newHeader};
    },{urls: ["<all_urls>"]},["blocking", "requestHeaders"]);
};

HReferer.editBasedOnRefererPref = function(requestHeader, pos, packetUrl) {
    var newHeader = requestHeader;
    var httpRefererOptions = HReferer.getRefererOption(packetUrl);
    switch (httpRefererOptions) {
        case string.getRefererBlock():
            newHeader.splice(pos, 1);
            break;
        case string.getRefererDomainOnly():
            url = newHeader[pos].value
            newHeader[pos].value = url.replace(/^.*:\/\//g, '').split('/')[0];
            break;
        case string.getRefererAllow():
            break;
        default:
            break;
    }
    
    return newHeader;
}

HReferer.getRefererOption = function(packetUrl) {
    URL_POS = string.RULE_URL_POS;
    PREFERENCE_POS = string.RULE_PREF_TYPE_POS;
    REFERER = string.getReferer();
    rulesSet = resources.getRulesSet();
    userRefererPref = resources.getDefaultUserPref(packetUrl, REFERER);

    return resources.getUserPref(userRefererPref, packetUrl, REFERER);
}