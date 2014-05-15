function HTTP_Referer() {}

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
	var httpRefererOptions = resources.getHttpReferer();
	
	switch (httpRefererOptions) {
		case "suppress":
			newHeader.splice(pos, 1);
			break;
		case "domainOnly":
			newHeader = newHeader[pos].replace(/^.*:\/\//g, '').split('/')[0];
			break;
		case "normal":
			break;
	}
	
	return newHeader;
}
