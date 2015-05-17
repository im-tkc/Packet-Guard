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

resources.getUserPref = function(defaultUserPref, packetUrl, preferenceTermToCompare) {
    var rulesSet = this.getRulesSet();
    var userRefererPref = defaultUserPref;

    for (var i = (rulesSet.length - 1); i >= 0; i--) {
        rule = this.splitEachRule(rulesSet[i]);

        if (packetUrl.indexOf(rule[string.RULE_URL_POS]) != -1 
            && rule[string.RULE_PREF_TYPE_POS] == preferenceTermToCompare) {
            userRefererPref = rule[string.RULE_USER_PREF_POS];
            break;
        }
    }

    return userRefererPref;
}

resources.getDefaultUserPref = function(packetUrl, preferenceTermToCompare) {
    rulesSet = this.getRulesSet();
    userRefererPref = "";

    for (var i = 0; i < rulesSet.length; i++) {
        rule = this.splitEachRule(rulesSet[i]);
        if (rule[string.RULE_URL_POS] == string.RULE_ANY_URL && rule[string.RULE_PREF_TYPE_POS] == preferenceTermToCompare) {
            userRefererPref = rule[string.RULE_USER_PREF_POS];
            break;
        }
    }

    return userRefererPref;
}

resources.splitEachRule = function(array) {
    return array.match(/(?:[^\s"]+|"[^"]*")+/g);
}

resources.capitalizeFirstLetter = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
