domainListField = "domainList";
clearCacheField = "autoClearCacheField";
clearCacheOnExit = "clearCacheOnExitOption";
httpRefererOptions = "httpRefererOptions";

domainsLocalStorageName = "domainsAllowed";
clearCacheMinsStorageName = "clearCacheMins";
clearCacheOnExitStorageName = "clearCacheOnExit";
httpRefererStorageName = "httpReferer";

main();

function main() {
	document.addEventListener('DOMContentLoaded', restoreWhitelist);
	document.querySelector('#saveWhitelist').addEventListener('click', saveWhitelist);
	
	document.addEventListener('DOMContentLoaded', restorePrivacy);
	document.querySelector('#savePrivacy').addEventListener('click', savePrivacy);
}

function restoreWhitelist() {
	var domainsAllowed = localStorage[domainsLocalStorageName];
	if (domainsAllowed) {	
		domainsAllowed = domainsAllowed.replace(/,/g, "\n");
		setValueById(domainListField, domainsAllowed);
	}
}

function saveWhitelist() {
	var domainsAllowed = getValueById(domainListField).split("\n");
	
	domainsAllowed = domainsAllowed.filter(function(e){return e});
	localStorage[domainsLocalStorageName] = domainsAllowed;

	visualFeedback("statusWhitelist");
}

function restorePrivacy() {
	var clearCacheMins = localStorage[clearCacheMinsStorageName];
	var httpReferer = localStorage[httpRefererStorageName];

	if (clearCacheMins) {
		setValueById(clearCacheField, clearCacheMins);
	}
	
	if (clearCacheOnExit) {
		setIsChecked(clearCacheOnExit, localStorage[clearCacheOnExitStorageName]);
	}
	
	if (httpReferer) {
		setValueById(httpRefererOptions, httpReferer);
	}
}

function savePrivacy() {
	localStorage[httpRefererStorageName] = getValueById(httpRefererOptions);
	localStorage[clearCacheMinsStorageName] = getValueById(clearCacheField);
	localStorage[clearCacheOnExitStorageName] = getIsChecked(clearCacheOnExit);

	cacheCleaner.createTimer(parseInt(localStorage[clearCacheMinsStorageName]));
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


function getClearCacheMinsStorage() {
	return localStorage[clearCacheMinsStorageName];
}