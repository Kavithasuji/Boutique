import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCategories } from "../../services/category.service";
import { getProducts } from "../../services/product.service";
import { useNavigate } from "react-router-dom";



interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface Product {
  id: string;
  categoryId: string;
}



const HomeCategories = () => {
      const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoryRes, productRes] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(categoryRes);
        setProducts(productRes);
      } catch (err) {
        console.log(err);
      }
    };

    loadData();
  }, []);
  const visibleCategories = showAll
  ? categories
  : categories.slice(0, 6);

  const getProductCount = (categoryId: string) => {
    return products.filter(
      (product) => product.categoryId === categoryId
    ).length;
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] py-24">

      {/* Background Glow */}

      <div className="absolute top-0 left-0 h-[350px] w-[350px] rounded-full bg-red-100 blur-[150px] opacity-50" />

      <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-orange-100 blur-[160px] opacity-40" />

      <div className="relative max-w-[1450px] mx-auto px-8">

        {/* Heading */}

        <div className="text-center">

          <span className="inline-block rounded-full border border-red-200 bg-white px-5 py-2 text-xs uppercase tracking-[4px] text-red-600">

            Shop By Category

          </span>

          <h2 className="mt-5 text-5xl font-bold text-gray-900">

            Explore Every Style

          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-500">

            Discover premium collections crafted with timeless elegance,
            luxurious fabrics and modern silhouettes.

          </p>

        </div>

        {/* Grid */}

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

{visibleCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group"
            >

              <div
                className="
                relative
                overflow-hidden
                rounded-[32px]
                bg-white
                shadow-xl
                transition-all
                duration-500
                hover:-translate-y-3
                hover:shadow-2xl
                "
              >

                {/* Image */}

                <div className="relative h-[480px] overflow-hidden">

                  <img
                    src={category.image}
                    alt={category.name}
                    className="
                    h-full
                    w-full
                    object-cover
                    transition-all
                    duration-700
                    group-hover:scale-110
                    "
                  />

                  {/* Gradient */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Product Count */}

                  {/* <div className="absolute right-5 top-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold shadow">

                    {getProductCount(category.id)} Products

                  </div> */}

                  {/* Bottom */}

                  <div className="absolute bottom-0 left-0 right-0 p-7">

                    <h3 className="text-3xl font-bold text-white">

                      {category.name}

                    </h3>

                  </div>

                </div>

                {/* Hover Overlay */}

                <div
                  className="
                  absolute
                  inset-0
                  flex
                  translate-y-full
                  flex-col
                  justify-end
                  bg-gradient-to-t
                  from-black/90
                  via-black/70
                  to-transparent
                  p-8
                  transition-all
                  duration-500
                  group-hover:translate-y-0
                  "
                >

                  <span className="mb-3 text-sm uppercase tracking-[3px] text-red-300">

                    Premium Collection

                  </span>

                  <h3 className="text-3xl font-bold text-white">

                    {category.name}

                  </h3>

                  <p className="mt-4 line-clamp-4 text-gray-200 leading-7">

                    {category.description}

                  </p>

               <button
  onClick={() => navigate(`/category/${category.slug}`)}
  className="
    mt-8
    flex
    w-fit
    items-center
    gap-2
    rounded-full
    bg-white
    px-6
    py-3
    font-semibold
    text-red-600
    transition
    hover:bg-red-600
    hover:text-white
  "
>
  Explore Collection

  <ArrowRight size={18} />
</button>
                </div>

              </div>

            </Link>

          ))}

        </div>
        {categories.length > 6 && (
  <div className="mt-14 flex justify-center">
    <button
      onClick={() => setShowAll(!showAll)}
      className="
        rounded-full
        border
        border-red-600
        px-8
        py-3
        font-semibold
        text-red-600
        transition-all
        duration-300
        hover:bg-red-600
        hover:text-white
      "
    >
      {showAll ? "Show Less" : "See More"}
    </button>
  </div>
)}

      </div>
    </section>
  );
};

export default HomeCategories;