var removeToListButtonId = "removeToList";
var addToListButtonId = "addToList";
var urlToExclude = "";
var domainsLocalStorageName = "domainsAllowed";

chrome.tabs.query({active: true}, function(tabs) {
	var activeUrl = tabs[0].url;
	urlToExclude = activeUrl.replace(/^.*:\/\//g, '').split('/')[0];
	var urlHTMLTag = document.getElementById("activeUrl");
	urlHTMLTag.innerHTML = urlToExclude;
	
	var domainsAllowed = getListOfAllowedDomains();
	if(domainsAllowed && domainsAllowed.indexOf(urlToExclude) != -1) {
		showElement(removeToListButtonId);
	} else {
		showElement(addToListButtonId);
	}
});

document.querySelector('#'+ addToListButtonId).addEventListener('click', addToList);
document.querySelector('#'+ removeToListButtonId).addEventListener('click', removeToList);
document.querySelector('#clearAllCookies').addEventListener('click', clearAllCookies);

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
	var domainsAllowed = localStorage[domainsLocalStorageName] 
		? localStorage[domainsLocalStorageName].split(",")
		: [];
	return domainsAllowed;
}

function setListOfAllowedDomains(domainsAllowed) {
	sanitizedDomainsAllowed = domainsAllowed.filter(function(e){return e});
	localStorage[domainsLocalStorageName] = sanitizedDomainsAllowed;
}

function hideAndShowButton(elementIdToHide, elementIdToShow) {
	$("#" + elementIdToHide).hide("slow", function() {
		$("#" + elementIdToShow).show("slow");
	});
}

function clearAllCookies() {
	chrome.browsingData.removeCookies({});
	removeSiteData(); //call a function from cookieCleaner.js
	
	var checkmarkHTMLTag = document.getElementById("checkmark");
	checkmarkHTMLTag.innerHTML = "&#10004;";
	setTimeout(function() {
		checkmarkHTMLTag.innerHTML = "";
	}, 1000);
}