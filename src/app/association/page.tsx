export default function AssociationPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            Potato Lake Association
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              About Our Association
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              The Potato Lake Association is a community organization dedicated to preserving 
              and enhancing the natural beauty and recreational opportunities of Potato Lake. 
              We work together to maintain water quality, promote responsible lake use, and 
              foster a strong sense of community among lake residents and visitors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Our Mission</h3>
              <p className="text-neutral-dark leading-relaxed">
                To preserve and protect Potato Lake&apos;s natural resources while promoting 
                responsible recreational use and fostering a strong, engaged community 
                of lake residents and visitors.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Our Goals</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Maintain water quality and clarity</li>
                <li>• Prevent invasive species introduction</li>
                <li>• Promote safe boating practices</li>
                <li>• Support local businesses and services</li>
                <li>• Organize community events and activities</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Meeting Information</h3>
            <p className="text-neutral-dark leading-relaxed mb-6">
              The Potato Lake Association holds regular meetings to discuss lake management, 
              upcoming events, and community concerns. All residents and property owners 
              are welcome to attend.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">Meeting Schedule</h4>
                <p className="text-neutral-dark">First Tuesday of each month at 7:00 PM</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Location</h4>
                <p className="text-neutral-dark">Community Center, Potato Lake</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Contact Information</h3>
            <p className="text-neutral-dark leading-relaxed mb-6">
              Have questions about the association or interested in getting involved? 
              We&apos;d love to hear from you!
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-primary">Email</h4>
                <p className="text-neutral-dark">info@potatolakeassociation.org</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary">Mailing Address</h4>
                <p className="text-neutral-dark">Potato Lake Association<br />P.O. Box 123<br />Potato Lake, MN 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 