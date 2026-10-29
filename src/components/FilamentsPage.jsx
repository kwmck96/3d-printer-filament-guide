import { useEffect, useMemo, useRef, useState } from 'react'
import { filaments, CATEGORIES } from '../data/filaments.js'
import { checkCompat } from '../lib/compat.js'
import { fmtTemp, normalize, toUnit } from '../lib/util.js'
import HeatRuler from './HeatRuler.jsx'
import { SettingName, SlicerFootnotes, FilamentChip, ProblemLink, StatusBadge, Difficulty } from './Bits.jsx'

const ENCLOSURE_TEXT = {
  avoid: ['Not needed', 'Avoid enclosed heat; open the lid on enclosed printers.'],
  none: ['Not needed', 'Prints fine on open-frame printers.'],
  recommended: ['Recommended', 'Larger parts warp without one.'],
  required: ['Required', 'Expect warping or cracking without one.'],
}
const NOZZLE_TEXT = {
  brass: ['Standard brass', 'No special nozzle needed.'],
  large: ['0.5 mm or larger', 'Small nozzles clog on the filler particles.'],
  hardened: ['Hardened steel', 'Abrasive: wears out brass quickly.'],
}
const EXTRUDER_TEXT = {
  any: ['Any', 'Bowden or direct drive.'],
  'direct-recommended': ['Direct drive recommended', 'Bowden works, slowly.'],
  'direct-required': ['Direct drive required', 'Soft filament buckles in Bowden tubes.'],
}
const VENT_TEXT = {
  none: ['None needed', 'Low fumes.'],
  recommended: ['Recommended', 'Print in a ventilated room.'],
  required: ['Required', 'Ventilate or use a filtered enclosure.'],
}
const DRY_TEXT = { optional: 'Optional', recommended: 'Recommended', required: 'Required' }
const LEVEL = { Required: 'high', 'Hardened steel': 'high', 'Direct drive required': 'high', Recommended: 'mid', 'Direct drive recommended': 'mid', '0.5 mm or larger': 'mid' }

function ReqRow({ label, value, detail }) {
  return (
    <div className="req">
      <dt>{label}</dt>
      <dd>
        <span className={`req__value req__value--${LEVEL[value] || 'low'}`}>{value}</span>
        {detail && <span className="req__detail">{detail}</span>}
      </dd>
    </div>
  )
}

