


import React from "react";
import { UserGroupIcon, ClockIcon, ComputerDesktopIcon, CurrencyDollarIcon, BoltIcon, DocumentTextIcon, BriefcaseIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";

const features = [
  { icon: <UserGroupIcon className="w-10 h-10 text-yellow-400" />, title: "Certified Professionals", desc: "All our security personnel are fully licensed, background-checked, and certified with extensive training." },
  { icon: <ClockIcon className="w-10 h-10 text-yellow-400" />, title: "24/7 Availability", desc: "Round-the-clock protection and monitoring services ensure your safety never takes a break." },
  { icon: <ComputerDesktopIcon className="w-10 h-10 text-yellow-400" />, title: "Advanced Technology", desc: "Modern security systems with real-time reporting and comprehensive monitoring." },
  { icon: <CurrencyDollarIcon className="w-10 h-10 text-yellow-400" />, title: "Competitive Pricing", desc: "Premium security services at transparent, competitive rates." },
  { icon: <BoltIcon className="w-10 h-10 text-yellow-400" />, title: "Rapid Response", desc: "Swift emergency response teams trained to handle critical situations." },
  { icon: <DocumentTextIcon className="w-10 h-10 text-yellow-400" />, title: "Detailed Reporting", desc: "Comprehensive incident reports, daily activity logs, and transparent communication." },
  { icon: <BriefcaseIcon className="w-10 h-10 text-yellow-400" />, title: "Experienced Team", desc: "Years of industry experience with a proven track record." },
  { icon: <Cog6ToothIcon className="w-10 h-10 text-yellow-400" />, title: "Customized Solutions", desc: "Tailored security plans designed to meet your specific needs." },
];

export default function WhyUs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Why Choose Rama & Rama?</h2>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mb-4 rounded"></div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">We stand out in the security industry with our commitment to excellence, cutting-edge technology, and unwavering dedication to client safety.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#0b2b7a] rounded-full p-4">{f.icon}</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="w-full bg-gradient-to-r from-[#1a3b9c] to-[#1742e5] text-center py-16 px-4 rounded-2xl shadow-lg mt-16">
          <h2 className="text-white text-3xl md:text-4xl font-semibold mb-4">Ready to Experience Superior Security?</h2>
          <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">Join hundreds of satisfied clients who trust Rama & Rama for their security needs.</p>
          <a href="/contact" className="bg-[#f2b705] hover:bg-[#e0a800] text-black font-medium py-3 px-8 rounded-md text-lg inline-block">Get Your Free Security Consultation</a>
        </div>
      </div>
    </section>
  );
}
