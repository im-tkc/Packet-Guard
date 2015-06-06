chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
        resources.setClearCacheMins(120);
        resources.setClearCacheOnExit("true");

        var rulesSet = [];
        var isGlobalRulesSet = rulesSetHelper.checkIfGlobalRuleExist(rulesSet);
        rulesSetHelper.addNeccessaryGlobalRule(isGlobalRulesSet, rulesSet);
        resources.setRulesSet(rulesSet);
    }
});