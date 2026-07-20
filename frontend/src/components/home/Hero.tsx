
// import herologo from '../../assets/logo/hero.jpeg';
// const Hero = () => {
//   return (
//     <section className="relative overflow-hidden bg-[#FAF7F2] pt-32 pb-20">

//       {/* Background Blur */}

//       <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-red-100 blur-[180px] opacity-60" />

//       <div className="max-w-[1450px] mx-auto px-8">

//         <div className="grid lg:grid-cols-2 gap-20 items-center">

//           {/* Left */}

//           <div>

//             <span className="inline-block mb-5 rounded-full border border-red-200 bg-white px-5 py-2 text-xs uppercase tracking-[4px] text-red-600">
//               ✦ New Arrival 2026
//             </span>

//             <h1 className="text-6xl lg:text-7xl font-serif font-semibold leading-tight text-gray-900">
//               Discover
//               <br />
//               Timeless
//               <span className="text-red-600"> Elegance</span>
//             </h1>

//             <p className="mt-8 max-w-xl text-lg leading-9 text-gray-500">
//               Curated collections of premium ethnic and western wear crafted
//               for women who appreciate elegance, confidence, and timeless
//               fashion.
//             </p>

//             <div className="mt-10 flex gap-5">

//               <button className="rounded-full bg-red-600 px-9 py-4 text-white font-medium shadow-xl transition hover:scale-105 hover:bg-red-700">
//                 Shop Collection
//               </button>

//               <button className="rounded-full border border-gray-300 bg-white px-9 py-4 font-medium transition hover:border-red-600 hover:text-red-600">
//                 Explore
//               </button>

//             </div>

//             <div className="mt-14 flex gap-12">

//               <div>
//                 <h2 className="text-3xl font-bold">5K+</h2>
//                 <p className="text-gray-500">
//                   Happy Customers
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-3xl font-bold">250+</h2>
//                 <p className="text-gray-500">
//                   Premium Collections
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-3xl font-bold">4.9★</h2>
//                 <p className="text-gray-500">
//                   Customer Rating
//                 </p>
//               </div>

//             </div>

//           </div>

//           {/* Right */}

//           <div className="relative">

//             <div className="absolute -left-10 top-12 h-96 w-96 rounded-full bg-red-100 blur-[120px]" />

//             <img
//               src={herologo}
//               alt="Luxury Boutique"
//               className="relative z-10 h-[760px] w-full rounded-[40px] object-cover shadow-2xl"
//             />

//             {/* Floating Card */}

//             <div className="absolute bottom-10 left-8 z-20 rounded-3xl bg-white/90 backdrop-blur-xl p-6 shadow-xl">

//               <p className="text-sm text-gray-500">
//                 Featured Collection
//               </p>

//               <h3 className="mt-1 text-xl font-semibold">
//                 Summer Elegance
//               </h3>

//               <p className="mt-2 text-red-600 font-medium">
//                 Up to 40% Off
//               </p>

//             </div>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// };

