function String() {}
string = String.prototype;
string.RULE_URL_POS = 0;
string.RULE_PREF_TYPE_POS = 1;
string.RULE_USER_PREF_POS = 2;
string.RULE_LENGTH = 3;
string.RULE_ANY_URL = "*";
string.HTTP_IF_NONE_MATCH = "If-None-Match"; //rule for etag
string.USER_AGENT_GENERIC_CHROME = "Mozilla/5.0 AppleWebKit (KHTML, like Gecko) Chrome Safari";
string.INTERNAL_URL = new RegExp("^(chrome(|-extension)|opera)://.*$");
string.CHROME_WEBSTORE = "https://chrome.google.com/webstore";

string.DEFAULT_USER_PREF = ["block", "block", "clear", "allow"];

string.getSupportedTypes = function() {
	return ["etag", "referer", "cookie", "user-agent"];
};

string.getSupportedOptions = function() { 
    return [
        ["block", "allow"], 
        ["block", "domain-only", "allow"],
        ["clear", "keep"],
        ["generic", "allow", "block", new RegExp("^\".*\"$")]
    ];
};

string.getEtag = function() { a=string.getSupportedTypes(); return a[0]; };
string.getReferer =  function() { a=string.getSupportedTypes(); return a[1]; };
string.getCookie =  function() { a=string.getSupportedTypes(); return a[2]; };
string.getUserAgent =  function() { a=string.getSupportedTypes(); return a[3]; };

string.getEtagBlock = function() { a=string.getSupportedOptions(); return a[0][1]; };
string.getEtagAllow = function() { a=string.getSupportedOptions(); return a[0][2]; };

string.getRefererBlock = function() { a=string.getSupportedOptions(); return a[1][0]; };
string.getRefererDomainOnly = function() { a=string.getSupportedOptions(); return a[1][1]; };
string.getRefererAllow = function() { a=string.getSupportedOptions(); return a[1][2]; };

string.getCookieClear = function() { a=string.getSupportedOptions(); return a[2][0]; };
string.getCookieKeep = function() { a=string.getSupportedOptions(); return a[2][1]; };

string.getUserAgentGeneric = function() { a=string.getSupportedOptions(); return a[3][0]; };
string.getUserAgentAllow = function() { a=string.getSupportedOptions(); return a[3][1]; };
string.getUserAgentBlock = function() { a=string.getSupportedOptions(); return a[3][2]; };
string.getUserAgentCustom = function() { a=string.getSupportedOptions(); return a[3][3]; };
