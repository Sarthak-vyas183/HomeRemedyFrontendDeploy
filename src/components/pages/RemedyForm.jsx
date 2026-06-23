/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from "../Store/useAuth";
import { toast } from 'react-toastify';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RemedyForm = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '', description: '', ingredients: '', steps: '', ailments: '', effectiveness: '', EcommerceUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const ingredients = formData.ingredients.split(/[\n,]+/).map(i => i.trim()).filter(Boolean);
    const steps = formData.steps.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    const ailments = formData.ailments.split(/[\n,]+/).map(a => a.trim()).filter(Boolean);
    const effectiveness = Number(formData.effectiveness);
    const body = { title: formData.title, description: formData.description, ingredients, steps, ailments, effectiveness, EcommerceUrl: formData.EcommerceUrl };
    try {
      const response = await fetch(`${baseUrl}remedy`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        toast.success('Remedy submitted successfully!');
        setFormData({ title: '', description: '', ingredients: '', steps: '', ailments: '', effectiveness: '', EcommerceUrl: '' });
      } else {
        toast.error('Error submitting remedy');
      }
    } catch (error) {
      toast.error('Error submitting remedy');
    }
    setUploading(false);
  };

  const fields = [
    { key: "title", label: "Remedy Title", type: "input", placeholder: "E.g. Honey & Ginger Cold Remedy", rows: null, hint: null },
    { key: "description", label: "Description", type: "textarea", placeholder: "Describe what this remedy does and how it helps...", rows: 4, hint: null },
    { key: "ingredients", label: "Ingredients", type: "textarea", placeholder: "One per line, or comma-separated\nE.g. 2 tbsp honey\n1 inch fresh ginger", rows: 4, hint: "Separate each ingredient with a new line or comma" },
    { key: "steps", label: "Preparation Steps", type: "textarea", placeholder: "Step 1: Boil water\nStep 2: Add ginger...", rows: 5, hint: "Separate each step with a new line or comma" },
    { key: "ailments", label: "Treats Ailments", type: "textarea", placeholder: "Cold, Sore throat, Cough...", rows: 2, hint: "Separate each ailment with a new line or comma" },
  ];

  return (
    <div className="p-4 lg:p-8 min-h-full bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create a Remedy</h1>
          <p className="text-gray-500 text-sm mt-1">Share your traditional healing knowledge with the community</p>
        </div>

        <div className="card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-forest-500 via-forest-400 to-herb-500" />
          <div className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map(({ key, label, type, placeholder, rows, hint }) => (
                <div key={key} className="form-group">
                  <label className="label">{label}</label>
                  {type === "input" ? (
                    <input
                      type="text"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="input-field"
                      placeholder={placeholder}
                      required
                    />
                  ) : (
                    <textarea
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="input-field resize-none"
                      rows={rows}
                      placeholder={placeholder}
                      required
                    />
                  )}
                  {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
                </div>
              ))}

              {/* Effectiveness */}
              <div className="form-group">
                <label className="label">Effectiveness Rating</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, effectiveness: String(num) })}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 ${
                        String(formData.effectiveness) === String(num)
                          ? "bg-forest-600 text-white shadow-md scale-110"
                          : "bg-forest-50 text-forest-600 border border-forest-200 hover:bg-forest-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <span className="text-gray-400 text-sm ml-2">
                    {formData.effectiveness ? `${formData.effectiveness}/5` : "Select rating"}
                  </span>
                </div>
                {/* Hidden input for form validation */}
                <input type="number" name="effectiveness" value={formData.effectiveness} onChange={handleChange} className="sr-only" min={1} max={5} required />
              </div>

              {/* Ecommerce URL */}
              <div className="form-group">
                <label className="label">
                  Buy Ingredients URL{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  name="EcommerceUrl"
                  value={formData.EcommerceUrl}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://amazon.in/..."
                />
                <p className="text-xs text-gray-400 mt-1">Link to purchase ingredients online</p>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Remedy...
                    </>
                  ) : (
                    <>🌿 Submit Remedy</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info card */}
        <div className="mt-5 bg-forest-50 border border-forest-200 rounded-xl p-4">
          <p className="text-forest-700 text-sm font-medium mb-1">📝 What happens next?</p>
          <p className="text-forest-600 text-xs leading-relaxed">
            Your remedy will be reviewed by our medical professionals before being published. This usually takes 2-3 days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemedyForm;
