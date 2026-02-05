import React, { useEffect, useState } from "react";
import About from "./About";
import Services from "./Services";
import Testimonials from "./Testimonials";
import WhyUs from "./WhyUs";
import ContactUs from "./ContactUs";
import Footer from "../components/Footer";

const Home = () => {
  const slides = [
    { id: 1, title: "Professional Corporate Security", text: "Comprehensive security solutions tailored for your business and workplace safety.", image: "https://wallpaperaccess.com/full/508928.jpg" },
    { id: 2, title: "Apartment & Building Security", text: "Protecting residential communities with trained guards and 24/7 monitoring.", image: "https://wallpaperaccess.com/full/153070.jpg" },
    { id: 3, title: "Your Safety, Our Priority", text: "Trusted security services for businesses and residential properties across the region.", image: "https://png.pngtree.com/thumb_back/fw800/background/20230314/pngtree-beautiful-background-of-high-rise-buildings-image_1947772.jpg" },
  ];

  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <main>
      <section className="relative w-full min-h-[85vh] overflow-hidden">
        {slides.map((s, i) => (
          <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${s.image})` }} />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-20 px-6 md:px-16 lg:px-32 h-full flex items-center">
              <div className="max-w-3xl text-white">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">{s.title}</h1>
                <p className="text-lg md:text-xl mb-6">{s.text}</p>
                <a href="/contact" className="inline-block bg-white text-[#0b2b7a] px-6 py-3 rounded-lg font-medium">Contact Now</a>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-8 inset-x-0 flex justify-center gap-3 z-30">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full ${i === current ? "bg-white scale-110" : "bg-gray-400"}`} />
          ))}
        </div>
      </section>

      <About />
      <Services />
      <Testimonials />
      <WhyUs />
      <ContactUs />
      <Footer/>
    </main>
  );
};

export default Home;
