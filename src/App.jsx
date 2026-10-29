import { useEffect, useState } from 'react'
import { useHashRoute, usePersistentState } from './lib/util.js'
import { DEFAULT_PRINTER } from './lib/compat.js'
import FilamentsPage from './components/FilamentsPage.jsx'
import ProblemsPage from './components/ProblemsPage.jsx'
import ComparePage from './components/ComparePage.jsx'
import SlicersPage from './components/SlicersPage.jsx'
import PrinterPanel from './components/PrinterPanel.jsx'

const TABS = [
  { id: 'filaments', label: 'Filaments' },
  { id: 'problems', label: 'Problems' },
  { id: 'compare', label: 'Compare' },
]

export default function App() {
  const [route, navigate] = useHashRoute()
  const [prefs, setPrefs] = usePersistentState('ffg.prefs', { unit: 'C' })
  const [printer, setPrinter] = usePersistentState('ffg.printer', DEFAULT_PRINTER)
  const [panelOpen, setPanelOpen] = useState(false)
  const unit = prefs.unit

  useEffect(() => {
    if (!route.id) window.scrollTo({ top: 0 })
  }, [route.tab, route.id])

  const titles = { filaments: 'Filaments', problems: 'Print problems', compare: 'Compare', slicers: 'Slicer names' }
  useEffect(() => {
    document.title = `${titles[route.tab]} · Filament Field Guide`
  })

  return (
    <div className="app">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="topbar__inner">
          <a
            className="brand"
            href="#/filaments"
            onClick={(e) => {
              e.preventDefault()
              navigate('filaments')
            }}
          >
            <span className="brand__mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            Filament Field Guide
          </a>
          <nav className="tabs" aria-label="Sections">
            {TABS.map((t) => (
              <a
                key={t.id}
                href={`#/${t.id}`}
                className={`tab${route.tab === t.id ? ' is-on' : ''}`}
                aria-current={route.tab === t.id ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(t.id)
                }}
              >
                {t.label}
              </a>
            ))}
          </nav>
          <div className="topbar__tools">
            <div className="unit" role="group" aria-label="Temperature unit">
              {['C', 'F'].map((u) => (
                <button key={u} type="button" className={unit === u ? 'is-on' : ''} aria-pressed={unit === u} onClick={() => setPrefs({ unit: u })}>
                  °{u}
                </button>
              ))}
            </div>
            <button type="button" className={`btn btn--printer${printer.enabled ? ' is-set' : ''}`} aria-expanded={panelOpen} onClick={() => setPanelOpen((o) => !o)}>
              <span className="long">My printer</span><span className="short">Printer</span>
              {printer.enabled && <span className="btn__dot" aria-label="(set)" />}
            </button>
          </div>
        </div>
        {panelOpen && (
          <div className="topbar__panel">
            <PrinterPanel printer={printer} setPrinter={setPrinter} unit={unit} onClose={() => setPanelOpen(false)} />
          </div>
        )}
      </header>

      <main id="main">
        {route.tab === 'filaments' && <FilamentsPage unit={unit} printer={printer} openId={route.id} navigate={navigate} />}
        {route.tab === 'problems' && <ProblemsPage openId={route.id} navigate={navigate} />}
        {route.tab === 'compare' && <ComparePage ids={route.id ? route.id.split(',') : []} unit={unit} printer={printer} navigate={navigate} />}
        {route.tab === 'slicers' && <SlicersPage />}
      </main>

      <footer className="footer">
        <p>
          Temperatures and settings are starting points compiled from manufacturer data sheets and published guides; each entry lists its sources. Your spool’s label and a temperature tower beat any table.
        </p>
        <p>
          <a
            href="#/slicers"
            onClick={(e) => {
              e.preventDefault()
              navigate('slicers')
            }}
          >
            Slicer setting names
          </a>
        </p>
      </footer>
    </div>
  )
}
