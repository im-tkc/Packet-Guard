function CookieCleaner() {}

CCleaner = CookieCleaner.prototype;
CCleaner.bindListener = function() {
    var functionPointer = this;
    
    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        functionPointer.removeUnwantedCookies();
        functionPointer.removeSiteData();
    });
};

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

            if (resources.getRulesSet()) {
                listOfAllCookiesDomain = functionPointer.excludeOpenedTabCookies(functionPointer, listOfAllCookiesDomain, listOfActiveUrls);
                listOfAllCookiesDomain = functionPointer.applyRuleSet(functionPointer, listOfAllCookiesDomain, listOfActiveUrls);
            }

            functionPointer.removeAllCookies(listOfAllCookiesDomain, cookies);
        });
    });
};

CCleaner.excludeOpenedTabCookies = function(functionPointer, listOfAllCookiesDomain, listOfActiveUrls) {
    for (var i=0; i < listOfAllCookiesDomain.length; i++) {
        for (var j=0; j<listOfActiveUrls.length; j++) {
            if (listOfActiveUrls[j].indexOf(listOfAllCookiesDomain[i]) != -1) {
                listOfAllCookiesDomain = functionPointer.removeAllInstance(listOfAllCookiesDomain, listOfAllCookiesDomain[i]);
                --i;
            }
        }
    }

    return listOfAllCookiesDomain;
};

CCleaner.applyRuleSet = function(functionPointer, listOfAllCookiesDomain, listOfActiveUrls) {
    listOfForceClearCookie = [];
    var rulesSet = resources.getRulesSet();
    var COOKIE = string.getCookie();

    for (var i=0; i < listOfAllCookiesDomain.length; i++) {
        for (var j = (rulesSet.length - 1); j >= 0; j--) {
            rule = inputHelper.splitEachRule(rulesSet[j]);
            url = rule[string.RULE_URL_POS];

            isCookieKeep = (rule[string.RULE_PREF_TYPE_POS] == COOKIE
                && rule[string.RULE_USER_PREF_POS] == string.getCookieKeep());

            if (url.indexOf(listOfAllCookiesDomain[i]) != -1 && isCookieKeep) {
                listOfAllCookiesDomain = functionPointer.removeAllInstance(listOfAllCookiesDomain, listOfAllCookiesDomain[i]);
                --i;
            } else if (url.indexOf(listOfAllCookiesDomain[i]) != -1 
                &&  (rule[string.RULE_PREF_TYPE_POS] == COOKIE
                && rule[string.RULE_USER_PREF_POS] == string.getCookieClear())) {
                    listOfForceClearCookie.push(listOfAllCookiesDomain[i]);
            }

            if (url == string.RULE_ANY_URL && isCookieKeep) {
                listOfAllCookiesDomain = listOfForceClearCookie;
                break;
            }
        }
    }

    return listOfAllCookiesDomain;
};

CCleaner.removeAllInstance = function(array, itemToRemove) {
    var filteredArray = array.filter(function(item){
        return typeof item == 'string' && item.indexOf(itemToRemove) != 0;
    });
    
    return filteredArray;
};

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
};

CCleaner.removeCookie = function(prefix, cookie) {
    var link = prefix + '://' + cookie.domain + cookie.path;
    chrome.cookies.remove({url: link, name: cookie.name});
};

CCleaner.removeSiteData = function() {
    chrome.browsingData.remove({}, {
        "appcache": true,
        "fileSystems": true,
        "indexedDB": true,
        "localStorage": true,
        "pluginData": true,
        "serviceWorkers": true,
        "webSQL": true
    });
};
