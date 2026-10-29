import { filaments, filamentById, RATING_LABELS, RATING_INVERTED, CATEGORIES } from '../data/filaments.js'
import { checkCompat } from '../lib/compat.js'
import { fmtRange, fmtTemp } from '../lib/util.js'
import HeatRuler from './HeatRuler.jsx'
import { StatusBadge, Difficulty, ProblemLink } from './Bits.jsx'

const MAX = 3
const ENCL = { avoid: 'No (avoid enclosed heat)', none: 'No', recommended: 'Recommended', required: 'Required' }
const NOZ = { brass: 'Brass is fine', large: '0.5 mm+ recommended', hardened: 'Hardened required' }
const EXT = { any: 'Any', 'direct-recommended': 'Direct drive recommended', 'direct-required': 'Direct drive required' }
const VENT = { none: 'Not needed', recommended: 'Recommended', required: 'Required' }
const DRY = { optional: 'Optional', recommended: 'Recommended', required: 'Required' }

function Rating({ value, inverted }) {
  return (
    <span className={`meter${inverted ? ' meter--inverted' : ''}`} aria-label={`${value} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= value ? 'on' : ''} />
      ))}
    </span>
  )
}

export default function ComparePage({ ids, unit, printer, navigate }) {
  const selected = (ids || []).filter((id) => filamentById[id]).slice(0, MAX)
  const set = (list) => navigate('compare', list.join(','))
  const cols = selected.map((id) => filamentById[id])

  const change = (index, value) => {
    const next = [...selected]
    if (value === '') next.splice(index, 1)
    else next[index] = value
    set(next.filter((v, i, a) => a.indexOf(v) === i))
  }

  const slots = [...selected, ...(selected.length < MAX ? [''] : [])]

  const rows = [
    { label: 'Nozzle', render: (f) => <span className="tabular">{fmtRange(f.temps.nozzle.min, f.temps.nozzle.max, unit)} <span className="muted">start {fmtTemp(f.temps.nozzle.sweet, unit)}</span></span> },
    { label: 'Bed', render: (f) => <span className="tabular">{fmtRange(f.temps.bed.min, f.temps.bed.max, unit)} <span className="muted">start {fmtTemp(f.temps.bed.sweet, unit)}</span></span> },
    { label: 'Difficulty', render: (f) => <Difficulty level={f.difficulty} /> },
    { label: 'Enclosure', render: (f) => ENCL[f.requirements.enclosure] },
    { label: 'Hotend', render: (f) => (f.requirements.hotend === 'all-metal' ? 'All-metal' : 'Standard') },
    { label: 'Nozzle type', render: (f) => NOZ[f.requirements.nozzle] },
    { label: 'Extruder', render: (f) => EXT[f.requirements.extruder] },
    { label: 'Ventilation', render: (f) => VENT[f.requirements.ventilation] },
    { label: 'Drying', render: (f) => `${DRY[f.requirements.drying.level]} · ${fmtTemp(f.requirements.drying.temp, unit)}, ${f.requirements.drying.hours} h` },
    { label: 'Heat resistance', render: (f) => f.heatNote },
    ...Object.entries(RATING_LABELS).map(([k, label]) => ({
      label,
      rating: true,
      render: (f) => <Rating value={f.ratings[k]} inverted={RATING_INVERTED.has(k)} />,
    })),
    {
      label: 'Watch out for',
      render: (f) => (
        <span className="stack">
          {f.problems.slice(0, 3).map((p) => (
            <ProblemLink key={p.id} id={p.id} navigate={navigate} />
          ))}
        </span>
      ),
    },
  ]
  if (printer.enabled) rows.splice(2, 0, { label: 'On your printer', render: (f) => <StatusBadge status={checkCompat(f, printer, unit).status} /> })

  return (
    <div className="page page--wide">
      <header className="page__intro">
        <h1>Compare filaments</h1>
        <p>Pick up to three. Temperature ranges are drawn on the same scale so you can see the overlap at a glance.</p>
      </header>

      <div className="picker">
        {slots.map((id, i) => (
          <label key={i} className="picker__slot">
            <span className="picker__label">{i === 0 ? 'First filament' : i === 1 ? 'Second filament' : 'Third filament'}</span>
            <select value={id} onChange={(e) => change(i, e.target.value)}>
              <option value="">{id ? 'Remove' : 'Choose a filament…'}</option>
              {CATEGORIES.map((c) => (
                <optgroup key={c.id} label={c.label}>
                  {filaments
                    .filter((f) => f.category === c.id)
                    .map((f) => (
                      <option key={f.id} value={f.id} disabled={selected.includes(f.id) && f.id !== id}>
                        {f.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
        ))}
      </div>

      {cols.length === 0 ? (
        <div className="empty empty--compare">
          <p>Choose a filament above to start, or try a common matchup:</p>
          <div className="chip-row">
            {[
              ['pla', 'petg'],
              ['petg', 'pctg', 'asa'],
              ['abs', 'asa'],
              ['nylon', 'pa-cf', 'pc'],
              ['tpu-95a', 'tpu-soft'],
            ].map((pair) => (
              <button key={pair.join()} type="button" className="chip" onClick={() => set(pair)}>
                {pair.map((p) => filamentById[p].name).join(' vs ')}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <section className="overlay">
            <h3>Nozzle</h3>
            {cols.map((f) => (
              <div key={f.id} className="overlay__row">
                <span className="overlay__name">{f.name}</span>
                <HeatRuler kind="nozzle" range={f.temps.nozzle} unit={unit} compact />
              </div>
            ))}
            <HeatRuler kind="nozzle" range={{ min: 0, max: 0, sweet: 0 }} unit={unit} ticksOnly />
            <h3>Bed</h3>
            {cols.map((f) => (
              <div key={f.id} className="overlay__row">
                <span className="overlay__name">{f.name}</span>
                <HeatRuler kind="bed" range={f.temps.bed} unit={unit} compact />
              </div>
            ))}
            <HeatRuler kind="bed" range={{ min: 0, max: 0, sweet: 0 }} unit={unit} ticksOnly />
          </section>

          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Property</span></th>
                  {cols.map((f) => (
                    <th key={f.id} scope="col">
                      <a href={`#/filaments/${f.id}`} onClick={(e) => { e.preventDefault(); navigate('filaments', f.id) }}>
                        {f.name}
                      </a>
                      <span className="compare__sub">{f.summary}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className={row.rating ? 'is-rating' : ''}>
                    <th scope="row">{row.label}</th>
                    {cols.map((f) => (
                      <td key={f.id}>{row.render(f)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fine">
            Ratings are relative editorial judgments on a 1–5 scale for comparing these filaments with each other, not lab measurements. For moisture sensitivity and cost, a fuller bar is worse.
          </p>
        </>
      )}
    </div>
  )
}
