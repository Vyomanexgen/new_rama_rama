import React from "react";
import {
  FaPlus,
  FaRegCommentDots,
  FaCommentDots,
  FaStar,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "CEO, TechVision Solutions",
      status: "Active",
      rating: 5,
      review:
        "Rama & Rama has been protecting our corporate office for over 3 years. Their security guards are professional, well-trained, and always alert. We feel completely safe knowing they're on duty.",
    },
    {
      id: 2,
      name: "Priya Mehta",
      role: "Event Organizer",
      status: "Active",
      rating: 5,
      review:
        "We hired Rama & Rama for our wedding event and they managed everything flawlessly. From guest management to VIP security, their team handled it all professionally. Highly recommended!",
    },
    {
      id: 3,
      name: "Anil Sharma",
      role: "Resident Association President",
      status: "Active",
      rating: 5,
      review:
        "Our residential community has been using Rama & Rama's services for 2 years. The professional guards and 24/7 gate security have significantly improved our safety. Excellent service!",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Testimonials Management</h2>
          <p className="text-green-600 text-sm mt-1">
            ✓ {testimonials.length} testimonial(s) currently visible on homepage
          </p>
        </div>

        <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80">
          <FaPlus /> Add Testimonial
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-5 rounded-xl flex items-center gap-4 shadow-md">
          <FaRegCommentDots size={35} />
          <div>
            <p className="text-sm">Total Testimonials</p>
            <h3 className="text-xl font-semibold">{testimonials.length}</h3>
          </div>
        </div>

        <div className="bg-green-500 text-white p-5 rounded-xl flex items-center gap-4 shadow-md">
          <FaCommentDots size={35} />
          <div>
            <p className="text-sm">Active</p>
            <h3 className="text-xl font-semibold">
              {testimonials.filter((t) => t.status === "Active").length}
            </h3>
          </div>
        </div>

        <div className="bg-yellow-500 text-white p-5 rounded-xl flex items-center gap-4 shadow-md">
          <FaStar size={35} />
          <div>
            <p className="text-sm">Average Rating</p>
            <h3 className="text-xl font-semibold">5.0</h3>
          </div>
        </div>
      </div>

      {/* Testimonials Cards */}
      {testimonials.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl border shadow-md p-6 mb-5"
        >
          <div className="flex justify-between items-start gap-4">
            {/* Profile + Details */}
            <div className="flex gap-4">
              {/* Avatar Circle */}
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                {item.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>

                {/* Status Badge */}
                <span className="bg-black text-white px-2 py-1 rounded-full text-xs ml-2">
                  {item.status}
                </span>

                <p className="text-gray-600 text-sm mt-1">{item.role}</p>

                {/* Rating */}
                <div className="flex text-yellow-500 mt-2">
                  {[...Array(item.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-700 mt-3 text-sm leading-relaxed max-w-2xl">
                  "{item.review}"
                </p>
              </div>
            </div>

            {/* Edit/Delete Buttons */}
            <div className="flex gap-2">
              <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg">
                <FaEdit className="text-gray-700" />
              </button>
              <button className="bg-red-500 hover:bg-red-600 p-2 rounded-lg">
                <FaTrash className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
