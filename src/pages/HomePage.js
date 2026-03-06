// src/pages/HomePage.js
import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Strip from '../components/Strip';
import MenuSection from '../components/MenuSection';
import ReservationSection from '../components/ReservationSection';
import ReviewsSection from '../components/ReviewsSection';
import Footer from '../components/Footer';

export default function HomePage() {
  // Initialise fade-in-up animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-in-up:not(.visible)').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <Strip />
      <MenuSection />
      <ReservationSection />
      <ReviewsSection />
      <Footer />
    </>
  );
}
