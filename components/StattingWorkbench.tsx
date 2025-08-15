'use client'

import { useMemo, useState } from 'react'

type MaterialType = 'Metal' | 'Cloth' | 'Beast' | 'Wood' | 'Medicine' | 'Mana'

type PositiveStatKey =
  | 'CD'
  | 'CD%'
  | 'ATK%'
  | '% Stronger Against Fire'

type NegativeStatKey = 'Dodge' | 'Natural HP regen' | 'MDEF%' | 'Accuracy'

interface PositiveStatDef {
  key: PositiveStatKey
  label: string
  maxLv: number
  potPerLevel: number
  material: MaterialType
  // Seed a per-level material point estimate from the example for quick feedback
  exampleCost?: { level: number; points: number }
}

interface NegativeStatDef {
  key: NegativeStatKey
  label: string
  // The UI shows "lv-16 means -22" etc. We model the MAX case for a first version
  maxLvLabel: string // e.g. 'lv-16'
  returnsPot: number // pot returned when applying MAX
  material: MaterialType
  exampleCost?: { amountLabel: string; points: number } // e.g. '-22' -> 74800
}

const POSITIVE_STATS: PositiveStatDef[] = [
  { key: 'CD%', label: 'Critical Damage%', maxLv: 11, potPerLevel: 10, material: 'Mana', exampleCost: { level: 10, points: 19250 } },
  { key: 'CD', label: 'Critical Damage', maxLv: 23, potPerLevel: 3, material: 'Mana', exampleCost: { level: 23, points: 71291 } },
  { key: 'ATK%', label: 'ATK%', maxLv: 15, potPerLevel: 10, material: 'Beast', exampleCost: { level: 10, points: 19250 } },
  { key: '% Stronger Against Fire', label: '% Stronger Against Fire', maxLv: 23, potPerLevel: 5, material: 'Mana', exampleCost: { level: 23, points: 108100 } },
]

const NEGATIVE_STATS: NegativeStatDef[] = [
  { key: 'Dodge', label: 'Dodge', maxLvLabel: 'lv-16', returnsPot: 79, material: 'Cloth', exampleCost: { amountLabel: '-22', points: 74800 } },
  { key: 'Natural HP regen', label: 'Natural HP Regen', maxLvLabel: 'lv-30', returnsPot: 76, material: 'Metal', exampleCost: { amountLabel: '-30', points: 236375 } },
  { key: 'MDEF%', label: 'MDEF%', maxLvLabel: 'lv-13', returnsPot: 70, material: 'Metal', exampleCost: { amountLabel: '-13', points: 40950 } },
  { key: 'Accuracy', label: 'Accuracy', maxLvLabel: 'lv-16', returnsPot: 39, material: 'Medicine', exampleCost: { amountLabel: '-22', points: 74800 } },
]

interface PositivePick {
  key: PositiveStatKey | ''
  level: number
}

interface NegativePick {
  key: NegativeStatKey | ''
  useMax: boolean
}

