# Privacy Policy

**DataLayer Discrepancies Debugger – Chrome Extension**

Last updated: March 2026

## Overview

DataLayer Discrepancies Debugger is a developer tool designed to help analyze inconsistencies in `dataLayer` events on websites.

This extension does **not collect, store, transmit, or share personal user data**.

## Data Processing

The extension temporarily processes information available on the current webpage in order to detect discrepancies between `dataLayer` events.

This includes:

* `dataLayer` events triggered on the page
* The current page URL (pathname only)
* Event properties (for example `ecommerce.items[0]` values)

All processing occurs **locally in the user's browser**.

## Local Storage

The extension uses the browser's local storage (`chrome.storage.local`) only to:

* Temporarily store captured events
* Allow comparison between events across pages during the debugging session
* Enable exporting discrepancy reports

This information:

* Is stored **only on the user's device**
* Is **never transmitted to external servers**
* Can be cleared at any time using the **Clear** button in the extension panel.

## Data Export

If the user chooses to export discrepancies, the extension generates a **JSON file locally** and downloads it to the user's computer.

The extension does not send exported data anywhere.

## Third-Party Services

This extension **does not use third-party analytics, tracking services, or external APIs**.

## Permissions

The extension requires access to the active webpage only in order to read `dataLayer` events for debugging purposes.

## Changes to This Policy

This privacy policy may be updated if the extension functionality changes. Updates will be reflected in this document.

## Contact

If you have questions about this privacy policy, you can contact the developer:

David Hermoso
GitHub: https://github.com/jdavidhermoso
