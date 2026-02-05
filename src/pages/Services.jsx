

import React from "react";
import { BuildingOfficeIcon, HomeModernIcon, ShieldCheckIcon, UserGroupIcon, TruckIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

const items = [
  { icon: <BuildingOfficeIcon className="w-12 h-12 text-[#0b2b7a]" />, title: "Corporate Security", desc: "Comprehensive security solutions for offices, businesses, and corporate environments." },
  { icon: <HomeModernIcon className="w-12 h-12 text-[#0b2b7a]" />, title: "Apartment/Building Security", desc: "Residential security services for gated communities and apartment complexes." },
  { icon: <ShieldCheckIcon className="w-12 h-12 text-[#0b2b7a]" />, title: "Event Security", desc: "Reliable event security for private, corporate, and public events." },
  { icon: <UserGroupIcon className="w-12 h-12 text-[#0b2b7a]" />, title: "Personal Bodyguards", desc: "Trained personnel for VIP and executive protection." },
  { icon: <TruckIcon className="w-12 h-12 text-[#0b2b7a]" />, title: "Logistics Security", desc: "Secure transport and logistics for valuable cargo." },
  { icon: <AcademicCapIcon className="w-12 h-12 text-[#0b2b7a]" />, title: "Institutional Security", desc: "Safety solutions for schools, colleges, and institutions." },
];

const Services = () => (
  <section id="services" className="bg-white py-16 px-6 md:px-12">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#0b2b7a] mb-3">Our Security Services</h2>
      <div className="w-20 h-1 bg-yellow-400 mx-auto mb-6 rounded"></div>
      <p className="text-gray-600 max-w-2xl mx-auto mb-12">Comprehensive security solutions designed to protect your business, property, and peace of mind.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((s, i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition">
            <div className="bg-blue-50 p-5 rounded-full inline-block mb-6">{s.icon}</div>
            <h3 className="text-xl font-semibold text-[#0b2b7a] mb-3">{s.title}</h3>
            <p className="text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
