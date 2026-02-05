import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#163c8c] text-white pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* ABOUT SECTION */}
        <div>
          <h3 className="font-semibold text-lg mb-4">ABOUT RAMA & RAMA</h3>
          <p className="text-sm leading-relaxed">
            Rama & Rama is a leading security services provider in India, 
            specializing in Corporate Security and Residential Security Solutions. 
            We are committed to delivering professional, reliable, and 
            comprehensive security services with trained personnel and advanced technology.
          </p>
        </div>

        {/* USEFUL LINKS */}
        <div>
          <h3 className="font-semibold text-lg mb-4">USEFUL LINKS</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:underline">About Us</li>
            <li className="cursor-pointer hover:underline">Our Services</li>
            <li className="cursor-pointer hover:underline">Why Choose Us</li>
            <li className="cursor-pointer hover:underline">Client Testimonials</li>
            <li className="cursor-pointer hover:underline">Contact Us</li>
            <li className="cursor-pointer hover:underline">Admin Portal</li>
          </ul>
        </div>

        {/* OUR SOLUTIONS */}
        <div>
          <h3 className="font-semibold text-lg mb-4">OUR SOLUTIONS</h3>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:underline">Corporate Security</li>
            <li className="cursor-pointer hover:underline">Apartment/Building Security</li>
            <li className="cursor-pointer hover:underline">Security Guard Services</li>
            <li className="cursor-pointer hover:underline">24/7 Monitoring Solutions</li>
            <li className="cursor-pointer hover:underline">Event Security Management</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-lg mb-4">CONTACT DETAILS</h3>
          <p className="text-sm font-semibold">Rama & Rama Security Services</p>

          <p className="text-sm mt-3 leading-relaxed">
            Address:<br />
            123 Security Plaza, Sector 18,<br />
            New Delhi - 110001, India
          </p>

          <p className="text-sm mt-3">
            Phone:<br /> 
            +91-11-4646-5555 / 4646-6666
          </p>

          <p className="text-sm mt-3">
            Email:<br />
            info@ramarama.com
          </p>
        </div>

      </div>

      {/* FOOTER BOTTOM */}
      <div className="border-t border-white/20 mt-10 pt-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-sm text-white">
          <p>© 2025 Rama & Rama Security Services. All rights reserved.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span className="cursor-pointer hover:underline">Terms of Service</span>
            <span className="cursor-pointer hover:underline">Careers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
