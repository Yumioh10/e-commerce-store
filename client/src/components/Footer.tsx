import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-teal-500 fill-teal-500" />
              <h3 className="text-xl font-bold text-white">MaparaSanté</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted source for medical-grade cosmetics. Professional skincare solutions for healthy, radiant skin.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-teal-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-teal-500 transition-colors">Serums</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Moisturizers</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Cleansers</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Treatments</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Sunscreen</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-teal-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Info Livraison</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-teal-500 transition-colors">Track Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-teal-500 flex-shrink-0" />
                <span>(+212) 663-612-722</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 text-teal-500 flex-shrink-0" />
                <span>support@maparasante.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-teal-500 flex-shrink-0" />
                <span>123 Wellness Ave, Health City, HC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; 2026 MaparaSanté. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-teal-500 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