export default function StattingWorkbench() {
  const [originalPotential, setOriginalPotential] = useState<number>(120)
  const [positivePicks, setPositivePicks] = useState<PositivePick[]>([
    { key: 'CD', level: 23 },
    { key: 'CD%', level: 10 },
    { key: 'ATK%', level: 10 },
    { key: '% Stronger Against Fire', level: 23 },
  ])
  const [negativePicks, setNegativePicks] = useState<NegativePick[]>([
    { key: 'Dodge', useMax: true },
    { key: 'Natural HP regen', useMax: true },
    { key: 'MDEF%', useMax: true },
    { key: 'Accuracy', useMax: true },
  ])

  const positiveCostPot = useMemo(() => {
    return positivePicks.reduce((sum, pick) => {
      const def = POSITIVE_STATS.find((s) => s.key === pick.key)
      if (!def || pick.level <= 0) return sum
      return sum + def.potPerLevel * Math.min(pick.level, def.maxLv)
    }, 0)
  }, [positivePicks])

  const negativeReturnPot = useMemo(() => {
    return negativePicks.reduce((sum, pick) => {
      const def = NEGATIVE_STATS.find((s) => s.key === pick.key)
      if (!def || !pick.useMax) return sum
      return sum + def.returnsPot
    }, 0)
  }, [negativePicks])

  const remainingPot = originalPotential - positiveCostPot + negativeReturnPot

  // Material points per category (very first-pass approximation seeded by your example)
  const materialPoints = useMemo(() => {
    const acc: Record<MaterialType, number> = {
      Metal: 0,
      Cloth: 0,
      Beast: 0,
      Wood: 0,
      Medicine: 0,
      Mana: 0,
    }

    // Positive stats
    for (const pick of positivePicks) {
      const def = POSITIVE_STATS.find((s) => s.key === pick.key)
      if (!def || pick.level <= 0) continue
      let points = 0
      if (def.exampleCost) {
        // scale linearly from example seed
        points = Math.round((def.exampleCost.points / def.exampleCost.level) * Math.min(pick.level, def.maxLv))
      }
      acc[def.material] += points
    }

    // Negative stats
    for (const pick of negativePicks) {
      const def = NEGATIVE_STATS.find((s) => s.key === pick.key)
      if (!def || !pick.useMax) continue
      const points = def.exampleCost ? def.exampleCost.points : 0
      acc[def.material] += points
    }

    return acc
  }, [positivePicks, negativePicks])

  const updatePositive = (index: number, key: PositiveStatKey | '') => {
    setPositivePicks((prev) => {
      const next = [...prev]
      const def = POSITIVE_STATS.find((s) => s.key === key)
      next[index] = { key, level: def ? def.maxLv : 0 }
      return next
    })
  }

  const updatePositiveLevel = (index: number, level: number) => {
    setPositivePicks((prev) => {
      const next = [...prev]
      const def = POSITIVE_STATS.find((s) => s.key === next[index].key)
      const max = def ? def.maxLv : 0
      next[index] = { ...next[index], level: Math.max(0, Math.min(level, max)) }
      return next
    })
  }

  const updateNegative = (index: number, key: NegativeStatKey | '') => {
    setNegativePicks((prev) => {
      const next = [...prev]
      next[index] = { key, useMax: true }
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Statting Workbench (First Pass)</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="originalPot" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Original Potential
            </label>
            <input
              id="originalPot"
              type="number"
              min={0}
              value={originalPotential}
              onChange={(e) => setOriginalPotential(parseInt(e.target.value || '0', 10))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Positive Stats */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Positive Stats</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {positivePicks.map((pick, idx) => {
            const def = POSITIVE_STATS.find((s) => s.key === pick.key)
            const max = def?.maxLv ?? 0
            return (
              <div key={idx} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                <label htmlFor={`pos-${idx}`} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stat
                </label>
                <select
                  id={`pos-${idx}`}
                  value={pick.key}
                  onChange={(e) => updatePositive(idx, e.target.value as PositiveStatKey)}
                  className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">--- Choose Stat ---</option>
                  {POSITIVE_STATS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} (MaxLv: {s.maxLv}, Pot:{s.potPerLevel})
                    </option>
                  ))}
                </select>

                <label htmlFor={`pos-lv-${idx}`} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stat level
                </label>
                <input
                  id={`pos-lv-${idx}`}
                  type="number"
                  min={0}
                  max={max}
                  value={pick.level}
                  onChange={(e) => updatePositiveLevel(idx, parseInt(e.target.value || '0', 10))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Negative Stats */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Negative Stats</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {negativePicks.map((pick, idx) => {
            const def = NEGATIVE_STATS.find((s) => s.key === pick.key)
            return (
              <div key={idx} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                <label htmlFor={`neg-${idx}`} className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stat
                </label>
                <select
                  id={`neg-${idx}`}
                  value={pick.key}
                  onChange={(e) => updateNegative(idx, e.target.value as NegativeStatKey)}
                  className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">--- Choose Stat ---</option>
                  {NEGATIVE_STATS.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} (MAX {s.maxLvLabel}, Return:{s.returnsPot}pt)
                    </option>
                  ))}
                </select>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-700">MAX</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Summary</h3>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">Remaining Potential</div>
            <div className={`text-2xl font-bold ${remainingPot < 0 ? 'text-red-600' : 'text-green-600'}`}>{remainingPot}/{originalPotential}</div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Positive cost: {positiveCostPot}pt, Negative return: {negativeReturnPot}pt
            </div>
          </div>

          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Material Points (approx)</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {(Object.keys(materialPoints) as MaterialType[]).map((mat) => (
                <div key={mat} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{mat}:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{materialPoints[mat].toLocaleString()} pt</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-2 font-medium text-gray-900 dark:text-gray-100">Positive Stats</div>
            <div className="space-y-2 text-sm">
              {positivePicks.filter((p) => p.key && p.level > 0).map((p, i) => {
                const def = POSITIVE_STATS.find((s) => s.key === p.key)!
                const approx = def.exampleCost ? Math.round((def.exampleCost.points / def.exampleCost.level) * p.level) : 0
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {def.label}
                      <span className="ml-1 text-gray-500">{p.level > 0 ? `+${p.level}` : ''}</span>
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {approx.toLocaleString()} x {def.material}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
            <div className="mb-2 font-medium text-gray-900 dark:text-gray-100">Negative Stats (MAX)</div>
            <div className="space-y-2 text-sm">
              {negativePicks.filter((p) => p.key && p.useMax).map((p, i) => {
                const def = NEGATIVE_STATS.find((s) => s.key === p.key)!
                const points = def.exampleCost?.points ?? 0
                return (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      {def.label}
                      <span className="ml-1 text-gray-500">{def.exampleCost?.amountLabel ? def.exampleCost.amountLabel : def.maxLvLabel}</span>
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {points.toLocaleString()} x {def.material}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}