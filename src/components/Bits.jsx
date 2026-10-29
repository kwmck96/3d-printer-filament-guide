import { glossary } from '../data/glossary.js'
import { filamentById } from '../data/filaments.js'
import { problemById } from '../data/problems.js'
import { STATUS_LABEL } from '../lib/compat.js'

// Setting label that gets an asterisk when the slicer name is unintuitive.
export function SettingName({ k, children }) {
  const g = k ? glossary[k] : null
  return (
    <>
      {children}
      {g?.unintuitive && (
        <sup className="fn-mark" title="Slicer names differ. See the note below.">
          *
        </sup>
      )}
    </>
  )
}

// Footnote block listing slicer names for every unintuitive key used above it.
export function SlicerFootnotes({ keys, navigate }) {
  const unique = [...new Set(keys)].filter((k) => glossary[k]?.unintuitive)
  if (!unique.length) return null
  return (
    <aside className="footnotes" aria-label="Slicer name notes">
      <p className="footnotes__intro">
        <sup>*</sup> Slicers name these settings differently:
      </p>
      <dl>
        {unique.map((k) => {
          const g = glossary[k]
          return (
            <div key={k} className="footnotes__row">
              <dt>{g.name}</dt>
              <dd>
                PrusaSlicer: {g.prusa}. Orca/Bambu: {g.orca}. Cura: {g.cura}.
              </dd>
            </div>
          )
        })}
      </dl>
      <button type="button" className="linkish" onClick={() => navigate('slicers')}>
        See all slicer names
      </button>
    </aside>
  )
}

export function FilamentChip({ id, navigate, note }) {
  const f = filamentById[id]
  if (!f) return null
  return (
    <a
      className="chip chip--filament"
      href={`#/filaments/${id}`}
      onClick={(e) => {
        e.preventDefault()
        navigate('filaments', id)
      }}
      title={note}
    >
      {f.name}
    </a>
  )
}

export function ProblemLink({ id, navigate, children }) {
  const p = problemById[id]
  if (!p) return null
  return (
    <a
      className="problem-link"
      href={`#/problems/${id}`}
      onClick={(e) => {
        e.preventDefault()
        navigate('problems', id)
      }}
    >
      {children || p.name}
    </a>
  )
}

export function StatusBadge({ status, compact }) {
  return (
    <span className={`status status--${status}`}>
      <span className="status__dot" aria-hidden="true" />
      {compact ? <span className="sr-only">{STATUS_LABEL[status]}</span> : STATUS_LABEL[status]}
    </span>
  )
}

export function Difficulty({ level }) {
  return (
    <span className="difficulty" aria-label={`Difficulty ${level} of 5`} title={`Difficulty ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= level ? 'on' : ''} />
      ))}
    </span>
  )
}
