function RuleObject() {
    this.firstPartyUserPref = ""
    this.thirdPartyUserPref = "";
    this.isFirstPartyUserPrefSet = false;
    this.isThirdPartyUserPrefSet = false;
    this.isUserPrefUpdated = false;
}
ruleObject = RuleObject.prototype;

ruleObject = {
    get firstPartyUserPref() {
        return this.firstPartyUserPref;
    }, 
    get thirdPartyUserPref() {
        return this.thirdPartyUserPref;
    }, 
    set firstPartyUserPref(userPref) {
        this.firstPartyUserPref = userPref;
    },
    set thirdPartyUserPref(userPref) {
        this.thirdPartyUserPref = userPref;
    },
    get isUserPrefUpdated() {
        return this.isUserPrefUpdated;
    },
    set isUserPrefUpdated(isUserPrefUpdated) {
        this.isUserPrefUpdated = isUserPrefUpdated;
    }
}
