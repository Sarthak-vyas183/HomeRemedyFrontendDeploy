import React, { useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import Footer from "../layout/Footer";

function Home() {
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.2,
      });
    });
    return () => context.revert();
  }, []);

  const features = [
    { icon: "🌿", title: "Natural Healing", desc: "Rooted in centuries of traditional herbal knowledge" },
    { icon: "✅", title: "Doctor Verified", desc: "Every remedy reviewed by certified medical professionals" },
    { icon: "🌱", title: "100% Organic", desc: "Natural ingredients, zero synthetic additives" },
    { icon: "💊", title: "No Side Effects", desc: "Gentle, time-tested remedies safe for all ages" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative w-full h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: "url(../../../images/about.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/85 via-forest-950/70 to-forest-900/60" />

        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 w-full">
          <div className="hero-content max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-forest-600/20 border border-forest-400/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 bg-forest-400 rounded-full animate-pulse" />
              <span className="text-forest-300 text-sm font-medium">Community-Driven Healing Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
              Natural<br />
              <span className="text-forest-400">Herbal</span>{" "}
              <span className="text-white">Remedies</span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Discover centuries-old traditional healing practices — shared by communities, verified by doctors, trusted by families.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/remedies"
                className="inline-flex items-center gap-2 bg-forest-600 hover:bg-forest-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-forest-600/25"
              >
                <span>Explore Remedies</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                Learn More
              </Link>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-white/10">
              {[
                { value: "500+", label: "Remedies" },
                { value: "100%", label: "Organic" },
                { value: "Dr.", label: "Verified" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-forest-400">{value}</p>
                  <p className="text-white/50 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs">Scroll to discover</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>

        <img
          src="../../../images/leaficon.png"
          alt=""
          className="absolute bottom-10 right-10 w-32 md:w-48 opacity-20 pointer-events-none"
          style={{ animation: "float 4s ease-in-out infinite" }}
        />
      </section>

      {/* About Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 text-sm font-semibold px-3 py-1 rounded-full mb-6">
                🌿 Who We Are
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Remedies for<br />
                <span className="text-forest-600">every ailment</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Homemade rural remedies preserve traditional knowledge passed down through generations, offering natural, accessible solutions for common ailments. They promote self-reliance and health in rural communities, reducing dependency on modern pharmaceuticals.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-xl bg-forest-50 border border-forest-100">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/remedies"
                className="inline-flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Browse All Remedies
              </Link>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="../../../images/home02.png"
                  alt="Natural Remedies"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-elevated p-4 border border-forest-100 max-w-[180px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🏥</span>
                  <span className="text-forest-700 font-bold text-sm">Doctor Verified</span>
                </div>
                <p className="text-gray-500 text-xs">All remedies reviewed by certified professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}

export default Home;
