domainsLocalStorageName = "domainsAllowed";
clearCacheMinsStorageName = "clearCacheMins";
clearCacheOnExitStorageName = "clearCacheOnExit";
httpRefererStorageName = "httpReferer";
rulesSetName = "rulesSet"

function Resource() {}
resources = Resource.prototype;

resources.getDomainsAllowed = function() {
    return localStorage[domainsLocalStorageName];
}

resources.setDomainsAllowed = function(value) {
    localStorage[domainsLocalStorageName] = value;
}

resources.getClearCacheMins = function() {
    return localStorage[clearCacheMinsStorageName];
}

resources.setClearCacheMins = function(value) {
    localStorage[clearCacheMinsStorageName] = value;
}

resources.getClearCacheOnExit = function() {
    return localStorage[clearCacheOnExitStorageName];
}

resources.setClearCacheOnExit = function(value) {
    localStorage[clearCacheOnExitStorageName] = value;
}

resources.getHttpReferer = function() {
    return localStorage[httpRefererStorageName];
}

resources.setHttpReferer = function(value) {
    localStorage[httpRefererStorageName] = value;
}

resources.getRulesSet = function() {
	return localStorage[rulesSetName].split(",");
}

resources.setRulesSet = function(value) {
	localStorage[rulesSetName] = value
}

resources.sortBasedOnUrl = function(array){
    array1 = this.reverseRuleUrl(array);
    newArray = array1.sort();
    return this.reverseRuleUrl(newArray);
}

resources.reverseRuleUrl = function(array) {
    array1 = array
    for (var i = 0; i < array.length; i++) {
        rule = this.splitEachRule(array[i]);
        tmpUrl = rule[0].split("").reverse().join("");
        rule[0] = tmpUrl;
        array1[i] = rule.join(" ");
    }

    return array1;
}

resources.editBasedOnUserPref = function(requestHeader, pos, packetUrl, rulePrefType, stringForBlock, stringForAllow) {
    var newHeader = requestHeader;
    var userPref = this.getUserPref(packetUrl, rulePrefType);
    switch (userPref) {
        case stringForBlock:
            newHeader.splice(pos, 1);
            break;
        case stringForAllow:
            break;
        default:
            break;
    }
    
    return newHeader;
}

resources.getUserPref = function(packetUrl, rulePrefType) {
    rulesSet = resources.getRulesSet();
    userPref = resources.getDefaultUserPref(packetUrl, rulePrefType);

    for (var i = (rulesSet.length - 1); i >= 0; i--) {
        rule = this.splitEachRule(rulesSet[i]);

        if (packetUrl.indexOf(rule[string.RULE_URL_POS]) != -1 
            && rule[string.RULE_PREF_TYPE_POS] == rulePrefType) {
            userPref = rule[string.RULE_USER_PREF_POS];
            break;
        }
    }

    return userPref;
}

resources.getDefaultUserPref = function(packetUrl, rulePrefType) {
    rulesSet = this.getRulesSet();
    userPref = "";

    for (var i = 0; i < rulesSet.length; i++) {
        rule = this.splitEachRule(rulesSet[i]);
        if (rule[string.RULE_URL_POS] == string.RULE_ANY_URL && rule[string.RULE_PREF_TYPE_POS] == rulePrefType) {
            userPref = rule[string.RULE_USER_PREF_POS];
            break;
        }
    }

    return userPref;
}

resources.splitEachRule = function(array) {
    return array.match(/(?:[^\s"]+|"[^"]*")+/g);
}

resources.capitalizeFirstXLetters = function(string, firstXNumber) {
    return string.substring(0, firstXNumber).toUpperCase() + string.slice(firstXNumber);
}