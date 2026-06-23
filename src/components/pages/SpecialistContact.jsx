/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../Store/useAuth';
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ContactDoctorForm() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({ doctorEmail: '', queryType: '', reqDescription: '', emailVerified: false });
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVerifyEmail = async () => {
    setVerifying(true);
    try {
      const response = await fetch(`${baseUrl}user/verifyProfessionalEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.doctorEmail }),
      });
      if (response.status === 200) {
        setVerificationMessage('Doctor found and verified!');
        setSubmitDisabled(false);
        setFormData({ ...formData, emailVerified: true });
      } else {
        setVerificationMessage('No doctor found with this email.');
        setSubmitDisabled(true);
      }
    } catch (error) {
      setVerificationMessage(`Verification error: ${error.message}`);
      setSubmitDisabled(true);
    }
    setVerifying(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${baseUrl}user/connect_to_dr`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.doctorEmail, about: formData.queryType, reqDescription: formData.reqDescription }),
      });
      if (response.status === 200) {
        toast.success('Request sent to doctor successfully!');
        setFormData({ doctorEmail: '', queryType: '', reqDescription: '', emailVerified: false });
        setVerificationMessage('');
        setSubmitDisabled(true);
      } else {
        toast.error('Failed to send request.');
      }
    } catch (error) {
      toast.error(`Submit error: ${error.message}`);
    }
    setSubmitting(false);
  };

  const queryOptions = [
    { value: "Verify My Remedy", label: "Verify My Remedy" },
    { value: "Suggest Pros and Cons", label: "Suggest Pros & Cons on My Remedy" },
    { value: "Disagree with My Remedy", label: "Disagree with My Remedy — Explain Why" },
  ];

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Contact a Doctor</h1>
          <p className="text-gray-500 text-sm mt-1">Get professional feedback on your remedy from a verified specialist</p>
        </div>

        <div className="card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-forest-500" />
          <div className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Doctor Email + Verify */}
              <div className="form-group">
                <label className="label">Doctor's Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="doctorEmail"
                    value={formData.doctorEmail}
                    onChange={handleChange}
                    placeholder="doctor@example.com"
                    className="input-field flex-1"
                    required
                    disabled={formData.emailVerified}
                  />
                  {!formData.emailVerified && (
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={verifying || !formData.doctorEmail}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all disabled:opacity-50 flex-shrink-0"
                    >
                      {verifying ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : "Verify"}
                    </button>
                  )}
                  {formData.emailVerified && (
                    <div className="flex items-center gap-1.5 bg-forest-100 border border-forest-200 text-forest-700 px-3 py-2 rounded-xl text-sm font-medium flex-shrink-0">
                      ✓ Verified
                    </div>
                  )}
                </div>
                {verificationMessage && (
                  <p className={`text-sm mt-2 flex items-center gap-1 ${formData.emailVerified ? 'text-forest-600' : 'text-red-600'}`}>
                    {formData.emailVerified ? "✓" : "✗"} {verificationMessage}
                  </p>
                )}
              </div>

              {/* Query Type */}
              <div className="form-group">
                <label className="label">What is your request about?</label>
                <select
                  name="queryType"
                  value={formData.queryType}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select a query type...</option>
                  {queryOptions.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="label">Remedy Description</label>
                <textarea
                  name="reqDescription"
                  value={formData.reqDescription}
                  onChange={handleChange}
                  placeholder="Provide detailed information about your remedy so the doctor can give you accurate feedback..."
                  className="input-field resize-none"
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitDisabled || submitting}
                className={`w-full flex items-center justify-center gap-2 font-semibold px-5 py-3 rounded-xl transition-all duration-200 ${submitDisabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md"
                  }`}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : "Send Request to Doctor"}
              </button>

              {submitDisabled && (
                <p className="text-center text-amber-600 text-sm">
                  Please verify the doctor's email before submitting.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-5 bg-teal-50 border border-teal-200 rounded-xl p-4">
          <p className="text-teal-700 text-sm font-medium mb-1">💡 How it works</p>
          <p className="text-teal-600 text-xs leading-relaxed">
            Enter a verified doctor's email, describe your query, and submit. The doctor will review your remedy and provide professional feedback.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactDoctorForm;
