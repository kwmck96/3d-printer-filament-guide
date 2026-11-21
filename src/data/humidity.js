// Relative-humidity guidance per filament.
//
// What the bands mean: the relative humidity of the air around the spool while
// it feeds a print (a session of a few hours to about a day).
//   ideal    — RH at or below `ideal`
//   workable — above `ideal`, up to `workable`; expect to dry more often
//   issues   — above `workable`; moisture problems are likely within a session
//
// How they were set: no manufacturer publishes per-filament three-band RH
// limits. Bambu Lab and UltiMaker publish one storage target (below 20% RH for
// most filaments) and Bambu groups materials by how much moisture protection
// they need. The bands below are editorial: each filament is placed in a tier
// using those groupings plus measured absorption data (cited per tier). They
// are a guide for where to start worrying, not a measured limit.
//
// Long-term storage (days to months) is a separate, stricter target: below
// 20% RH for everything (Bambu, UltiMaker).

const HS = {
  bambuDry: { label: 'Bambu Lab wiki: drying filament', url: 'https://wiki.bambulab.com/en/filament-acc/filament/dry-filament' },
  bambuPva: { label: 'Bambu Lab wiki: PVA printing guide', url: 'https://wiki.bambulab.com/en/filament-acc/filament/pva-printing-guide' },
  umStorage: { label: 'UltiMaker: filament storage tips', url: 'https://ultimaker.com/learn/3d-printer-filament-storage-essential-tips-and-ideas/' },
  umPvaUptake: { label: 'UltiMaker: moisture uptake of PVA', url: 'https://support.ultimaker.com/articles/Knowledge/What-is-the-moisture-uptake-of-UltiMaker-PVA-2-85mm' },
  specialchem: { label: 'SpecialChem: water absorption of plastics', url: 'https://www.specialchem.com/plastics/guide/water-absorption-24-hours' },
  envalior: { label: 'Envalior: moisture diffusion in polyamides (PDF)', url: 'https://www.envalior.com/content/dam/envalior/en/documents/white-paper/envalior-moisture-diffusion-white-paper.pdf' },
  nylonStudy: { label: 'Influence of filament moisture on 3D printing nylon (Technologies, 2025)', url: 'https://www.mdpi.com/2227-7080/13/8/376' },
  prusaDry: { label: 'Prusa Knowledge Base: drying filament', url: 'https://help.prusa3d.com/article/drying-filament_332086' },
  all3dp: { label: 'All3DP: hygroscopy in 3D printing', url: 'https://all3dp.com/2/hygrosopy-3d-printing-guide/' },
  ftc: { label: 'FIRST Tech Challenge docs: filament storage', url: 'https://ftc-docs.firstinspires.org/manufacturing/3d_printing/filament_choice/filament_storage/filament_storage.html' },
}

export const HUMIDITY_GENERAL = {
  storage: 20,
  indoor: { min: 45, max: 65 },
  sources: [HS.bambuDry, HS.umStorage],
}

export const HUMIDITY_TIERS = {
  low: {
    label: 'Low moisture uptake',
    basis:
      'These plastics absorb comparatively little water (SpecialChem lists 0.01–0.3% for PP, HIPS and ASA). All3DP names ASA, PP and HIPS as less prone to moisture problems, and Bambu lists ABS and ASA as drying recommended with desiccant optional.',
    exposure: 'Tolerates ordinary room air for a print session; dry it if it has sat out for weeks.',
    sources: [HS.specialchem, HS.all3dp, HS.bambuDry, HS.ftc],
  },
  moderate: {
    label: 'Moderate moisture uptake',
    basis:
      'Bambu lists PLA and PETG (and their CF/GF versions) as drying recommended with desiccant optional. FIRST’s storage guide calls sealed storage highly recommended for PLA and PETG.',
    exposure: 'At about 55% RH, freshly dried filament can start losing print quality within about 2–12 hours (Bambu).',
    sources: [HS.bambuDry, HS.ftc],
  },
  high: {
    label: 'High moisture uptake',
    basis:
      'Bambu lists TPU and PC as drying required before use with desiccant required during use. Prusa names TPU among the materials that need drying more often than PLA.',
    exposure: 'Print from a dry box or dryer. At about 55% RH, freshly dried filament can degrade within hours (Bambu).',
    sources: [HS.bambuDry, HS.prusaDry],
  },
  severe: {
    label: 'Very high moisture uptake',
    basis:
      'Polyamides absorb the most water of the common filaments: PA6 reaches about 3 wt% at 50% RH and almost 6 wt% at 80% RH (Envalior). In a 2025 study, nylon 6 filament held at 80% RH and 40 °C showed bubble defects after 24 h and badly deteriorated extrusion by 48 h. Bambu lists PA and PVA as drying required with desiccant required during use.',
    exposure: 'Room air is in the problem range. Print straight from a dryer or sealed dry box.',
    sources: [HS.envalior, HS.nylonStudy, HS.bambuDry],
  },
}

