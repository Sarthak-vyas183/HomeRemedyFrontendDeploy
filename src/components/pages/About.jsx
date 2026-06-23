/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profile from "../../assets/profile.jpg";
import { Link } from "react-router-dom";
import Footer from "../layout/Footer";
gsap.registerPlugin(ScrollTrigger);

function About() {
  const founderRef = useRef(null);

  useEffect(() => {
    gsap.from(".about-hero-text > *", {
      opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: "power2.out", delay: 0.2,
    });
    if (founderRef.current) {
      gsap.from(founderRef.current.querySelectorAll(".founder-card"), {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: founderRef.current, start: "top 85%" },
      });
    }
  }, []);

  const values = [
    { icon: "🌿", title: "Traditional Wisdom", desc: "Preserving centuries of healing knowledge passed through generations" },
    { icon: "🔬", title: "Scientific Validation", desc: "Every remedy reviewed by certified medical professionals" },
    { icon: "🤝", title: "Community Driven", desc: "Built by and for communities who rely on natural healing" },
    { icon: "🌍", title: "Accessible to All", desc: "Free, open-source knowledge for everyone, everywhere" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative pt-[10vh] h-[60vh] flex items-center overflow-hidden"
        style={{ backgroundImage: "url(../../../images/about.png)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-forest-950/70 to-forest-800/60" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 text-center about-hero-text">
          <div className="inline-flex items-center gap-2 bg-forest-600/20 border border-forest-400/30 rounded-full px-4 py-1.5 mb-5">
            <span className="text-forest-400 text-sm font-medium">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            About <span className="text-forest-400">HomeRemedy</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Born from a hackathon, grown into a community — discover the story behind the platform
          </p>
          <nav className="flex items-center justify-center gap-2 text-sm text-white/50 mt-6">
            <Link to="/" className="hover:text-forest-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">About</span>
          </nav>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 text-sm font-semibold px-3 py-1 rounded-full mb-6">
            🌱 Our Mission
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Empowering communities with <span className="text-forest-600">traditional healing</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            HomeRemedy.in was born in 2024 when three college students participated in the Sistech Hackathon. The challenge was to create a web application that could have a positive impact on society. Motivated by the opportunity to make a difference, they developed a platform where users can share and explore homemade remedies for various ailments. This initiative not only impressed the judges but also laid the foundation for a community-driven platform that empowers individuals to leverage traditional knowledge for health and well-being.
          </p>
          <Link to="/contact" className="btn-primary inline-flex">
            Get In Touch
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="bg-forest-50 py-20 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What we stand for</h2>
            <p className="text-gray-500">Our core principles guide everything we build</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 text-center hover:border-forest-200 transition-all">
                <div className="w-14 h-14 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 px-4 lg:px-8" ref={founderRef}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 text-sm font-semibold px-3 py-1 rounded-full mb-6">
            👥 The Team
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Meet the Founders</h2>

          <div className="flex flex-wrap justify-center gap-8">
            <div className="founder-card card p-8 flex flex-col items-center max-w-xs w-full">
              <div className="relative mb-5">
                <img
                  src={profile}
                  alt="Sarthak Vyas"
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-forest-100 shadow-md"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">👨‍💻</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Sarthak Vyas</h3>
              <p className="text-forest-600 text-sm font-medium mb-3">Founder & CEO</p>
              <p className="text-gray-500 text-sm text-center mb-5 leading-relaxed">
                Visionary behind HomeRemedy.org, passionate about bringing traditional healing to the digital age.
              </p>
              <div className="flex gap-2">
                <a
                  href="https://www.linkedin.com/in/sarthak-vyas-/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  LinkedIn
                </a>
                <a href="mailto:sarthak@example.com" className="btn-ghost text-xs px-3 py-1.5 border border-gray-200">
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
