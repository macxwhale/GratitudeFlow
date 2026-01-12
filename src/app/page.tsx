'use client';

import {
  ArrowRight,
  BarChart3,
  Brain,
  Heart,
  PenLine,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/AppLayout';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const LandingPage = () => {
  const { data: user, loading: authLoading } = useUser();
  const router = useRouter();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-landing-background">
        <Loader2 className="h-12 w-12 animate-spin text-landing-primary" />
      </div>
    );
  }

  if (user) {
    router.push('/reflections');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans bg-landing-background text-landing-foreground-muted overflow-x-hidden">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-landing-background/80 backdrop-blur-md">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-landing-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-landing-foreground">
            GratitudeFlow
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="#features"
            className="text-sm font-medium text-landing-foreground-muted hover:text-landing-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-landing-foreground-muted hover:text-landing-primary transition-colors"
          >
            How It Works
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="landingGhost" size="sm" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button variant="landingPrimary" size="sm" className="shadow-soft" asChild>
            <Link href="/login">Start Your Journey</Link>
          </Button>
        </div>
      </div>
    </div>
    <div className="h-px bg-landing-border/50" />
  </header>
);

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-landing-background to-landing-secondary/20">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-0 -left-24 w-72 h-72 bg-landing-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 -right-24 w-96 h-96 bg-landing-accent/40 rounded-full blur-3xl animate-float animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-landing-primary/5 rounded-full blur-3xl" />
    </div>

    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
      <div
        className="animate-fade-in-up"
        style={{ animationDelay: '0.1s' }}
      >
        <Badge
          variant="landing"
          className="py-1.5 px-4"
        >
          <Sparkles className="w-4 h-4 mr-2 text-landing-primary" />
          AI-Powered Gratitude Journaling
        </Badge>
      </div>

      <h1
        className="mt-6 text-4xl md:text-6xl font-bold tracking-tighter text-landing-foreground leading-tight animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        Unleash the Power of{' '}
        <span className="bg-gradient-to-r from-landing-primary to-orange-400 text-transparent bg-clip-text">
          Gratitude
        </span>{' '}
        with AI
      </h1>

      <p
        className="mt-6 max-w-2xl mx-auto text-lg text-landing-foreground-muted animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        Your personal companion for daily reflection, positive mindset shifts,
        and tracking your emotional well-being.
      </p>

      <div
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
      >
        <Button variant="landingPrimary" size="lg" asChild>
          <Link href="/login">
            Begin Your Journey <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </Button>
        <Button variant="landingOutline" size="lg" asChild>
          <Link href="#features">Learn More</Link>
        </Button>
      </div>

      <div
        className="mt-12 flex items-center justify-center gap-4 sm:gap-8 text-sm text-landing-foreground-muted animate-fade-in-up"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="text-center">
          <p className="font-semibold text-landing-foreground">10K+</p>
          <p>Users</p>
        </div>
        <div className="h-8 w-px bg-landing-border/50" />
        <div className="text-center">
          <p className="font-semibold text-landing-foreground">500K+</p>
          <p>Entries Logged</p>
        </div>
        <div className="h-8 w-px bg-landing-border/50" />
        <div className="text-center">
          <p className="font-semibold text-landing-foreground">4.9 ★</p>
          <p>Avg. Rating</p>
        </div>
      </div>
    </div>
  </section>
);

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description:
      'Our smart AI analyzes your journal entries to identify emotional themes and patterns, helping you understand yourself better.',
  },
  {
    icon: Heart,
    title: 'Personalized Affirmations',
    description:
      'Receive custom-crafted affirmations based on your reflections to reinforce positivity and build a resilient mindset.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Growth',
    description:
      'Visualize your emotional journey over time with streaks and calendars, celebrating your progress and consistency.',
  },
];

const FeaturesSection = () => (
  <section
    id="features"
    className="py-16 md:py-24 bg-white"
  >
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-landing-foreground">
          Discover a New Way to Journal
        </h2>
        <p className="mt-4 text-lg text-landing-foreground-muted">
          GratitudeFlow goes beyond a simple diary. It's an intelligent
          partner on your path to well-being.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="p-8 bg-landing-card rounded-2xl border border-landing-border/50 transition-all duration-300 hover:border-landing-secondary hover:shadow-card animate-fade-in-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="w-14 h-14 rounded-xl bg-landing-secondary flex items-center justify-center transition-colors duration-300 group-hover:bg-landing-primary/10">
              <feature.icon className="w-7 h-7 text-landing-primary" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-landing-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-landing-foreground-muted leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const steps = [
  {
    icon: PenLine,
    title: 'Write Your Gratitude',
    description:
      'Share your thoughts, feelings, and daily reflections in a safe and private space.',
  },
  {
    icon: Sparkles,
    title: 'Get AI Insights',
    description:
      'Our AI provides empathetic summaries, identifies emotional themes, and generates personalized gratitude messages.',
  },
  {
    icon: BarChart3,
    title: 'Watch Yourself Grow',
    description:
      'Track your progress over time, build streaks, and see how your mindset evolves on your journey.',
  },
];

const HowItWorksSection = () => (
  <section
    id="how-it-works"
    className="py-16 md:py-24 bg-gradient-to-br from-landing-background to-landing-secondary/20 relative overflow-hidden"
  >
    <div className="absolute -top-24 -right-24 w-96 h-96 bg-landing-primary/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-landing-accent/20 rounded-full blur-3xl" />

    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-landing-foreground">
          A Simple Path to a Positive Mindset
        </h2>
        <p className="mt-4 text-lg text-landing-foreground-muted">
          In just three easy steps, you can transform your daily reflections
          into powerful growth.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="text-center relative flex flex-col items-center animate-fade-in-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-px bg-landing-border" />
            )}
            <div className="relative">
              <div className="w-24 h-24 bg-landing-card border border-landing-border/50 rounded-2xl flex items-center justify-center shadow-soft">
                <step.icon className="w-12 h-12 text-landing-primary" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-landing-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                0{index + 1}
              </div>
            </div>
            <h3 className="mt-6 text-xl font-bold text-landing-foreground max-w-xs">
              {step.title}
            </h3>
            <p className="mt-2 text-landing-foreground-muted max-w-xs">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const CtaSection = () => (
  <section className="py-16 md:py-24 bg-white">
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="relative p-8 md:p-16 bg-gradient-to-br from-landing-primary/10 via-landing-accent/30 to-landing-primary/5 rounded-3xl overflow-hidden border border-landing-border/50">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-landing-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-landing-accent/30 rounded-full blur-3xl" />
        <div className="text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-landing-foreground">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 text-lg text-landing-foreground-muted max-w-xl mx-auto">
            Join thousands of others who are cultivating happiness and
            positivity, one reflection at a time.
          </p>
          <div className="mt-8">
            <Button
              variant="landingPrimary"
              size="lg"
              className="shadow-glow"
              asChild
            >
              <Link href="/login">
                Start for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-landing-card border-t border-landing-border/50">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between h-20 gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-landing-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-landing-foreground">
            GratitudeFlow
          </span>
        </Link>
        <div className="flex gap-6 items-center text-sm text-landing-foreground-muted">
          <Link href="#features" className="hover:text-landing-primary transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-landing-primary transition-colors">
            How It Works
          </Link>
          <Link href="#" className="hover:text-landing-primary transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-landing-primary transition-colors">
            Terms
          </Link>
        </div>
        <p className="text-sm text-landing-foreground-muted">
          © {new Date().getFullYear()} GratitudeFlow. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default LandingPage;
