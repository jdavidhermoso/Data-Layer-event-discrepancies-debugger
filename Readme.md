# DataLayer DISCREPANCIES DEBUGGER - Chrome Extension

![DataLayer Inspector Panel Preview](./logo.png)

Extension created by David Hermoso https://www.linkedin.com/in/jdavidhermoso/

## Description

This Chrome extension allows you to **capture and analyze discrepancies** in the GA event (IN THE CODE I LET A PLACEHOLDER YOUR_GA_EVENT, THAT YOU CAN CHANGE) sent to your website’s `dataLayer`.  

It is designed for development and marketing teams working with multiple e-commerce implementations to **ensure data consistency** across pages.

The extension:

- Listens to all `window.dataLayer.push` events related to your event (IN THE CODE I LET A PLACEHOLDER YOUR_GA_EVENT, THAT YOU CAN CHANGE).
- Detects discrepancies between events on different pages and/or against a **reference model**.
- Displays a **floating panel** on the page with captured events.
- Allows **exporting discrepancies** to a JSON file organized by property and URL.

---

## Key Features

1. **Intercepts `dataLayer.push`**
    - Captures only events with `event: YOUR EVENT ID` (IN THE CODE I LET A PLACEHOLDER YOUR_GA_EVENT, THAT YOU CAN CHANGE).
    - Safely clones objects to avoid serialization issues (functions, DOM elements, circular references, etc.).

2. **Event comparison**
    - Compares properties of the first item in `ecommerce.items[0]` against a defined **reference model**.
    - Compares each new event with previous events to detect inconsistencies between pages.
    - Ignores irrelevant keys such as `timestamp` or `sessionId`.

3. **Floating UI Panel**
    - Lists captured events and highlights discrepancies.
    - **Clear** button: removes all captured events.
    - **Export** button: generates a JSON with only discrepant properties, grouped by property and URL.

4. **Export Format**
    - Final JSON format:

```json
{
  "property1": {
    "/url1": { "value": ... },
    "/url2": { "value": ... }
  },
  "property2": {
    "/url1": { "value": ... }
  }
}
```

Extension icons were generated using this tool: https://github.com/alexleybourne/chrome-extension-icon-generator/tree/main