import { Metadata } from 'next'
import ToramStattingSimulator from '@/components/ToramStattingSimulator'

export const metadata: Metadata = {
  title: 'Toram Online Statting Simulator - Toram Online Database',
  description:
    'Test statting formulas and calculate success rates for Toram Online equipment enhancement',
}

export default function AutoStattingPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Toram Online Statting Simulator
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Test statting formulas and calculate success rates for equipment enhancement. Based on
          actual Toram Online mechanics like Tanaka's Buki Proper and SparkyNeko's simulator.
        </p>
      </div>

      <div className="container py-12">
        <ToramStattingSimulator />
      </div>
    </div>
  )
}
