// Run with: node scripts/validate-data.mjs
import { filaments, filamentById } from '../src/data/filaments.js'
import { problems, problemById } from '../src/data/problems.js'
import { glossary } from '../src/data/glossary.js'

const errors = []
const err = (m) => errors.push(m)

for (const f of filaments) {
  for (const k of ['nozzle', 'bed']) {
    const t = f.temps[k]
    if (!(t.min <= t.sweet && t.sweet <= t.max)) err(`${f.id}: ${k} sweet ${t.sweet} outside ${t.min}-${t.max}`)
  }
  f.problems.forEach((p) => problemById[p.id] || err(`${f.id}: unknown problem ${p.id}`))
  f.alternatives.forEach((a) => filamentById[a.id] || err(`${f.id}: unknown alternative ${a.id}`))
  f.alternatives.forEach((a) => a.id === f.id && err(`${f.id}: lists itself as alternative`))
  f.settings.forEach((s) => s.key && !glossary[s.key] && err(`${f.id}: unknown glossary key ${s.key}`))
  if (!f.sources?.length) err(`${f.id}: no sources`)
  if (!f.ratings || Object.keys(f.ratings).length !== 8) err(`${f.id}: ratings incomplete`)
}
for (const p of problems) {
  ;[...p.mostLikely, ...p.leastLikely, ...p.byFilament.map((b) => b.id)].forEach((id) => filamentById[id] || err(`${p.id}: unknown filament ${id}`))
  p.mostLikely.filter((id) => p.leastLikely.includes(id)).forEach((id) => err(`${p.id}: ${id} is both most and least likely`))
  p.steps.forEach((s) => s.key && !glossary[s.key] && err(`${p.id}: unknown glossary key ${s.key}`))
  ;(p.related || []).forEach((id) => problemById[id] || err(`${p.id}: unknown related ${id}`))
  if (!p.guides.length) err(`${p.id}: no photo guides`)
}
const ids = [...filaments.map((f) => f.id), ...problems.map((p) => p.id)]
ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => err(`duplicate id ${id}`))

console.log(`${filaments.length} filaments, ${problems.length} problems, ${Object.keys(glossary).length} glossary entries`)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log('OK')
