'use client'

import { useState, useEffect } from 'react'
import {
  CalculatorIcon,
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

interface StattingFormula {
  id: string
  name: string
  materials: string[]
  baseSuccessRate: number
  smithLevel: number
  baseLevel: number
  startingPotential: number
  targetPotential: number
  steps: number
  notes: string
}

interface StattingResult {
  success: boolean
  finalPotential: number
  successRate: number
  materialsUsed: string[]
  cost: number
}

const DEFAULT_FORMULAS: StattingFormula[] = [
  {
    id: '1',
    name: 'Basic ATK Enhancement',
    materials: ['Sharpening Stone', 'Basic Catalyst'],
    baseSuccessRate: 75,
    smithLevel: 50,
    baseLevel: 100,
    startingPotential: 100,
    targetPotential: 150,
    steps: 3,
    notes: 'Basic weapon enhancement formula',
  },
  {
    id: '2',
    name: 'Critical Strike Enhancement',
    materials: ['Critical Gem', 'Advanced Catalyst'],
    baseSuccessRate: 60,
    smithLevel: 80,
    baseLevel: 150,
    startingPotential: 120,
    targetPotential: 200,
    steps: 5,
    notes: 'High-risk critical enhancement',
  },
  {
    id: '3',
    name: 'Defense Reinforcement',
    materials: ['Reinforced Cloth', 'Defense Catalyst'],
    baseSuccessRate: 85,
    smithLevel: 40,
    baseLevel: 80,
    startingPotential: 80,
    targetPotential: 130,
    steps: 2,
    notes: 'Safe armor enhancement',
  },
]

export default function ToramStattingSimulator() {
  const [formulas, setFormulas] = useState<StattingFormula[]>(DEFAULT_FORMULAS)
  const [selectedFormula, setSelectedFormula] = useState<StattingFormula | null>(null)
  const [simulationResults, setSimulationResults] = useState<StattingResult[]>([])
  const [showNewFormula, setShowNewFormula] = useState(false)
  const [newFormula, setNewFormula] = useState<Omit<StattingFormula, 'id'>>({
    name: '',
    materials: [''],
    baseSuccessRate: 75,
    smithLevel: 50,
    baseLevel: 100,
    startingPotential: 100,
    targetPotential: 150,
    steps: 3,
    notes: '',
  })

  const calculateSuccessRate = (
    formula: StattingFormula,
    smithLevel: number,
    baseLevel: number
  ): number => {
    // Base success rate calculation based on Toram mechanics
    let successRate = formula.baseSuccessRate

    // Smith level bonus (higher smith level = higher success)
    const smithBonus = Math.min((smithLevel - 50) * 0.5, 20)
    successRate += smithBonus

    // Base level penalty (higher base level = lower success)
    const levelPenalty = Math.max((baseLevel - 100) * 0.3, 0)
    successRate -= levelPenalty

    // Material quality bonus
    const materialBonus = formula.materials.length * 5
    successRate += materialBonus

    // Potential difference penalty
    const potentialDiff = formula.targetPotential - formula.startingPotential
    const potentialPenalty = Math.max(potentialDiff * 0.2, 0)
    successRate -= potentialPenalty

    return Math.max(Math.min(successRate, 95), 5) // Clamp between 5% and 95%
  }

  const simulateStatting = (
    formula: StattingFormula,
    iterations: number = 100
  ): StattingResult[] => {
    const results: StattingResult[] = []

    for (let i = 0; i < iterations; i++) {
      const successRate = calculateSuccessRate(formula, formula.smithLevel, formula.baseLevel)
      const random = Math.random() * 100
      const success = random <= successRate

      let finalPotential = formula.startingPotential
      if (success) {
        // Success: gain potential based on formula
        const potentialGain = Math.floor(
          (formula.targetPotential - formula.startingPotential) * (0.7 + Math.random() * 0.6)
        )
        finalPotential = Math.min(
          formula.startingPotential + potentialGain,
          formula.targetPotential
        )
      } else {
        // Failure: lose some potential
        const potentialLoss = Math.floor(formula.startingPotential * 0.1 + Math.random() * 10)
        finalPotential = Math.max(formula.startingPotential - potentialLoss, 0)
      }

      results.push({
        success,
        finalPotential,
        successRate,
        materialsUsed: formula.materials,
        cost: formula.materials.length * 1000, // Simplified cost calculation
      })
    }

    return results
  }

  const runSimulation = () => {
    if (!selectedFormula) return

    const results = simulateStatting(selectedFormula, 100)
    setSimulationResults(results)
  }

  const addNewFormula = () => {
    if (!newFormula.name || newFormula.materials[0] === '') return

    const formula: StattingFormula = {
      ...newFormula,
      id: Date.now().toString(),
    }

    setFormulas([...formulas, formula])
    setNewFormula({
      name: '',
      materials: [''],
      baseSuccessRate: 75,
      smithLevel: 50,
      baseLevel: 100,
      startingPotential: 100,
      targetPotential: 150,
      steps: 3,
      notes: '',
    })
    setShowNewFormula(false)
  }

  const removeFormula = (id: string) => {
    setFormulas(formulas.filter((f) => f.id !== id))
    if (selectedFormula?.id === id) {
      setSelectedFormula(null)
    }
  }

  const addMaterial = () => {
    setNewFormula((prev) => ({
      ...prev,
      materials: [...prev.materials, ''],
    }))
  }

  const removeMaterial = (index: number) => {
    setNewFormula((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }))
  }

  const updateMaterial = (index: number, value: string) => {
    setNewFormula((prev) => ({
      ...prev,
      materials: prev.materials.map((mat, i) => (i === index ? value : mat)),
    }))
  }

  const getSuccessRateColor = (rate: number): string => {
    if (rate >= 80) return 'text-green-600'
    if (rate >= 60) return 'text-yellow-600'
    if (rate >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getSuccessRateBg = (rate: number): string => {
    if (rate >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (rate >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    if (rate >= 40) return 'bg-orange-100 dark:bg-orange-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <CalculatorIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Toram Online Statting Simulator
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Test statting formulas and calculate success rates. Based on actual Toram Online
          mechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Formula Selection */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Available Formulas
              </h3>
              <button
                onClick={() => setShowNewFormula(true)}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4" />
                Add Formula
              </button>
            </div>

            <div className="space-y-3">
              {formulas.map((formula) => (
                <div
                  key={formula.id}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                    selectedFormula?.id === formula.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedFormula(formula)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedFormula(formula)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {formula.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formula.materials.join(' + ')}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getSuccessRateBg(formula.baseSuccessRate)} ${getSuccessRateColor(formula.baseSuccessRate)}`}
                        >
                          {formula.baseSuccessRate}% Base Success
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Smith: {formula.smithLevel}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFormula(formula.id)
                      }}
                      className="ml-2 rounded-md p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Formula Form */}
          {showNewFormula && (
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Add New Formula
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="formulaName"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Formula Name
                  </label>
                  <input
                    id="formulaName"
                    type="text"
                    value={newFormula.name}
                    onChange={(e) => setNewFormula((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter formula name"
                  />
                </div>

                <div>
                  <fieldset>
                    <legend className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Materials
                    </legend>
                    <div className="space-y-2">
                      {newFormula.materials.map((material, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={material}
                            onChange={(e) => updateMaterial(index, e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            placeholder="Material name"
                            aria-label={`Material ${index + 1}`}
                          />
                          {newFormula.materials.length > 1 && (
                            <button
                              onClick={() => removeMaterial(index)}
                              className="rounded-md p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addMaterial}
                        className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add Material
                      </button>
                    </div>
                  </fieldset>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="baseSuccess"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Base Success Rate (%)
                    </label>
                    <input
                      id="baseSuccess"
                      type="number"
                      min="1"
                      max="100"
                      value={newFormula.baseSuccessRate}
                      onChange={(e) =>
                        setNewFormula((prev) => ({
                          ...prev,
                          baseSuccessRate: parseInt(e.target.value) || 75,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="smithLevel"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Smith Level
                    </label>
                    <input
                      id="smithLevel"
                      type="number"
                      min="1"
                      max="200"
                      value={newFormula.smithLevel}
                      onChange={(e) =>
                        setNewFormula((prev) => ({
                          ...prev,
                          smithLevel: parseInt(e.target.value) || 50,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="baseLevel"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Base Level
                    </label>
                    <input
                      id="baseLevel"
                      type="number"
                      min="1"
                      max="330"
                      value={newFormula.baseLevel}
                      onChange={(e) =>
                        setNewFormula((prev) => ({
                          ...prev,
                          baseLevel: parseInt(e.target.value) || 100,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="steps"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Steps
                    </label>
                    <input
                      id="steps"
                      type="number"
                      min="1"
                      max="10"
                      value={newFormula.steps}
                      onChange={(e) =>
                        setNewFormula((prev) => ({ ...prev, steps: parseInt(e.target.value) || 3 }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startingPotential"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Starting Potential
                    </label>
                    <input
                      id="startingPotential"
                      type="number"
                      min="0"
                      max="999"
                      value={newFormula.startingPotential}
                      onChange={(e) =>
                        setNewFormula((prev) => ({
                          ...prev,
                          startingPotential: parseInt(e.target.value) || 100,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="targetPotential"
                      className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Target Potential
                    </label>
                    <input
                      id="targetPotential"
                      type="number"
                      min="0"
                      max="999"
                      value={newFormula.targetPotential}
                      onChange={(e) =>
                        setNewFormula((prev) => ({
                          ...prev,
                          targetPotential: parseInt(e.target.value) || 150,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={newFormula.notes}
                    onChange={(e) => setNewFormula((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="Additional notes about this formula"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={addNewFormula}
                    className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Add Formula
                  </button>
                  <button
                    onClick={() => setShowNewFormula(false)}
                    className="flex-1 rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simulation Results */}
        <div className="space-y-6">
          {selectedFormula && (
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Formula Details
                </h3>
                <button
                  onClick={runSimulation}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <CalculatorIcon className="h-4 w-4" />
                  Run Simulation
                </button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                    <p className="text-gray-900 dark:text-gray-100">{selectedFormula.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Materials:</span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedFormula.materials.join(' + ')}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Base Success Rate:
                    </span>
                    <p
                      className={`font-medium ${getSuccessRateColor(selectedFormula.baseSuccessRate)}`}
                    >
                      {selectedFormula.baseSuccessRate}%
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Smith Level:
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">{selectedFormula.smithLevel}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Base Level:
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">{selectedFormula.baseLevel}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Steps:</span>
                    <p className="text-gray-900 dark:text-gray-100">{selectedFormula.steps}</p>
                  </div>
                </div>

                <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Note:</strong> {selectedFormula.notes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Simulation Results */}
          {simulationResults.length > 0 && (
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Simulation Results (100 iterations)
              </h3>

              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Success Rate:
                    </span>
                    <p className="text-lg font-bold text-green-600">
                      {Math.round(
                        (simulationResults.filter((r) => r.success).length /
                          simulationResults.length) *
                          100
                      )}
                      %
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Average Final Potential:
                    </span>
                    <p className="text-lg font-bold text-blue-600">
                      {Math.round(
                        simulationResults.reduce((sum, r) => sum + r.finalPotential, 0) /
                          simulationResults.length
                      )}
                    </p>
                  </div>
                </div>

                {/* Results Table */}
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          #
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Result
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Final Potential
                        </th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                          Success Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {simulationResults.slice(0, 20).map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-2 py-2 text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </td>
                          <td className="px-2 py-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                result.success
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}
                            >
                              {result.success ? 'Success' : 'Failure'}
                            </span>
                          </td>
                          <td className="px-2 py-2 font-medium text-gray-900 dark:text-gray-100">
                            {result.finalPotential}
                          </td>
                          <td className="px-2 py-2">
                            <span
                              className={`font-medium ${getSuccessRateColor(result.successRate)}`}
                            >
                              {Math.round(result.successRate)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {simulationResults.length > 20 && (
                    <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                      Showing first 20 results of {simulationResults.length} total
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information Panel */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-medium text-blue-900 dark:text-blue-100">
              About Toram Online Statting
            </h3>
            <p className="mb-3 text-blue-800 dark:text-blue-200">
              This simulator helps you test statting formulas before using them in-game. Success
              rates are calculated based on your Smith level, base level, materials used, and the
              potential difference you're trying to achieve.
            </p>
            <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <p>
                <strong>Smith Level:</strong> Higher levels increase success rates
              </p>
              <p>
                <strong>Base Level:</strong> Higher levels decrease success rates
              </p>
              <p>
                <strong>Materials:</strong> More materials generally increase success
              </p>
              <p>
                <strong>Potential Difference:</strong> Larger gaps are harder to achieve
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
