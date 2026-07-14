import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const quickLinks = [
  "Home",
  "Categories",
  "Collections",
  "About",
  "Contact",
];

const categories = [
  "Sarees",
  "Kurtis",
  "Dresses",
  "Lehengas",
  "Tops",
];

const Footer = () => {
  return (
    <footer className="bg-[#161616] text-gray-300">

      {/* Top */}

      <div className="max-w-[1450px] mx-auto px-8 py-20">

        <div className="grid gap-14 lg:grid-cols-4">

          {/* Brand */}

          <div>

            <h2 className="text-4xl font-bold text-white">
              Cupidanza
            </h2>

            <p className="mt-2 uppercase tracking-[6px] text-red-400 text-xs">
              Boutique
            </p>

            <p className="mt-8 leading-8 text-gray-400">
              Discover timeless elegance with premium ethnic and western
              collections designed for every occasion.
            </p>

           <div className="mt-8 flex gap-4">
  {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map((Icon, index) => (
    <button
      key={index}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-red-600"
    >
      <Icon size={20} />
    </button>
  ))}
</div>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-2xl font-semibold text-white">
              Quick Links
            </h3>

            <div className="mt-8 space-y-4">

              {quickLinks.map((item) => (

                <a
                  key={item}
                  href="#"
                  className="flex items-center gap-2 transition hover:text-red-400"
                >
                  <ArrowRight size={16} />

                  {item}
                </a>

              ))}

            </div>

          </div>

          {/* Categories */}

          <div>

            <h3 className="text-2xl font-semibold text-white">
              Categories
            </h3>

            <div className="mt-8 space-y-4">

              {categories.map((item) => (

                <a
                  key={item}
                  href="#"
                  className="flex items-center gap-2 transition hover:text-red-400"
                >
                  <ArrowRight size={16} />

                  {item}
                </a>

              ))}

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-2xl font-semibold text-white">
              Contact Us
            </h3>

            <div className="mt-8 space-y-6">

              <div className="flex gap-4">

                <MapPin className="text-red-500" />

                <p>
                  123 Fashion Street,
                  <br />
                  Chennai, Tamil Nadu
                </p>

              </div>

              <div className="flex gap-4">

                <Phone className="text-red-500" />

                <p>+91 98765 43210</p>

              </div>

              <div className="flex gap-4">

                <Mail className="text-red-500" />

                <p>support@cupidanza.com</p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-white/10">

        <div className="max-w-[1450px] mx-auto flex flex-col items-center justify-between gap-4 px-8 py-6 text-sm text-gray-400 lg:flex-row">

          <p>
            © {new Date().getFullYear()} Cupidanza Boutique. All rights reserved.
          </p>

          <div className="flex gap-8">

            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-white">
              Terms & Conditions
            </a>

            <a href="#" className="hover:text-white">
              Refund Policy
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;