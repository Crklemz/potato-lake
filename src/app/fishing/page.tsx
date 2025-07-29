export default function FishingPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            Fishing on Potato Lake
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Excellent Fishing Opportunities
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              Potato Lake is renowned for its excellent fishing opportunities. The lake is home to 
              a variety of fish species including walleye, northern pike, bass, and panfish. 
              Whether you&apos;re an experienced angler or just starting out, you&apos;ll find plenty of 
              great spots to cast your line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fish Species</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Walleye</li>
                <li>• Northern Pike</li>
                <li>• Largemouth Bass</li>
                <li>• Smallmouth Bass</li>
                <li>• Bluegill</li>
                <li>• Crappie</li>
                <li>• Perch</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fishing Regulations</h3>
              <p className="text-neutral-dark mb-4">
                Please be sure to check current Minnesota DNR fishing regulations before your trip.
              </p>
              <a href="/dnr" className="text-accent hover:text-primary font-semibold">
                View DNR Information →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Latest Fishing Report</h3>
            <p className="text-neutral-dark leading-relaxed">
              Fishing has been excellent this season! Anglers are reporting good catches of walleye 
              in the early morning and evening hours. Northern pike are active throughout the day, 
              and panfish are biting well in the shallower areas of the lake.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 