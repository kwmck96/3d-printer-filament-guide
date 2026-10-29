import { fmtTemp } from './util.js'

// Compares a filament's requirements with the user's printer profile.
// Returns { status: 'ok' | 'caution' | 'no', reasons: [{ level, text }] }.

export const DEFAULT_PRINTER = {
  enabled: false,
  maxNozzle: 260,
  maxBed: 100,
  enclosed: false,
  hardened: false,
  directDrive: true,
  ventilation: false,
  dryer: false,
}

export const PRINTER_PRESETS = [
  {
    id: 'basic-bowden',
    label: 'Budget open-frame (Bowden)',
    values: { maxNozzle: 240, maxBed: 100, enclosed: false, hardened: false, directDrive: false, ventilation: false, dryer: false },
  },
  {
    id: 'open-dd',
    label: 'Open-frame, direct drive',
    values: { maxNozzle: 300, maxBed: 110, enclosed: false, hardened: false, directDrive: true, ventilation: false, dryer: false },
  },
  {
    id: 'enclosed',
    label: 'Enclosed CoreXY, hardened nozzle',
    values: { maxNozzle: 300, maxBed: 110, enclosed: true, hardened: true, directDrive: true, ventilation: true, dryer: false },
  },
]

const RANK = { ok: 0, caution: 1, no: 2 }

export function checkCompat(f, p, unit = 'C') {
  const t = (c) => fmtTemp(c, unit)
  const reasons = []
  const add = (level, text) => reasons.push({ level, text })
  const r = f.requirements
  const { nozzle, bed } = f.temps

  if (p.maxNozzle < nozzle.min) add('no', `Needs at least ${t(nozzle.min)} at the nozzle; your printer tops out at ${t(p.maxNozzle)}.`)
  else if (p.maxNozzle < nozzle.sweet) add('caution', `Your max nozzle temperature is below the ${t(nozzle.sweet)} starting point; you’ll be printing at the low edge of the range.`)

  if (p.maxBed < bed.min) add('no', `Needs a bed of at least ${t(bed.min)}; your printer tops out at ${t(p.maxBed)}.`)
  else if (p.maxBed < bed.sweet) add('caution', `Your max bed temperature is below the ${t(bed.sweet)} starting point.`)

  if (r.enclosure === 'required' && !p.enclosed) add('no', 'Needs an enclosure; open-frame printers warp or crack most parts.')
  if (r.enclosure === 'recommended' && !p.enclosed) add('caution', 'An enclosure is recommended; expect warping on larger parts.')
  if (r.enclosure === 'avoid' && p.enclosed) add('caution', 'Open the door or lid while printing; enclosed heat causes heat creep with this material.')

  if (r.nozzle === 'hardened' && !p.hardened) add('no', 'Abrasive: needs a hardened steel (or similar) nozzle. It will wear out a brass nozzle quickly.')

  if (r.extruder === 'direct-required' && !p.directDrive) add('no', 'Needs a direct-drive extruder; Bowden setups buckle soft filament.')
  if (r.extruder === 'direct-recommended' && !p.directDrive) add('caution', 'Possible on Bowden, but slow and finicky; direct drive is recommended.')

  if (r.ventilation === 'required' && !p.ventilation) add('caution', 'Emits fumes: print in a ventilated room or with a filtered enclosure.')
  if (r.ventilation === 'recommended' && !p.ventilation) add('caution', 'Ventilation is recommended.')

  if (r.drying.level === 'required' && !p.dryer) add('caution', `Must be dried (about ${t(r.drying.temp)} for ${r.drying.hours} h); an oven works if you don’t own a dryer.`)

  const status = reasons.reduce((acc, x) => (RANK[x.level] > RANK[acc] ? x.level : acc), 'ok')
  return { status, reasons }
}

export const STATUS_LABEL = { ok: 'Compatible', caution: 'Possible with caveats', no: 'Not without upgrades' }
