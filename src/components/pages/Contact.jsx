/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { toast } from "react-toastify";
import Footer from "../layout/Footer";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullname: "", email: "", contact: "", message: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);
    try {
      const response = await fetch(`${baseUrl}user/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok && data.msg === "contact message Sent") {
        setSubmitted(true);
        setForm({ fullname: "", email: "", contact: "", message: "" });
        toast.success("Message sent successfully!");
      } else {
        setError(data.msg || "Failed to send message.");
      }
    } catch (err) {
      setError("Failed to send message.");
    }
    setLoading(false);
  };

  const contactInfo = [
    { icon: "📞", label: "Phone", value: "+91-9981546195" },
    { icon: "📧", label: "Email", value: "traditional.remedy@gmail.com" },
    { icon: "📍", label: "Location", value: "India" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-900 pt-[10vh] pb-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center pt-10">
          <div className="inline-flex items-center gap-2 bg-forest-600/20 border border-forest-400/30 rounded-full px-4 py-1.5 mb-5">
            <span className="text-forest-400 text-sm font-medium">💬 Get in touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/50 text-lg">We'd love to hear from you. Send us a message and we'll respond promptly.</p>
        </div>
      </section>

      <section className="py-16 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Let's talk</h2>
                <p className="text-gray-500 leading-relaxed">
                  Have a question about a remedy? Want to partner with us? Or just want to say hello? We're here for you.
                </p>
              </div>

              {contactInfo.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-gray-800 font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                    <p className="text-gray-500 mb-6">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="btn-secondary">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
                    <div className="form-group">
                      <label className="label">Full Name</label>
                      <input type="text" name="fullname" value={form.fullname} onChange={handleChange}
                        className="input-field" placeholder="John Doe" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="label">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                          className="input-field" placeholder="you@example.com" required />
                      </div>
                      <div className="form-group">
                        <label className="label">Phone</label>
                        <input type="text" name="contact" value={form.contact} onChange={handleChange}
                          className="input-field" placeholder="+91 XXXXX XXXXX" required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="label">Message</label>
                      <textarea name="message" value={form.message} onChange={handleChange}
                        rows={5} className="input-field resize-none"
                        placeholder="Tell us what's on your mind..." required />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                        {error}
                      </div>
                    )}

                    <button type="submit" disabled={loading}
                      className="btn-primary w-full flex items-center justify-center gap-2">
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                      ) : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
