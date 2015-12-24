function RuleSet() {}
rulesSetHelper = RuleSet.prototype;
rulesSetHelper.RULE_POS = 0;

rulesSetHelper.formatRuleSet = function(rulesSet) {
    rulesSet = rulesSetHelper.sanitizeRulesSet(rulesSet);
    var isGlobalRulesSet = rulesSetHelper.checkIfGlobalRuleExist(rulesSet);
    rulesSet = rulesSetHelper.addNeccessaryGlobalRule(isGlobalRulesSet, rulesSet);
    rulesSet = rulesSetHelper.updateUserPref(rulesSet);
    rulesSet = rulesSetHelper.sortBasedOnUrl(rulesSet);
    rulesSet = rulesSetHelper.removeDuplicateRulesSet(rulesSet);
    rulesSet = rulesSetHelper.compactRulesSet(rulesSet);
    
    return rulesSet;
};

rulesSetHelper.sanitizeRulesSet = function(rulesSetArray) {
    var array = rulesSetArray;
    
    for (var i=0; i < array.length; i++) {
        if (array[i].startsWith(string.RULE_COMMENTED)) { continue; }

        var ruleComponents = inputHelper.splitEachRule(array[i]);
        var isValidRuleLength = ruleComponents.length == string.RULE_LENGTH;
        var isCookieRule = (ruleComponents[string.RULE_PREF_TYPE_POS].indexOf(string.getCookie()) == 0) 
            && (ruleComponents.length == string.RULE_LENGTH - 1);
        if (array[i] && !(isValidRuleLength || isCookieRule)) { array.splice(i, 1); --i; continue; }
        
        var isValidRule = [false, false, false];
        var url = ruleComponents[string.RULE_URL_POS];
        if (url.match(/^(https?:\/\/)?[\S].*/)) {
            url = url.replace(/https?:\/\//g, "");
            url = url.replace(/\/.*$/g, "");

            ruleComponents[string.RULE_URL_POS] = url;
            array[i] = ruleComponents.join(" ");
            isValidRule[0] = true;
        }

        isValidRule[1] = this.validateUserOptionsAndType(ruleComponents);
        isValidRule[2] = this.validateWhichParty(isCookieRule, isValidRuleLength, ruleComponents);
        

        if (isValidRule.indexOf(false) != -1) { array.splice(i, 1); --i;}
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

rulesSetHelper.validateWhichParty = function(isCookieRule, isValidRuleLength, ruleComponents) {
    var validRule = false;
    if (isCookieRule || (isValidRuleLength 
        && string.getSupportedParties().indexOf(ruleComponents[string.RULE_WHICH_PARTY_POS]) != -1)) {
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
};

rulesSetHelper.addNeccessaryGlobalRule = function(isGlobalRulesSet, rulesSetArray) {
    var supportedTypes = string.getSupportedTypes();

    while (isGlobalRulesSet.indexOf(false) != -1) {
        var idx = isGlobalRulesSet.indexOf(false);
        var genericRule = [string.RULE_ANY_URL, supportedTypes[idx], string.DEFAULT_USER_PREF[idx], string.getAllParties()];
        var rule = (supportedTypes[idx] == string.getCookie()) 
                    ? genericRule.slice(0, genericRule.length - 1) 
                    : genericRule;

        rulesSetArray.push(rule.join(" "));
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

rulesSetHelper.updateUserPref = function(rulesSet) {
    var oldRulesSet = resources.getRulesSet();
    var newRules = inputHelper.diffArray(rulesSet, oldRulesSet);

    for (var i=0; i<newRules.length; i++) {
        var rule = inputHelper.splitEachRule(newRules[i]);
        var searchTerm = [rule[string.RULE_URL_POS], rule[string.RULE_PREF_TYPE_POS], rule[string.RULE_USER_PREF_POS]].join(" ");
        var searchResults = inputHelper.findMatchInArray(oldRulesSet, searchTerm);

        for (var j=0; j<searchResults.length; j++) {
            rulesSet = inputHelper.removeAllInstance(rulesSet, searchResults[j]);
            rulesSet = rulesSetHelper.changeToAllPartiesIfSameUserPref(searchResults[j], rule, i, rulesSet);
        }
    }

    return rulesSet;
};

rulesSetHelper.changeToAllPartiesIfSameUserPref = function(searchResult, newRule, newRulePos, rulesSet) {
    var oldRule = inputHelper.splitEachRule(searchResult);
    var ALL_PARTY_POS = string.getSupportedParties().indexOf(string.getAllParties());
    var isSameUserPref = newRule[string.RULE_USER_PREF_POS] == oldRule[string.RULE_USER_PREF_POS];
    var isDiffParty = string.getSupportedParties().indexOf(newRule[string.RULE_WHICH_PARTY_POS]) != ALL_PARTY_POS 
                        && string.getSupportedParties().indexOf(oldRule[string.RULE_WHICH_PARTY_POS]) != ALL_PARTY_POS;

    if (isSameUserPref && isDiffParty) {
        var posInRulesSet = rulesSet.indexOf(newRule.join(" "));
        newRule[string.RULE_WHICH_PARTY_POS] = string.getAllParties();
        rulesSet[posInRulesSet] = newRule.join(" ");
    }

    return rulesSet;
}

rulesSetHelper.compactRulesSet = function(rulesSet) {
    var globalRulesSetLessURL = rulesSetHelper.getGlobalRulesSet(rulesSet, true);
    var globalRulesSet = rulesSetHelper.getGlobalRulesSet(rulesSet, false);
    var rulesSetLessGlobal = rulesSet;

    for (var i = 0; i < globalRulesSetLessURL.length; i++) {
        rulesSetLessGlobal = rulesSetLessGlobal.filter(function(value, index, self) {
            var rule = inputHelper.splitEachRule(value);
            if (rule[string.RULE_URL_POS] === string.RULE_ANY_URL)
                return false; 
            else if (value.startsWith(string.RULE_COMMENTED))
                return true; 
            else {
                return rulesSetHelper.removeIfGlobalRuleMatchesPerSiteRule(globalRulesSetLessURL[i], value);
            }
        });
    }

    rulesSet = globalRulesSet.concat(rulesSetLessGlobal);
    return rulesSet;
}

rulesSetHelper.getGlobalRulesSet = function(rulesSet, isLessURL) {
    var globalRulesSet = [];
    for (var i=0; i < rulesSet.length; i++) {
        var rule = inputHelper.splitEachRule(rulesSet[i]);
        if (rule[string.RULE_URL_POS] === string.RULE_ANY_URL) {
            if (isLessURL) { rule.splice(string.RULE_URL_POS, 1); }
            globalRulesSet.push(rule.join(" "));
        } else if (rulesSet[i].startsWith(string.RULE_COMMENTED))
            continue;
        else
            break;
    }

    return globalRulesSet;
}

rulesSetHelper.removeIfGlobalRuleMatchesPerSiteRule = function(globalRuleLessURL, ruleLessGlobal) {
    var rule = inputHelper.splitEachRule(globalRuleLessURL);
    var ruleSubterm = globalRuleLessURL;
    var RULE_WHICH_PARTY_POS_LESS_URL = string.RULE_WHICH_PARTY_POS - 1
    if (rule[RULE_WHICH_PARTY_POS_LESS_URL] == string.getAllParties()) {
        rule.splice(RULE_WHICH_PARTY_POS_LESS_URL, 1);
        ruleSubterm = rule.join(" ");
    }

    return ruleLessGlobal.indexOf(ruleSubterm) == -1;
}


rulesSetHelper.editBasedOnUserPref = function(requestHeader, pos, visitUrl, packetUrl, rulePrefType, stringForBlock, stringForAllow) {
    var newHeader = requestHeader;
    var myRuleObject = rulesSetHelper.getRuleObject(visitUrl, rulePrefType);
    var isFirstPartyPacket = packetUrl == visitUrl;

    if (isFirstPartyPacket && !myRuleObject.isUserPrefUpdated) {
        if (myRuleObject.firstPartyUserPref == stringForBlock) {
            newHeader.splice(pos, 1);
            myRuleObject.isUserPrefUpdated = true;
        } else if (myRuleObject.firstPartyUserPref == stringForAllow) {
            myRuleObject.isUserPrefUpdated = true;
        }
    }

    if (!isFirstPartyPacket && !myRuleObject.isUserPrefUpdated) {
        if (myRuleObject.thirdPartyUserPref == stringForBlock) {
            newHeader.splice(pos, 1);
            myRuleObject.isUserPrefUpdated = true;
        } else if (myRuleObject.thirdPartyUserPref == stringForAllow) {
            myRuleObject.isUserPrefUpdated = true;
        }
    }

    if (rulePrefType.localeCompare(string.getUserAgent()) == 0)
        userAgent.configureUserAgent(myRuleObject, rulePrefType, newHeader, visitUrl, packetUrl, pos);
    else if (rulePrefType.localeCompare(string.getReferer()) == 0)
        hReferer.configureReferer(myRuleObject, rulePrefType, newHeader, visitUrl, packetUrl, pos);

    return newHeader;
};

rulesSetHelper.getRuleObject = function(visitUrl, rulePrefType) {
    var rulesSet = resources.getRulesSet();
    var myRuleObject = new RuleObject();

    for (var i = (rulesSet.length - 1); i >= 0; i--) {
        rule = inputHelper.splitEachRule(rulesSet[i]);

        if (rulesSetHelper.getIsVisitUrlOrAnyUrl(visitUrl, rule) && (rule[string.RULE_PREF_TYPE_POS] == rulePrefType)) {
            userPref = rule[string.RULE_USER_PREF_POS];
            userPartyPref = rule[string.RULE_WHICH_PARTY_POS];

            if ((userPartyPref == string.getFirstParty()) && !myRuleObject.isFirstPartyUserPrefSet) {
                myRuleObject.firstPartyUserPref = userPref;
                myRuleObject.isFirstPartyUserPrefSet = true;
            }
            if ((userPartyPref == string.getThirdParty()) && !myRuleObject.isThirdPartyUserPrefSet) {
                myRuleObject.thirdPartyUserPref = userPref;
                myRuleObject.isThirdPartyUserPrefSet = true;
            }
            if (userPartyPref == string.getAllParties()) {
                if (!myRuleObject.isFirstPartyUserPrefSet) {
                    myRuleObject.firstPartyUserPref = userPref;
                    myRuleObject.isFirstPartyUserPrefSet = true;
                }
                if (!myRuleObject.isThirdPartyUserPrefSet) {
                    myRuleObject.thirdPartyUserPref = userPref;
                    myRuleObject.isThirdPartyUserPrefSet = true;
                }
            }
        
            if (myRuleObject.isThirdPartyUserPrefSet && myRuleObject.isFirstPartyUserPrefSet) { break; }
                
        }
    }

    return myRuleObject;
};

rulesSetHelper.getCookieUserPref = function(visitUrl) {
    var rulesSet = resources.getRulesSet();
    var userPref = "";

    for (var i = (rulesSet.length - 1); i >= 0; i--) {
        var rule = inputHelper.splitEachRule(rulesSet[i]);
        
        if (rulesSetHelper.getIsVisitUrlOrAnyUrl(visitUrl, rule)
            && rule[string.RULE_PREF_TYPE_POS] == string.getCookie()) {
            userPref = rule[string.RULE_USER_PREF_POS];
            break;
        }
    }

    return userPref;
}

rulesSetHelper.getIsVisitUrlOrAnyUrl = function(visitUrl, rule) {
    return visitUrl.indexOf(rule[string.RULE_URL_POS]) != -1 || rule[string.RULE_URL_POS] == string.RULE_ANY_URL;
}

rulesSetHelper.setCustomField = function(regex, userPref, httpHeader, pos, myRuleObject) {
    if (regex.test(userPref)) {
        httpHeader[pos].value = userPref.substring(1, userPref.length - 1);
        myRuleObject.isUserPrefUpdated = true;
    }

    return httpHeader;
}