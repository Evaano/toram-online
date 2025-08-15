'use client'

import { useState, useEffect } from 'react'
import {
  CalculatorIcon,
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface Stat {
  name: string
  value: number
  maxValue: number
  priority: 'high' | 'medium' | 'low'
  cost: number
}

interface Equipment {
  type: 'weapon' | 'armor' | 'accessory'
  name: string
  level: number
  currentStats: Stat[]
  targetStats: Stat[]
  enhancementLevel: number
}

interface StattingFormula {
  materials: string[]
  successRate: number
  cost: number
  steps: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

const STAT_TYPES = {
  weapon: [
    { name: 'ATK', maxValue: 999, baseCost: 100 },
    { name: 'MATK', maxValue: 999, baseCost: 100 },
    { name: 'CRIT', maxValue: 100, baseCost: 150 },
    { name: 'CRIT DMG', maxValue: 100, baseCost: 200 },
    { name: 'ACCURACY', maxValue: 100, baseCost: 120 },
    { name: 'PENETRATION', maxValue: 100, baseCost: 180 },
    { name: 'MP', maxValue: 999, baseCost: 80 },
    { name: 'HP', maxValue: 999, baseCost: 80 },
  ],
  armor: [
    { name: 'DEF', maxValue: 999, baseCost: 100 },
    { name: 'MDEF', maxValue: 999, baseCost: 100 },
    { name: 'HP', maxValue: 999, baseCost: 80 },
    { name: 'MP', maxValue: 999, baseCost: 80 },
    { name: 'AGI', maxValue: 100, baseCost: 150 },
    { name: 'VIT', maxValue: 100, baseCost: 150 },
    { name: 'INT', maxValue: 100, baseCost: 150 },
    { name: 'STR', maxValue: 100, baseCost: 150 },
  ],
  accessory: [
    { name: 'HP', maxValue: 999, baseCost: 80 },
    { name: 'MP', maxValue: 999, baseCost: 80 },
    { name: 'AGI', maxValue: 100, baseCost: 150 },
    { name: 'VIT', maxValue: 100, baseCost: 150 },
    { name: 'INT', maxValue: 100, baseCost: 150 },
    { name: 'STR', maxValue: 100, baseCost: 150 },
    { name: 'CRIT', maxValue: 100, baseCost: 150 },
    { name: 'CRIT DMG', maxValue: 100, baseCost: 200 },
  ],
}

const CHARACTER_CLASSES = [
  'Swordman',
  'Knight',
  'Archer',
  'Hunter',
  'Mage',
  'Priest',
  'Dark Mage',
  'Monk',
  'Assassin',
  'Paladin',
  'Sorcerer',
  'Bard',
]

export default function AutoStattingCalculator() {
  const [selectedClass, setSelectedClass] = useState('')
  const [buildType, setBuildType] = useState<'dps' | 'tank' | 'support' | 'hybrid'>('dps')
  const [equipment, setEquipment] = useState<Equipment>({
    type: 'weapon',
    name: '',
    level: 1,
    currentStats: [],
    targetStats: [],
    enhancementLevel: 0,
  })
  const [autoCalculatedStats, setAutoCalculatedStats] = useState<Stat[]>([])
  const [stattingFormulas, setStattingFormulas] = useState<StattingFormula[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Auto-calculate optimal stats based on class and build type
  const calculateOptimalStats = () => {
    if (!selectedClass || !equipment.type) return

    const availableStats = STAT_TYPES[equipment.type]
    const calculatedStats: Stat[] = []

    // Base priority system based on class and build
    const priorityMap = getPriorityMap(selectedClass, buildType)

    availableStats.forEach((stat, index) => {
      const priority = priorityMap[stat.name] || 'medium'
      const maxValue = Math.min(stat.maxValue, equipment.level * 10)

      // Calculate optimal value based on priority and build type
      let optimalValue = 0
      switch (priority) {
        case 'high':
          optimalValue = Math.floor(maxValue * 0.8)
          break
        case 'medium':
          optimalValue = Math.floor(maxValue * 0.6)
          break
        case 'low':
          optimalValue = Math.floor(maxValue * 0.3)
          break
      }

      calculatedStats.push({
        name: stat.name,
        value: optimalValue,
        maxValue: maxValue,
        priority: priority,
        cost: stat.baseCost * (optimalValue / 100),
      })
    })

    // Sort by priority and value
    calculatedStats.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority] || b.value - a.value
    })

    setAutoCalculatedStats(calculatedStats)
    generateStattingFormulas(calculatedStats)
  }

  const getPriorityMap = (characterClass: string, build: string) => {
    const maps: Record<string, Record<string, 'high' | 'medium' | 'low'>> = {
      Swordman: {
        ATK: 'high',
        CRIT: 'high',
        'CRIT DMG': 'high',
        HP: 'medium',
        DEF: 'medium',
        STR: 'medium',
        AGI: 'low',
        MP: 'low',
      },
      Mage: {
        MATK: 'high',
        MP: 'high',
        INT: 'high',
        CRIT: 'medium',
        HP: 'medium',
        MDEF: 'medium',
        ATK: 'low',
        DEF: 'low',
      },
      Archer: {
        ATK: 'high',
        CRIT: 'high',
        'CRIT DMG': 'high',
        ACCURACY: 'high',
        AGI: 'medium',
        HP: 'medium',
        MP: 'low',
        DEF: 'low',
      },
    }

    return maps[characterClass] || {}
  }

  const generateStattingFormulas = (stats: Stat[]) => {
    const formulas: StattingFormula[] = []

    stats.forEach((stat) => {
      if (stat.priority === 'high') {
        // High priority stats get multiple formulas with different success rates
        formulas.push({
          materials: ['High Grade Material', 'Premium Catalyst'],
          successRate: 85,
          cost: stat.cost * 2,
          steps: [
            'Apply base statting material',
            'Use premium catalyst for enhancement',
            'Apply final stat boost',
          ],
          riskLevel: 'low',
        })

        formulas.push({
          materials: ['Standard Material', 'Basic Catalyst'],
          successRate: 65,
          cost: stat.cost * 1.2,
          steps: ['Apply base statting material', 'Use basic catalyst', 'Apply stat boost'],
          riskLevel: 'medium',
        })
      } else if (stat.priority === 'medium') {
        formulas.push({
          materials: ['Standard Material'],
          successRate: 75,
          cost: stat.cost,
          steps: ['Apply standard statting material', 'Apply stat boost'],
          riskLevel: 'medium',
        })
      } else {
        formulas.push({
          materials: ['Basic Material'],
          successRate: 90,
          cost: stat.cost * 0.8,
          steps: ['Apply basic statting material'],
          riskLevel: 'low',
        })
      }
    })

    setStattingFormulas(formulas)
  }

  const applyAutoStats = () => {
    setEquipment((prev) => ({
      ...prev,
      targetStats: autoCalculatedStats,
    }))
  }

  const resetStats = () => {
    setAutoCalculatedStats([])
    setStattingFormulas([])
    setEquipment((prev) => ({
      ...prev,
      targetStats: [],
    }))
  }

  return (
    <div className="space-y-8">
      {/* Configuration Section */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <CogIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Character & Build Configuration
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="characterClass"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Character Class
            </label>
            <select
              id="characterClass"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Class</option>
              {CHARACTER_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="buildType"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Build Type
            </label>
            <select
              id="buildType"
              value={buildType}
              onChange={(e) =>
                setBuildType(e.target.value as 'dps' | 'tank' | 'support' | 'hybrid')
              }
              className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="dps">DPS (Damage)</option>
              <option value="tank">Tank (Defense)</option>
              <option value="support">Support (Healing/Buffs)</option>
              <option value="hybrid">Hybrid (Balanced)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="equipmentType"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Equipment Type
            </label>
            <select
              id="equipmentType"
              value={equipment.type}
              onChange={(e) =>
                setEquipment((prev) => ({
                  ...prev,
                  type: e.target.value as 'weapon' | 'armor' | 'accessory',
                }))
              }
              className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="weapon">Weapon</option>
              <option value="armor">Armor</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={calculateOptimalStats}
            disabled={!selectedClass}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CalculatorIcon className="h-5 w-5" />
            Calculate Optimal Stats
          </button>

          <button
            onClick={resetStats}
            className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Auto-Calculated Stats */}
      {autoCalculatedStats.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Auto-Calculated Optimal Stats
            </h2>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {autoCalculatedStats.map((stat, index) => (
              <div
                key={index}
                className={`rounded-lg border-2 p-4 ${
                  stat.priority === 'high'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : stat.priority === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {stat.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      stat.priority === 'high'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : stat.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}
                  >
                    {stat.priority.toUpperCase()}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Max: {stat.maxValue} | Cost: {Math.round(stat.cost)}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={applyAutoStats}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            <SparklesIcon className="h-5 w-5" />
            Apply Auto-Calculated Stats
          </button>
        </div>
      )}

      {/* Statting Formulas */}
      {stattingFormulas.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recommended Statting Formulas
            </h2>
          </div>

          <div className="space-y-4">
            {stattingFormulas.map((formula, index) => (
              <div
                key={index}
                className={`rounded-lg border-2 p-4 ${
                  formula.riskLevel === 'low'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : formula.riskLevel === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Formula #{index + 1}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Success Rate: <span className="font-medium">{formula.successRate}%</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      formula.riskLevel === 'low'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : formula.riskLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {formula.riskLevel.toUpperCase()} RISK
                  </span>
                </div>

                <div className="mb-3">
                  <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">Materials:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formula.materials.map((material, matIndex) => (
                      <span
                        key={matIndex}
                        className="rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="mb-2 font-medium text-gray-900 dark:text-gray-100">Steps:</h4>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {formula.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Cost: {Math.round(formula.cost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Options */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
        >
          <CogIcon className="h-5 w-5" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="equipmentLevel"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Equipment Level
                </label>
                <input
                  id="equipmentLevel"
                  type="number"
                  min="1"
                  max="200"
                  value={equipment.level}
                  onChange={(e) =>
                    setEquipment((prev) => ({
                      ...prev,
                      level: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="enhancementLevel"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Enhancement Level
                </label>
                <input
                  id="enhancementLevel"
                  type="number"
                  min="0"
                  max="10"
                  value={equipment.enhancementLevel}
                  onChange={(e) =>
                    setEquipment((prev) => ({
                      ...prev,
                      enhancementLevel: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="mt-0.5 h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Advanced Configuration
                  </h4>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    These settings affect the calculation of optimal stats and success rates. Higher
                    equipment levels and enhancement levels may require more expensive materials but
                    can achieve higher stat values.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium text-blue-900 dark:text-blue-100">
              About Lazy Tanaka Auto Statting
            </h3>
            <p className="mb-3 text-blue-800 dark:text-blue-200">
              This system automatically calculates optimal stat distributions for your Toram Online
              character builds, inspired by Tanaka's Buki Proper statting tools. It analyzes your
              character class, build type, and equipment to suggest the most effective stat
              allocations with high success rates.
            </p>
            <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <p>
                <strong>High Priority:</strong> Core stats essential for your build
              </p>
              <p>
                <strong>Medium Priority:</strong> Important supporting stats
              </p>
              <p>
                <strong>Low Priority:</strong> Nice-to-have stats when resources allow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
