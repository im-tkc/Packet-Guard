var removeToListButtonId = "removeToList";
var addToListButtonId = "addToList";
var urlToExclude = "";

main()

function main() {
    chrome.tabs.query({active: true}, function(tabs) {
        var activeUrl = tabs[0].url;
        urlToExclude = activeUrl.replace(/^.*:\/\//g, '').split('/')[0];
        var urlHTMLTag = document.getElementById("activeUrl");
        urlHTMLTag.innerHTML = urlToExclude;
        
        // var domainsAllowed = getListOfAllowedDomains();
        // if(domainsAllowed && domainsAllowed.indexOf(urlToExclude) != -1) {
        //     showElement(removeToListButtonId);
        // } else {
        //     showElement(addToListButtonId);
        // }
    });
    document.addEventListener('DOMContentLoaded', generateButtons);
    // document.querySelector('#'+ addToListButtonId).addEventListener('click', addToList);
    // document.querySelector('#'+ removeToListButtonId).addEventListener('click', removeToList);
    // document.querySelector('#clearAllCookies').addEventListener('click', clearAllCookies);
}

function showElement(id) {
    var element = document.getElementById(id);
    element.style.display = "block";
}

function addToList() {
    var domainsAllowed = getListOfAllowedDomains();
    domainsAllowed.push(urlToExclude);
    setListOfAllowedDomains(domainsAllowed);
    hideAndShowButton(addToListButtonId, removeToListButtonId);
}

function removeToList() {
    var domainsAllowed = getListOfAllowedDomains();
    removeAllInstance(domainsAllowed, urlToExclude);
    setListOfAllowedDomains(domainsAllowed);
    hideAndShowButton(removeToListButtonId, addToListButtonId);
}

function removeAllInstance(array, item) {
    var i;
    while((i = array.indexOf(item)) !== -1) {
        array.splice(i, 1);
    }
}

function getListOfAllowedDomains() {
    var domainsAllowed = resources.getDomainsAllowed()
        ? resources.getDomainsAllowed().split(",")
        : [];
    return domainsAllowed;
}

function setListOfAllowedDomains(domainsAllowed) {
    sanitizedDomainsAllowed = domainsAllowed.filter(function(e){return e});
    resources.setDomainsAllowed(sanitizedDomainsAllowed);
}

function hideAndShowButton(elementIdToHide, elementIdToShow) {
    $("#" + elementIdToHide).hide("slow", function() {
        $("#" + elementIdToShow).show("slow");
    });
}

function clearAllCookies() {
    chrome.browsingData.removeCookies({});
    
    var cookieCleaner = new CookieCleaner();
    cookieCleaner.removeSiteData();
    
    var checkmarkHTMLTag = document.getElementById("checkmark");
    checkmarkHTMLTag.innerHTML = "&#10004;";
    setTimeout(function() {
        checkmarkHTMLTag.innerHTML = "";
    }, 1000);
}

function generateButtons() {
    var supportedTypes = string.getSupportedTypes();
    var supportedOptions = string.getSupportedOptions();
    var table = document.getElementById("table");

    for (var i=0; i < supportedTypes.length; i++) {
        var prefType = resources.capitalizeFirstXLetters(supportedTypes[i], 1);

        var row = table.insertRow(-1);
        var data1 = row.insertCell(-1);
        
        var legend = document.createElement("legend");
        legend.innerHTML = prefType
        data1.appendChild(legend);

        var data2 = row.insertCell(-1);
        for (var j=0; j < supportedOptions[i].length; j++) {
            if (supportedOptions[i][j].toString() !== string.getUserAgentCustom().toString()) {
                var userPref = resources.capitalizeFirstXLetters(supportedOptions[i][j], 1);
                var input = document.createElement("input");
                input.id = "radio-" + prefType + "-" + userPref;
                input.name = "radio-" + prefType;
                input.value = supportedOptions[i][j];
                input.type = "radio";

                var label = document.createElement("label");
                label.setAttribute("for", input.id);
                label.textContent = userPref;

                data2.appendChild(input);
                data2.appendChild(label);
            }
        }
        data1.setAttribute("style", "width: 20%;");
        data2.setAttribute("style", "width: 80%;");
    }
    applyInputStyles();
}

function applyInputStyles() {
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
