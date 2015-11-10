function Etag() {}

etag=Etag.prototype;
etag.performEtagModification = function(requestHeaders, pos, tabUrl, packetUrl) {
    var ETAG = string.getEtag();
    var newHeader = requestHeaders;
    if (requestHeaders[pos].name === string.HTTP_IF_NONE_MATCH) {
        var ETAG_BLOCK = string.getEtagBlock();
        var ETAG_ALLOW = string.getEtagAllow();
        newHeader = rulesSetHelper.editBasedOnUserPref(requestHeaders, pos, tabUrl, packetUrl, ETAG, ETAG_BLOCK, ETAG_ALLOW);
    }

    return newHeader;
};