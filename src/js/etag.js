function Etag() {}

etag=Etag.prototype;
etag.performEtagModification = function(requestHeaders, pos, url) {
    var ETAG = string.getEtag();
    var newHeader = requestHeaders;
    if (requestHeaders[pos].name === string.HTTP_IF_NONE_MATCH) {
        var ETAG_BLOCK = string.getEtagBlock();
        var ETAG_ALLOW = string.getEtagAllow();
        newHeader = rulesSetHelper.editBasedOnUserPref(requestHeaders, pos, url, ETAG, ETAG_BLOCK, ETAG_ALLOW);
    }

    return newHeader;
};