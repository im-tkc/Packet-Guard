var clearCacheField = "autoClearCacheField";
var checkBoxClearCacheOnExit = "clearCacheOnExitOption";
var rulesSetField = "rulesSet"

main();

function main() {
    document.addEventListener('DOMContentLoaded', restoreGeneralSettings);
    document.querySelector('#saveGeneralSettingsButton').addEventListener('click', saveGeneralSettings);

    document.addEventListener('DOMContentLoaded', restoreRulesSet);
    document.querySelector('#saveRulesSetButton').addEventListener('click', saveRulesSet);

    document.querySelector('#importSettingButton').addEventListener('click', importSettings);
    document.querySelector('#exportSettingButton').addEventListener('click', exportSettings);
}

function restoreGeneralSettings() {
    var clearCacheMins = resources.getClearCacheMins();

    if (clearCacheMins) {
        setValueById(clearCacheField, clearCacheMins);
    }
    
    if (checkBoxClearCacheOnExit) {
        setIsChecked(checkBoxClearCacheOnExit, resources.getClearCacheOnExit());
    }
}

function saveGeneralSettings() {
    resources.setClearCacheMins(getValueById(clearCacheField));
    resources.setClearCacheOnExit(getIsChecked(checkBoxClearCacheOnExit));

    cacheCleaner.createTimer(parseInt(resources.getClearCacheMins()));
    visualFeedback("generalSettingStatusDiv");
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
    
    rulesSet = rulesSetHelper.formatRuleSet(rulesSet);
    
    setValueById(rulesSetField, rulesSet.join("\n"));
    resources.setRulesSet(rulesSet);

    visualFeedback("rulesSetStatusDiv");
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

function importSettings() {
    var idInputFileButton = "importSettingInputFile";
    document.getElementById(idInputFileButton).accept = "text/*";
    $("#" + idInputFileButton).trigger("click");
    document.getElementById(idInputFileButton).addEventListener('change', uploadFiles, false);
}

function uploadFiles(evt) {
    var file = evt.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) { 
            var contents = e.target.result;
            try {
                var obj = JSON.parse(contents);

                var clearCacheMins = obj["clearCacheField"];
                var clearCacheOnExit = obj["checkBoxClearCacheOnExit"];
                var rulesSet = obj["rulesSetField"];

                var isValid = validateImportedData(clearCacheMins, clearCacheOnExit);
                rulesSet = rulesSetHelper.formatRuleSet(rulesSet);
                
                if (isValid) {
                    resources.setClearCacheMins(clearCacheMins);
                    resources.setClearCacheOnExit(clearCacheOnExit);
                    resources.setRulesSet(rulesSet);

                    cacheCleaner.createTimer(parseInt(resources.getClearCacheMins()));
                    location.reload();
                }
            } catch (e) {
                alert("This is not a valid backup file. Please try again.");
                document.getElementById(evt.srcElement.id).value = "";
            } 

        }
        reader.readAsText(file);
    }
}

function exportSettings() {
    var clearCacheMins = resources.getClearCacheMins();
    var clearCacheOnExit = resources.getClearCacheOnExit();
    var rulesSet = resources.getRulesSet();

    var obj = new Object();
    obj.clearCacheField = clearCacheMins;
    obj.checkBoxClearCacheOnExit = clearCacheOnExit;
    obj.rulesSetField = rulesSet;

    var jsonData = JSON.stringify(obj);
    var url = 'data:text/x-json;base64,' + btoa(jsonData);
    chrome.downloads.download({
        url: url,
        filename: 'cookieCleaner-all-data.txt'
    });
}

function visualFeedback(elementId) {
    // Update status to let user know options were saved.
    var status = document.getElementById(elementId);
    status.innerHTML = "Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}