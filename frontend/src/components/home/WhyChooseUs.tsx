import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Award,
} from "lucide-react";

const whyChooseUs = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping",
    description: "Enjoy free delivery on all orders above ₹999 anywhere in India.",
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "Your payments are protected with 100% secure encrypted checkout.",
  },
  {
    id: 3,
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return or exchange your order within 7 days.",
  },
  {
    id: 4,
    icon: Award,
    title: "Premium Quality",
    description: "Every outfit is crafted using premium fabrics and elegant finishes.",
  },
];

const WhyChooseUs = () => {
return (
  <section className="relative overflow-hidden bg-[#0f0f0f] ">

    {/* Background */}

    <div className="absolute inset-0">

      <div className="absolute left-[-150px] top-0 h-[500px] w-[500px] rounded-full bg-[#d72638]/10 blur-[170px]" />

      <div className="absolute right-[-120px] bottom-0 h-[450px] w-[450px] rounded-full bg-[#d72638]/10 blur-[160px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_60%)]" />

    </div>

    <div className="relative z-10 mx-auto max-w-[1500px] px-8">

      {/* Heading */}

      <div className="text-center">

        <span
          className="
          inline-flex
          items-center
          rounded-full
          border
          border-[#d72638]
          bg-[#d72638]/10
          px-6
          py-2
          text-xs
          uppercase
          tracking-[5px]
          text-[#ff7a86]
          "
        >
          ✦ Why Cupidanza
        </span>

        <h2
          className="
          mt-8
          text-5xl
          font-light
          uppercase
          tracking-[3px]
          text-white
          lg:text-6xl
          "
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Luxury Shopping

          <span className="mt-2 block text-[#d72638]">
            Experience
          </span>

        </h2>

        <div className="mx-auto mt-6 h-[2px] w-24 rounded-full bg-[#d72638]" />

        <p
          className="
          mx-auto
          mt-8
          max-w-3xl
          text-lg
          leading-9
          text-gray-400
          "
        >
          More than fashion—every purchase is backed by trusted service,
          premium craftsmanship, secure shopping and effortless support.
        </p>

      </div>

      {/* Cards */}

      <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

        {whyChooseUs.map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.id}
              className="
              group
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.03]
              p-10
              backdrop-blur-xl
              transition-all
              duration-500
              hover:-translate-y-3
              hover:border-[#d72638]/60
              hover:shadow-[0_25px_80px_rgba(215,38,56,0.20)]
              "
            >

              {/* Top Glow */}

              <div
                className="
                absolute
                -right-10
                -top-10
                h-36
                w-36
                rounded-full
                bg-[#d72638]/10
                blur-3xl
                opacity-0
                transition
                duration-500
                group-hover:opacity-100
                "
              />

              {/* Icon */}

              <div
                className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border
                border-[#d72638]/40
                bg-[#d72638]/10
                text-[#d72638]
                transition-all
                duration-500
                group-hover:scale-110
                group-hover:rotate-6
                "
              >

                <Icon size={34} />

              </div>

              {/* Number */}

              <span
                className="
                absolute
                right-8
                top-8
                text-6xl
                font-light
                text-white/5
                "
              >
                0{item.id}
              </span>

              {/* Content */}

              <h3
                className="
                mt-8
                text-2xl
                font-light
                uppercase
                tracking-[2px]
                text-white
                "
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                {item.title}
              </h3>

              <div
                className="
                mt-4
                h-[2px]
                w-12
                rounded-full
                bg-[#d72638]
                transition-all
                duration-500
                group-hover:w-20
                "
              />

              <p
                className="
                mt-6
                leading-8
                text-gray-400
                "
              >
                {item.description}
              </p>

            </div>

          );

        })}

      </div>

    </div>

  </section>
);
};


export default WhyChooseUs;