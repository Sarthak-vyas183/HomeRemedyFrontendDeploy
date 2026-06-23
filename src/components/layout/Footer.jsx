import React from "react";
import Logo from "../../assets/LOGO.png";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center">
                <img src={Logo} alt="Logo" className="w-7 h-7 object-contain" />
              </div>
              <span className="font-bold text-lg">
                Home<span className="text-forest-400">Remedies</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Preserving traditional healing wisdom through community-driven, doctor-verified natural remedies.
            </p>
            <div className="flex gap-3">
              {[FaInstagram, FaFacebook, FaTwitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-forest-600 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              {["About Us", "Support", "Privacy Policy", "Terms & Conditions", "Pricing & Refund"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-white/50 hover:text-forest-400 text-sm transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-4">Community</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-white/50 hover:text-forest-400 text-sm transition-colors duration-200">
                  Traditional-Remedies.org
                </Link>
              </li>
              <li>
                <Link to="/" className="text-white/50 hover:text-forest-400 text-sm transition-colors duration-200">
                  Discord Community
                </Link>
              </li>
              <li>
                <Link to="/remedies" className="text-white/50 hover:text-forest-400 text-sm transition-colors duration-200">
                  Browse Remedies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-2.5">
              {["+91-9981546195", "+91-9302695689", "traditional.remedy@gmail.com"].map((item) => (
                <li key={item} className="text-white/50 text-sm">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} HomeRemedy.in. All Rights Reserved.</p>
          <p className="text-white/30 text-xs">Built with care for traditional wisdom</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
