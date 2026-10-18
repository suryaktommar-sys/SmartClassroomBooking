function TopBar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-navy-100 bg-white px-4 py-3 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-navy-100 text-navy-900 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-navy-500">College Administration</p>
          <h1 className="text-lg font-semibold text-navy-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-navy-900">Faculty User</p>
          <p className="text-xs text-slate-500">Sample account</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-sm font-semibold text-white">
          FU
        </div>
      </div>
    </header>
  )
}

export default TopBar
