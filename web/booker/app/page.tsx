'use client';

import { BookingProvider } from "@/context/BookingContext";
import BookingWizard from "@/components/booking/BookingWizard";
// import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { Shield, Clock, MapPin, Phone, Star, Zap, Users, Award } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    { icon: Clock, title: "24/7 Available", desc: "Round the clock assistance" },
    { icon: MapPin, title: "Pan India", desc: "Coverage across all states" },
    { icon: Shield, title: "Verified Providers", desc: "Background-checked professionals" },
    { icon: Zap, title: "Fast Response", desc: "Average 15-min arrival time" },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "1000+", label: "Verified Providers" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "15 min", label: "Avg Response Time" },
  ];

  return (
    <main className="min-h-screen bg-background overflow-hidden">
// Navbar removed (handled in layout)

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4">
          {/* Logo Animation */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src="/logo.png"
              alt="VehicAid - Rapid Response, Quick Care"
              width={200}
              height={200}
              className="drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Hero Text */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Roadside Assistance <br className="hidden md:block" />
              <span className="text-primary">Reimagined.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              India's most trusted roadside assistance platform. Get help within minutes,
              anytime, anywhere. Professional, verified, and affordable.
            </p>
          </motion.div>

          {/* Booking Wizard */}
          <motion.div
            className="relative z-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <BookingProvider>
              <div className="bg-background/80 backdrop-blur-xl border rounded-3xl shadow-2xl p-6 md:p-8 ring-1 ring-white/20 hover:ring-primary/30 transition-all duration-500">
                <BookingWizard />
              </div>
            </BookingProvider>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose VehicAid?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're not just another roadside assistance service. We're your trusted partner on every journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-background rounded-2xl p-6 border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Award className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to Hit the Road with Confidence?</h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto mb-8">
              Download our app or call our 24/7 helpline to get started. Premium subscribers get priority support!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download App
              </motion.button>
              <motion.button
                className="px-8 py-3 border-2 border-white/50 font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-5 w-5" />
                1800-VEHIC-AID
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="VehicAid" width={40} height={40} />
            <span className="font-bold">VehicAid</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 VehicAid. Rapid Response, Quick Care. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
