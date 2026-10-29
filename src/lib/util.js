import { useEffect, useState, useCallback } from 'react'

// ── Temperature units ──────────────────────────────────────────────
export const toUnit = (c, unit) => (unit === 'F' ? Math.round((c * 9) / 5 + 32) : c)
export const fmtTemp = (c, unit) => `${toUnit(c, unit)} °${unit}`
export const fmtRange = (min, max, unit) => `${toUnit(min, unit)}–${toUnit(max, unit)} °${unit}`

// ── Safe localStorage-backed state ─────────────────────────────────
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw == null ? initial : { ...initial, ...JSON.parse(raw) }
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable; keep in memory */
    }
  }, [key, value])
  return [value, setValue]
}

// ── Hash routing: #/filaments/petg, #/problems/stringing, #/compare/pla,petg ──
export function parseHash(hash) {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  const tab = ['filaments', 'problems', 'compare', 'slicers'].includes(parts[0]) ? parts[0] : 'filaments'
  return { tab, id: parts[1] ? decodeURIComponent(parts[1]) : null }
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  const navigate = useCallback((tab, id) => {
    const next = `#/${tab}${id ? `/${encodeURIComponent(id)}` : ''}`
    if (window.location.hash !== next) window.location.hash = next
    else setRoute(parseHash(next))
  }, [])
  return [route, navigate]
}

export const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
