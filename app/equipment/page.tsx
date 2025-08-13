import { getDatabase } from '@/lib/database'
import EquipmentDatabase from '@/components/EquipmentDatabase'

interface Equipment {
  id: number
  name: string
  type: string
  sell_price?: string
  buy_price?: string
  description?: string
}

interface EquipmentAttribute {
  id: number
  equipment_id: number
  label: string
  value: string | number
}

interface EquipmentDrop {
  id: number
  equipment_id: number
  monster_name: string
  monster_url: string
  monster_level: string
  location_name: string
  location_url: string
}

interface EquipmentCompleteView {
  equipment: Equipment
  attributes: EquipmentAttribute[]
  drops: EquipmentDrop[]
}

function sanitizeName(name: string): string {
  return name.replace(/\s*\[[^\]]*\]\s*$/g, '').trim()
}

async function getCandidateTables(): Promise<string[]> {
  const db = getDatabase()
  try {
    const rows = (await db.all(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    )) as { name: string }[]

    const candidates: string[] = []
    for (const r of rows) {
      if (r.name === 'xtal') continue
      const cols = await getTableColumns(r.name)

      // Accept xtal-like tables
      const hasTitle = cols.includes('title')
      const hasStatPair =
        (cols.includes('div') && cols.includes('column_11')) ||
        (cols.includes('div6') && cols.includes('column_13')) ||
        (cols.includes('div7') && cols.includes('column_15')) ||
        (cols.includes('div11') && cols.includes('column_17'))
      if (hasTitle && hasStatPair) {
        candidates.push(r.name)
        continue
      }

      // Accept equipment table schema
      const looksLikeEquipment =
        cols.includes('card_title') &&
        cols.includes('table_grid_3') &&
        cols.includes('table_grid_4')
      if (looksLikeEquipment) {
        candidates.push(r.name)
      }
    }
    return candidates
  } catch {
    return []
  }
}

async function getTableColumns(tableName: string): Promise<string[]> {
  const db = getDatabase()
  try {
    const pragmaRows = (await db.all(`PRAGMA table_info(${tableName})`)) as Array<{
      name: string
    }>
    return pragmaRows.map((r) => r.name)
  } catch {
    return []
  }
}

function pickFirstKey<T extends Record<string, unknown>>(
  obj: T,
  keys: string[],
  fallback = ''
): string {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] != null) {
      return String(obj[key])
    }
  }
  return fallback
}

