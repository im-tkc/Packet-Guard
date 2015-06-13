# An extract from `manifest.js`
    ....
    "permissions": [
        "browsingData",
        "tabs", "*://*/*",
        "cookies", "*://*/*",
        "alarms",
        "webRequest", "webRequestBlocking", "*://*/*",
        "downloads"
    ]
    ....


 - [Browsing data](https://developer.chrome.com/extensions/browsingData) - To clear cache and site-related data.
 - [Tabs](https://developer.chrome.com/extensions/tabs) - To get all currently active tab's URL.
 - [Cookies](https://developer.chrome.com/extensions/cookies) - To remove all unwanted cookies.
 - [Alarms](https://developer.chrome.com/apps/alarms) - To implement timer to clear cache and site-related data.
 - [WebRequest](https://developer.chrome.com/extensions/webRequest) - To intercept all HTTP traffic for `webRequestBlocking`.
 - [WebRequestBlocking](https://developer.chrome.com/extensions/webRequest) - To block all unwanted HTTP traffic field.
 - [Downloads](https://developer.chrome.com/extensions/downloads) - To implement download function for exporting Packet Guard data.