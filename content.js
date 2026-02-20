// popup.js
document.addEventListener('DOMContentLoaded', async () => {
    const toggleBtn = document.getElementById('toggleBtn');

    // 1. Get the current state from storage
    const data = await chrome.storage.local.get("isStyleDisabled");
    let isCurrentlyDisabled = data.isStyleDisabled || false;
    
    // Set initial button text
    toggleBtn.innerText = isCurrentlyDisabled ? "Enable CSS" : "Disable CSS";

    toggleBtn.addEventListener('click', async () => {
        // Flip the value
        isCurrentlyDisabled = !isCurrentlyDisabled;

        // 2. Save the NEW value to storage immediately
        await chrome.storage.local.set({ isStyleDisabled: isCurrentlyDisabled });
        
        // 3. Update the button UI
        toggleBtn.innerText = isCurrentlyDisabled ? "Enable CSS" : "Disable CSS";

        // 4. Tell the Content Script to update the page
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { 
                action: "toggleCSS", 
                isNowDisabled: isCurrentlyDisabled 
            }).catch(err => console.log("Content script not ready yet."));
        }
    });
});