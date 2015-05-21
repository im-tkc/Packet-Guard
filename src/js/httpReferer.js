function HTTP_Referer() {}

hReferer=HTTP_Referer.prototype;
hReferer.performHTTPRefererModification = function(requestHeaders, pos, url) {
    var newHeader = requestHeaders;
    var REFERER = string.getReferer();

    if (requestHeaders[pos].name === resources.capitalizeFirstXLetters(REFERER, 1)) {
        var refererBlock = string.getRefererBlock();
        var refererAllow = string.getRefererAllow();
        newHeader = resources.editBasedOnUserPref(requestHeaders, pos, url, REFERER, refererBlock, refererAllow);
        newHeader = hReferer.refererDomainOnlyCheck(REFERER, newHeader, url, pos);
    }

    return newHeader;
}

hReferer.refererDomainOnlyCheck = function(referer, httpHeader, url, pos) {
    var userPref = resources.getUserPref(url, referer);
    if (string.getRefererDomainOnly().localeCompare(userPref) == 0) {
        url = httpHeader[pos].value;
        httpHeader[pos].value = url.replace(/^.*:\/\//g, '').split('/')[0];
    }

    return httpHeader;
}