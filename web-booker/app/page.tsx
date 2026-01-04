import { BookingProvider } from "@/context/BookingContext";
import BookingWizard from "@/components/booking/BookingWizard";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header / Nav */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">V</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
              VehicAid
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Book Service</Link>
            <Link href="/subscription" className="text-sm font-medium hover:text-primary transition-colors">Subscriptions</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Wizard */}
      <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

        <div className="container mx-auto px-4 text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl mb-6">
            Roadside Assistance <br className="hidden md:block" />
            <span className="text-primary">Reimagined.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Fast, reliable, and professional help when you need it most.
            Book a tow, mechanic, or fuel delivery in seconds.
          </p>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <BookingProvider>
            <div className="bg-background/80 backdrop-blur-xl border rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto ring-1 ring-white/20">
              <BookingWizard />
            </div>
          </BookingProvider>
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground">Trusted by thousands of drivers worldwide.</p>
        </div>
      </section>
    </main>
  );
}
