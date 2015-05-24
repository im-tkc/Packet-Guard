clearCacheField = "autoClearCacheField";
clearCacheOnExit = "clearCacheOnExitOption";
rulesSetField = "rulesSet"

main();

function main() {
    document.addEventListener('DOMContentLoaded', restoreGeneralSettings);
    document.querySelector('#saveGeneralSettingsButton').addEventListener('click', saveGeneralSettings);

    document.addEventListener('DOMContentLoaded', restoreRulesSet);
    document.querySelector('#saveRulesSetButton').addEventListener('click', saveRulesSet);
}

function restoreGeneralSettings() {
    var clearCacheMins = resources.getClearCacheMins();

    if (clearCacheMins) {
        setValueById(clearCacheField, clearCacheMins);
    }
    
    if (clearCacheOnExit) {
        setIsChecked(clearCacheOnExit, resources.getClearCacheOnExit());
    }
}

function saveGeneralSettings() {
    resources.setClearCacheMins(getValueById(clearCacheField));
    resources.setClearCacheOnExit(getIsChecked(clearCacheOnExit));

    cacheCleaner.createTimer(parseInt(resources.getClearCacheMins()));
    visualFeedback("statusPrivacy");
}

function restoreRulesSet() {
    var rulesSet = resources.getRulesSet().join("\n");
    if (rulesSet) {
        setValueById(rulesSetField, rulesSet);
    }
}

function saveRulesSet() {
    var rulesSet = getValueById(rulesSetField).split("\n");
    rulesSet = rulesSet.filter(function(e){return e});
    
    rulesSet = validateRulesSet(rulesSet);
    rulesSet = resources.sortBasedOnUrl(rulesSet);
    rulesSet = rulesSet.filter(function(value, index, self) { 
        return self.indexOf(value) === index;
    });
    
    setValueById(rulesSetField, rulesSet.join("\n"));
    resources.setRulesSet(rulesSet);

    visualFeedback("statusWhitelist");
}

function getValueById(elementId) {
    var element = document.getElementById(elementId);
    return element.value;
}

function setValueById(elementId, value) {
    var element = document.getElementById(elementId);
    element.value = value;
}

function getIsChecked(elementId) {
    return document.getElementById(elementId).checked;
}

function setIsChecked(elementId, value) {
    document.getElementById(elementId).checked = (value == "true");
}

function visualFeedback(elementId) {
    // Update status to let user know options were saved.
    var status = document.getElementById(elementId);
    status.innerHTML = "Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}