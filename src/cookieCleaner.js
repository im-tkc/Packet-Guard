chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	cookieCleaner();
	chrome.browsingData.removeLocalStorage({});
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
				listOfAllCookiesDomain.push(cookies[i].domain);
			}
			
			var listOfUnusedCookies = getListOfUnusedCookies(listOfActiveUrls, listOfAllCookiesDomain);			
			removeAllCookies(listOfUnusedCookies, cookies);
		});
	});
}

function getListOfUnusedCookies(listOfActiveUrls, listOfAllCookiesDomain) {
	var listOfUnusedCookies = listOfAllCookiesDomain;
	
	for (var i = 0; i < listOfAllCookiesDomain.length; i++) {
		for (var j = 0; j < listOfActiveUrls.length; j++) {
			if (listOfActiveUrls[j] && listOfAllCookiesDomain[i]) {
				if (listOfActiveUrls[j].indexOf(listOfAllCookiesDomain[i]) != -1) {					
					removeAllInstance(listOfUnusedCookies, listOfAllCookiesDomain[i])
				} 
			}
		}
	}
	return listOfUnusedCookies;
}

function removeAllInstance(array, item) {
   var i;
   while((i = array.indexOf(item)) !== -1) {
     array.splice(i, 1);
   }
}

function removeAllCookies(listOfUnusedCookies, cookies) {
	for (var i = 0; i < cookies.length; i++) {
		for (var j = 0; j < listOfUnusedCookies.length; j++) {
			if (cookies[i].domain == listOfUnusedCookies[j]) {
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
