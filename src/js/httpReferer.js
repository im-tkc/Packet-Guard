function HTTP_Referer() {
	this.httpRefererStorageName = "httpReferer";
}

HReferer=HTTP_Referer.prototype;
HReferer.bindListener = function () {
	var hRefererPointer = this;
	
	chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
		for (var i = 0; i < details.requestHeaders.length; ++i) {
			if (details.requestHeaders[i].name === 'Referer') {
				var newHeader = hRefererPointer.editBasedOnRefererPref(details.requestHeaders, i);
				break;
			}
		}
		return {requestHeaders: newHeader};
	},{urls: ["<all_urls>"]},["blocking", "requestHeaders"]);
};

HReferer.editBasedOnRefererPref = function(requestHeader, pos) {
	var newHeader = requestHeader;
	var httpReferer = localStorage[this.httpRefererStorageName];
	
	switch (httpReferer) {
		case "suppress":
			newHeader[pos].value = "";
			break;
		case "domainOnly":
			newHeader = newHeader[pos].replace(/^.*:\/\//g, '').split('/')[0];
			break;
		case "normal":
			break;
	}
	
	return newHeader;
}

httpReferer = new HTTP_Referer();
httpReferer.bindListener();