// ideal: upper RH limit of the ideal band; workable: upper limit of the workable band.
export const humidity = {
  pla: { tier: 'moderate', ideal: 35, workable: 55 },
  'pla-plus': { tier: 'moderate', ideal: 35, workable: 55 },
  'silk-pla': { tier: 'moderate', ideal: 30, workable: 50, note: 'Silk blends string more than plain PLA, so moisture shows up sooner.' },
  petg: { tier: 'moderate', ideal: 30, workable: 50, note: 'PETG’s stringing gets noticeably worse when it is damp, so the bands sit lower than PLA’s.' },
  pctg: { tier: 'moderate', ideal: 30, workable: 50 },
  abs: {
    tier: 'low',
    ideal: 35,
    workable: 55,
    note: 'Water absorption varies widely by ABS grade (SpecialChem: 0.05–1.8%), so the bands sit a little lower than ASA’s.',
    sources: [HS.specialchem],
  },
  asa: { tier: 'low', ideal: 40, workable: 60 },
  hips: { tier: 'low', ideal: 40, workable: 60 },
  'tpu-95a': { tier: 'high', ideal: 20, workable: 35 },
  'tpu-soft': { tier: 'high', ideal: 15, workable: 30, note: 'Soft grades print with almost no retraction, so any moisture shows up as strings and bubbles.' },
  nylon: { tier: 'severe', ideal: 15, workable: 25 },
  pc: {
    tier: 'high',
    ideal: 20,
    workable: 35,
    note: 'Bambu warns that repeated drying and cooling can make PC brittle, so keep it sealed with desiccant after each drying.',
  },
  pp: {
    tier: 'low',
    ideal: 50,
    workable: 70,
    note: 'PP barely absorbs water (SpecialChem: 0.01–0.1%). It is the least humidity-sensitive filament here.',
    sources: [HS.specialchem],
  },
  'pla-cf': { tier: 'moderate', ideal: 35, workable: 55 },
  'petg-cf': { tier: 'moderate', ideal: 30, workable: 50 },
  'pa-cf': { tier: 'severe', ideal: 15, workable: 25, note: 'Carbon fill reduces how much the part warps, not how much water the nylon absorbs.' },
  wood: {
    tier: 'high',
    ideal: 25,
    workable: 40,
    note: 'Bambu lists wood-fill PLA as drying required and desiccant required, stricter than plain PLA, because the wood fibers take on water.',
  },
  'abrasive-pla': { tier: 'moderate', ideal: 35, workable: 55 },
  pva: {
    tier: 'severe',
    ideal: 15,
    workable: 25,
    note: 'At about 55% RH, freshly dried PVA gets damp in 1–3 hours (Bambu). UltiMaker found PVA in open office air (55% RH) went from 0.7 to over 4 wt% water in 8 weeks, past the 3.5 wt% point where it becomes unprintable. At 21% RH it only reached 1.1 wt%.',
    sources: [HS.bambuPva, HS.umPvaUptake],
  },
}

export function humidityBands(id) {
  const h = humidity[id]
  if (!h) return null
  return {
    ...h,
    tierInfo: HUMIDITY_TIERS[h.tier],
    sources: [...(h.sources || []), ...HUMIDITY_TIERS[h.tier].sources],
  }
}
