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

interface CrystalCardProps {
  crystal: Crystal
  stats: CrystalStat[]
  drops: CrystalDrop[]
  usage: CrystalUsage[]
}

export default function CrystalCard({ crystal, stats, drops, usage }: CrystalCardProps) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Crystal Header */}
      <div className="mb-4 border-b border-gray-200 pb-4 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{crystal.name}</h2>
        <div className="mt-2 flex items-center gap-4">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {crystal.type}
          </span>
          {crystal.sell_price && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sell:{' '}
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                {crystal.sell_price}
              </span>
            </span>
          )}
          {crystal.process_cost && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Process:{' '}
              <span className="font-semibold text-green-600 dark:text-green-400">
                {crystal.process_cost}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {crystal.description && (
        <div className="mb-4">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {crystal.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Crystal Stats */}
        {stats.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">Stats</h3>
            <div className="space-y-2">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex items-center justify-between rounded bg-gray-50 p-2 dark:bg-gray-700"
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.stat_name}
                    {stat.is_upgrade_specific && stat.upgrade_type && (
                      <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">
                        ({stat.upgrade_type})
                      </span>
                    )}
                  </span>
                  <span
                    className={`text-sm font-bold ${stat.stat_value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {stat.stat_value >= 0 ? `+${stat.stat_value}` : stat.stat_value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drop Locations */}
        {drops.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Drop Locations
            </h3>
            <div className="space-y-2">
              {drops.map((drop) => (
                <div
                  key={drop.id}
                  className="rounded border-l-4 border-purple-500 bg-gray-50 p-3 dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {drop.monster_url ? (
                        <a
                          href={drop.monster_url}
                          className="text-sm font-semibold text-purple-600 hover:underline dark:text-purple-400"
                        >
                          {drop.monster_name}
                        </a>
                      ) : (
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {drop.monster_name}
                        </span>
                      )}
                      {drop.monster_level && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          Lv. {drop.monster_level}
                        </span>
                      )}
                    </div>
                  </div>
                  {drop.location_name && (
                    <div className="mt-1">
                      {drop.location_url ? (
                        <a
                          href={drop.location_url}
                          className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                        >
                          📍 {drop.location_name}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          📍 {drop.location_name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Used For Section */}
        {usage.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Used For
            </h3>
            <div className="space-y-2">
              {usage.map((use) => (
                <div
                  key={use.id}
                  className="rounded border-l-4 border-orange-500 bg-gray-50 p-3 dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="mb-2 inline-flex items-center rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                        {use.usage_type}
                      </span>
                      <div>
                        {use.item_url ? (
                          <a
                            href={use.item_url}
                            className="text-sm font-semibold text-orange-600 hover:underline dark:text-orange-400"
                          >
                            {use.item_name}
                          </a>
                        ) : (
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {use.item_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {use.location_name && (
                    <div className="mt-1">
                      {use.location_url ? (
                        <a
                          href={use.location_url}
                          className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                        >
                          📍 {use.location_name}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          📍 {use.location_name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show empty state if no stats, drops, or usage */}
      {stats.length === 0 && drops.length === 0 && usage.length === 0 && (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">No additional information available</p>
        </div>
      )}
    </div>
  )
}
