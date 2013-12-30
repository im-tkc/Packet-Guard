chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	cookieCleaner();
	chrome.browsingData.remove({}, {
		"localStorage": true,
		"pluginData": true,
	});
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

function getListOfUnusedCookies(listOfCookiesToIgnore, listOfAllCookiesDomain) {
	var listOfUnwantedCookies = listOfAllCookiesDomain;
	
	for (var i = 0; i < listOfAllCookiesDomain.length; i++) {
		for (var j = 0; j < listOfCookiesToIgnore.length; j++) {
			if (listOfCookiesToIgnore[j] && listOfAllCookiesDomain[i]) {
				if (listOfCookiesToIgnore[j].indexOf(listOfAllCookiesDomain[i]) != -1) {
					removeAllInstance(listOfUnwantedCookies, listOfAllCookiesDomain[i]);
				}
			}
		}
	}
	return listOfUnwantedCookies;
}

function removeAllInstance(array, item) {
   var i;
   while((i = array.indexOf(item)) !== -1) {
     array.splice(i, 1);
   }
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