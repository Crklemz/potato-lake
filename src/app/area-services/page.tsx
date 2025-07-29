export default function AreaServicesPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            Area Services
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Local Businesses & Services
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              Discover the local businesses and services that support the Potato Lake community. 
              From restaurants and shops to professional services, our area sponsors help make 
              Potato Lake a great place to live and visit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Sample Sponsor */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-32 bg-accent flex items-center justify-center mb-4 rounded-lg">
                <span className="text-primary font-semibold">Business Logo</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-dark">Local Restaurant</h3>
              <p className="text-neutral-dark mb-4">
                Delicious meals and great service for visitors and locals alike.
              </p>
              <a href="#" className="text-accent hover:text-primary font-semibold">
                Visit Website →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-32 bg-accent flex items-center justify-center mb-4 rounded-lg">
                <span className="text-primary font-semibold">Business Logo</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-dark">Bait & Tackle Shop</h3>
              <p className="text-neutral-dark mb-4">
                Everything you need for a successful day of fishing on Potato Lake.
              </p>
              <a href="#" className="text-accent hover:text-primary font-semibold">
                Visit Website →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="h-32 bg-accent flex items-center justify-center mb-4 rounded-lg">
                <span className="text-primary font-semibold">Business Logo</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-dark">Marina Services</h3>
              <p className="text-neutral-dark mb-4">
                Boat rentals, fuel, and maintenance services for lake visitors.
              </p>
              <a href="#" className="text-accent hover:text-primary font-semibold">
                Visit Website →
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Become a Sponsor</h3>
            <p className="text-neutral-dark leading-relaxed mb-6">
              Are you a local business interested in supporting the Potato Lake Association? 
              We offer sponsorship opportunities that help promote your business while 
              supporting our community initiatives.
            </p>
            <a href="/association" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors">
              Contact Us About Sponsorship
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 