// export default Hero;

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0f0f0f] pt-28">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute right-[-120px] top-0 h-[700px] w-[700px] rounded-full bg-[#d72638]/20 blur-[160px]" />

        <div className="absolute left-[-150px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-[#ffffff08] blur-[120px]" />

      </div>

      {/* Top Offer Bar */}

      <div className="relative z-20 border-b border-white/10 bg-[#181818]">

        <div className="mx-auto flex max-w-[1500px] items-center justify-center px-8 py-3">

          <p className="text-sm tracking-wide text-gray-300">

            ✦ New Luxury Collection 2026

            <span className="mx-4 text-[#d72638]">
              •
            </span>

            Free Shipping Above ₹999

            <span className="mx-4 text-[#d72638]">
              •
            </span>

            Flat 50% OFF Selected Styles

          </p>

        </div>

      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] px-8">

        <div className="grid min-h-[780px] items-center gap-12 lg:grid-cols-2">

          {/* LEFT */}

          <div className="relative">

            <span
              className="
              inline-flex
              items-center
              rounded-full
              border
              border-[#d72638]
              bg-[#d72638]/10
              px-5
              py-2
              text-xs
              uppercase
              tracking-[4px]
              text-[#ff6b77]
              "
            >
              ✦ New Arrival 2026
            </span>

            <h1
              className="
              mt-8
              text-6xl
              font-light
              uppercase
              leading-[1.05]
              tracking-[3px]
              text-white
              lg:text-8xl
              "
              style={{
                fontFamily:
                  "'Montserrat', sans-serif",
              }}
            >
              Wear

              <br />

              Confidence

              <span className="block text-[#d72638]">
                Every Day
              </span>

            </h1>

            <p
              className="
              mt-8
              max-w-xl
              text-lg
              leading-9
              text-gray-300
              "
            >
              Discover premium ethnic,
              western and party wear
              crafted for women who embrace
              elegance, confidence and
              timeless fashion.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">

              <button
                className="
                rounded-full
                bg-[#d72638]
                px-10
                py-4
                text-sm
                font-semibold
                uppercase
                tracking-[2px]
                text-white
                transition
                duration-300
                hover:scale-105
                hover:bg-[#b81f2f]
                "
              >
                Shop Collection
              </button>

              <button
                className="
                rounded-full
                border
                border-white/20
                bg-white/5
                px-10
                py-4
                text-sm
                font-semibold
                uppercase
                tracking-[2px]
                text-white
                backdrop-blur-xl
                transition
                duration-300
                hover:border-[#d72638]
                hover:bg-[#d72638]
                "
              >
                Explore
              </button>

            </div>

            <div className="mt-14 flex gap-12">

              <div>

                <h2 className="text-4xl font-bold text-white">
                  5K+
                </h2>

                <p className="mt-2 text-gray-400">
                  Happy Customers
                </p>

              </div>

              <div>

                <h2 className="text-4xl font-bold text-white">
                  350+
                </h2>

                <p className="mt-2 text-gray-400">
                  Premium Products
                </p>

              </div>

              <div>

                <h2 className="text-4xl font-bold text-white">
                  4.9★
                </h2>

                <p className="mt-2 text-gray-400">
                  Customer Rating
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative flex items-center justify-center">

  {/* Background Curves */}

  <div
    className="
    absolute
    right-[-180px]
    top-0
    h-[760px]
    w-[760px]
    rounded-bl-[380px]
    rounded-tl-[380px]
    rounded-br-[120px]
    bg-gradient-to-br
    from-[#1f1f1f]
    via-[#232323]
    to-[#d72638]
    opacity-95
    "
  />

  <div
    className="
    absolute
    right-10
    top-10
    h-[650px]
    w-[650px]
    rounded-full
    border
    border-white/10
    "
  />

  {/* Main Model */}

  <img
    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80"
    alt="Cupidanza Fashion"
    className="
    relative
    z-20
    h-[760px]
    object-contain
    drop-shadow-[0_40px_80px_rgba(0,0,0,0.55)]
    transition
    duration-700
    hover:scale-105
    "
  />

  {/* Floating Card 1 */}

  <div
    className="
    absolute
    left-[-20px]
    top-20
    z-30
    overflow-hidden
    rounded-[28px]
    border
    border-white/10
    bg-black/70
    p-3
    shadow-2xl
    backdrop-blur-xl
    "
  >

    <img
      src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80"
      alt=""
      className="
      h-56
      w-44
      rounded-2xl
      object-cover
      "
    />

  </div>

  {/* Floating Card 2 */}

  <div
    className="
    absolute
    bottom-20
    left-28
    z-30
    overflow-hidden
    rounded-[28px]
    border
    border-white/10
    bg-black/70
    p-3
    shadow-2xl
    backdrop-blur-xl
    "
  >

    <img
      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80"
      alt=""
      className="
      h-72
      w-52
      rounded-2xl
      object-cover
      "
    />

  </div>

  {/* Floating Offer Card */}

  <div
    className="
    absolute
    right-[-40px]
    top-24
    z-40
    w-72
    rounded-[30px]
    border
    border-white/10
    bg-black/80
    p-7
    shadow-[0_25px_60px_rgba(0,0,0,0.55)]
    backdrop-blur-xl
    "
  >

    <p
      className="
      text-xs
      uppercase
      tracking-[4px]
      text-[#ff8a94]
      "
    >
      Featured Collection
    </p>

    <h2
      className="
      mt-4
      text-3xl
      font-light
      text-white
      "
    >
      Luxury
      <br />
      Edition
    </h2>

    <div
      className="
      mt-6
      text-6xl
      font-bold
      leading-none
      text-[#d72638]
      "
    >
      50%
    </div>

    <p
      className="
      mt-2
      text-lg
      text-gray-300
      "
    >
      OFF
    </p>

    <button
      className="
      mt-8
      w-full
      rounded-full
      bg-[#d72638]
      py-3
      text-sm
      font-semibold
      uppercase
      tracking-[2px]
      text-white
      transition
      hover:bg-[#b81f2f]
      "
    >
      Explore Deals
    </button>

  </div>

</div>

</div>

</div>
      {/* ===================== CATEGORY SECTION ===================== */}


    </section>
  );
};

export default Hero;