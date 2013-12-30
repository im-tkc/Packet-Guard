function save_options() {
	var textArea = document.getElementById(domainListField);
	var domainsAllowed = textArea.value.split("\n");
	localStorage[domainsLocalStorageName] = domainsAllowed;

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	var domainsAllowed = localStorage[domainsLocalStorageName];
	if (!domainsAllowed) {
		return;
	}
	
	domainsAllowed = domainsAllowed.replace(/,/g, "\n");
	var textArea = document.getElementById(domainListField);
	textArea.value = domainsAllowed;
	
}

domainListField = "domainList";
domainsLocalStorageName = "domainsAllowed"

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);