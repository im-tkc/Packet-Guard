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
    if ((myRuleObject.firstPartyUserPref == string.getRefererDomainOnly()) && (packetUrl == tabUrl) && !myRuleObject.isFirstPartyUserPrefUpdated) {
        refererUrl = httpHeader[pos].value;
        httpHeader[pos].value = inputHelper.getDomainOnly(refererUrl);
        myRuleObject.isFirstPartyUserPrefUpdated = true;
    }
    if ((myRuleObject.thirdPartyUserPref == string.getRefererDomainOnly()) && (packetUrl != tabUrl) && !myRuleObject.isThirdPartyUserPrefUpdated) {
        refererUrl = httpHeader[pos].value;
        httpHeader[pos].value = inputHelper.getDomainOnly(refererUrl);
        myRuleObject.isThirdPartyUserPrefUpdated = true;
    }

    if(!myRuleObject.isUserPrefUpdated && (packetUrl == tabUrl))
        httpHeader = rulesSetHelper.setCustomField(string.getRefererCustom(), myRuleObject.firstPartyUserPref, httpHeader, pos);
    if (!myRuleObject.isUserPrefUpdated && (packetUrl != tabUrl))
        httpHeader = rulesSetHelper.setCustomField(string.getRefererCustom(), myRuleObject.thirdPartyUserPref, httpHeader, pos);

    return httpHeader;
};