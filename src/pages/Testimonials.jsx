import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const testimonials = [
  { name: "Rajesh Kumar", role: "CEO, TechVision Solutions", initials: "RK", text: `Rama & Rama has been protecting our corporate office for over 3 years. Their security guards are professional, well-trained, and always alert.` },
  { name: "Priya Mehta", role: "Event Organizer", initials: "PM", text: `We hired Rama & Rama for our wedding event and they managed everything flawlessly. From guest management to VIP security.` },
  { name: "Anil Sharma", role: "Resident Association President", initials: "AS", text: `Our residential community has been using Rama & Rama's services for 2 years. Excellent service!` },
];

export default function Testimonials() {
  return (
    <section className="bg-[#0b2b7a] text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">What Our Clients Say</h2>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mb-10 rounded-full"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-[#163d9a] rounded-xl p-6 text-left flex flex-col justify-between hover:bg-[#1b47b8] transform hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, j) => (
                  <StarIcon key={j} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-100 italic mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm md:text-base">{t.name}</div>
                  <div className="text-gray-300 text-xs md:text-sm">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
