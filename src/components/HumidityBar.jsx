import { HUMIDITY_GENERAL } from '../data/humidity.js'

// 0–100% RH bar split into ideal / workable / likely-issues bands, with a
// bracket showing typical indoor air (Bambu: 45–65% RH) for context.
export default function HumidityBar({ ideal, workable, compact = false, name }) {
  const { indoor } = HUMIDITY_GENERAL
  const desc = `${name ? `${name}: ` : ''}ideal at or below ${ideal}% RH, workable ${ideal}–${workable}%, likely issues above ${workable}%`

  return (
    <div className={`hbar${compact ? ' hbar--compact' : ''}`} role="img" aria-label={desc}>
      {!compact && (
        <dl className="hbar__legend">
          <div className="hbar__key hbar__key--ideal">
            <dt>Ideal</dt>
            <dd>≤ {ideal}%</dd>
          </div>
          <div className="hbar__key hbar__key--workable">
            <dt>Workable</dt>
            <dd>
              {ideal}–{workable}%
            </dd>
          </div>
          <div className="hbar__key hbar__key--issues">
            <dt>Likely issues</dt>
            <dd>&gt; {workable}%</dd>
          </div>
        </dl>
      )}
      <div className="hbar__track">
        <span className="hbar__seg hbar__seg--ideal" style={{ width: `${ideal}%` }} />
        <span className="hbar__seg hbar__seg--workable" style={{ left: `${ideal}%`, width: `${workable - ideal}%` }} />
        <span className="hbar__seg hbar__seg--issues" style={{ left: `${workable}%`, width: `${100 - workable}%` }} />
      </div>
      {!compact && (
        <div className="hbar__scale" aria-hidden="true">
          <span className="hbar__indoor" style={{ left: `${indoor.min}%`, width: `${indoor.max - indoor.min}%` }}>
            typical room air
          </span>
          {[0, 25, 50, 75, 100].map((t) => (
            <span key={t} className="hbar__tick" style={{ left: `${t}%` }}>
              {t}%
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
