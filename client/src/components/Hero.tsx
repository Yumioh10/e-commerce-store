import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-emerald-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">
              Skincare Products
            </div>

            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Your Skin's
              <span className="block text-teal-600">Best Friend</span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Discover dermatologist-approved cosmetics that combine science and
              nature for radiant, healthy skin. Professional-grade formulas for
              everyday beauty.
            </p>

            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className='rounded-md shadow'>
                <a
                href='products'
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 md:py-4 md:text-lg md:px-10 transition shadow"
              >
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a 
                  href='#categories'
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full bg-white text-gray-900 hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition shadow">
                    Browse Categories 
                </a>
              </div>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Natural Ingredients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Customer Support</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-3xl transform rotate-3"></div>
            <img
              src="https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Skincare products"
              className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-10 w-32 h-32 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
    </section>
  )
}
