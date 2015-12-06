var urlToExclude = "";
var imageCommitId = "img-isCommitted";
var imageOpenOptionsId = "img-openOptions";
var imageRefreshId = "img-refresh";

main();

function main() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeUrl = tabs[0].url;
    
        var visitUrl = inputHelper.getDomainOnly(activeUrl);
        var isOpera = (navigator.userAgent.indexOf("OPR") != -1);
        var isWebstore = ((activeUrl.startsWith(string.CHROME_WEBSTORE) && !isOpera)
            || (activeUrl.startsWith(string.OPERA_WEBSTORE) && isOpera));
        var isInternalUrl = (isWebstore || string.INTERNAL_URL.test(activeUrl))
                            ? true
                            : false;

        generateURLOptions(visitUrl);
        generateFields(visitUrl, isInternalUrl); 
    });

    document.querySelector("#" + imageOpenOptionsId).addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });

    document.querySelector("#" + imageRefreshId).addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            chrome.tabs.reload(arrayOfTabs[0].id);
        });
    });
}

function generateURLOptions(visitUrl) {
    var counter = 0;
    var urlOptionsList = new Array();
    for (var i=0; i < string.getSupportedParties().length; i++) {
        var  urlOption = generateURLOption(visitUrl, i);
        urlOptionsList.push(urlOption);
    }

    var jsonArray = JSON.parse(JSON.stringify(urlOptionsList));
    var supportedTypes = string.getSupportedTypes();
    $('#urlOptions').ddslick({
        data: jsonArray,
        defaultSelectedIndex: string.getSupportedParties().length - 1,
        width: 200,
        onSelected: function(data) { resetRadio(visitUrl, supportedTypes); }
    });
}

function generateURLOption(visitUrl, counter) {
    var jsonObject = new Object();
    jsonObject.text = visitUrl + " - " + string.getSupportedParties()[counter];
    jsonObject.value = counter + 1;

    return jsonObject;
}

function generateFields(visitUrl, isInternalUrl) {
    var supportedTypes = string.getSupportedTypes();
    var supportedOptions = string.getSupportedOptions();
    var table = document.getElementById("table");
    table.id = "prefType-table";

    for (var i=0; i < supportedTypes.length; i++) {
        var prefType = inputHelper.capitalizeFirstXLetters(supportedTypes[i], 1);
        var row = table.insertRow(-1);
        generateLabelColumn(prefType, row);
        generateOptionsColumn(prefType, row, supportedOptions, i);
    }
    
    applyInputStyles(isInternalUrl);
    checkRadioBasedOnRule(visitUrl, supportedTypes);
    createButtonEventHandler();
}

function generateLabelColumn(prefType, row) {
    var data1 = row.insertCell(-1);
    
    var legend = document.createElement("legend");
    legend.innerHTML = prefType;
    data1.appendChild(legend);

    data1.setAttribute("style", "width: 20%;");
}

function generateOptionsColumn(prefType, row, supportedOptions, idx) {
    var data2 = row.insertCell(-1);
    for (var j=0; j < supportedOptions[idx].length; j++) {
        if (supportedOptions[idx][j].toString() !== string.getUserAgentCustom().toString()) {
            var userPref = inputHelper.capitalizeFirstXLetters(supportedOptions[idx][j], 1);
            var input = document.createElement("input");
            input.id = "radio-" + prefType + "-" + userPref;
            input.name = "radio-" + prefType;
            input.value = supportedOptions[idx][j];
            input.type = "radio";

            var label = document.createElement("label");
            label.setAttribute("for", input.id);
            label.textContent = userPref;

            data2.appendChild(input);
            data2.appendChild(label);
        }
    }
    data2.setAttribute("style", "width: 80%;");
}

function applyInputStyles(isInternalUrl) {
    styleColour = "green";
    $('#prefType-table input[type="radio"]').each(function(){
        var self = $(this),
        label = self.next(),
        label_text = label.text();
        label.remove();
        self.iCheck({
            checkboxClass: 'icheckbox_line-' + styleColour,
            radioClass: 'iradio_line-' + styleColour,
            insert: '<div class="icheck_line-icon"></div>' + label_text
        });

        if(isInternalUrl) { self.iCheck('disable'); }

    });

    var listOfRadioButtons = document.getElementsByClassName("iradio_line-" + styleColour);
    for (var i=0; i < listOfRadioButtons.length; i++) {
        listOfRadioButtons[i].setAttribute("style", "\
            float: left;\
            width: initial;\
            margin-left: 5px;\
        ");
    }
}

function resetRadio(visitUrl, supportedTypes) {
    unbindCreateButtonEventHandler();
    clearAllCheckedRadio();
    checkRadioBasedOnRule(visitUrl, supportedTypes);
    createButtonEventHandler();
}

function unbindCreateButtonEventHandler() {
    $('#prefType-table input[type="radio"]').off('ifToggled');
}

function clearAllCheckedRadio() {
    $('#prefType-table input[type="radio"]').each(function(){
        $(this).iCheck("uncheck");
    });
}

function checkRadioBasedOnRule(visitUrl, supportedTypes) {
    for (var i = 0; i < supportedTypes.length; i++) {
        var ruleObject = rulesSetHelper.getRuleObject(visitUrl, supportedTypes[i]);

        var urlAndSelectedPartyLabel = document.getElementsByClassName("dd-selected-text")[0];
        var selectedParty = urlAndSelectedPartyLabel.innerHTML.split(" - ")[1];

        var isAllPartiesUserPrefSame = (ruleObject.firstPartyUserPref === ruleObject.thirdPartyUserPref) 
                                        && selectedParty == string.getAllParties();
        var isFirstPartiesUserPref = selectedParty == string.getFirstParty();
        var isThirdPartiesUserPref = selectedParty == string.getThirdParty();

        if (supportedTypes[i] === string.getCookie()) {
            var userPref = rulesSetHelper.getCookieUserPref(visitUrl);
            $('input#radio-' + supportedTypes[i] + "-" + userPref).iCheck('check');
        }

        if ((isAllPartiesUserPrefSame || isFirstPartiesUserPref) && !string.getUserAgentCustom().test(userPref)) {
            $('input#radio-' + supportedTypes[i] + "-" + ruleObject.firstPartyUserPref).iCheck('check');
        } else if (isThirdPartiesUserPref && !string.getUserAgentCustom().test(userPref)) {
            $('input#radio-' + supportedTypes[i] + "-" + ruleObject.thirdPartyUserPref).iCheck('check');
        }
    }
}

function createButtonEventHandler() {
    $('#prefType-table input[type="radio"]').on('ifToggled', function(event){
        var imgCommit = document.getElementById(imageCommitId);
        imgCommit.setAttribute("src", "ico/uncommitted.png");
    });
}