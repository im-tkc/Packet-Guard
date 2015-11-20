function HTTP_Referer() {}

hReferer=HTTP_Referer.prototype;
hReferer.performHTTPRefererModification = function(requestHeaders, pos, tabUrl, packetUrl) {
    var newHeader = requestHeaders;
    var REFERER = string.getReferer();
    
    if (requestHeaders[pos].name === inputHelper.capitalizeFirstXLetters(REFERER, 1)) {
        var refererBlock = string.getRefererBlock();
        var refererAllow = string.getRefererAllow();
        newHeader = rulesSetHelper.editBasedOnUserPref(requestHeaders, pos, tabUrl, packetUrl, REFERER, refererBlock, refererAllow);
    }

    return newHeader;
};

hReferer.configureReferer = function(myRuleObject, referer, httpHeader, tabUrl, packetUrl, pos) {
    var isFirstPartyPacket = packetUrl == tabUrl;

    if ((myRuleObject.firstPartyUserPref == string.getRefererDomainOnly()) && isFirstPartyPacket && !myRuleObject.isUserPrefUpdated) {
        refererUrl = httpHeader[pos].value;
        httpHeader[pos].value = inputHelper.getDomainOnly(refererUrl);
        myRuleObject.isUserPrefUpdated = true;
    }
    if ((myRuleObject.thirdPartyUserPref == string.getRefererDomainOnly()) && !isFirstPartyPacket && !myRuleObject.isUserPrefUpdated) {
        refererUrl = httpHeader[pos].value;
        httpHeader[pos].value = inputHelper.getDomainOnly(refererUrl);
        myRuleObject.isUserPrefUpdated = true;
    }

    if(!myRuleObject.isUserPrefUpdated && isFirstPartyPacket)
        httpHeader = rulesSetHelper.setCustomField(string.getRefererCustom(), myRuleObject.firstPartyUserPref, httpHeader, pos, myRuleObject);
    if (!myRuleObject.isUserPrefUpdated && !isFirstPartyPacket)
        httpHeader = rulesSetHelper.setCustomField(string.getRefererCustom(), myRuleObject.thirdPartyUserPref, httpHeader, pos, myRuleObject);

    return httpHeader;
};