'use client'

import { useState } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

interface StattingMaterial {
  name: string
  type: 'weapon' | 'armor' | 'accessory' | 'universal'
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  successRate: number
  cost: number
  description: string
  effects: string[]
  locations: string[]
}

interface StattingFormula {
  id: string
  name: string
  equipmentType: 'weapon' | 'armor' | 'accessory'
  targetStat: string
  materials: StattingMaterial[]
  totalCost: number
  averageSuccessRate: number
  steps: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  notes: string
}

const STATTING_MATERIALS: StattingMaterial[] = [
  // Weapon Materials
  {
    name: 'Sharpening Stone',
    type: 'weapon',
    rarity: 'common',
    successRate: 75,
    cost: 1000,
    description: 'Basic material for weapon statting',
    effects: ['ATK +10-30', 'CRIT +1-3'],
    locations: ['General Store', 'Crafting NPCs'],
  },
  {
    name: 'Magic Crystal',
    type: 'weapon',
    rarity: 'uncommon',
    successRate: 65,
    cost: 5000,
    description: 'Enchanted crystal for magical weapon enhancement',
    effects: ['MATK +15-45', 'MP +20-60'],
    locations: ['Magic Shop', 'Dungeon Drops'],
  },
  {
    name: 'Critical Gem',
    type: 'weapon',
    rarity: 'rare',
    successRate: 55,
    cost: 15000,
    description: 'Precious gem that enhances critical abilities',
    effects: ['CRIT +5-15', 'CRIT DMG +10-30'],
    locations: ['Jewel Merchant', 'Boss Drops'],
  },
  {
    name: 'Dragon Scale',
    type: 'weapon',
    rarity: 'epic',
    successRate: 45,
    cost: 50000,
    description: 'Rare dragon scale with powerful enhancement properties',
    effects: ['ATK +50-150', 'All Stats +5-15'],
    locations: ['Dragon Bosses', 'Premium Shop'],
  },

  // Armor Materials
  {
    name: 'Reinforced Cloth',
    type: 'armor',
    rarity: 'common',
    successRate: 80,
    cost: 800,
    description: 'Strengthened fabric for armor enhancement',
    effects: ['DEF +8-25', 'HP +15-45'],
    locations: ['Tailor Shop', 'Crafting NPCs'],
  },
  {
    name: 'Magic Thread',
    type: 'armor',
    rarity: 'uncommon',
    successRate: 70,
    cost: 4000,
    description: 'Enchanted thread that weaves magical protection',
    effects: ['MDEF +12-35', 'MP +25-75'],
    locations: ['Magic Shop', 'Dungeon Drops'],
  },
  {
    name: 'Vitality Essence',
    type: 'armor',
    rarity: 'rare',
    successRate: 60,
    cost: 12000,
    description: 'Concentrated life force for health enhancement',
    effects: ['HP +100-300', 'VIT +8-20'],
    locations: ['Herbalist', 'Boss Drops'],
  },

  // Accessory Materials
  {
    name: 'Polished Gem',
    type: 'accessory',
    rarity: 'common',
    successRate: 85,
    cost: 600,
    description: 'Basic gemstone for accessory enhancement',
    effects: ['HP +10-30', 'MP +10-30'],
    locations: ['Jewel Merchant', 'Crafting NPCs'],
  },
  {
    name: 'Agility Crystal',
    type: 'accessory',
    rarity: 'uncommon',
    successRate: 70,
    cost: 3500,
    description: 'Crystal that enhances movement and speed',
    effects: ['AGI +5-15', 'ACCURACY +3-8'],
    locations: ['Magic Shop', 'Dungeon Drops'],
  },

  // Universal Materials
  {
    name: 'Blessed Water',
    type: 'universal',
    rarity: 'rare',
    successRate: 90,
    cost: 8000,
    description: 'Holy water that increases success rates',
    effects: ['Success Rate +10%', 'All Stats +2-5'],
    locations: ['Church', 'Special Events'],
  },
  {
    name: 'Lucky Charm',
    type: 'universal',
    rarity: 'epic',
    successRate: 95,
    cost: 25000,
    description: 'Mystical charm that greatly improves success',
    effects: ['Success Rate +20%', 'All Stats +5-10'],
    locations: ['Premium Shop', 'Special Events'],
  },
]

