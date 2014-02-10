chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	cookieCleaner();
	removeSiteData();
});

function cookieCleaner() {
	chrome.tabs.query({}, function(tabs) {
		var listOfActiveUrls = [];
		for (var i = 0; i < tabs.length; i++) {
			listOfActiveUrls.push(tabs[i].url);
		}
		
		chrome.cookies.getAll({}, function(cookies) {
			var listOfAllCookiesDomain = [];
			for (var i = 0; i < cookies.length; i++) {
				var domainName = cookies[i].domain.charAt(0) == '.' 
					? cookies[i].domain.substring(1, cookies[i].length)
					: cookies[i].domain;
					
				listOfAllCookiesDomain.push(domainName);
			}
			
			var listOfNotWhiteListedCookies = listOfAllCookiesDomain;
			if (localStorage["domainsAllowed"]) {
				var whitelistedDomains = localStorage["domainsAllowed"].split(",");
				listOfNotWhiteListedCookies = getListOfUnusedCookies(whitelistedDomains, listOfAllCookiesDomain);
			}
			
			var listOfUnwantedCookies = getListOfUnusedCookies(listOfActiveUrls, listOfNotWhiteListedCookies);
			removeAllCookies(listOfUnwantedCookies, cookies);
		});
	});
}

function getListOfUnusedCookies(listOfURLToIgnore, listOfAllCookiesDomain) {
	var listOfUnwantedCookies = listOfAllCookiesDomain;
	
	loopNewCookieDomain:
	for (var i = 0; i < listOfAllCookiesDomain.length; i++) {
		for (var j = 0; j < listOfURLToIgnore.length; j++) {
			if (listOfURLToIgnore[j] && listOfAllCookiesDomain[i]) {
				if (listOfURLToIgnore[j].indexOf(listOfAllCookiesDomain[i]) != -1) {
					listOfUnwantedCookies = removeAllInstance(listOfUnwantedCookies, listOfAllCookiesDomain[i]);
					continue loopNewCookieDomain;
				}
			}
		}
	}
	return listOfUnwantedCookies;
}

function removeAllInstance(array, itemToRemove) {
	var filteredArray = array.filter(function(item){
		return typeof item == 'string' && item.indexOf(itemToRemove) == -1;
	});
	
	return filteredArray;
}

function removeAllCookies(listOfUnwantedCookies, cookies) {
	for (var i = 0; i < cookies.length; i++) {
		for (var j = 0; j < listOfUnwantedCookies.length; j++) {
			if (cookies[i].domain.indexOf(listOfUnwantedCookies[j]) != -1) {
				removeCookie('http', cookies[i]);
				removeCookie('https', cookies[i]);
				console.log("Removed " + cookies[i].domain);
			}
		}
	}
}

function removeCookie(prefix, cookie) {
	var link = prefix + '://' + cookie.domain + cookie.path;
	chrome.cookies.remove({url: link, name: cookie.name});
}

function removeSiteData() {
	chrome.browsingData.remove({}, {
		"appcache": true,
		"fileSystems": true,
		"indexedDB": true,
		"localStorage": true,
		"pluginData": true,
		"webSQL": true
	});
}