const targetInput = document.getElementById("targetEvent");
const modelInput = document.getElementById("modelEvent");
const domainsInput = document.getElementById("domains");

function restore() {
    chrome.storage.sync.get(
        {
            TARGET_EVENT: "",
            MODEL_EVENT_NAME: "",
            ALLOWED_DOMAINS: []
        },
        (items) => {
            targetInput.value = items.TARGET_EVENT;
            modelInput.value = items.MODEL_EVENT_NAME;
            domainsInput.value = items.ALLOWED_DOMAINS.join(",");
        });
}

function save() {
    const TARGET_EVENT = targetInput.value;
    const MODEL_EVENT_NAME = modelInput.value;

    const ALLOWED_DOMAINS = domainsInput.value
        .split(",")
        .map(d => d.trim())
        .filter(Boolean);

    chrome.storage.sync.set({
        TARGET_EVENT,
        MODEL_EVENT_NAME,
        ALLOWED_DOMAINS
    }, () => {
        document.getElementById("status").innerText = "Saved!";
    });
}

document.getElementById("save").addEventListener("click", save);

restore();
