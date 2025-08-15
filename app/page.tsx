import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

export default function Page() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Toram Online Database
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          {siteMetadata.description}
        </p>
      </div>

      <div className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/xtals"
          className="rounded-lg border border-gray-200 p-6 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">Crystals</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Browse all xtals, filter by stats and usage.
          </p>
        </Link>

        <Link
          href="/equipment"
          className="rounded-lg border border-gray-200 p-6 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Equipment
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Weapons, armor, and more with sorting and filters.
          </p>
        </Link>

        <Link
          href="/auto-statting"
          className="rounded-lg border border-gray-200 p-6 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Auto Statting
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Lazy Tanaka's automatic stat calculation and formulas.
          </p>
        </Link>
      </div>
    </div>
  )
}
