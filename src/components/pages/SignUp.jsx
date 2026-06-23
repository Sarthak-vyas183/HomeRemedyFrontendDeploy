import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/useAuth";
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";
import { toast } from "react-toastify";
const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/";

function SignUp() {
  const [step, setStep] = useState(1);
  const [Errmsg, setErrmsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    fullName: "", email: "", username: "", ph_no: "", password: "", avatar: null,
  });
  const navigate = useNavigate();
  const { storeTokenInLs } = useAuth();

  useEffect(() => {
    gsap.from(".signup-card", {
      scale: 0.97,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [step]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileInput = (e) => {
    setUser((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!user.fullName || !user.email || !user.username) {
      toast.error("Please fill out all fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(user.ph_no)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    if (user.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(user).forEach((key) => {
        if (user[key]) formData.append(key, user[key]);
      });
      if (user.avatar) {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(user.avatar.type)) {
          toast.error("Avatar must be JPEG or PNG.");
          setLoading(false);
          return;
        }
        if (user.avatar.size > 2 * 1024 * 1024) {
          toast.error("Avatar file size must be less than 2MB.");
          setLoading(false);
          return;
        }
      }
      const response = await fetch(`${baseUrl}user/register`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.status === 409) { toast.error("Email already registered"); setLoading(false); return; }
      if (!response.ok) {
        const errorMessage = data.msg?.issues ? data.msg.issues[0].message : data.msg || "An error occurred.";
        setErrmsg(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }
      storeTokenInLs(data.data.accessToken);
      toast.success("Account created! Welcome aboard.");
      navigate("/");
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
    setLoading(false);
  };

  const steps = ["Personal Info", "Security"];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative"
      style={{
        backgroundImage: "url(../../../images/about.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md">
        <div className="signup-card bg-white rounded-2xl shadow-2xl overflow-hidden relative">
          {/* Close button */}
          <Link
            to="/"
            aria-label="Close"
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          <div className="h-1.5 bg-gradient-to-r from-forest-500 via-forest-400 to-herb-500" />

          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
              <p className="text-gray-500 text-sm mt-1">Join our healing community</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-8">
              {steps.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? "bg-forest-600 text-white" :
                      step === i + 1 ? "bg-forest-600 text-white ring-4 ring-forest-100" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? "text-gray-800" : "text-gray-400"}`}>
                      {s}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 rounded-full transition-all ${step > 1 ? "bg-forest-500" : "bg-gray-200"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={step === 1 ? handleNext : handlesubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <div className="form-group">
                    <label className="label">Full Name</label>
                    <input type="text" name="fullName" value={user.fullName} onChange={handleInput}
                      className="input-field" placeholder="John Doe" required />
                  </div>
                  <div className="form-group">
                    <label className="label">Email Address</label>
                    <input type="email" name="email" value={user.email} onChange={handleInput}
                      className="input-field" placeholder="you@example.com" required />
                  </div>
                  <div className="form-group">
                    <label className="label">Username</label>
                    <input type="text" name="username" value={user.username} onChange={handleInput}
                      className="input-field" placeholder="johndoe" required />
                  </div>
                  <button type="submit" className="btn-primary w-full mt-2">
                    Continue →
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="label">Phone Number</label>
                    <input type="text" name="ph_no" value={user.ph_no} onChange={handleInput}
                      className="input-field" placeholder="10-digit number" required />
                  </div>
                  <div className="form-group">
                    <label className="label">Password</label>
                    <input type="password" name="password" value={user.password} onChange={handleInput}
                      className="input-field" placeholder="Min. 8 characters" required />
                  </div>
                  <div className="form-group">
                    <label className="label">Profile Photo <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input type="file" name="avatar" onChange={handleFileInput}
                      className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-50 file:text-forest-700 hover:file:bg-forest-100 cursor-pointer" />
                  </div>
                  {Errmsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      {Errmsg}
                    </div>
                  )}
                  <div className="flex gap-3 mt-2">
                    <button type="button" onClick={handleBack} className="btn-secondary flex-1">
                      ← Back
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</>
                      ) : "Create Account"}
                    </button>
                  </div>
                </>
              )}
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-forest-600 font-semibold hover:text-forest-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;