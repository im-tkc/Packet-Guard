function RuleSet() {}
rulesSetHelper = RuleSet.prototype;

rulesSetHelper.formatRuleSet = function(rulesSet) {
    rulesSet = rulesSetHelper.sanitizeRulesSet(rulesSet);
    var isGlobalRulesSet = rulesSetHelper.checkIfGlobalRuleExist(rulesSet);
    rulesSet = rulesSetHelper.addNeccessaryGlobalRule(isGlobalRulesSet, rulesSet);
    rulesSet = rulesSetHelper.sortBasedOnUrl(rulesSet);
    rulesSet = rulesSetHelper.removeDuplicateRulesSet(rulesSet);

    return rulesSet;
};

rulesSetHelper.sanitizeRulesSet = function(rulesSetArray) {
    var array = rulesSetArray;
    
    for (var i=0; i < array.length; i++) {
        if (array[i].startsWith("#")) { continue; }

        ruleComponents = inputHelper.splitEachRule(array[i]);
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
};

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
};

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
};

rulesSetHelper.addNeccessaryGlobalRule = function(isGlobalRulesSet, rulesSetArray) {
    var supportedTypes = string.getSupportedTypes();

    while (isGlobalRulesSet.indexOf(false) != -1) {
        var idx = isGlobalRulesSet.indexOf(false);
        var rule = [string.RULE_ANY_URL, supportedTypes[idx], string.DEFAULT_USER_PREF[idx]].join(" ");
        rulesSetArray.push(rule);
        isGlobalRulesSet[idx] = true;
    }

    return rulesSetArray;
};


rulesSetHelper.sortBasedOnUrl = function(array){
    array1 = rulesSetHelper.reverseRuleUrl(array);
    newArray = array1.sort();
    return rulesSetHelper.reverseRuleUrl(newArray);
};

rulesSetHelper.reverseRuleUrl = function(array) {
    array1 = array;
    for (var i = 0; i < array.length; i++) {
        rule = inputHelper.splitEachRule(array[i]);
        tmpUrl = rule[0].split("").reverse().join("");
        rule[0] = tmpUrl;
        array1[i] = rule.join(" ");
    }

    return array1;
};

rulesSetHelper.removeDuplicateRulesSet = function(rulesSet) {
    return rulesSet.filter(function(value, index, self) { 
        return self.indexOf(value) === index;
    });
};

rulesSetHelper.editBasedOnUserPref = function(requestHeader, pos, visitUrl, rulePrefType, stringForBlock, stringForAllow) {
    var newHeader = requestHeader;
    var userPref = rulesSetHelper.getUserPref(visitUrl, rulePrefType);
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
};

rulesSetHelper.getUserPref = function(visitUrl, rulePrefType) {
    rulesSet = resources.getRulesSet();
    userPref = rulesSetHelper.getDefaultUserPref(rulePrefType);

    for (var i = (rulesSet.length - 1); i >= 0; i--) {
        rule = inputHelper.splitEachRule(rulesSet[i]);

        if (visitUrl.indexOf(rule[string.RULE_URL_POS]) != -1 
            && rule[string.RULE_PREF_TYPE_POS] == rulePrefType) {
            userPref = rule[string.RULE_USER_PREF_POS];
            break;
        }
    }

    return userPref;
};

rulesSetHelper.getDefaultUserPref = function(rulePrefType) {
    rulesSet = resources.getRulesSet();
    userPref = "";

    for (var i = 0; i < rulesSet.length; i++) {
        rule = inputHelper.splitEachRule(rulesSet[i]);
        if (rule[string.RULE_URL_POS] == string.RULE_ANY_URL && rule[string.RULE_PREF_TYPE_POS] == rulePrefType) {
            userPref = rule[string.RULE_USER_PREF_POS];
            break;
        }
    }

    return userPref;
};