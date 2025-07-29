

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Potato Lake
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-neutral-light">
            Discover the natural beauty and recreational opportunities of our pristine lake
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/resorts" className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-neutral-light transition-colors">
              Explore Resorts
            </a>
            <a href="/fishing" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Fishing Info
            </a>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-neutral-dark">
              About Potato Lake
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              Potato Lake is a beautiful natural lake located in northern Minnesota, 
              offering excellent fishing, boating, and recreational opportunities. 
              Our association is dedicated to preserving the lake&apos;s natural beauty 
              and promoting responsible use of this precious resource.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark">
            Explore Our Website
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">Resorts</h3>
              <p className="text-neutral-dark mb-4">
                Find the perfect place to stay during your visit to Potato Lake.
              </p>
              <a href="/resorts" className="text-accent hover:text-primary font-semibold">
                View Resorts →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fishing</h3>
              <p className="text-neutral-dark mb-4">
                Get the latest fishing reports and information about the lake.
              </p>
              <a href="/fishing" className="text-accent hover:text-primary font-semibold">
                Fishing Info →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">News & Events</h3>
              <p className="text-neutral-dark mb-4">
                Stay updated with the latest news and upcoming events.
              </p>
              <a href="/news" className="text-accent hover:text-primary font-semibold">
                View Events →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
