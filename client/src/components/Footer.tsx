export const Footer = () => (
  <footer className="bg-medical-gray text-medical-text-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold text-medical-text mb-4">Medical Information</h3>
          <p className="text-sm">
            All products are dermatologically tested and comply with EU medical device regulations.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-medical-text mb-4">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li>Monday - Friday: 9AM - 7PM</li>
            <li>Medical hotline: +33 1 23 45 67 89</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-medical-text mb-4">Shipping</h3>
          <ul className="space-y-2 text-sm">
            <li>Livraison partout au Maroc</li>
            <li>Discreet medical packaging</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-medical-text mb-4">Newsletter</h3>
          <p className="text-sm mb-4">Get medical skincare insights</p>
          <input type="email" placeholder="Your email" className="w-full px-3 py-2 rounded border border-medical-gray" />
        </div>
      </div>
      <div className="border-t border-medical-gray mt-8 pt-8 text-center text-sm">
        <p>&copy; 2026 MaparaSanté. Medical Cosmetics Platform. All rights reserved.</p>
      </div>
    </div>
  </footer>
);