
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo/cupi.webp";

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

  useEffect(() => {
  const loadNavigation = async () => {
    try {
      const [categoryRes, productRes] = await Promise.all([
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg py-3"
          : "bg-[#FAF7F2]/85 backdrop-blur-xl border-b border-white/40 py-4"
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-8 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Cupidanza"
            className="h-14 w-auto"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Cupidanza
            </h1>

            <p className="text-xs tracking-[6px] uppercase text-gray-400">
              Boutique
            </p>
          </div>
        </Link>

        {/* Navigation */}

        <nav className="hidden lg:flex items-center gap-10">

        <nav className="hidden lg:flex items-center gap-10">

  {/* Categories */}

  <div className="relative group">

    <button className="font-medium text-gray-800 hover:text-red-600">
      Categories
    </button>

    <div
      className="
      invisible
      opacity-0
      absolute
      left-0
      top-full
      mt-3
      w-64
      rounded-xl
      bg-white
      shadow-xl
      transition-all
      duration-300
      group-hover:visible
      group-hover:opacity-100
      z-50
      "
    >
      {categories.map((category: any) => (
        <Link
          key={category.id}
          to={`/category/${category.slug}`}
          className="block px-5 py-3 hover:bg-gray-100"
        >
          {category.name}
        </Link>
      ))}
    </div>

  </div>

  {/* Collections */}

  <div className="relative group">

    <button className="font-medium text-gray-800 hover:text-red-600">
      Collections
    </button>

    <div
      className="
      invisible
      opacity-0
      absolute
      left-0
      top-full
      mt-3
      w-72
      max-h-96
      overflow-y-auto
      rounded-xl
      bg-white
      shadow-xl
      transition-all
      duration-300
      group-hover:visible
      group-hover:opacity-100
      z-50
      "
    >
      {products.map((product: any) => (
        <Link
          key={product.id}
          to={`/product/${product.slug}`}
          className="block px-5 py-3 hover:bg-gray-100"
        >
          {product.name}
        </Link>
      ))}
    </div>

  </div>

  <Link
    to="/about"
    className="font-medium text-gray-800 hover:text-red-600"
  >
    About
  </Link>

  <Link
    to="/contact"
    className="font-medium text-gray-800 hover:text-red-600"
  >
    Contact
  </Link>

</nav>

        </nav>

        {/* Right */}

        <div className="hidden lg:flex items-center gap-5">

          {/* Search */}

          <div className="relative">

            <input
              type="text"
              placeholder="Search products..."
              className="
              w-64
              rounded-full
              border
              border-[#E8DDD0]
              bg-white/70
              backdrop-blur-md
              py-2.5
              pl-5
              pr-11
              text-sm
              placeholder:text-gray-400
              focus:outline-none
              focus:border-red-500
              focus:bg-white
              transition-all
              "
            />

            <Search
              size={18}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

          </div>

          {/* Account - Changes based on auth state */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="transition hover:text-red-600 hover:scale-110">
                <User size={21} />
              </button>
              <div className="invisible opacity-0 absolute right-0 top-full mt-2 w-48 rounded-xl bg-white shadow-xl transition-all duration-300 group-hover:visible group-hover:opacity-100 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="transition hover:text-red-600 hover:scale-110"
            >
              <User size={21} />
            </Link>
          )}

          {/* Wishlist */}

          <Link
            to="/wishlist"
            className="transition hover:text-red-600 hover:scale-110"
          >
            <Heart size={21} />
          </Link>

          {/* Cart */}

          <Link
            to="/cart"
            className="relative transition hover:text-red-600 hover:scale-110"
          >
            <ShoppingBag size={21} />

            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
              0
            </span>

          </Link>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="
              rounded-full
              bg-red-600
              px-6
              py-3
              font-medium
              text-white
              shadow-lg
              transition
              hover:-translate-y-1
              hover:bg-red-700
              "
            >
              My Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="
                rounded-full
                border-2
                border-red-600
                px-6
                py-3
                font-medium
                text-red-600
                transition
                hover:bg-red-50
                "
              >
                Login
              </Link>
              <Link
                to="/register"
                className="
                rounded-full
                bg-red-600
                px-6
                py-3
                font-medium
                text-white
                shadow-lg
                transition
                hover:-translate-y-1
                hover:bg-red-700
                "
              >
                Register
              </Link>
            </>
          )}

          {/* Admin */}

          <Link
            to="/admin/login"
            className="
            rounded-full
            bg-gray-800
            px-4
            py-3
            font-medium
            text-white
            shadow-lg
            transition
            hover:-translate-y-1
            hover:bg-gray-900
            text-sm
            "
          >
            Admin
          </Link>

        </div>

        {/* Mobile */}
{/* 
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-3xl"
        >
          ☰
        </button> */}

      </div>

      {menuOpen && (

        <div className="lg:hidden bg-[#FAF7F2] backdrop-blur-xl shadow-xl">

          <div className="flex flex-col gap-5 p-6">

            {navItems.map((item) => (

              <Link
                key={item.title}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-red-600"
              >
                {item.title}
              </Link>

            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-red-600"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-red-600"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border-2 border-red-600 py-3 text-center text-red-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-red-600 py-3 text-center text-white"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-gray-800 py-3 text-center text-white"
            >
              Admin
            </Link>

          </div>

        </div>

      )}

    </header>
  );
};

export default Header;