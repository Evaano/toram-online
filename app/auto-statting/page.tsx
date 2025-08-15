import { Metadata } from 'next'
import AutoStattingCalculator from '@/components/AutoStattingCalculator'

export const metadata: Metadata = {
  title: 'Lazy Tanaka Auto Statting - Toram Online Database',
  description: 'Automatically calculate optimal stat distributions for your Toram Online character builds',
}

export default function AutoStattingPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Lazy Tanaka Auto Statting
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Automatically calculate optimal stat distributions for your character builds. 
          Let the system do the heavy lifting while you focus on gameplay!
        </p>
      </div>

      <div className="py-10">
        <AutoStattingCalculator />
      </div>
    </div>
  )
}