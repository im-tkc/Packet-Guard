$(function() {
    $('input.numeric').each(function() {
        $(this).numberOnly();
        $(this).getOriginalValueIfInvalid(resources.getClearCacheMins());
    });
});

$.fn.numberOnly = function() {
    $(this).focusout(function () {
        var value = $(this).val();
        var newValue = value.split(/[^\d]/)[0];
        $(this).val(newValue);
    });
};

$.fn.getOriginalValueIfInvalid = function(originalValue) {
    $(this).focusout(function () {
        if ($(this).val() == "") {
            $(this).val(originalValue);
        }
    });
}

function validateRulesSet(rulesSetArray) {
    var array = rulesSetArray;
    
    for (i=0; i < array.length; i++) {
        if (array[i].startsWith("#")) {
            continue;
        }

        ruleComponents = resources.splitEachRule(array[i]);
        if (array[i] && ruleComponents.length != string.RULE_LENGTH) {
            array.splice(i, 1);
        }

        var isValidRule = [false, false];
        var url = ruleComponents[string.RULE_URL_POS];
        if (url.match(/^(https?:\/\/)?[\S].*/)) {
            url = url.replace(/https?:\/\//g, "");
            url = url.replace(/\/.*$/g, "");

            ruleComponents[string.RULE_URL_POS] = url;
            array[i] = ruleComponents.join(" ");
            isValidRule[0] = true;
        }

        isValidRule[1] = validateUserOptionsAndType(ruleComponents);

        if (isValidRule.indexOf(false) != -1) {
            array.splice(i, 1);
        }
    }

    return array;
}

function validateUserOptionsAndType(ruleComponents) {
    var validRule = false;
    var userPrefType = ruleComponents[string.RULE_PREF_TYPE_POS];
    var userPref = ruleComponents[string.RULE_USER_PREF_POS];
    var supportedTypes = string.getSupportedTypes();
    var supportedOptions = string.getSupportedOptions();

    typeIndex = supportedTypes.indexOf(userPrefType);
    isValidPrefType = supportedTypes.indexOf(userPrefType) != -1;
    isValidUserPref = (supportedOptions[typeIndex].indexOf(userPref) != -1) 
            || (string.getUserAgentCustom().test(userPref));
    if (isValidPrefType && isValidUserPref) {
        validRule = true;
    }

    return validRule;
}

function checkIfGlobalRuleExist(rulesSetArray) {
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

    while (isGlobalRulesSet.indexOf(false) != -1) {
        var idx = isGlobalRulesSet.indexOf(false);
        var rule = [string.RULE_ANY_URL, supportedTypes[idx], string.DEFAULT_USER_PREF[idx]].join(" ");
        rulesSetArray.push(rule);
        isGlobalRulesSet[idx] = true;
    }

    return rulesSetArray;
}