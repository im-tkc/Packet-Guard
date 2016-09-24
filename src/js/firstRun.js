chrome.runtime.onInstalled.addListener(function(details) {
    var rulesSet = resources.getRulesSet();

    if(details.reason == "install") { initialConfiguration(); }
    else if (details.reason == "update" && (details.previousVersion == "0.5" || details.previousVersion == "0.6")) { 
        rulesSet = updateRulesSetWithPartySupport();
    }
    
    showWebpage(details);
    checkAndUpdateGlobalRule(rulesSet);
});

function initialConfiguration() {
    resources.setClearCacheMins(120);
    resources.setClearCacheOnExit("true");
}

function updateRulesSetWithPartySupport() {
    var rulesSet = resources.getRulesSet();
    for (var i = 0; i < rulesSet.length; i++) {
        var rule = inputHelper.splitEachRule(rulesSet[i]);
        rule = rule.concat(string.getAllParties());
        rulesSet[i] = rule.join(" ");
    };

    return rulesSet;
}

function showWebpage(details) {
    var isExtensionUpdated = details.previousVersion != "0.6.2";
    if (details.reason == "install" || details.reason == "update" && isExtensionUpdated) {
        chrome.tabs.create({url: "https://github.com/im-tkc/Packet-Guard#packet-guard"});
    }
}

function checkAndUpdateGlobalRule(rulesSet) {
    rulesSet = rulesSetHelper.formatRuleSet(rulesSet);
    resources.setRulesSet(rulesSet);
}