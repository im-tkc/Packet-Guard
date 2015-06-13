# Default Packet Guard rule
 - Allow user-agent (user-agent field will be left untouched)
 - Block etag (etag field will be suppressed)
 - Clear cookie (all unwanted cookie will be cleared upon closing of tabs)
 - Block referer (referer field will be suppressed)

# How to create rule?
There are two ways in creating the rule. Namely the graphical method or the rule method (for advanced user).

## Graphical method
To do so, click on the extension icon located at the address bar.

![Packet Guard popup](https://raw.githubusercontent.com/im-tkc/Packet-Guard/master/doc/img/popup.png)

Check the desired rule.

![Packet Guard before it commits](https://raw.githubusercontent.com/im-tkc/Packet-Guard/master/doc/img/popup-uncommited.png)

(Note: The HTTP packets will **not be modified** until you click on the red unlock icon)

Done!

## Rule method (For advanced user)
Go to Packet Guard option menu. Click on "Manage rules".

![Packet Guard manage rules](https://raw.githubusercontent.com/im-tkc/Packet-Guard/master/doc/img/option-manage-rules.png)

Enter the desired rule and click on "Save" button.

Done!

# What is the syntax of the rule?
The syntax of the rule is as follows:

|            | URL                    | Option                           | Preference                                                                                                                                           |
|------------|------------------------|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
|**Meaning** |The page that you visit.|Available fields to be edited.    |Available preference to be edited.                                                                                                                    |
|**Example** |www.facebook.com        |etag, referer, cookie, user-agent.|**etag** - Allow, Block <br> **referer** - block, allow, domain-only <br> **cookie** - clean, keep <br> **user-agent** - generic, allow, block, custom|

## Wait! What does each individual preference means?
 - **Allow** - The targeted field will be left untouched.
 - **Block** - The targeted field will be removed/suppressed before it sends.
 - **Domain-only (for referer)** - This means that the "Referer" field will only send domain information only. For example, the packet will send "http://www.google.com" instead of "http://google.com/q=what+is+my+previous+page".
 - **Clean (for cookie)** - This cookie *will not be marked* as "protected" when the tab is closed. For example, if "facebook.com" is set as "clean" for cookie, cookie that is related to "facebook.com" will be deleted when a tab is closed. However, it will be *implicitly "keep"* if "facebook.com" tab is not closed. This means that if "facebook.com" tab is opened while some other tab is closed, Packet Guard will not clear "facebook.com" cookies.
 - **Keep (for cookie)** - This cookie *will be marked* as "protected" when the tab is closed. For example, if "facebook.com" is set as "keep", cookie that is related to "facebook.com" will not be deleted when the tab is closed. This means that if "facebook.com" tab is closed, Packet Guard will not clear "facebook.com" cookies.
 - **Custom (for user-agent)** - The targeted field will be changed based on the user desired string. It can set by quoting the preference field. For example:

    `edition.cnn.com user-agent "firefox"`
    
    Will set user-agent field as `firefox` instead of the default field.
- **Generic (for user-agent)** - As proposed by [Larm from wilderssecurity](http://www.wilderssecurity.com/threads/improving-the-privacy-with-generic-browser-user-agent-strings.358284/#post-2326018). This will suppress unnecessary information such as your operating system as well as your version of chromium browser. *Setting it to `generic` may break some sites but improve privacy*.

## How about global rule?
Global rule for each option needs to be available at all times. It will be a default option for unknown sites. To set a global rule, set `*`in the URL field.

# Can I temporarily disable rule(s) without having to delete them?
Yes you can do so by marking `#` right in front of the rule. This will disable that rule until you remove `#` from the rule.

For example:

    ....
    www.ted.com referer block <-- Continue suppressing referer
    www.google.com user-agent block <-- Continue suppressing user-agent
    #www.facebook.com referer domain-only <-- Rule is temporarily disabled
    ....