async function getEquipmentData(): Promise<EquipmentCompleteView[]> {
  const db = getDatabase()

  try {
    const candidateTables = await getCandidateTables()
    if (candidateTables.length === 0) {
      return []
    }

    const results: EquipmentCompleteView[] = []

    for (const tableName of candidateTables) {
      const cols = await getTableColumns(tableName)
      const orderCol = cols.includes('card_title')
        ? 'card_title'
        : cols.includes('title')
          ? 'title'
          : cols.includes('name')
            ? 'name'
            : 'id'
      const rows = (await db.all(`SELECT * FROM ${tableName} ORDER BY ${orderCol}`)) as unknown[]

      for (const rowUnknown of rows) {
        const row = rowUnknown as Record<string, unknown>

        if (tableName === 'equipment') {
          const rawName = String(row.card_title || 'Unknown')
          const rawType = String(row.card_title_2 || '')
          const equipment: Equipment = {
            id: Number(row.id ?? 0),
            name: sanitizeName(rawName),
            type: rawType.replace(/[[\]]/g, '').trim(),
            sell_price: String(row.item_prop || ''),
            buy_price: String(row.item_prop_2 || ''),
            description: '',
          }

          const attributes: EquipmentAttribute[] = []
          let attrId = 1

          const gridPairs: Array<[number, number]> = [
            [3, 4],
            [5, 6],
            [7, 8],
            [15, 16],
            [17, 18],
            [19, 20],
            [21, 22],
            [23, 24],
            [26, 27],
          ]
          for (const [ln, vn] of gridPairs) {
            const nameCol = `table_grid_${ln}`
            const valueCol = `table_grid_${vn}`
            const label = row[nameCol]
            const value = row[valueCol]
            if (label && value != null) {
              attributes.push({
                id: attrId++,
                equipment_id: equipment.id,
                label: String(label),
                value: typeof value === 'number' ? value : String(value),
              })
            }
          }

          const drops: EquipmentDrop[] = []
          let dropId = 1
          const itemKeys = [
            'pagination_js_item',
            'pagination_js_item_2',
            'pagination_js_item_3',
            'pagination_js_item_4',
            'pagination_js_item_5',
            'pagination_js_item_6',
            'pagination_js_item_7',
            'pagination_js_item_8',
            'pagination_js_item_9',
            'pagination_js_item_10',
            'pagination_js_item_11',
            'pagination_js_item_12',
            'pagination_js_item_13',
          ] as const
          const hrefKeys = [
            'pagination_js_item_href',
            'pagination_js_item_href_2',
            'pagination_js_item_href_3',
            'pagination_js_item_href_4',
            'pagination_js_item_href_5',
            'pagination_js_item_href_6',
            'pagination_js_item_href_7',
            'pagination_js_item_href_8',
            'pagination_js_item_href_9',
            'pagination_js_item_href_10',
            'pagination_js_item_href_11',
            'pagination_js_item_href_12',
          ] as const

          for (let i = 0; i < itemKeys.length; i += 1) {
            const text = row[itemKeys[i]]
            if (!text || String(text).trim() === '-' || String(text).trim() === '') continue
            const href = row[hrefKeys[i]]
            drops.push({
              id: dropId++,
              equipment_id: equipment.id,
              monster_name: String(text),
              monster_url: String(href || ''),
              monster_level: '',
              location_name: '',
              location_url: '',
            })
          }

          results.push({ equipment, attributes, drops })
        } else {
          // xtal-like mapping fallback
          const equipment: Equipment = {
            id: Number(row.id ?? 0),
            name: sanitizeName(pickFirstKey(row, ['title', 'name'], 'Unknown')),
            type:
              pickFirstKey(row, ['font', 'type', 'category'], '').replace(/[[\\]]/g, '') ||
              tableName,
            sell_price: pickFirstKey(row, ['p', 'sell_price'], ''),
            buy_price: pickFirstKey(row, ['p2', 'buy_price'], ''),
            description: pickFirstKey(row, ['description', 'desc'], ''),
          }

          const attributes: EquipmentAttribute[] = []
          let attrId = 1
          const statPairs: Array<{ nameCol: string; valueCol: string }> = [
            { nameCol: 'div', valueCol: 'column_11' },
            { nameCol: 'div6', valueCol: 'column_13' },
            { nameCol: 'div7', valueCol: 'column_15' },
            { nameCol: 'div11', valueCol: 'column_17' },
          ]
          for (const pair of statPairs) {
            const statName = row[pair.nameCol]
            const statValue = row[pair.valueCol]
            if (statName && statValue != null) {
              attributes.push({
                id: attrId++,
                equipment_id: equipment.id,
                label: String(statName),
                value: Number(statValue),
              })
            }
          }

          const drops: EquipmentDrop[] = []
          let dropId = 1
          const dropMappings = [
            {
              monsterCol: 'a',
              urlCol: 'url',
              levelCol: 'avoidwrap',
              locationCol: 'a4',
              locationUrlCol: 'url5',
            },
            {
              monsterCol: 'a8',
              urlCol: 'url9',
              levelCol: 'avoidwrap10',
              locationCol: 'a12',
              locationUrlCol: 'url13',
            },
          ] as const
          for (const m of dropMappings) {
            const monsterName = row[m.monsterCol]
            if (monsterName) {
              drops.push({
                id: dropId++,
                equipment_id: equipment.id,
                monster_name: String(monsterName),
                monster_url: String(row[m.urlCol] || ''),
                monster_level: String(row[m.levelCol] || '').replace(/[()]/g, ''),
                location_name: String(row[m.locationCol] || ''),
                location_url: String(row[m.locationUrlCol] || ''),
              })
            }
          }

          results.push({ equipment, attributes, drops })
        }
      }
    }

    return results
  } catch (error) {
    console.error('Error fetching equipment data:', error)
    return []
  }
}

export default async function EquipmentPage() {
  const equipmentData = await getEquipmentData()

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Equipment Database
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Complete equipment information from the Toram database ({equipmentData.length} items)
        </p>
      </div>
      <div className="container py-12">
        <EquipmentDatabase initialData={equipmentData} />
      </div>
    </div>
  )
}
