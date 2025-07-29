export default function NewsPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            News & Events
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Stay Updated
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              Keep up with the latest news, events, and happenings around Potato Lake. 
              From fishing tournaments to community gatherings, there&apos;s always something 
              exciting happening in our area.
            </p>
          </div>

          <div className="space-y-8">
            {/* Sample Event */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-accent flex items-center justify-center">
                <span className="text-primary font-semibold">Event Image</span>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    July 15, 2024
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-dark">
                  Annual Fishing Tournament
                </h3>
                <p className="text-neutral-dark leading-relaxed">
                  Join us for our annual fishing tournament! This family-friendly event features 
                  prizes for the biggest catch in multiple categories. Registration opens at 6 AM, 
                  fishing begins at 7 AM. All proceeds benefit lake conservation efforts.
                </p>
                <div className="mt-4">
                  <a href="#" className="text-accent hover:text-primary font-semibold">
                    Learn More →
                  </a>
                </div>
              </div>
            </div>

            {/* Another Sample Event */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-accent flex items-center justify-center">
                <span className="text-primary font-semibold">Event Image</span>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    August 5, 2024
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-dark">
                  Lake Association Meeting
                </h3>
                <p className="text-neutral-dark leading-relaxed">
                  Monthly meeting of the Potato Lake Association. Topics include lake management, 
                  upcoming events, and community concerns. All residents and property owners are 
                  welcome to attend.
                </p>
                <div className="mt-4">
                  <a href="#" className="text-accent hover:text-primary font-semibold">
                    Learn More →
                  </a>
                </div>
              </div>
            </div>

            {/* News Item */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="bg-sand-accent text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  June 20, 2024
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-neutral-dark">
                New Boat Launch Improvements
              </h3>
              <p className="text-neutral-dark leading-relaxed">
                The public boat launch at Potato Lake has been upgraded with new concrete pads 
                and improved lighting. These improvements will make launching and retrieving 
                boats easier and safer for all users.
              </p>
              <div className="mt-4">
                <a href="#" className="text-accent hover:text-primary font-semibold">
                  Read More →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 