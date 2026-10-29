import { toUnit } from '../lib/util.js'

// Fixed scales so every filament is drawn on the same ruler and ranges are
// directly comparable across cards and in the Compare view.
const SCALES = {
  nozzle: { lo: 180, hi: 300, ticks: [180, 200, 220, 240, 260, 280, 300] },
  bed: { lo: 20, hi: 120, ticks: [20, 40, 60, 80, 100, 120] },
}

const frac = (v, { lo, hi }) => ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * 100
const pct = (v, scale) => `${frac(v, scale)}%`

export default function HeatRuler({ kind, range, unit, label, compact = false, showTicks = true, ticksOnly = false }) {
  const scale = SCALES[kind]
  if (ticksOnly) {
    return (
      <div className="ruler ruler--axis" aria-hidden="true">
        <div className="ruler__ticks">
          {scale.ticks.map((t) => (
            <span key={t} style={{ left: pct(t, scale) }}>
              {toUnit(t, unit)}°
            </span>
          ))}
        </div>
      </div>
    )
  }
  const { min, max, sweet } = range
  const clip = `inset(0 ${100 - frac(max, scale)}% 0 ${frac(min, scale)}%)`
  const desc = `${label ? `${label}: ` : ''}${toUnit(min, unit)} to ${toUnit(max, unit)} °${unit}, starting point ${toUnit(sweet, unit)} °${unit}`

  return (
    <div className={`ruler ruler--${kind}${compact ? ' ruler--compact' : ''}`} role="img" aria-label={desc}>
      {!compact && (
        <div className="ruler__head">
          {label && <span className="ruler__label">{label}</span>}
          <span className="ruler__range">
            {toUnit(min, unit)}–{toUnit(max, unit)}°{unit}
          </span>
          <span className="ruler__sweet-text">
            start at <strong>{toUnit(sweet, unit)}°{unit}</strong>
          </span>
        </div>
      )}
      <div className="ruler__track">
        <div className="ruler__heat" />
        <div className="ruler__band" style={{ clipPath: clip }} />
        <div className="ruler__sweet" style={{ left: pct(sweet, scale) }} />
      </div>
      {!compact && showTicks && (
        <div className="ruler__ticks" aria-hidden="true">
          {scale.ticks.map((t) => (
            <span key={t} style={{ left: pct(t, scale) }}>
              {toUnit(t, unit)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
