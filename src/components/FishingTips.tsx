'use client'

interface FishingTip {
  id: number
  text: string
  submittedBy: string | null
  order: number
}

interface FishingTipsProps {
  tips: FishingTip[]
}

export default function FishingTips({ tips }: FishingTipsProps) {
  if (!tips || tips.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
          Fishing Tips from the Lake Association
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-accent hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-start space-x-3">
                {/* Quote icon */}
                <div className="flex-shrink-0 mt-1">
                  <svg 
                    className="w-5 h-5 text-accent" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                
                <div className="flex-1">
                  <p className="text-neutral-dark leading-relaxed mb-3">
                    {tip.text}
                  </p>
                  {tip.submittedBy && (
                    <p className="text-sm text-neutral-dark italic">
                      — {tip.submittedBy}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 