import { getDatabase } from '@/lib/database'
import CrystalDatabase from '@/components/CrystalDatabase'

interface Crystal {
  id: number
  name: string
  type: string
  sell_price: string
  process_cost: string
  description: string
}

interface CrystalStat {
  id: number
  crystal_id: number
  stat_name: string
  stat_value: number
  is_upgrade_specific: boolean
  upgrade_type: string
}

interface CrystalDrop {
  id: number
  crystal_id: number
  monster_name: string
  monster_url: string
  monster_level: string
  location_name: string
  location_url: string
}

interface CrystalUsage {
  id: number
  crystal_id: number
  usage_type: string
  item_name: string
  item_url: string
  location_name: string
  location_url: string
}

interface CrystalCompleteView {
  crystal: Crystal
  stats: CrystalStat[]
  drops: CrystalDrop[]
  usage: CrystalUsage[]
}

async function getCrystalDataFromXtal(): Promise<CrystalCompleteView[]> {
  const db = getDatabase()

  try {
    // Get all data from the original xtal table
    const xtalRows = (await db.all('SELECT * FROM xtal ORDER BY title')) as unknown[]
    
    // Create a map for quick lookup of crystal data by name
    const crystalLookup = new Map<string, Record<string, unknown>>()
    for (const row of xtalRows) {
      const xtal = row as Record<string, unknown>
      if (xtal.title) {
        crystalLookup.set(String(xtal.title), xtal)
      }
    }

    const crystalCompleteViews: CrystalCompleteView[] = []

    for (const row of xtalRows) {
      const xtal = row as Record<string, unknown>
      
      // Extract basic crystal info
      const crystal: Crystal = {
        id: Number(xtal.id),
        name: String(xtal.title || 'Unknown'),
        type: String(xtal.font || '').replace(/[\[\]]/g, ''),
        sell_price: String(xtal.p || ''),
        process_cost: String(xtal.p2 || ''),
        description: ''
      }

      // Extract stats from the xtal table columns
      const stats: CrystalStat[] = []
      let statId = 1

      // Map of stat columns to their corresponding value columns
      const statMappings = [
        { nameCol: 'div', valueCol: 'column_11' },
        { nameCol: 'div6', valueCol: 'column_13' },
        { nameCol: 'div7', valueCol: 'column_15' },
        { nameCol: 'div11', valueCol: 'column_17' }
      ]

      for (const mapping of statMappings) {
        const statName = xtal[mapping.nameCol]
        const statValue = xtal[mapping.valueCol]

        if (statName && statValue !== null && statValue !== undefined) {
          stats.push({
            id: statId++,
            crystal_id: crystal.id,
            stat_name: String(statName),
            stat_value: Number(statValue),
            is_upgrade_specific: false,
            upgrade_type: ''
          })
        }
      }

      // Extract drops from the xtal table
      const drops: CrystalDrop[] = []
      let dropId = 1

      // Drop data patterns in xtal table
      const dropMappings = [
        { monsterCol: 'a', urlCol: 'url', levelCol: 'avoidwrap', locationCol: 'a4', locationUrlCol: 'url5' },
        { monsterCol: 'a8', urlCol: 'url9', levelCol: 'avoidwrap10', locationCol: 'a12', locationUrlCol: 'url13' }
      ]

      for (const mapping of dropMappings) {
        const monsterName = xtal[mapping.monsterCol]
        
        if (monsterName) {
          drops.push({
            id: dropId++,
            crystal_id: crystal.id,
            monster_name: String(monsterName),
            monster_url: String(xtal[mapping.urlCol] || ''),
            monster_level: String(xtal[mapping.levelCol] || '').replace(/[()]/g, ''),
            location_name: String(xtal[mapping.locationCol] || ''),
            location_url: String(xtal[mapping.locationUrlCol] || '')
          })
        }
      }

      // Extract usage information from the xtal table
      const usage: CrystalUsage[] = []
      let usageId = 1

      // Check if this crystal has "Used For" data
      if (xtal.div22 === 'Used For' && xtal.a24) {
        const usageType = String(xtal.title23 || 'Unknown')
        const itemName = String(xtal.a24)
        
        let locationName = ''
        let locationUrl = ''
        
        // For "Upgrade Into" items, look up the target crystal's location
        if (usageType === 'Upgrade Into') {
          const targetCrystal = crystalLookup.get(itemName)
          if (targetCrystal) {
            // Use the target crystal's drop location data (first drop location)
            locationName = String(targetCrystal.a4 || '')
            locationUrl = String(targetCrystal.url5 || '')
          }
        } else {
          // For other usage types (Furniture, Crafting), use the original location
          locationName = String(xtal.a26 || '')
          locationUrl = String(xtal.url27 || '')
        }
        
        usage.push({
          id: usageId++,
          crystal_id: crystal.id,
          usage_type: usageType,
          item_name: itemName,
          item_url: String(xtal.url25 || ''),
          location_name: locationName,
          location_url: locationUrl
        })
      }

      crystalCompleteViews.push({
        crystal,
        stats,
        drops,
        usage
      })
    }

    return crystalCompleteViews
  } catch (error) {
    console.error('Error fetching crystal data from xtal:', error)
    return []
  }
}

export default async function XtalsPage() {
  const crystalData = await getCrystalDataFromXtal()

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Crystal Database
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Complete crystal information from the Toram database ({crystalData.length} crystals)
        </p>
      </div>
      <div className="container py-12">
        <CrystalDatabase initialData={crystalData} />
      </div>
    </div>
  )
}