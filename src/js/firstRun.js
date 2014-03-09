chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == "install") {
		localStorage["httpReferer"] = "suppress";
		localStorage["clearCacheMins"] = 120;
	}
});