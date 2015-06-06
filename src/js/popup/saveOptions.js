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
        var url = document.getElementById("activeUrl").innerHTML;

        rulesSet = removeOldRule(rulesSet, supportedTypes, url);
        rulesSet = addNewRule(rulesSet, supportedTypes, url);

        rulesSet = rulesSetHelper.sortBasedOnUrl(rulesSet);
        rulesSet = rulesSetHelper.removeDuplicateRulesSet(rulesSet);
        resources.setRulesSet(rulesSet);

        setImageToCommitted();
    }
}

function removeOldRule(rulesSet, supportedTypes, url) {
    for (var i=0; i < rulesSet.length; i++) {
        for (var j=0; j < supportedTypes.length; j++) {
            if (rulesSet[i].startsWith([url, supportedTypes[j]].join(" "))) {
                rulesSet.splice(i, 1);
                --i;
            }
        }
    }

    return rulesSet;
}

function addNewRule(rulesSet, supportedTypes, url){
    for (var i=0; i < supportedTypes.length; i++) {
        var prefType = inputHelper.capitalizeFirstXLetters(supportedTypes[i], 1);
        var userPref = $('input[name="radio-'+ prefType +'"]:checked').val();
        var rule = [url, supportedTypes[i], userPref].join(" ");
        rulesSet.push(rule);
    }

    return rulesSet;
}

function setImageToCommitted() {
    imageCommit.setAttribute("src", committedImagePath);
}