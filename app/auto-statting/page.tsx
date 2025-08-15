import { Metadata } from 'next'
import AutoStattingCalculator from '@/components/AutoStattingCalculator'
import StattingFormulaDatabase from '@/components/StattingFormulaDatabase'

export const metadata: Metadata = {
  title: 'Lazy Tanaka Auto Statting - Toram Online Database',
  description:
    'Automatically calculate optimal stat distributions and browse statting formulas for your Toram Online character builds',
}

export default function AutoStattingPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Lazy Tanaka Auto Statting
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Automatically calculate optimal stat distributions and browse comprehensive statting
          formulas for your Toram Online character builds. Inspired by Tanaka's Buki Proper statting
          tools and enhanced with modern automation.
        </p>
      </div>

      <div className="container py-12">
        <AutoStattingCalculator />

        <div className="mt-16">
          <StattingFormulaDatabase />
        </div>
      </div>
    </div>
  )
}
