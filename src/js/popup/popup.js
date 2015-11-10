var removeToListButtonId = "removeToList";
var addToListButtonId = "addToList";
var urlToExclude = "";
var imageCommitId = "img-isCommitted";

main();

function main() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeUrl = tabs[0].url;
    
        var visitUrl = inputHelper.getDomainOnly(activeUrl);
        var urlHTMLTag = document.getElementById("activeUrl");
        urlHTMLTag.innerHTML = visitUrl;
        
        var isOpera = (navigator.userAgent.indexOf("OPR") != -1);
        var isWebstore = ((activeUrl.startsWith(string.CHROME_WEBSTORE) && !isOpera)
            || (activeUrl.startsWith(string.OPERA_WEBSTORE) && isOpera));
        var isInternalUrl = (isWebstore || string.INTERNAL_URL.test(activeUrl))
                            ? true
                            : false;

        generateFields(visitUrl, isInternalUrl); 
    });
}

function generateFields(visitUrl, isInternalUrl) {
    var supportedTypes = string.getSupportedTypes();
    var supportedOptions = string.getSupportedOptions();
    var table = document.getElementById("table");

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
    $('input').each(function(){
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

function checkRadioBasedOnRule(visitUrl, supportedTypes) {
    for (var i = 0; i < supportedTypes.length; i++) {
        userPref = rulesSetHelper.getUserPref(visitUrl, supportedTypes[i]);
        if (!string.getUserAgentCustom().test(userPref))
            $('input#radio-' + supportedTypes[i] + "-" + userPref).iCheck('check');
    }
}

function createButtonEventHandler() {
    $('input').on('ifChanged', function(event){
        var imgCommit = document.getElementById(imageCommitId);
        imgCommit.setAttribute("src", "ico/uncommitted.png");
    });
}