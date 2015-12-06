var imageCommitId = "img-isCommitted";
var imageCommit = "";
var committedImagePath = "ico/committed.png";

$(window).bind("load", function() {
    main();
});

function main() {
    imageCommit = document.getElementById(imageCommitId);
    document.querySelector("#" + imageCommitId).addEventListener('click', saveRule);
}

function saveRule() {
    if (imageCommit.getAttribute("src") !== committedImagePath) {
        var rulesSet = resources.getRulesSet();
        var supportedTypes = string.getSupportedTypes();

        var urlAndSelectedPartyLabel = document.getElementsByClassName("dd-selected-text")[0];
        var url = urlAndSelectedPartyLabel.innerHTML.split(" - ")[0]
        var selectedParty = urlAndSelectedPartyLabel.innerHTML.split(" - ")[1];

        rulesSet = removeOldRule(rulesSet, supportedTypes, url, selectedParty);
        rulesSet = addNewRule(rulesSet, supportedTypes, url, selectedParty);

        rulesSet = rulesSetHelper.compactRulesSet(rulesSet);
        rulesSet = rulesSetHelper.sortBasedOnUrl(rulesSet);
        rulesSet = rulesSetHelper.removeDuplicateRulesSet(rulesSet);
        resources.setRulesSet(rulesSet);

        setImageToCommitted();
    }
}

function removeOldRule(rulesSet, supportedTypes, url, selectedParty) {
    for (var i=0; i < rulesSet.length; i++) {
        if (!rulesSet[i].startsWith(url)) { continue; }

        for (var j=0; j < supportedTypes.length; j++) {
            var isAllPartiesRule = inputHelper.endsWith(rulesSet[i], string.getAllParties());
            var isFirstPartyRule = inputHelper.endsWith(rulesSet[i], string.getFirstParty());
            var isThirdPartyRule = inputHelper.endsWith(rulesSet[i], string.getThirdParty());

            var isSelectedAllParty = (selectedParty === string.getAllParties() 
                && (rulesSet[i].startsWith([url, supportedTypes[j]].join(" "))));
            var isSelectedFirstParty = (selectedParty === string.getFirstParty() 
                && (rulesSet[i].startsWith([url, supportedTypes[j]].join(" ")) 
                    && (isFirstPartyRule || isAllPartiesRule)));
            var isSelectedThirdParty = (selectedParty === string.getThirdParty() 
                && (rulesSet[i].startsWith([url, supportedTypes[j]].join(" ")) 
                    && (isThirdPartyRule || isAllPartiesRule)));

            if (isSelectedAllParty || isSelectedFirstParty || isSelectedThirdParty) {
                rulesSet.splice(i, 1);
                --i;
            }
        }
    }

    return rulesSet;
}

function addNewRule(rulesSet, supportedTypes, url, selectedParty){
    for (var i=0; i < supportedTypes.length; i++) {
        var prefType = inputHelper.capitalizeFirstXLetters(supportedTypes[i], 1);
        var userPref = $('input[name="radio-'+ prefType +'"]:checked').val();

        var rule = (supportedTypes[i] === string.getCookie()) 
                    ? [url, supportedTypes[i], userPref].join(" ")
                    : [url, supportedTypes[i], userPref, selectedParty].join(" ");
        rulesSet.push(rule);
    }

    return rulesSet;
}

function setImageToCommitted() {
    imageCommit.setAttribute("src", committedImagePath);
}