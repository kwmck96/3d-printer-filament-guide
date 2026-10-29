import { PRINTER_PRESETS, DEFAULT_PRINTER } from '../lib/compat.js'
import { toUnit } from '../lib/util.js'

const fromUnit = (v, unit) => (unit === 'F' ? Math.round(((v - 32) * 5) / 9) : v)

export default function PrinterPanel({ printer, setPrinter, unit, onClose }) {
  const set = (patch) => setPrinter((p) => ({ ...p, ...patch, enabled: true }))

  return (
    <section className="printer" aria-labelledby="printer-title">
      <div className="printer__head">
        <h2 id="printer-title">My printer</h2>
        <button type="button" className="btn btn--quiet" onClick={onClose}>
          Done
        </button>
      </div>
      <p className="fine">
        Describe your printer and every filament gets a compatibility badge. Saved in this browser only.
      </p>

      <div className="printer__presets" role="group" aria-label="Start from a preset">
        {PRINTER_PRESETS.map((p) => (
          <button key={p.id} type="button" className="chip" onClick={() => set(p.values)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="printer__grid">
        <label className="field">
          <span>Max nozzle temperature (°{unit})</span>
          <input
            type="number"
            inputMode="numeric"
            value={toUnit(printer.maxNozzle, unit)}
            onChange={(e) => set({ maxNozzle: fromUnit(Number(e.target.value) || 0, unit) })}
          />
        </label>
        <label className="field">
          <span>Max bed temperature (°{unit})</span>
          <input
            type="number"
            inputMode="numeric"
            value={toUnit(printer.maxBed, unit)}
            onChange={(e) => set({ maxBed: fromUnit(Number(e.target.value) || 0, unit) })}
          />
        </label>
        <label className="check">
          <input type="checkbox" checked={printer.enclosed} onChange={(e) => set({ enclosed: e.target.checked })} />
          Enclosed
        </label>
        <label className="check">
          <input type="checkbox" checked={printer.hardened} onChange={(e) => set({ hardened: e.target.checked })} />
          Hardened steel nozzle
        </label>
        <label className="check">
          <input type="checkbox" checked={printer.directDrive} onChange={(e) => set({ directDrive: e.target.checked })} />
          Direct-drive extruder
        </label>
        <label className="check">
          <input type="checkbox" checked={printer.ventilation} onChange={(e) => set({ ventilation: e.target.checked })} />
          Ventilation or filtration
        </label>
        <label className="check">
          <input type="checkbox" checked={printer.dryer} onChange={(e) => set({ dryer: e.target.checked })} />
          Filament dryer
        </label>
      </div>

      <div className="printer__foot">
        <label className="check">
          <input type="checkbox" checked={printer.enabled} onChange={(e) => setPrinter((p) => ({ ...p, enabled: e.target.checked }))} />
          Show compatibility badges
        </label>
        <button type="button" className="linkish" onClick={() => setPrinter({ ...DEFAULT_PRINTER })}>
          Reset
        </button>
      </div>
    </section>
  )
}
