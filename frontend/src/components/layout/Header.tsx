import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/cupi.webp";
import { searchProducts } from "../../services/search.service";
import type { SearchProduct } from "../../types/search";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react";

import { getCategories } from "../../services/category.service";
import { getProducts } from "../../services/product.service";
import { useAuth } from "../../contexts/AuthContext";
const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
const [query,setQuery]=useState("");

const [loading,setLoading]=useState(false);

const [results, setResults] = useState<SearchProduct[]>([]);
const handleKeyDown=(

e:React.KeyboardEvent<HTMLInputElement>

)=>{

if(e.key==="Enter"){

navigate(`/search?q=${query}`);

}

};

const debouncedQuery=useDebounce(query);

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const [categoryRes, productRes] =
          await Promise.all([
            getCategories(),
            getProducts(),
          ]);

        setCategories(categoryRes);
        setProducts(productRes);
      } catch (error) {
        console.error(error);
      }
    };

    loadNavigation();
  }, []);
  useEffect(()=>{

    if(!debouncedQuery.trim()){

      setResults

        return;

    }

    const fetchResults=async()=>{

        try{

            setLoading(true);

           const data = await searchProducts(debouncedQuery);

const keyword = debouncedQuery.toLowerCase().trim();

const sorted = [...data].sort((a, b) => {
  const aName = a.name.toLowerCase();
  const bName = b.name.toLowerCase();

  const aStarts = aName.startsWith(keyword);
  const bStarts = bName.startsWith(keyword);

  if (aStarts && !bStarts) return -1;
  if (!aStarts && bStarts) return 1;

  const aContains = aName.includes(keyword);
  const bContains = bName.includes(keyword);

  if (aContains && !bContains) return -1;
  if (!aContains && bContains) return 1;

  return aName.localeCompare(bName);
});

setResults(sorted);

        }catch(err){

            console.log(err);

        }finally{

            setLoading(false);

        }

    };

    fetchResults();

},[debouncedQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const navItems = [
    {
      title: "Categories",
      path: "/categories",
    },
    {
      title: "Collections",
      path: "/collections",
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Contact",
      path: "/contact",
    },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.55)] border-b border-[#d72638]/40 py-3"
          : "bg-black/75 backdrop-blur-xl border-b border-white/10 py-4"
      }`}
    >
      <div className="mx-auto flex max-w-[1450px] items-center justify-between px-8">

        {/* Logo */}
        {/* ===================== LOGO ===================== */}

<Link
  to="/"
  className="group flex items-center gap-4"
>
  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(215,38,56,0.35)]">

    <img
      src={logo}
      alt="Cupidanza"
      className="h-10 w-10 object-contain"
    />

  </div>

  <div>

    <h3
      className="text-xl font-light uppercase tracking-[5px] text-white"
      style={{
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      CUPIDANZA
    </h3>

    <p className="mt-1 text-[11px] uppercase tracking-[8px] text-[#d72638]">
      Luxury Fashion
    </p>

  </div>

</Link>

{/* ===================== NAVIGATION ===================== */}

<nav className="hidden items-center gap-10 lg:flex">

  {/* Categories */}

  <div className="relative group">

    <button
      className="
      relative
      text-sm
      uppercase
      tracking-[2px]
      text-white
      transition
      duration-300
      hover:text-[#d72638]
      "
    >
      Categories

      <span
        className="
        absolute
        -bottom-2
        left-0
        h-[2px]
        w-0
        bg-[#d72638]
        transition-all
        duration-300
        group-hover:w-full
        "
      />
    </button>

    <div
      className="
      invisible
      absolute
      left-0
      top-full
      z-50
      mt-6
      w-72
      rounded-xl
      border
      border-white/10
      bg-[#111111]/95
      opacity-0
      shadow-[0_20px_60px_rgba(0,0,0,0.45)]
      backdrop-blur-xl
      transition-all
      duration-300
      group-hover:visible
      group-hover:opacity-100
      "
    >

      <div className="border-b border-white/10 px-5 py-4">

        <h3 className="text-sm uppercase tracking-[4px] text-[#d72638]">
          Categories
        </h3>

      </div>

      {categories.map((category: any) => (

        <Link
          key={category.id}
          to={`/category/${category.slug}`}
          className="
          block
          border-b
          border-white/5
          px-5
          py-3
          text-sm
          text-gray-300
          transition
          hover:bg-[#d72638]
          hover:text-white
          "
        >
          {category.name}
        </Link>

      ))}

    </div>

  </div>

  {/* Collections */}

  <div className="relative group">

    <button
      className="
      relative
      text-sm
      uppercase
      tracking-[2px]
      text-white
      transition
      duration-300
      hover:text-[#d72638]
      "
    >
      Collections

      <span
        className="
        absolute
        -bottom-2
        left-0
        h-[2px]
        w-0
        bg-[#d72638]
        transition-all
        duration-300
        group-hover:w-full
        "
      />
    </button>

    <div
      className="
      invisible
      absolute
      left-0
      top-full
      z-50
      mt-6
      max-h-[420px]
      w-80
      overflow-y-auto
      rounded-xl
      border
      border-white/10
      bg-[#111111]/95
      opacity-0
      shadow-[0_20px_60px_rgba(0,0,0,0.45)]
      backdrop-blur-xl
      transition-all
      duration-300
      group-hover:visible
      group-hover:opacity-100
      "
    >

      <div className="border-b border-white/10 px-5 py-4">

        <h3 className="text-sm uppercase tracking-[4px] text-[#d72638]">
          Collections
        </h3>

      </div>

      {products.map((product: any) => (

        <Link
          key={product.id}
          to={`/product/${product.slug}`}
          className="
          block
          border-b
          border-white/5
          px-5
          py-3
          text-sm
          text-gray-300
          transition
          hover:bg-[#d72638]
          hover:text-white
          "
        >
          {product.name}
        </Link>

      ))}

    </div>

  </div>

  {/* About */}

  <p
    className="
    relative
    text-sm
    uppercase
    tracking-[2px]
    text-white
    transition
    hover:text-[#d72638]
    after:absolute
    after:-bottom-2
    after:left-0
    after:h-[2px]
    after:w-0
    after:bg-[#d72638]
    after:transition-all
    hover:after:w-full
    "
  >
    About
  </p>

  {/* Contact */}

  <p
    className="
    relative
    text-sm
    uppercase
    tracking-[2px]
    text-white
    transition
    hover:text-[#d72638]
    after:absolute
    after:-bottom-2
    after:left-0
    after:h-[2px]
    after:w-0
    after:bg-[#d72638]
    after:transition-all
    hover:after:w-full
    "
  >
    Contact
  </p>

</nav>
{/* ===================== RIGHT SECTION ===================== */}

<div className="hidden lg:flex items-center gap-6">

  {/* Search */}

<div className="relative">

  <input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="Search products..."
  className="
    w-72
    rounded-full
    border
    border-white/10
    bg-white/10
    py-3
    pl-6
    pr-12
    text-sm
    text-white
    placeholder:text-gray-400
    backdrop-blur-xl
    transition
    duration-300
    focus:border-[#d72638]
    focus:bg-white/15
    focus:outline-none
  "
/>

  <Search
    size={18}
    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300"
  />


    {
query && (

<div className="absolute left-0 top-full mt-3 w-full rounded-xl bg-white shadow-2xl z-50">

    {
        loading &&

        <p className="p-4 text-sm">
            Searching...
        </p>
    }

    {
        results.length >0 &&

        <>

        <div className="px-4 py-2 text-xs font-semibold text-gray-500">

            PRODUCTS

        </div>

        {
results.map((product) => (
                <div

                key={product.id}

                onClick={()=>{

                    navigate(`/product/${product.slug}`);

                    setQuery("");

                }}

                className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-100"

                >

                    <img

                    src={product.colors[0]?.imageUrl}

                    className="h-14 w-14 rounded-lg object-cover"

                    />

                    <div>

                        <p>

                            {product.name}

                        </p>

                        <p className="text-sm text-gray-500">

                            ₹{product.price}

                        </p>

                    </div>

                </div>

            ))
        }

        </>

    }

    {/* {
        results.categories.length>0 &&

        <>

        <div className="border-t px-4 py-2 text-xs font-semibold text-gray-500">

            CATEGORIES

        </div>

        {

            results.categories.map(category=>(

                <div

                key={category.id}

                onClick={()=>{

                    navigate(`/category/${category.slug}`);

                    setQuery("");

                }}

                className="cursor-pointer px-4 py-3 hover:bg-gray-100"

                >

                    {category.name}

                </div>

            ))

        }

        </>

    } */}

</div>

)
}


  </div>

  {/* Profile */}

  {isAuthenticated ? (

    <div className="relative group">

      <button
        className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-full
        border
        border-white/10
        bg-white/10
        text-white
        transition
        duration-300
        hover:border-[#d72638]
        hover:bg-[#d72638]
        "
      >
        <User size={19} />
      </button>

      <div
        className="
        invisible
        absolute
        right-0
        top-full
        z-50
        mt-5
        w-64
        overflow-hidden
        rounded-xl
        border
        border-white/10
        bg-[#111111]/95
        opacity-0
        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
        backdrop-blur-xl
        transition-all
        duration-300
        group-hover:visible
        group-hover:opacity-100
        "
      >

        <div className="border-b border-white/10 p-5">

          <h3 className="font-semibold text-white">
            {user?.name}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            {user?.email}
          </p>

        </div>

        <Link
          to="/profile"
          className="block px-5 py-3 text-sm text-gray-300 transition hover:bg-[#d72638] hover:text-white"
        >
          My Profile
        </Link>

        <Link
          to="/orders"
          className="block px-5 py-3 text-sm text-gray-300 transition hover:bg-[#d72638] hover:text-white"
        >
          My Orders
        </Link>

        <button
          onClick={logout}
          className="
          w-full
          px-5
          py-3
          text-left
          text-sm
          text-red-400
          transition
          hover:bg-[#d72638]
          hover:text-white
          "
        >
          Logout
        </button>

      </div>

    </div>

  ) : (

    <Link
      to="/login"
      className="
      flex
      h-11
      w-11
      items-center
      justify-center
      rounded-full
      border
      border-white/10
      bg-white/10
      text-white
      transition
      duration-300
      hover:border-[#d72638]
      hover:bg-[#d72638]
      "
    >
      <User size={19} />
    </Link>

  )}

  {/* Wishlist */}

  <p
    className="
    flex
    h-11
    w-11
    items-center
    justify-center
    rounded-full
    border
    border-white/10
    bg-white/10
    text-white
    transition
    duration-300
    hover:border-[#d72638]
    hover:bg-[#d72638]
    "
  >
    <Heart size={19} />
  </p>

  {/* Cart */}

  <Link
    to="/cart"
    className="
    relative
    flex
    h-11
    w-11
    items-center
    justify-center
    rounded-full
    border
    border-white/10
    bg-white/10
    text-white
    transition
    duration-300
    hover:border-[#d72638]
    hover:bg-[#d72638]
    "
  >

    <ShoppingBag size={19} />

    <span
      className="
      absolute
      -right-1
      -top-1
      flex
      h-5
      w-5
      items-center
      justify-center
      rounded-full
      bg-[#d72638]
      text-[10px]
      font-semibold
      text-white
      "
    >
      0
    </span>

  </Link>

  {/*
  <Link
    to="/admin/login"
    className="
    rounded-full
    bg-[#d72638]
    px-5
    py-3
    text-sm
    uppercase
    tracking-[2px]
    text-white
    transition
    hover:bg-[#b81f2f]
    "
  >
    Admin
  </Link>
  */}

</div>
        {/* ===================== MOBILE MENU BUTTON ===================== */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-white/10
          text-2xl
          text-white
          transition
          duration-300
          hover:border-[#d72638]
          hover:bg-[#d72638]
          lg:hidden
          "
        >
          ☰
        </button>

      </div>

      {/* ===================== MOBILE MENU ===================== */}

      {menuOpen && (

        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-2xl">

          <div className="space-y-3 px-6 py-6">

            {navItems.map((item) => (

              <Link
                key={item.title}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="
                block
                rounded-lg
                px-4
                py-3
                text-sm
                uppercase
                tracking-[2px]
                text-gray-300
                transition
                hover:bg-[#d72638]
                hover:text-white
                "
              >
                {item.title}
              </Link>

            ))}

            <div className="my-4 border-t border-white/10"></div>

            {isAuthenticated ? (

              <>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="
                  block
                  rounded-lg
                  px-4
                  py-3
                  text-gray-300
                  transition
                  hover:bg-[#d72638]
                  hover:text-white
                  "
                >
                  My Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="
                  block
                  rounded-lg
                  px-4
                  py-3
                  text-gray-300
                  transition
                  hover:bg-[#d72638]
                  hover:text-white
                  "
                >
                  My Orders
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="
                  w-full
                  rounded-lg
                  px-4
                  py-3
                  text-left
                  text-red-400
                  transition
                  hover:bg-[#d72638]
                  hover:text-white
                  "
                >
                  Logout
                </button>

              </>

            ) : (

              <>

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="
                  block
                  rounded-lg
                  border
                  border-[#d72638]
                  py-3
                  text-center
                  uppercase
                  tracking-[2px]
                  text-[#d72638]
                  transition
                  hover:bg-[#d72638]
                  hover:text-white
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="
                  mt-3
                  block
                  rounded-lg
                  bg-[#d72638]
                  py-3
                  text-center
                  uppercase
                  tracking-[2px]
                  text-white
                  transition
                  hover:bg-[#b81f2f]
                  "
                >
                  Register
                </Link>

              </>

            )}

            <div className="my-4 border-t border-white/10"></div>

            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="
              block
              rounded-lg
              px-4
              py-3
              text-gray-300
              transition
              hover:bg-[#d72638]
              hover:text-white
              "
            >
              Wishlist
            </Link>

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="
              block
              rounded-lg
              px-4
              py-3
              text-gray-300
              transition
              hover:bg-[#d72638]
              hover:text-white
              "
            >
              Cart
            </Link>

            {/*
            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="
              mt-3
              block
              rounded-lg
              bg-gray-800
              py-3
              text-center
              uppercase
              tracking-[2px]
              text-white
              "
            >
              Admin
            </Link>
            */}

          </div>

        </div>

      )}

    </header>
  );
};

export default Header;