const STATTING_FORMULAS: StattingFormula[] = [
  // Weapon Formulas
  {
    id: 'wpn_atk_1',
    name: 'Basic Attack Enhancement',
    equipmentType: 'weapon',
    targetStat: 'ATK',
    materials: [STATTING_MATERIALS[0]], // Sharpening Stone
    totalCost: 1000,
    averageSuccessRate: 75,
    steps: ['Clean weapon surface', 'Apply Sharpening Stone', 'Polish for 30 seconds'],
    difficulty: 'easy',
    notes: 'Best for beginners. Low cost, decent success rate.',
  },
  {
    id: 'wpn_crit_1',
    name: 'Critical Strike Enhancement',
    equipmentType: 'weapon',
    targetStat: 'CRIT',
    materials: [STATTING_MATERIALS[2]], // Critical Gem
    totalCost: 15000,
    averageSuccessRate: 55,
    steps: [
      'Prepare weapon surface',
      'Apply Critical Gem with precision',
      'Use heat treatment',
      'Cool gradually',
    ],
    difficulty: 'hard',
    notes: 'High risk, high reward. Best used with success rate boosters.',
  },
  {
    id: 'wpn_dragon_1',
    name: 'Dragon Power Enhancement',
    equipmentType: 'weapon',
    targetStat: 'ATK + All Stats',
    materials: [STATTING_MATERIALS[3], STATTING_MATERIALS[10]], // Dragon Scale + Lucky Charm
    totalCost: 75000,
    averageSuccessRate: 70,
    steps: [
      'Purify weapon with holy water',
      'Apply Dragon Scale carefully',
      'Use Lucky Charm for protection',
      'Perform ancient enhancement ritual',
    ],
    difficulty: 'expert',
    notes: 'Expert-level enhancement. Requires precise timing and materials.',
  },

  // Armor Formulas
  {
    id: 'arm_def_1',
    name: 'Defense Reinforcement',
    equipmentType: 'armor',
    targetStat: 'DEF',
    materials: [STATTING_MATERIALS[4]], // Reinforced Cloth
    totalCost: 800,
    averageSuccessRate: 80,
    steps: ['Clean armor surface', 'Apply Reinforced Cloth', 'Sew with magic thread'],
    difficulty: 'easy',
    notes: 'Very beginner-friendly. High success rate, low cost.',
  },
  {
    id: 'arm_vitality_1',
    name: 'Vitality Enhancement',
    equipmentType: 'armor',
    targetStat: 'HP + VIT',
    materials: [STATTING_MATERIALS[6]], // Vitality Essence
    totalCost: 12000,
    averageSuccessRate: 60,
    steps: [
      'Prepare armor surface',
      'Apply Vitality Essence',
      'Use life force binding',
      'Rest for 24 hours',
    ],
    difficulty: 'medium',
    notes: 'Good for tank builds. Moderate difficulty and cost.',
  },

  // Accessory Formulas
  {
    id: 'acc_agi_1',
    name: 'Agility Enhancement',
    equipmentType: 'accessory',
    targetStat: 'AGI + ACCURACY',
    materials: [STATTING_MATERIALS[8]], // Agility Crystal
    totalCost: 3500,
    averageSuccessRate: 70,
    steps: [
      'Clean accessory surface',
      'Apply Agility Crystal',
      'Use precision tools',
      'Polish to perfection',
    ],
    difficulty: 'medium',
    notes: 'Great for archer and assassin builds.',
  },
]

export default function StattingFormulaDatabase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'weapon' | 'armor' | 'accessory'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    'all' | 'easy' | 'medium' | 'hard' | 'expert'
  >('all')
  const [selectedRarity, setSelectedRarity] = useState<
    'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  >('all')

  const filteredMaterials = STATTING_MATERIALS.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      selectedType === 'all' || material.type === selectedType || material.type === 'universal'
    const matchesRarity = selectedRarity === 'all' || material.rarity === selectedRarity

    return matchesSearch && matchesType && matchesRarity
  })

  const filteredFormulas = STATTING_FORMULAS.filter((formula) => {
    const matchesSearch =
      formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formula.targetStat.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || formula.equipmentType === selectedType
    const matchesDifficulty =
      selectedDifficulty === 'all' || formula.difficulty === selectedDifficulty

    return matchesSearch && matchesType && matchesDifficulty
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'uncommon':
        return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200'
      case 'rare':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-200'
      case 'epic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-200'
      case 'legendary':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
      case 'hard':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-200'
      case 'expert':
        return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <BookOpenIcon className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Statting Formula Database
          </h2>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search materials, formulas, or stats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="equipmentType"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Equipment Type
              </label>
              <select
                id="equipmentType"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as 'all' | 'weapon' | 'armor' | 'accessory')
                }
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="weapon">Weapon</option>
                <option value="armor">Armor</option>
                <option value="accessory">Accessory</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="difficulty"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) =>
                  setSelectedDifficulty(
                    e.target.value as 'all' | 'easy' | 'medium' | 'hard' | 'expert'
                  )
                }
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="rarity"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Material Rarity
              </label>
              <select
                id="rarity"
                value={selectedRarity}
                onChange={(e) =>
                  setSelectedRarity(
                    e.target.value as 'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
                  )
                }
                className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Statting Materials ({filteredMaterials.length})
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
            >
              <div className="mb-2 flex items-start justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{material.name}</h4>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${getRarityColor(material.rarity)}`}
                >
                  {material.rarity.toUpperCase()}
                </span>
              </div>

              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                {material.description}
              </p>

              <div className="mb-3 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <ChartBarIcon className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Success Rate: <span className="font-medium">{material.successRate}%</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CurrencyDollarIcon className="h-4 w-4 text-yellow-600" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Cost: <span className="font-medium">{material.cost.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <h5 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Effects:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {material.effects.map((effect, effectIndex) => (
                    <span
                      key={effectIndex}
                      className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Locations:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {material.locations.map((location, locationIndex) => (
                    <span
                      key={locationIndex}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulas Section */}
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Statting Formulas ({filteredFormulas.length})
        </h3>

        <div className="space-y-4">
          {filteredFormulas.map((formula) => (
            <div
              key={formula.id}
              className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formula.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Target: {formula.targetStat}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getDifficultyColor(formula.difficulty)}`}
                  >
                    {formula.difficulty.toUpperCase()}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {formula.equipmentType.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <h5 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Materials:
                  </h5>
                  <div className="space-y-1">
                    {formula.materials.map((material, matIndex) => (
                      <div key={matIndex} className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getRarityColor(material.rarity)}`}
                        >
                          {material.rarity}
                        </span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {material.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Cost & Success:
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Total Cost:{' '}
                        <span className="font-medium">{formula.totalCost.toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChartBarIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Success Rate:{' '}
                        <span className="font-medium">{formula.averageSuccessRate}%</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                    Steps:
                  </h5>
                  <ol className="list-inside list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {formula.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> {formula.notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
