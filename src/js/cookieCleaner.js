function CookieCleaner() {}

CCleaner = CookieCleaner.prototype;
CCleaner.bindListener = function() {
    var functionPointer = this;
    
    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        functionPointer.removeUnwantedCookies();
        functionPointer.removeSiteData();
    });
}

CCleaner.removeUnwantedCookies = function() {
    var functionPointer = this;
    
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
            if (resources.getDomainsAllowed()) {
                var whitelistedDomains = resources.getDomainsAllowed().split(",");
                listOfNotWhiteListedCookies = functionPointer.getListOfUnusedCookies(whitelistedDomains, listOfAllCookiesDomain);
            }
            
            var listOfUnwantedCookies = functionPointer.getListOfUnusedCookies(listOfActiveUrls, listOfNotWhiteListedCookies);
            functionPointer.removeAllCookies(listOfUnwantedCookies, cookies);
        });
    });
}

CCleaner.getListOfUnusedCookies = function(listOfURLToIgnore, listOfAllCookiesDomain) {
    var listOfUnwantedCookies = listOfAllCookiesDomain;
    
    loopNewCookieDomain:
    for (var i = 0; i < listOfAllCookiesDomain.length; i++) {
        for (var j = 0; j < listOfURLToIgnore.length; j++) {
            if (listOfURLToIgnore[j] && listOfAllCookiesDomain[i]) {
                if (listOfURLToIgnore[j].indexOf(listOfAllCookiesDomain[i]) != -1) {
                    listOfUnwantedCookies = this.removeAllInstance(listOfUnwantedCookies, listOfAllCookiesDomain[i]);
                    continue loopNewCookieDomain;
                }
            }
        }
    }
    return listOfUnwantedCookies;
}

CCleaner.removeAllInstance = function(array, itemToRemove) {
    var filteredArray = array.filter(function(item){
        return typeof item == 'string' && item.indexOf(itemToRemove) == -1;
    });
    
    return filteredArray;
}

CCleaner.removeAllCookies = function(listOfUnwantedCookies, cookies) {
    for (var i = 0; i < cookies.length; i++) {
        for (var j = 0; j < listOfUnwantedCookies.length; j++) {
            if (cookies[i].domain.indexOf(listOfUnwantedCookies[j]) != -1) {
                this.removeCookie('http', cookies[i]);
                this.removeCookie('https', cookies[i]);
                console.log("Removed " + cookies[i].domain);
            }
        }
    }
}

CCleaner.removeCookie = function(prefix, cookie) {
    var link = prefix + '://' + cookie.domain + cookie.path;
    chrome.cookies.remove({url: link, name: cookie.name});
}

CCleaner.removeSiteData = function() {
    chrome.browsingData.remove({}, {
        "appcache": true,
        "fileSystems": true,
        "indexedDB": true,
        "localStorage": true,
        "pluginData": true,
        "webSQL": true
    });
}
