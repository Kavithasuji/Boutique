const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Small Text */}
            <div className="inline-block">
              <span className="text-sm font-medium tracking-widest text-primary uppercase">
                New Collection 2026
              </span>
            </div>

            {/* Large Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-secondary leading-tight">
              Elegance Redefined
            </h1>

            {/* Paragraph */}
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Discover curated collections of premium ethnic and western wear crafted for the modern woman.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:shadow-xl hover:scale-105">
                Shop Now
              </button>
              <button className="px-8 py-4 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-xl hover:scale-105">
                Explore Collection
              </button>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop"
                alt="Fashion Hero"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
