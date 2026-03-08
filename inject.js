(function () {

    function safeSerialize(obj) {
        const seen = new WeakSet();

        return JSON.parse(
            JSON.stringify(obj, function (key, value) {

                if (typeof value === "function") {
                    return "[Function]";
                }

                if (typeof value === "object" && value !== null) {

                    if (seen.has(value)) {
                        return "[Circular]";
                    }

                    seen.add(value);

                    if (value instanceof Element) {
                        return `<${value.tagName.toLowerCase()} />`;
                    }

                    if (value === window) {
                        return "[Window]";
                    }
                }

                return value;
            })
        );
    }

    window.dataLayer = window.dataLayer || [];

    const originalPush = window.dataLayer.push;

    window.dataLayer.push = function () {

        const args = Array.from(arguments).map(safeSerialize);

        window.postMessage({
            type: "DATALAYER_EVENT",
            payload: args
        }, "*");

        return originalPush.apply(this, arguments);
    };

})();