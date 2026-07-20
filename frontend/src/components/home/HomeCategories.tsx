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
<section className="relative -mt-24 overflow-hidden bg-[#0f0f0f] pt-16 pb-28">
    {/* Background Effects */}

    <div className="absolute inset-0 overflow-hidden">

      <div
        className="
        absolute
        -left-40
        top-10
        h-[520px]
        w-[520px]
        rounded-full
        bg-[#d72638]/15
        blur-[180px]
        "
      />

      <div
        className="
        absolute
        -right-32
        bottom-0
        h-[450px]
        w-[450px]
        rounded-full
        bg-[#d72638]/10
        blur-[170px]
        "
      />

      <div
        className="
        absolute
        left-1/2
        top-1/2
        h-[700px]
        w-[700px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        border
        border-white/5
        "
      />

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
          ✦ Curated Collections
        </span>

        <h2
          className="
          mt-8
          text-5xl
          font-light
          uppercase
          tracking-[4px]
          text-white
          lg:text-6xl
          "
          style={{
            fontFamily:
              "'Montserrat', sans-serif",
          }}
        >
          Shop By

          <span className="block mt-2 text-[#d72638]">
            Category
          </span>

        </h2>

        <div
          className="
          mx-auto
          mt-6
          h-[2px]
          w-24
          rounded-full
          bg-[#d72638]
          "
        />

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
          Discover thoughtfully curated collections
          that combine timeless elegance, premium
          craftsmanship, and contemporary fashion
          for every occasion.
        </p>

      </div>

      {/* Grid */}
      {/* Grid */}

<div className="mt-20 grid gap-10 sm:grid-cols-2 xl:grid-cols-3">

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
        rounded-[34px]
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-3
        hover:border-[#d72638]/60
        hover:shadow-[0_25px_80px_rgba(215,38,56,0.18)]
        "
      >

        {/* Image */}

        <div className="relative h-[520px] overflow-hidden">

          <img
            src={category.image}
            alt={category.name}
            className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            group-hover:scale-110
            "
          />

          {/* Overlay */}

          <div
            className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#050505]
            via-black/40
            to-transparent
            "
          />

          {/* Premium Badge */}

          <div
            className="
            absolute
            left-6
            top-6
            rounded-full
            border
            border-[#d72638]/40
            bg-black/70
            px-4
            py-2
            backdrop-blur-xl
            "
          >

            <span
              className="
              text-[11px]
              uppercase
              tracking-[3px]
              text-[#ff7a86]
              "
            >
              Premium
            </span>

          </div>

          {/* Product Count */}

          <div
            className="
            absolute
            right-6
            top-6
            rounded-full
            border
            border-white/10
            bg-white/10
            px-4
            py-2
            backdrop-blur-xl
            "
          >

            <span
              className="
              text-sm
              font-medium
              text-white
              "
            >
              {getProductCount(category.id)} Products
            </span>

          </div>

          {/* Bottom Content */}

          <div
            className="
            absolute
            bottom-0
            left-0
            right-0
            p-8
            "
          >

            <p
              className="
              text-xs
              uppercase
              tracking-[4px]
              text-[#ff7a86]
              "
            >
              Luxury Collection
            </p>

            <h4
              className="
              mt-3
              text-xl
              font-light
              uppercase
              tracking-[2px]
              text-white
              "
              style={{
                fontFamily:
                  "'Montserrat', sans-serif",
              }}
            >
              {category.name}
            </h4>

          </div>

        </div>

        {/* Hover Panel */}

        <div
          className="
          absolute
          inset-0
          flex
          translate-y-full
          flex-col
          justify-end
          bg-gradient-to-t
          from-black
          via-black/90
          to-black/20
          p-8
          transition-all
          duration-500
          group-hover:translate-y-0
          "
        >

          <span
            className="
            text-xs
            uppercase
            tracking-[4px]
            text-[#ff7a86]
            "
          >
            Discover Collection
          </span>

          <h3
            className="
            mt-4
            text-4xl
            font-light
            uppercase
            text-white
            "
          >
            {category.name}
          </h3>

          <p
            className="
            mt-5
            line-clamp-4
            text-base
            leading-8
            text-gray-300
            "
          >
            {category.description}
          </p>

          <button
            onClick={() => navigate(`/category/${category.slug}`)}
            className="
            mt-8
            flex
            w-fit
            items-center
            gap-3
            rounded-full
            border
            border-[#d72638]
            bg-[#d72638]
            px-7
            py-3
            text-sm
            font-semibold
            uppercase
            tracking-[2px]
            text-white
            transition-all
            duration-300
            hover:scale-105
            hover:bg-transparent
            "
          >
            Explore Collection

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />

          </button>

        </div>

      </div>

    </Link>

  ))}

</div>
{categories.length > 6 && (
  <div className="mt-20 flex justify-center">

    <button
      onClick={() => setShowAll(!showAll)}
      className="
      group
      inline-flex
      items-center
      gap-3
      rounded-full
      border
      border-[#d72638]
      bg-[#d72638]/10
      px-10
      py-4
      text-sm
      font-semibold
      uppercase
      tracking-[3px]
      text-white
      backdrop-blur-xl
      transition-all
      duration-300
      hover:scale-105
      hover:bg-[#d72638]
      hover:shadow-[0_15px_45px_rgba(215,38,56,0.35)]
      "
    >
      {showAll ? "Show Less" : "View All Categories"}

      <ArrowRight
        size={18}
        className={`
          transition-all
          duration-300
          ${showAll ? "rotate-90" : "group-hover:translate-x-1"}
        `}
      />
    </button>

  </div>
)}

    </div>
  </section>
);

};

export default HomeCategories;