function FilamentDetail({ f, unit, navigate, compat }) {
  const r = f.requirements
  const [encl, enclD] = ENCLOSURE_TEXT[r.enclosure]
  const [noz, nozD] = NOZZLE_TEXT[r.nozzle]
  const [ext, extD] = EXTRUDER_TEXT[r.extruder]
  const [vent, ventD] = VENT_TEXT[r.ventilation]
  const hotend = r.hotend === 'all-metal' ? ['All-metal hotend', 'PTFE-lined hotends shouldn’t run this hot.'] : ['Standard', 'Stock hotends are fine.']

  return (
    <div className="detail">
      <p className="detail__lede">{f.description}</p>

      {compat && compat.reasons.length > 0 && (
        <div className={`compat-box compat-box--${compat.status}`}>
          <p className="compat-box__title">On your printer</p>
          <ul>
            {compat.reasons.map((x, i) => (
              <li key={i} className={`compat-reason compat-reason--${x.level}`}>
                {x.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="detail__section">
        <h3>Temperatures</h3>
        <div className="rulers">
          <HeatRuler kind="nozzle" label="Nozzle" range={f.temps.nozzle} unit={unit} />
          <HeatRuler kind="bed" label="Bed" range={f.temps.bed} unit={unit} />
        </div>
        <p className="fine">
          The range is the tightest window the cited sources support; where brands disagree, the notes below say what each lists. The starting point is an editorial suggestion. Tune from it with a temperature tower, and follow your spool’s label when it disagrees.
        </p>
      </section>

      <section className="detail__section">
        <h3>What it takes to print</h3>
        <dl className="reqs">
          <ReqRow label="Enclosure" value={encl} detail={enclD} />
          <ReqRow label="Hotend" value={hotend[0]} detail={hotend[1]} />
          <ReqRow label="Nozzle" value={noz} detail={nozD} />
          <ReqRow label="Extruder" value={ext} detail={extD} />
          <ReqRow label="Ventilation" value={vent} detail={ventD} />
          <ReqRow
            label="Drying"
            value={DRY_TEXT[r.drying.level]}
            detail={`${fmtTemp(r.drying.temp, unit)} for ${r.drying.hours} h if damp${r.drying.level === 'required' ? ', and before long prints' : ''}.`}
          />
        </dl>
        {r.notes?.length > 0 && (
          <ul className="notes">
            {r.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="detail__section">
        <h3>Other settings to start from</h3>
        <dl className="settings">
          {f.settings.map((s) => (
            <div key={s.label} className="settings__row">
              <dt>
                <SettingName k={s.key}>{s.label}</SettingName>
              </dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="detail__section detail__split">
        <div>
          <h3>Strengths</h3>
          <ul className="traits traits--good">
            {f.strengths.map((s) => (
              <li key={s.tag}>
                <strong>{s.tag}.</strong> {s.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Weaknesses</h3>
          <ul className="traits traits--bad">
            {f.weaknesses.map((s) => (
              <li key={s.tag}>
                <strong>{s.tag}.</strong> {s.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="detail__section">
        <h3>Most common problems</h3>
        <ul className="fixes">
          {f.problems.map((p) => (
            <li key={p.id}>
              <ProblemLink id={p.id} navigate={navigate} />
              <span>{p.fix}</span>
            </li>
          ))}
        </ul>
        <p className="fine">Each problem links to the full troubleshooting guide on the Problems tab.</p>
      </section>

      <section className="detail__section">
        <h3>Alternatives</h3>
        <ul className="alts">
          {f.alternatives.map((a) => (
            <li key={a.id}>
              <FilamentChip id={a.id} navigate={navigate} />
              <span>{a.note}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--quiet" onClick={() => navigate('compare', [f.id, ...f.alternatives.slice(0, 2).map((a) => a.id)].join(','))}>
          Compare {f.name} with these
        </button>
      </section>

      <SlicerFootnotes keys={f.settings.map((s) => s.key)} navigate={navigate} />

      <section className="detail__section sources">
        <h4>Sources</h4>
        <ul>
          {f.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function FilamentsPage({ unit, printer, openId, navigate }) {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [hideNo, setHideNo] = useState(false)
  const [open, setOpen] = useState(() => new Set(openId ? [openId] : []))
  const refs = useRef({})

  useEffect(() => {
    if (!openId) return
    setOpen((prev) => new Set(prev).add(openId))
    setQuery('')
    setCat('all')
    requestAnimationFrame(() => refs.current[openId]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [openId])

  const compat = useMemo(() => {
    if (!printer.enabled) return {}
    return Object.fromEntries(filaments.map((f) => [f.id, checkCompat(f, printer, unit)]))
  }, [printer, unit])

  const q = normalize(query.trim())
  const visible = filaments.filter((f) => {
    if (cat !== 'all' && f.category !== cat) return false
    if (hideNo && compat[f.id]?.status === 'no') return false
    if (!q) return true
    const hay = normalize([f.name, f.fullName, f.summary, f.description, ...f.strengths.map((s) => s.tag)].join(' '))
    return hay.includes(q)
  })

  const toggle = (id) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="page">
      <header className="page__intro">
        <h1>Filaments</h1>
        <p>Temperatures, printer requirements and quirks for {filaments.length} filaments you can print on a consumer machine.</p>
      </header>

      <div className="toolbar">
        <label className="search">
          <span className="sr-only">Search filaments</span>
          <input type="search" placeholder="Search: PETG, outdoor, flexible…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="chips" role="group" aria-label="Filter by category">
          <button type="button" className={`chip${cat === 'all' ? ' is-on' : ''}`} onClick={() => setCat('all')}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} type="button" className={`chip${cat === c.id ? ' is-on' : ''}`} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        {printer.enabled && (
          <label className="check">
            <input type="checkbox" checked={hideNo} onChange={(e) => setHideNo(e.target.checked)} />
            Hide filaments my printer can’t print
          </label>
        )}
      </div>

      <div className="legend" aria-hidden="true">
        <span className="legend__swatch legend__swatch--band" /> recommended nozzle range
        <span className="legend__swatch legend__swatch--sweet" /> starting point
        <span className="legend__scale">scale {toUnit(180, unit)}–{toUnit(300, unit)} °{unit}</span>
      </div>

      {visible.length === 0 && (
        <p className="empty">
          No filaments match. Clear the search or pick another category.
        </p>
      )}

      <ul className="list">
        {visible.map((f) => {
          const isOpen = open.has(f.id)
          const c = compat[f.id]
          return (
            <li key={f.id} className={`item${isOpen ? ' is-open' : ''}`} ref={(el) => (refs.current[f.id] = el)} id={`f-${f.id}`}>
              <button type="button" className="item__head" aria-expanded={isOpen} aria-controls={`fd-${f.id}`} onClick={() => toggle(f.id)}>
                <span className="item__title">
                  <span className="item__name">{f.name}</span>
                  <span className="item__summary">{f.summary}</span>
                </span>
                <span className="item__meta">
                  <span className="item__temp">{fmtTemp(f.temps.nozzle.sweet, unit)}</span>
                  <HeatRuler kind="nozzle" range={f.temps.nozzle} unit={unit} compact />
                  <span className="item__badges">
                    <Difficulty level={f.difficulty} />
                    {c && <StatusBadge status={c.status} compact />}
                  </span>
                </span>
                <span className="item__chev" aria-hidden="true" />
              </button>
              {isOpen && (
                <div id={`fd-${f.id}`}>
                  <FilamentDetail f={f} unit={unit} navigate={navigate} compat={c} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

