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
    <section className="bg-[#FAF7F2] py-24">
      <div className="max-w-[1450px] mx-auto px-8">

        <div className="text-center mb-16">
          <span className="inline-block rounded-full border border-red-200 bg-white px-5 py-2 text-xs uppercase tracking-[4px] text-red-600">
            Why Choose Us
          </span>

          <h2 className="mt-5 text-5xl font-bold text-gray-900">
            Shopping Made Better
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            We bring you premium fashion with trusted service and a seamless shopping experience.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-white p-10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-500">
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