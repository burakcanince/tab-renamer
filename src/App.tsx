import { useEffect, useState, type FormEvent } from "react"

const MAX_LENGTH = 80

type SavedTitle = { title: string; original: string }

const storageKey = (tabId: number) => `tab_${tabId}`

const applyTitle = (tabId: number, title: string) =>
  chrome.scripting.executeScript({
    target: { tabId },
    func: (newTitle: string) => {
      document.title = newTitle
    },
    args: [title],
  })

function App() {
  const [tabId, setTabId] = useState<number | null>(null)
  const [currentTitle, setCurrentTitle] = useState("")
  const [originalTitle, setOriginalTitle] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(async ([tab]) => {
      if (!tab?.id) return
      const key = storageKey(tab.id)
      const { [key]: saved } = await chrome.storage.session.get(key)
      setTabId(tab.id)
      setCurrentTitle(tab.title ?? "")
      setTitle(tab.title ?? "")
      setOriginalTitle((saved as SavedTitle | undefined)?.original ?? null)
    })
  }, [])

  const trimmed = title.trim()
  const canRename = tabId !== null && trimmed !== "" && trimmed !== currentTitle

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!canRename) return

    try {
      await applyTitle(tabId, trimmed)
      const saved: SavedTitle = { title: trimmed, original: originalTitle ?? currentTitle }
      await chrome.storage.session.set({ [storageKey(tabId)]: saved })
      window.close()
    } catch {
      setError("This page can't be renamed.")
    }
  }

  const handleReset = async () => {
    if (tabId === null || originalTitle === null) return

    try {
      await applyTitle(tabId, originalTitle)
      await chrome.storage.session.remove(storageKey(tabId))
      window.close()
    } catch {
      setError("This page can't be reset.")
    }
  }

  const buttonLabel = !trimmed ? "Type a title" : canRename ? "Rename tab" : "Same as current title"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pt-[18px] pb-5">
      <header className="flex items-center gap-2.5">
        <img src="/icon48.png" alt="" className="size-8" />
        <h1 className="font-display text-lg font-bold tracking-tight">Tab Renamer</h1>
      </header>

      <div className="flex items-center gap-3 rounded-[10px] border border-line bg-surface px-3 py-2.5">
        <div className="flex min-w-0 grow flex-col gap-0.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">Current tab</span>
          <span className="truncate text-[13px]">{currentTitle || "—"}</span>
        </div>
        {originalTitle !== null && (
          <button
            type="button"
            onClick={handleReset}
            title={`Restore "${originalTitle}"`}
            className="shrink-0 cursor-pointer rounded-md px-2 py-1 text-[13px] font-semibold text-accent hover:bg-accent/10"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <label htmlFor="title" className="text-[13px] font-semibold">
            New title
          </label>
          <span className="font-mono text-[11px] text-muted">
            {title.length} / {MAX_LENGTH}
          </span>
        </div>
        <input
          id="title"
          type="text"
          value={title}
          maxLength={MAX_LENGTH}
          autoFocus
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            setTitle(e.target.value)
            setError("")
          }}
          placeholder="Name this tab"
          className="h-11 rounded-[10px] border-[1.5px] border-line px-3.5 text-sm outline-none placeholder:text-placeholder focus:border-accent focus:ring-4 focus:ring-accent/15"
        />
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={!canRename}
        className="h-11 cursor-pointer rounded-[10px] bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted"
      >
        {buttonLabel}
      </button>
    </form>
  )
}

export default App
