export default function ResortsPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            Resorts on Potato Lake
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Find Your Perfect Getaway
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              Potato Lake offers a variety of resorts and accommodations to suit every visitor&apos;s needs. 
              From cozy cabins to full-service resorts, you&apos;ll find the perfect place to stay while 
              enjoying all that our beautiful lake has to offer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Placeholder resort cards */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-accent flex items-center justify-center">
                <span className="text-primary font-semibold">Resort Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-dark">Sample Resort</h3>
                <p className="text-neutral-dark mb-4">123 Lake Road, Potato Lake, MN</p>
                <p className="text-neutral-dark mb-4">Phone: (555) 123-4567</p>
                <a href="#" className="text-accent hover:text-primary font-semibold">
                  Visit Website →
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-accent flex items-center justify-center">
                <span className="text-primary font-semibold">Resort Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-dark">Another Resort</h3>
                <p className="text-neutral-dark mb-4">456 Shore Drive, Potato Lake, MN</p>
                <p className="text-neutral-dark mb-4">Phone: (555) 987-6543</p>
                <a href="#" className="text-accent hover:text-primary font-semibold">
                  Visit Website →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 