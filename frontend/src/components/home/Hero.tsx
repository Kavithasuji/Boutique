
import herologo from '../../assets/logo/hero.jpeg';
const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] pt-32 pb-20">

      {/* Background Blur */}

      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-100 blur-[180px] opacity-60" />

      <div className="max-w-[1450px] mx-auto px-8">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}

          <div>

            <span className="inline-block mb-5 rounded-full border border-red-200 bg-white px-5 py-2 text-xs uppercase tracking-[4px] text-red-600">
              ✦ New Arrival 2026
            </span>

            <h1 className="text-6xl lg:text-7xl font-serif font-semibold leading-tight text-gray-900">
              Discover
              <br />
              Timeless
              <span className="text-red-600"> Elegance</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-9 text-gray-500">
              Curated collections of premium ethnic and western wear crafted
              for women who appreciate elegance, confidence, and timeless
              fashion.
            </p>

            <div className="mt-10 flex gap-5">

              <button className="rounded-full bg-red-600 px-9 py-4 text-white font-medium shadow-xl transition hover:scale-105 hover:bg-red-700">
                Shop Collection
              </button>

              <button className="rounded-full border border-gray-300 bg-white px-9 py-4 font-medium transition hover:border-red-600 hover:text-red-600">
                Explore
              </button>

            </div>

            <div className="mt-14 flex gap-12">

              <div>
                <h2 className="text-3xl font-bold">5K+</h2>
                <p className="text-gray-500">
                  Happy Customers
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">250+</h2>
                <p className="text-gray-500">
                  Premium Collections
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">4.9★</h2>
                <p className="text-gray-500">
                  Customer Rating
                </p>
              </div>

            </div>

          </div>

          {/* Right */}

          <div className="relative">

            <div className="absolute -left-10 top-12 h-96 w-96 rounded-full bg-red-100 blur-[120px]" />

            <img
              src={herologo}
              alt="Luxury Boutique"
              className="relative z-10 h-[760px] w-full rounded-[40px] object-cover shadow-2xl"
            />

            {/* Floating Card */}

            <div className="absolute bottom-10 left-8 z-20 rounded-3xl bg-white/90 backdrop-blur-xl p-6 shadow-xl">

              <p className="text-sm text-gray-500">
                Featured Collection
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                Summer Elegance
              </h3>

              <p className="mt-2 text-red-600 font-medium">
                Up to 40% Off
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;