domainListField = "domainList";
clearCacheField = "autoClearCacheField";
clearCacheOnExit = "clearCacheOnExitOption";
httpRefererOptions = "httpRefererOptions";

main();

function main() {
    document.addEventListener('DOMContentLoaded', restoreWhitelist);
    document.querySelector('#saveWhitelist').addEventListener('click', saveWhitelist);
    
    document.addEventListener('DOMContentLoaded', restorePrivacy);
    document.querySelector('#savePrivacy').addEventListener('click', savePrivacy);
}

function restoreWhitelist() {
    var domainsAllowed = resources.getDomainsAllowed();
    if (domainsAllowed) {   
        domainsAllowed = domainsAllowed.replace(/,/g, "\n");
        setValueById(domainListField, domainsAllowed);
    }
}

function saveWhitelist() {
    var domainsAllowed = getValueById(domainListField).split("\n");
    
    domainsAllowed = domainsAllowed.filter(function(e){return e});
    resources.setDomainsAllowed(domainsAllowed);

    visualFeedback("statusWhitelist");
}

function restorePrivacy() {
    var clearCacheMins = resources.getClearCacheMins();
    var httpReferer = resources.getHttpReferer();

    if (clearCacheMins) {
        setValueById(clearCacheField, clearCacheMins);
    }
    
    if (clearCacheOnExit) {
        setIsChecked(clearCacheOnExit, resources.getClearCacheOnExit());
    }
    
    if (httpReferer) {
        setValueById(httpRefererOptions, httpReferer);
    }
}

function savePrivacy() {
    resources.setHttpReferer(getValueById(httpRefererOptions));
    resources.setClearCacheMins(getValueById(clearCacheField));
    resources.setClearCacheOnExit(getIsChecked(clearCacheOnExit));

    cacheCleaner.createTimer(parseInt(resources.getClearCacheMins()));
    visualFeedback("statusPrivacy");
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