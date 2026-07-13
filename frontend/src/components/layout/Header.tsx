import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo/cupi.webp';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Collections', path: '/collections' },
    { title: 'Categories', path: '/categories' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-white/90 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">

        {/* Logo */}

        <Link to="/" className="flex items-center gap-3">

          <img
            src={logo}
            alt="Cupidanza"
            className="h-14 w-auto"
          />

          <div>
            <h1 className="text-2xl font-bold text-black">
              Cupidanza
            </h1>

            <p className="text-xs tracking-[5px] uppercase text-gray-400">
              Boutique
            </p>
          </div>

        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden lg:flex items-center gap-10">

          {navItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`font-medium transition-all duration-300 ${
                location.pathname === item.path
                  ? 'text-red-600'
                  : 'text-gray-800 hover:text-red-600'
              }`}
            >
              {item.title}
            </Link>
          ))}

        </nav>

        {/* Right Buttons */}

        <div className="hidden lg:flex items-center gap-4">

          <Link
            to="/login"
            className="px-5 py-2 rounded-full border-2 border-red-600 text-red-600 font-medium hover:bg-red-600 hover:text-white transition-all duration-300"
          >
            Customer Login
          </Link>

          <Link
            to="/admin/login"
            className="px-5 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-300 shadow-lg"
          >
            Admin Login
          </Link>

        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-2xl text-black"
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (

        <div className="lg:hidden bg-white shadow-xl">

          <div className="flex flex-col p-6 gap-5">

            {navItems.map((item) => (

              <Link
                key={item.title}
                to={item.path}
                className="font-medium text-gray-700 hover:text-red-600"
                onClick={() => setMenuOpen(false)}
              >
                {item.title}
              </Link>

            ))}

            <Link
              to="/login"
              className="border-2 border-red-600 rounded-full py-2 text-center text-red-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Customer Login
            </Link>

            <Link
              to="/admin/login"
              className="bg-red-600 rounded-full py-2 text-center text-white font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>

          </div>

        </div>

      )}

    </header>
  );
};

export default Header;