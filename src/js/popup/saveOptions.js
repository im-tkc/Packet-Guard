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

        rulesSet = updateOldRule(rulesSet, supportedTypes, url, selectedParty);
        rulesSet = addNewRule(rulesSet, supportedTypes, url, selectedParty);

        rulesSet = rulesSetHelper.updateUserPref(rulesSet);
        rulesSet = rulesSetHelper.compactRulesSet(rulesSet);
        rulesSet = rulesSetHelper.sortBasedOnUrl(rulesSet);
        rulesSet = rulesSetHelper.removeDuplicateRulesSet(rulesSet);
        resources.setRulesSet(rulesSet);

        setImageToCommitted();
    }
}

function updateOldRule(rulesSet, supportedTypes, url, selectedParty) {
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
                    && isFirstPartyRule));
            var isSelectedThirdParty = (selectedParty === string.getThirdParty() 
                && (rulesSet[i].startsWith([url, supportedTypes[j]].join(" ")) 
                    && isThirdPartyRule));

            var isSelectedFirstPartyButAllPartiesRule = (selectedParty === string.getFirstParty() 
                && (rulesSet[i].startsWith([url, supportedTypes[j]].join(" ")) 
                    && isAllPartiesRule));
            var isSelectedThirdPartyButAllPartiesRule = (selectedParty === string.getThirdParty() 
                && (rulesSet[i].startsWith([url, supportedTypes[j]].join(" ")) 
                    && isAllPartiesRule));

            var prefType = inputHelper.capitalizeFirstXLetters(supportedTypes[j], 1);
            var userPref = $('input[name="radio-'+ prefType +'"]:checked').val();
            if ((isSelectedAllParty || isSelectedFirstParty || isSelectedThirdParty) && userPref != undefined) {
                rulesSet.splice(i, 1);
                --i;
            } else if ((isSelectedFirstPartyButAllPartiesRule || isSelectedThirdPartyButAllPartiesRule) && userPref != undefined) {
                var rule = inputHelper.splitEachRule(rulesSet[i]);
                rule[string.RULE_WHICH_PARTY_POS] = (isSelectedFirstPartyButAllPartiesRule) ? string.getThirdParty() : string.getFirstParty();
                rulesSet[i] = rule.join(" ");
            }
        }
    }

    return rulesSet;
}

function addNewRule(rulesSet, supportedTypes, url, selectedParty){
    for (var i=0; i < supportedTypes.length; i++) {
        var prefType = inputHelper.capitalizeFirstXLetters(supportedTypes[i], 1);
        var userPref = $('input[name="radio-'+ prefType +'"]:checked').val();

        if (userPref != undefined) {
            var rule = (supportedTypes[i] === string.getCookie()) 
                        ? [url, supportedTypes[i], userPref].join(" ")
                        : [url, supportedTypes[i], userPref, selectedParty].join(" ");
            rulesSet.push(rule);
        }
    }

    return rulesSet;
}

function setImageToCommitted() {
    imageCommit.setAttribute("src", committedImagePath);
}