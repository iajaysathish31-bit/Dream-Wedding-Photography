import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/Hero';
import Storytelling from './components/Storytelling';
import FeaturedStories from './components/FeaturedStories';
import SignatureCollections from './components/SignatureCollections';
import NatureMeetsLove from './components/NatureMeetsLove';
import MomentsBetween from './components/MomentsBetween';
import ClientExperience from './components/ClientExperience';
import Statistics from './components/Statistics';
import { BookYourStory } from './components/BookYourStory';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function MainSite() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll setup
    const lenis = {
      scrollTo: (target: number | string) => {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else {
          const element = document.querySelector(target);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    // GSAP scroll animations
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.fade-up').forEach((element: any) => {
        gsap.from(element, {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      gsap.utils.toArray('.fade-in').forEach((element: any) => {
        gsap.from(element, {
          opacity: 0,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-background text-foreground overflow-x-hidden">
      <Hero />
      <Storytelling />
      <FeaturedStories />
      <SignatureCollections />
      <NatureMeetsLove />
      <MomentsBetween />
      <ClientExperience />
      <Statistics />
      <BookYourStory />
      <Footer />
    </div>
  );
}