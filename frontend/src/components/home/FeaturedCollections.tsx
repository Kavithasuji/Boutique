import { ArrowRight } from "lucide-react";

const featuredCollections = [
  {
    id: 1,
    title: "Wedding Collection",
    subtitle: "Luxury Silk Sarees",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Summer Collection",
    subtitle: "Lightweight Cotton Styles",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Party Wear",
    subtitle: "Modern Evening Dresses",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1450px] mx-auto px-8">
        <div className="text-center mb-14">
          <span className="inline-block rounded-full border border-red-200 bg-red-50 px-5 py-2 text-xs uppercase tracking-[4px] text-red-600">
            Featured Collections
          </span>

          <h2 className="mt-5 text-5xl font-bold text-gray-900">
            Curated Just For You
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
            Discover our handpicked collections designed for every occasion.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featuredCollections.map((collection) => (
            <div
              key={collection.id}
              className="group overflow-hidden rounded-3xl bg-white shadow-xl transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-[500px] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 p-8">
                  <p className="text-sm uppercase tracking-[3px] text-red-300">
                    {collection.subtitle}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-white">
                    {collection.title}
                  </h3>

                  <button className="mt-6 flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white">
                    Shop Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;