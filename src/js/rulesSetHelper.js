function RuleSet() {}
rulesSetHelper = RuleSet.prototype;

rulesSetHelper.formatRuleSet = function(rulesSet) {
    var rulesSet = this.sanitizeRulesSet(rulesSet);
    var isGlobalRulesSet = this.checkIfGlobalRuleExist(rulesSet);
    rulesSet = this.addNeccessaryGlobalRule(isGlobalRulesSet, rulesSet);
    rulesSet = resources.sortBasedOnUrl(rulesSet);
    rulesSet = resources.removeDuplicateRulesSet(rulesSet);

    return rulesSet;
}

rulesSetHelper.sanitizeRulesSet = function(rulesSetArray) {
    var array = rulesSetArray;
    
    for (i=0; i < array.length; i++) {
        if (array[i].startsWith("#")) { continue; }

        ruleComponents = resources.splitEachRule(array[i]);
        if (array[i] && ruleComponents.length != string.RULE_LENGTH) { array.splice(i, 1); }

        var isValidRule = [false, false];
        var url = ruleComponents[string.RULE_URL_POS];
        if (url.match(/^(https?:\/\/)?[\S].*/)) {
            url = url.replace(/https?:\/\//g, "");
            url = url.replace(/\/.*$/g, "");

            ruleComponents[string.RULE_URL_POS] = url;
            array[i] = ruleComponents.join(" ");
            isValidRule[0] = true;
        }

        isValidRule[1] = this.validateUserOptionsAndType(ruleComponents);

        if (isValidRule.indexOf(false) != -1) { array.splice(i, 1); }
    }

    return array;
}

rulesSetHelper.validateUserOptionsAndType = function(ruleComponents) {
    var validRule = false;
    var userPrefType = ruleComponents[string.RULE_PREF_TYPE_POS];
    var userPref = ruleComponents[string.RULE_USER_PREF_POS];
    var supportedTypes = string.getSupportedTypes();
    var supportedOptions = string.getSupportedOptions();

    typeIndex = supportedTypes.indexOf(userPrefType);
    isValidPrefType = supportedTypes.indexOf(userPrefType) != -1;
    isValidUserPref = (typeIndex == -1) 
            ? false
            : (supportedOptions[typeIndex].indexOf(userPref) != -1) 
                || (string.getUserAgentCustom().test(userPref));
    if (isValidPrefType && isValidUserPref) {
        validRule = true;
    }

    return validRule;
}

rulesSetHelper.checkIfGlobalRuleExist = function(rulesSetArray) {
    var isGlobalRulesSet = [false, false, false, false];
    var supportedTypes = string.getSupportedTypes();

    for (var i=0; i < rulesSetArray.length; i++) {
        for (var j=0; j < supportedTypes.length; j++) {
            if (rulesSetArray[i].startsWith([string.RULE_ANY_URL, supportedTypes[j]].join(" ")))
                isGlobalRulesSet[j] = true;
            if (isGlobalRulesSet.indexOf(false) == -1)
                break;
        }
    }

    return isGlobalRulesSet;
}

rulesSetHelper.addNeccessaryGlobalRule = function(isGlobalRulesSet, rulesSetArray) {
    var supportedTypes = string.getSupportedTypes();

    while (isGlobalRulesSet.indexOf(false) != -1) {
        var idx = isGlobalRulesSet.indexOf(false);
        var rule = [string.RULE_ANY_URL, supportedTypes[idx], string.DEFAULT_USER_PREF[idx]].join(" ");
        rulesSetArray.push(rule);
        isGlobalRulesSet[idx] = true;
    }

    return rulesSetArray;
}
