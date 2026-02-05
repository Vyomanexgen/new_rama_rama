
import React from "react";

const About = () => {
  return (
    <section className="bg-gray-50 min-h-screen flex flex-col justify-center py-16 px-6 md:px-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0b2b7a]">
          About Rama & Rama Security Services
        </h2>
        <div className="w-20 h-1 bg-yellow-400 mx-auto mt-2 rounded"></div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto">
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
          Rama & Rama is a premier security service provider dedicated to protecting
          people, property, and assets with the highest level of professionalism and
          integrity. With years of experience in the security industry, we have
          established ourselves as a trusted name in delivering comprehensive
          security solutions tailored to meet the unique needs of our clients.
        </p>

        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
          Our team consists of highly trained, licensed, and experienced security
          professionals who are committed to excellence in every aspect of their
          service. We combine traditional security practices with modern technology
          and innovative approaches to provide effective, reliable, and cost-efficient
          security solutions.
        </p>

        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
          At Rama & Rama, we understand that security is not just about presence—
          it's about vigilance, quick response, and building trust. Whether you need
          corporate security or apartment and building protection, we are here to
          safeguard what matters most to you.
        </p>
      </div>

      {/* Bottom Divider */}
      <div className="mt-12 flex justify-center">
        <div className="w-16 h-1 bg-yellow-400 rounded"></div>
      </div>
    </section>
  );
};

export default About;



