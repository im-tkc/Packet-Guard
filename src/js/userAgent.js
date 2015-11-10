function UserAgent() {}

userAgent=UserAgent.prototype;
userAgent.performUserAgentModification = function(requestHeaders, pos, tabUrl, packetUrl) {
    var USER_AGENT = string.getUserAgent();
    var newHeader = requestHeaders;
    
    if (requestHeaders[pos].name.toLowerCase() === string.getUserAgent()) {
        var userAgentBlock = string.getUserAgentBlock();
        var userAgentAllow = string.getUserAgentAllow();
        newHeader = rulesSetHelper.editBasedOnUserPref(requestHeaders, pos, tabUrl, packetUrl, USER_AGENT, userAgentBlock, userAgentAllow);
    }

    return newHeader;
};

userAgent.configureUserAgent = function(myRuleObject, userAgent, httpHeader, tabUrl, packetUrl, pos) {
    if ((myRuleObject.firstPartyUserPref == string.getUserAgentGeneric()) && (packetUrl == tabUrl) && !myRuleObject.isUserPrefUpdated) {
        httpHeader[pos].value = string.USER_AGENT_GENERIC_CHROME;
        myRuleObject.isUserPrefUpdated = true;
    }
    if ((myRuleObject.thirdPartyUserPref == string.getUserAgentGeneric()) && (packetUrl != tabUrl) && !myRuleObject.isUserPrefUpdated) {
        httpHeader[pos].value = string.USER_AGENT_GENERIC_CHROME;
        myRuleObject.isUserPrefUpdated = true;
    }

    if((!myRuleObject.isUserPrefUpdated) && (packetUrl == tabUrl))
        httpHeader = rulesSetHelper.setCustomField(string.getUserAgentCustom(), myRuleObject.firstPartyUserPref, httpHeader, pos);
    if((!myRuleObject.isUserPrefUpdated) && (packetUrl != tabUrl))
        httpHeader = rulesSetHelper.setCustomField(string.getUserAgentCustom(), myRuleObject.thirdPartyUserPref, httpHeader, pos);

    return httpHeader;
};