chrome.runtime.onInstalled.addListener(function(details) {
    var rulesSet = [];
    if(details.reason == "install") { initialConfiguration(); }
    else if (details.reason == "update") { rulesSet = updateConfiguration(); }

    checkAndUpdateGlobalRule(rulesSet);    
});

function initialConfiguration() {
    resources.setClearCacheMins(120);
    resources.setClearCacheOnExit("true");
}

function updateConfiguration() {
    var rulesSet = resources.getRulesSet();
    for (var i = 0; i < rulesSet.length - 1; i++) {
        var rule = inputHelper.splitEachRule(rulesSet[i]);
        rule.concat(string.getAllParties());
        rulesSet[i] = rule.join(" ");
    };

    return rulesSet;
}

function checkAndUpdateGlobalRule(rulesSet) {
    var isGlobalRulesSet = rulesSetHelper.checkIfGlobalRuleExist(rulesSet);
    rulesSetHelper.addNeccessaryGlobalRule(isGlobalRulesSet, rulesSet);
    resources.setRulesSet(rulesSet);
}