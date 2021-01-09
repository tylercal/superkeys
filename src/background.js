let filters = []

function updateConfig() {
    filters = []
    chrome.storage.sync.get(results => {
        Object.entries(results).forEach(result => {
            filters = filters.concat(result[1].filters)
        })
    })
}

updateConfig();

// Storage was updated by another browser instance or the options page
chrome.storage.onChanged.addListener(changes => {
    chrome.storage.sync.get(updateConfig)
})

chrome.webNavigation.onCompleted.addListener(details => {
    if (details.frameId === 0) {
        const url = details.url
        let inject = false
        filters.forEach(filter => inject ||= url.includes(filter))
        if (inject) {
            chrome.tabs.executeScript(details.tabId, {file: 'src/script.js'})
        }
    }
})