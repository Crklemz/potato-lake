export default function DnrPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            DNR Information
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Minnesota Department of Natural Resources
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              The Minnesota DNR provides important information about fishing regulations, 
              boating safety, and lake management. Stay informed about the latest rules 
              and regulations to ensure a safe and enjoyable experience on Potato Lake.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fishing Regulations</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Fishing license requirements</li>
                <li>• Size and possession limits</li>
                <li>• Seasonal restrictions</li>
                <li>• Special regulations</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Boating Safety</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Boat registration requirements</li>
                <li>• Safety equipment requirements</li>
                <li>• Speed limits and restrictions</li>
                <li>• Invasive species prevention</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Lake Map</h3>
            <div className="h-64 bg-accent flex items-center justify-center rounded-lg">
              <span className="text-primary font-semibold">Interactive Lake Map</span>
            </div>
            <p className="text-neutral-dark mt-4">
              View detailed information about Potato Lake including depth contours, 
              access points, and important landmarks.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Important Links</h3>
            <div className="space-y-4">
              <a href="#" className="block text-accent hover:text-primary font-semibold">
                Minnesota DNR Website →
              </a>
              <a href="#" className="block text-accent hover:text-primary font-semibold">
                Fishing Regulations →
              </a>
              <a href="#" className="block text-accent hover:text-primary font-semibold">
                Boating Safety Information →
              </a>
              <a href="#" className="block text-accent hover:text-primary font-semibold">
                Invasive Species Information →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 