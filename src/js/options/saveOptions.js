var clearCacheField = "autoClearCacheField";
var checkBoxClearCacheOnExit = "clearCacheOnExitOption";
var rulesSetField = "rulesSet";
var savedNotification = "Options saved";

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
    visualFeedback("notice", savedNotification);
}

function restoreRulesSet() {
    var rulesSet = resources.getRulesSet().join("\n");
    if (rulesSet) {
        setValueById(rulesSetField, rulesSet);
    }
}

function saveRulesSet() {
    var rulesSet = getValueById(rulesSetField).split("\n");
    rulesSet = rulesSet.filter(function(e){return e;});
    
    rulesSet = rulesSetHelper.formatRuleSet(rulesSet);
    
    setValueById(rulesSetField, rulesSet.join("\n"));
    resources.setRulesSet(rulesSet);

    visualFeedback("notice", savedNotification);
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
                var promptMsg = "Are you sure you want to override existing data with imported data? "
                            + "The extension will restart after you have selected 'OK'.";

                if (isValid) {
                    $.Zebra_Dialog(promptMsg, {
                        'type':     'question',
                        'title':    'Overwritting existing data?',
                        'buttons':  [
                                        {caption: 'Yes', callback: function() {
                                            overrideData(clearCacheMins, clearCacheOnExit, rulesSet)
                                        }},
                                        {caption: 'No', callback: function() {}},
                                    ]
                    });
                } else {
                    throw "Invalid file";
                }
            } catch (e) {
                visualFeedback("error", "This is not a valid backup file. Please try again.");
            }

            document.getElementById(evt.srcElement.id).value = "";
        };
        reader.readAsText(file);
    }
}

function overrideData(clearCacheMins, clearCacheOnExit, rulesSet) {
    resources.setClearCacheMins(clearCacheMins);
    resources.setClearCacheOnExit(clearCacheOnExit);
    resources.setRulesSet(rulesSet);
    
    chrome.runtime.reload();
    window.close();
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
        filename: 'packetGuard-all-data.txt'
    });
}

function visualFeedback(msgType, msg, title) {
    title = (typeof title === "undefined") ? msg : title;
    switch(msgType.toLowerCase()) {
        case "notice":
            $.growl.notice({ message: msg});
            break;
        case "warning":
            $.growl.warning({message: msg});
            break;
        case "error":
            $.growl.error({message: msg});
            break;
        default:
            $.growl({ title: title, message: "The kitten is awake!" });
            break;
    }
}