import { useEffect, useRef, useState } from 'react'
import { problems, problemById, PROBLEM_GROUPS, TIER_LABELS } from '../data/problems.js'
import { normalize } from '../lib/util.js'
import { SettingName, SlicerFootnotes, FilamentChip, ProblemLink } from './Bits.jsx'

function ProblemDetail({ p, navigate }) {
  // Which filaments list this problem as one of their common ones.
  return (
    <div className="detail">
      <p className="detail__lede">{p.description}</p>

      <section className="detail__section">
        <h3>See what it looks like</h3>
        <p className="fine">These guides have real photos of the defect. They open on the publisher’s site.</p>
        <ul className="guides">
          {p.guides.map((g) => (
            <li key={g.url}>
              <a href={g.url} target="_blank" rel="noreferrer" className="guide">
                <span className="guide__site">{g.site}</span>
                <span className="guide__title">{g.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="detail__section">
        <h3>Why it happens</h3>
        <ul className="causes">
          {p.why.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </section>

      <section className="detail__section">
        <h3>How to fix it</h3>
        <p className="fine">Ordered from quickest to most involved. Change one thing at a time.</p>
        <ol className="steps">
          {p.steps.map((s, i) => (
            <li key={i} className={`step step--${s.tier}`}>
              <span className="step__tier">{TIER_LABELS[s.tier]}</span>
              <span className="step__text">
                {s.key ? <SettingName k={s.key}>{s.text}</SettingName> : s.text}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {p.hardwareOnly ? (
        <section className="detail__section">
          <h3>Does the filament matter?</h3>
          <p>Not much. This is a mechanical or motion problem; it looks the same whatever you print.</p>
        </section>
      ) : (
        <>
          {(p.mostLikely.length > 0 || p.leastLikely.length > 0) && (
            <section className="detail__section detail__split">
              {p.mostLikely.length > 0 && (
                <div>
                  <h3>Most prone</h3>
                  <div className="chip-row">
                    {p.mostLikely.map((id) => (
                      <FilamentChip key={id} id={id} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}
              {p.leastLikely.length > 0 && (
                <div>
                  <h3>Least prone</h3>
                  <div className="chip-row">
                    {p.leastLikely.map((id) => (
                      <FilamentChip key={id} id={id} navigate={navigate} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {p.byFilament.length > 0 && (
            <section className="detail__section">
              <h3>What to change, by filament</h3>
              <dl className="byfil">
                {p.byFilament.map((b) => (
                  <div key={b.id} className="byfil__row">
                    <dt>
                      <FilamentChip id={b.id} navigate={navigate} />
                    </dt>
                    <dd>{b.advice}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </>
      )}

      {p.related?.length > 0 && (
        <section className="detail__section">
          <h3>Often confused with or caused by</h3>
          <p className="related">
            {p.related.map((id, i) => (
              <span key={id}>
                {i > 0 && ', '}
                <ProblemLink id={id} navigate={navigate} />
              </span>
            ))}
          </p>
        </section>
      )}

      <SlicerFootnotes keys={p.steps.map((s) => s.key).filter(Boolean)} navigate={navigate} />
    </div>
  )
}

export default function ProblemsPage({ openId, navigate }) {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('all')
  const [open, setOpen] = useState(() => new Set(openId ? [openId] : []))
  const refs = useRef({})

  useEffect(() => {
    if (!openId || !problemById[openId]) return
    setOpen((prev) => new Set(prev).add(openId))
    setQuery('')
    setGroup('all')
    requestAnimationFrame(() => refs.current[openId]?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [openId])

  const q = normalize(query.trim())
  const visible = problems.filter((p) => {
    if (group !== 'all' && p.group !== group) return false
    if (!q) return true
    const hay = normalize([p.name, ...p.aka, p.summary, p.description].join(' '))
    return hay.includes(q)
  })

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="page">
      <header className="page__intro">
        <h1>Print problems</h1>
        <p>What {problems.length} common failures look like, why they happen, and what to change, including how the fix differs by filament.</p>
      </header>

      <div className="toolbar">
        <label className="search">
          <span className="sr-only">Search problems</span>
          <input type="search" placeholder="Search: strings, lifting corners, clicking…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <div className="chips" role="group" aria-label="Filter by type">
          <button type="button" className={`chip${group === 'all' ? ' is-on' : ''}`} onClick={() => setGroup('all')}>
            All
          </button>
          {PROBLEM_GROUPS.map((g) => (
            <button key={g.id} type="button" className={`chip${group === g.id ? ' is-on' : ''}`} onClick={() => setGroup(g.id)}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 && <p className="empty">No problems match. Try a different word, like “blob” or “warp”.</p>}

      <ul className="list">
        {visible.map((p) => {
          const isOpen = open.has(p.id)
          return (
            <li key={p.id} className={`item${isOpen ? ' is-open' : ''}`} ref={(el) => (refs.current[p.id] = el)} id={`p-${p.id}`}>
              <button type="button" className="item__head" aria-expanded={isOpen} aria-controls={`pd-${p.id}`} onClick={() => toggle(p.id)}>
                <span className="item__title">
                  <span className="item__name">{p.name}</span>
                  <span className="item__summary">{p.summary}</span>
                </span>
                <span className="item__meta item__meta--problem">
                  {p.aka.length > 0 && <span className="item__aka">also: {p.aka.join(', ')}</span>}
                </span>
                <span className="item__chev" aria-hidden="true" />
              </button>
              {isOpen && (
                <div id={`pd-${p.id}`}>
                  <ProblemDetail p={p} navigate={navigate} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

