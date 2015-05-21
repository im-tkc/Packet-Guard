function UserAgent() {}

userAgent=UserAgent.prototype;
userAgent.performUserAgentModification = function(requestHeaders, pos, url) {
    var USER_AGENT = string.getUserAgent();
    var newHeader = requestHeaders;
    
    if (requestHeaders[pos].name.toLowerCase() === string.getUserAgent()) {
        var userAgentBlock = string.getUserAgentBlock();
        var userAgentAllow = string.getUserAgentAllow();
        newHeader = resources.editBasedOnUserPref(requestHeaders, pos, url, USER_AGENT, userAgentBlock, userAgentAllow);
        newHeader = userAgent.configureUserAgent(USER_AGENT, newHeader, url, pos);
    }

    return newHeader;
}

userAgent.configureUserAgent = function(userAgent, httpHeader, url, pos) {
    var userPref = resources.getUserPref(url, userAgent);
    if (string.getUserAgentCustom().test(userPref)) {
        httpHeader[pos].value = userPref;
    } else if (string.getUserAgentGeneric().localeCompare(userPref) == 0) {
        httpHeader[pos].value = string.USER_AGENT_GENERIC_CHROME;
    }

    return httpHeader;
}