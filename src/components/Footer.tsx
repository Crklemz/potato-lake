export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Potato Lake Association</h3>
            <p className="text-neutral-light">
              Dedicated to preserving and promoting the natural beauty and recreational opportunities of Potato Lake.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/resorts" className="text-neutral-light hover:text-accent transition-colors">Resorts</a></li>
              <li><a href="/fishing" className="text-neutral-light hover:text-accent transition-colors">Fishing</a></li>
              <li><a href="/news" className="text-neutral-light hover:text-accent transition-colors">News & Events</a></li>
              <li><a href="/association" className="text-neutral-light hover:text-accent transition-colors">Association</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact</h3>
            <p className="text-neutral-light">
              For more information about Potato Lake Association, please contact us through our website.
            </p>
          </div>
        </div>
        
        <div className="border-t border-neutral-light mt-8 pt-8 text-center">
          <p className="text-neutral-light">
            © {new Date().getFullYear()} Potato Lake Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 