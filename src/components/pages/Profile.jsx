/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../Store/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Modal = ({ title, children, onClose, accentColor = "forest" }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
      <div className={`h-1 bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-400`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-xl">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

function Profile() {
  const { user, token, LogoutUser } = useAuth();
  const navigate = useNavigate();
  const [defaultavatar] = useState("../../../images/user.png");
  const [DoctorForm, setDoctorForm] = useState(false);
  const [RMP_NO, setRMP_NO] = useState("");
  const [RMP_img, setRMP_img] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDoctorSubmitting, setIsDoctorSubmitting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [ph_no, setPhNo] = useState("");
  const [preferredLanguage, setLanguage] = useState("");
  const [avatar, setAvatar] = useState(defaultavatar);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [doctorMessage, setDoctorMessage] = useState("");


  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
      setPhNo(user.ph_no || "");
      setLanguage(user.preferredLanguage || "");
      setAvatar(user.avatar || defaultavatar);
    }
  }, [user]);

  const handleSaveClick = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${baseUrl}user/updateAccountDetail`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName, email, location, bio, ph_no, preferredLanguage }),
      });

      if (!response.ok) {
        let message = "Unable to save profile. Try again later.";
        try {
          const data = await response.json();
          message = data?.message || message;
        } catch {
          // response wasn't JSON; keep generic message
        }
        toast.error(message);
        return;
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Network error — please check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const UpdateProfile = async () => {
    if (!profileImageFile) {
      toast.error("Please select a profile photo first.");
      return;
    }
    const formData = new FormData();
    formData.append("profileImage", profileImageFile);
    try {
      const response = await fetch(`${baseUrl}user/updateAvatar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        let message = "Unable to update photo. Try again later.";
        try {
          const data = await response.json();
          message = data?.message || message;
        } catch {
          // response wasn't JSON; keep generic message
        }
        toast.error(message);
        return;
      }

      const result = await response.json();
      if (result.avatar) setAvatar(result.avatar);
      toast.success("Profile photo updated");
      setProfileImageFile(null);
    } catch (error) {
      toast.error("Network error — please check your connection and try again.");
    }
  };


  const handleReqToBeDoctor = async () => {
    if (!RMP_NO.trim()) {
      toast.error("Please enter your certificate number.");
      return;
    }
    if (!RMP_img) {
      toast.error("Please attach your certificate image.");
      return;
    }
    if (isDoctorSubmitting) return;
    setIsDoctorSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("RMP_NO", RMP_NO);
      formData.append("RMP_Img", RMP_img);
      formData.append("message", doctorMessage);

      const response = await fetch(`${baseUrl}user/becomeProfessional`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        let message = "Failed to send request. Please try again.";
        try {
          const data = await response.json();
          message = data?.message || message;
        } catch {
          // response wasn't JSON (e.g. HTML error page); keep generic message
        }
        toast.error(message);
        return;
      }

      toast.success("Doctor verification request sent to admin!");
      setDoctorForm(false);
      setRMP_NO("");
      setRMP_img(null);
      setDoctorMessage("");
    } catch (error) {
      toast.error("An error occurred while sending the request.");
    } finally {
      setIsDoctorSubmitting(false);
    }
  };


  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm.");
      return;
    }
    if (isDeleteSubmitting) return;
    setIsDeleteSubmitting(true);

    try {
      const response = await fetch(`${baseUrl}user/deleteAccount`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!response.ok) {
        let message = "Incorrect password or unable to delete account.";
        try {
          const data = await response.json();
          message = data?.message || message;
        } catch {
          // response wasn't JSON; keep generic message
        }
        toast.error(message);
        return;
      }

      toast.success("Account deleted successfully.");
      setIsDeleting(false);
      setDeletePassword("");
      LogoutUser();
      navigate("/");
    } catch (error) {
      toast.error("Network error — please check your connection and try again.");
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-4 lg:p-8 pb-20 lg:pb-8">
      {/* Profile Hero */}
      <div className="card mb-6 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-forest-800 via-forest-700 to-teal-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-4">
            <div className="relative">
              <img
                src={avatar || defaultavatar}
                alt="Profile"
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover"
              />
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-forest-700 transition-colors shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/*" className="hidden" name="profilePic" onChange={handleFileChange} />
              </label>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user?.fullName}</h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              {user?.isprofessional && (
                <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                  ✅ Verified Professional
                </span>
              )}
            </div>
            {profileImageFile && (
              <button type="button" onClick={UpdateProfile} className="btn-primary text-sm">
                Save Photo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bio + Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
              <span className="text-xl">📝</span> About
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {user?.bio || "No bio yet. Edit your profile to add one."}
            </p>
          </div>

          {/* Activity */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span> Activity
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Remedies", value: user?.remedyList?.length || 0, color: "forest" },
                { label: "Badge", value: user?.badge || "—", color: "amber" },
                { label: "Certificate", value: user?.badge || "—", color: "blue" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`bg-${color}-50 rounded-xl p-4 text-center border border-${color}-100`}>
                  <p className={`text-2xl font-bold text-${color}-700 mb-1`}>{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details + Controls */}
        <div className="space-y-6">
          {/* Details */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span> Details
            </h2>
            <div className="space-y-3">
              {[
                { label: "Phone", value: user?.ph_no || "Not set" },
                { label: "Location", value: user?.location || "Not set" },
                { label: "Language", value: user?.preferredLanguage || "Not set" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-gray-800 text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Controls
            </h2>
            <div className="space-y-2">
              {[
                { label: "Get Certificate", action: () => toast.info("Coming soon!"), color: "blue", badge: "Soon" },
                { label: "Reset Password", action: () => toast.info("Coming soon!"), color: "amber", badge: "Soon" },
                { label: "Edit Profile", action: () => setIsEditing(true), color: "forest", badge: "Edit" },
              ].map(({ label, action, color, badge }) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium border border-${color}-100 bg-${color}-50 hover:bg-${color}-100 text-gray-800 transition-all duration-200`}
                >
                  <span>{label}</span>
                  <span className={`text-xs font-bold text-${color}-600 bg-${color}-100 px-2 py-0.5 rounded-md`}>{badge}</span>
                </button>
              ))}

              {!user?.isAdmin && !user?.isprofessional && (
                <button
                  type="button"
                  onClick={() => setDoctorForm(true)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium border border-teal-100 bg-teal-50 hover:bg-teal-100 text-gray-800 transition-all"
                >
                  <span>Become a Doctor</span>
                  <span className="text-xs font-bold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-md">Apply</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium border border-red-100 bg-red-50 hover:bg-red-100 text-red-700 transition-all"
              >
                <span>Delete Account</span>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <Modal title="Edit Profile" onClose={() => setIsEditing(false)}>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {[
              { label: "Full Name", value: fullName, setter: setFullName, type: "text" },
              { label: "Email", value: email, setter: setEmail, type: "email" },
              { label: "Phone Number", value: ph_no, setter: setPhNo, type: "tel" },
              { label: "Location", value: location, setter: setLocation, type: "text" },
              { label: "Language", value: preferredLanguage, setter: setLanguage, type: "text" },
            ].map(({ label, value, setter, type }) => (
              <div key={label} className="form-group">
                <label className="label">{label}</label>
                <input type={type} value={value} onChange={(e) => setter(e.target.value)} className="input-field" />
              </div>
            ))}
            <div className="form-group">
              <label className="label">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="input-field resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="button" onClick={handleSaveClick} disabled={isSaving} className="btn-primary flex-1 disabled:opacity-60">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Delete Account Modal */}
      {isDeleting && (
        <Modal title="Delete Account" onClose={() => { setIsDeleting(false); setDeletePassword(""); }} accentColor="red">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
            <p className="text-red-700 text-sm font-medium">⚠️ This action is permanent and cannot be undone.</p>
          </div>
          <div className="form-group mb-5">
            <label className="label">Enter your password to confirm</label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={isDeleteSubmitting}
              className="btn-danger flex-1 disabled:opacity-60"
            >
              {isDeleteSubmitting ? "Deleting..." : "Delete Account"}
            </button>
            <button
              type="button"
              onClick={() => { setIsDeleting(false); setDeletePassword(""); }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Doctor Form Modal */}
      {DoctorForm && (
        <Modal title="Apply for Professional Status" onClose={() => { setDoctorForm(false); setRMP_NO(""); setRMP_img(null); setDoctorMessage(""); }}>
          <p className="text-gray-500 text-sm mb-5">Submit your certificate details. Our admin team will review and verify your application.</p>
          <div className="space-y-4">
            <div className="form-group">
              <label className="label">Certificate Number</label>
              <input
                type="text"
                value={RMP_NO}
                onChange={(e) => setRMP_NO(e.target.value)}
                className="input-field"
                placeholder="Enter your certificate number"
                required
              />
            </div>
            <div className="form-group">
              <label className="label">Certificate Image</label>
              <input
                type="file"
                name="RMPCertificate"
                accept="image/*,application/pdf"
                onChange={(e) => setRMP_img(e.target.files[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
                required
              />
              {RMP_img && (
                <p className="text-xs text-gray-500 mt-1">Selected: {RMP_img.name}</p>
              )}
            </div>
            <div className="form-group">
              <label className="label">Message to Admin <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                value={doctorMessage}
                onChange={(e) => setDoctorMessage(e.target.value)}
                rows={3}
                className="input-field resize-none"
                placeholder="Tell us about your practice..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={handleReqToBeDoctor}
              disabled={isDoctorSubmitting}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl flex-1 transition-all disabled:opacity-60"
            >
              {isDoctorSubmitting ? "Submitting..." : "Submit Application"}
            </button>
            <button
              type="button"
              onClick={() => { setDoctorForm(false); setRMP_NO(""); setRMP_img(null); setDoctorMessage(""); }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Profile;