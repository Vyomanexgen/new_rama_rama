import React, { useEffect, useState } from "react";
import api from "../../../services/api";

const clean = (v) => String(v || "").trim();

function Section({ title, limit, value, onChange, placeholder }) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-lg font-semibold text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">Max {limit}</div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {value.map((v, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              className="border rounded-lg px-3 py-2 flex-1"
              value={v}
              onChange={(e) => {
                const next = [...value];
                next[idx] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
            />
            <button
              type="button"
              className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
            >
              Remove
            </button>
          </div>
        ))}
        {value.length < limit && (
          <button
            type="button"
            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 w-fit"
            onClick={() => onChange([...value, ""]) }
          >
            Add Item
          </button>
        )}
      </div>
    </div>
  );
}

export default function SuperAdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [whyUs, setWhyUs] = useState([""]);
  const [services, setServices] = useState([""]);
  const [testimonials, setTestimonials] = useState([""]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/superadmin/website-content");
      const data = res?.data?.content || {};

      setWhyUs(Array.isArray(data.whyUs) && data.whyUs.length ? data.whyUs : [""]);
      setServices(Array.isArray(data.services) && data.services.length ? data.services : [""]);
      setTestimonials(
        Array.isArray(data.testimonials) && data.testimonials.length ? data.testimonials : [""]
      );
    } catch (e) {
      console.error(e);
      setError("Failed to load website content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const prune = (arr, max) =>
        (arr || [])
          .map((x) => clean(x))
          .filter(Boolean)
          .slice(0, max);

      await api.put("/superadmin/website-content", {
        whyUs: prune(whyUs, 8),
        services: prune(services, 6),
        testimonials: prune(testimonials, 6),
      });

      setMessage("Saved");
    } catch (e) {
      console.error(e);
      setError("Failed to save website content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm">
          {message}
        </div>
      )}

      <Section title="Why Us" limit={8} value={whyUs} onChange={setWhyUs} placeholder="Why choose us..." />
      <Section title="Services" limit={6} value={services} onChange={setServices} placeholder="Service..." />
      <Section title="Testimonials" limit={6} value={testimonials} onChange={setTestimonials} placeholder="Testimonial..." />

      <button
        className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
        onClick={save}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Content"}
      </button>
    </div>
  );
}
