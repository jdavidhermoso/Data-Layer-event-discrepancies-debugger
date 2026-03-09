let TARGET_EVENT = "";

let MODEL_EVENT = {
    event: ""
};

const IGNORE_KEYS = ["timestamp", "sessionId"];

let userEvents = [];

function createPanel() {
    const panel = document.createElement("div");

    panel.id = "dl-inspector";
    panel.style.position = "fixed";
    panel.style.bottom = "0";
    panel.style.left = "0";
    panel.style.width = "100%";
    panel.style.height = "300px";
    panel.style.background = "#f9f9f9";
    panel.style.color = "#333";
    panel.style.fontSize = "14px";
    panel.style.fontFamily = "Arial, sans-serif";
    panel.style.zIndex = "999999";
    panel.style.overflowY = "auto";
    panel.style.borderTop = "3px solid #4CAF50";

    let messageHTML = '';

    panel.innerHTML = `
    <div style="padding:10px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ccc;">
      <strong style="font-size:16px;">DataLayer Inspector - ${TARGET_EVENT}</strong>
      <div>
        <button id="dl-clear" style="margin-right:5px; padding:5px 10px; background:#f44336; color:white; border:none; border-radius:3px; cursor:pointer;">Clear</button>
        <button id="dl-export" style="padding:5px 10px; background:#4CAF50; color:white; border:none; border-radius:3px; cursor:pointer;">Export</button>
      </div>
    </div>
    ${messageHTML}
    <div id="dl-events" style="padding:10px;"></div>
  `;

    document.body.appendChild(panel);

    document.getElementById("dl-clear").onclick = () => {
        userEvents = [];
        chrome.storage.local.remove("userEvents");
        render();
    };

    document.getElementById("dl-export").onclick = exportEvents;
}

function render() {
    const container = document.getElementById("dl-events");
    if (!container) return;

    container.innerHTML = userEvents
        .map((e, i) => `
      <div style="padding:6px;border-bottom:1px solid #333">
        <div><b>${i}</b> - ${e.url} - ${e.time} ${e.hasDiscrepancy ? "(discrepancy)" : ""}</div>
        <pre>${JSON.stringify(e.diffs || {}, null, 2)}</pre>
      </div>
    `)
        .join("");
}

function safeClone(obj) {
    const seen = new WeakSet();
    return JSON.parse(
        JSON.stringify(obj, function (key, value) {
            if (typeof value === "function") return "[Function]";
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) return "[Circular]";
                seen.add(value);
                if (value instanceof Element) return `<${value.tagName.toLowerCase()} />`;
                if (value === window) return "[Window]";
            }
            return value;
        })
    );
}

function compareItems(item1, item2) {
    const discrepancies = [];
    if (!item1 || !item2) return discrepancies;

    const keys = new Set([...Object.keys(item1), ...Object.keys(item2)]);
    keys.forEach(key => {
        if (IGNORE_KEYS.includes(key)) return;
        const val1 = item1[key];
        const val2 = item2[key];
        if (JSON.stringify(val1) !== JSON.stringify(val2)) {
            discrepancies.push({ property: key, value1: val1, value2: val2 });
        }
    });

    return discrepancies;
}

function handleEvent(event) {
    const url = window.location.pathname;
    const clonedEvent = safeClone(event);
    const eventItem = clonedEvent || null;
    const modelItem = MODEL_EVENT || null;

    if (!eventItem) return;

    let diffsToExport = {};
    let hasDiscrepancy = false;

    const modelDiffs = compareItems(modelItem, eventItem);
    if (modelDiffs.length > 0) {
        hasDiscrepancy = true;
        modelDiffs.forEach(d => {
            diffsToExport[d.property] = { url, value: eventItem[d.property] };
        });
    }

    userEvents.forEach(prev => {
        const prevItem = prev.data || null;
        const diffs = compareItems(prevItem, eventItem);
        if (diffs.length > 0) {
            hasDiscrepancy = true;
            diffs.forEach(d => {
                diffsToExport[d.property] = { url, value: eventItem[d.property] };
            });
        }
    });

    const eventObj = {
        url,
        time: new Date().toISOString(),
        hasDiscrepancy,
        diffs: diffsToExport,
        data: clonedEvent
    };

    userEvents.push(eventObj);
    chrome.storage.local.set({ userEvents });
    render();
}

function isAllowedDomain(allowedDomains) {

    const hostname = window.location.hostname;

    return allowedDomains.some(domain =>
        hostname === domain || hostname.endsWith("." + domain)
    );

}

function exportEvents() {
    const discrepantEvents = userEvents.filter(e => e.hasDiscrepancy);

    if (discrepantEvents.length === 0) {
        alert("No discrepancies to export.");
        return;
    }

    const exportObj = {
        "_metadata": {
            "message": "This json file was generated using the extension Data Layer event discrepancies debugger by David Hermoso.",
            "linkedin": "https://www.linkedin.com/in/jdavidhermoso/",
            "github": "https://github.com/jdavidhermoso/Data-Layer-event-discrepancies-debugger"
        }
    };

    discrepantEvents.forEach(e => {
        const url = e.url;
        const diffs = e.diffs || {};
        Object.entries(diffs).forEach(([prop, { value }]) => {
            if (!exportObj[prop]) exportObj[prop] = {};
            exportObj[prop][url] = { value };
        });
    });

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlBlob;
    a.download = `${TARGET_EVENT}_discrepancies.json`;
    a.click();
    URL.revokeObjectURL(urlBlob);
}

let ALLOWED_DOMAINS = [];
function loadSettings(callback) {

    chrome.storage.sync.get(
        {
            TARGET_EVENT: "",
            MODEL_EVENT_NAME: "",
            ALLOWED_DOMAINS: []
        },
        (items) => {

            TARGET_EVENT = items.TARGET_EVENT;
            MODEL_EVENT.event = items.MODEL_EVENT_NAME;
            ALLOWED_DOMAINS = items.ALLOWED_DOMAINS;

            callback();
        }
    );
}

function injectScript() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    document.documentElement.appendChild(script);
    script.onload = () => script.remove();
}

window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data?.type === "DATALAYER_EVENT") {
        event.data.payload.forEach((item) => {
            if (item?.event === TARGET_EVENT) {
                handleEvent(item);
            }
        });
    }
});

function init() {

    loadSettings(() => {

        if (!isAllowedDomain(ALLOWED_DOMAINS)) {
            return;
        }

        injectScript();

        chrome.storage.local.get("userEvents", (res) => {
            userEvents = res.userEvents || [];
            render();
        });

        const waitBody = setInterval(() => {
            if (document.body) {
                clearInterval(waitBody);
                createPanel();
            }
        }, 50);

    });

}

init();
