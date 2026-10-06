chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status !== "complete") return

  const key = `tab_${tabId}`
  const { [key]: saved } = await chrome.storage.session.get(key)
  if (!saved) return

  chrome.scripting
    .executeScript({
      target: { tabId },
      func: (newTitle) => {
        document.title = newTitle
      },
      args: [saved.title],
    })
    .catch(() => {})
})

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(`tab_${tabId}`)
})
