// popup.js
document.addEventListener('DOMContentLoaded', async () => {
    const toggleBtn = document.getElementById('toggleBtn');

    // 1. Safety check for the storage API
    if (!chrome.storage || !chrome.storage.local) {
        console.error("Storage API is not available. Check manifest.json permissions.");
        return;
    }

    try {
        // 2. Get current state to set button text
        const data = await chrome.storage.local.get("isStyleDisabled");
        let isCurrentlyDisabled = data.isStyleDisabled || false;
        toggleBtn.innerText = isCurrentlyDisabled ? "Enable CSS" : "Disable CSS";

        toggleBtn.addEventListener('click', async () => {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab?.id) {
                chrome.tabs.sendMessage(tab.id, { action: "toggleCSS" }, (response) => {
                    // Update state and UI based on what content.js reports back
                    if (chrome.runtime.lastError) {
                        console.error("Could not contact content script. Refresh the page!");
                        return;
                    }
                    toggleBtn.innerText = response.status ? "Enable CSS" : "Disable CSS";
                });
            }
        });
    } catch (error) {
        console.error("Error accessing local storage:", error);
    }
});