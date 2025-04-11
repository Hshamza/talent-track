import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HeroAnimation } from "@/components/hero-animation"
import { WaveBackground } from "@/components/wave-background"
import { FeatureCard } from "@/components/feature-card"
import { StatsCounter } from "@/components/stats-counter"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">T</div>
              </div>
              <span className="font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                TalentTrack
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Register
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section with Animation */}
        <section className="relative w-full overflow-hidden py-12 md:py-24">
          <WaveBackground />
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-indigo-500/10 px-3 py-1 text-sm text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  Next-Gen Talent Acquisition
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl">
                  <span className="block">Streamline Your</span>
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Hiring Process
                  </span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  TalentTrack helps HR and Talent Acquisition teams manage candidates, track interviews, and collaborate
                  effectively with AI-powered insights.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="border-indigo-200 dark:border-indigo-800">
                      Learn More
                    </Button>
                  </Link>
                  <Link href="/careers">
                    <Button size="lg" variant="outline" className="border-indigo-200 dark:border-indigo-800">
                      Browse Opportunities
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <HeroAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <StatsCounter value={500} label="Companies" icon="Building" />
              <StatsCounter value={10000} label="Candidates" icon="Users" />
              <StatsCounter value={25000} label="Interviews" icon="Calendar" />
              <StatsCounter value={95} label="Satisfaction" icon="ThumbsUp" suffix="%" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <div className="inline-block rounded-lg bg-indigo-500/10 px-3 py-1 text-sm text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything you need to manage your talent acquisition
              </h2>
              <p className="max-w-[85%] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform streamlines your entire recruitment workflow with powerful tools and insights
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <FeatureCard
                icon="Users"
                title="Candidate Management"
                description="Track candidate profiles, resumes, and application status in one place with AI-powered insights."
              />
              <FeatureCard
                icon="Calendar"
                title="Interview Scheduling"
                description="Easily schedule and track interviews across multiple stages with automated reminders."
                highlighted={true}
              />
              <FeatureCard
                icon="FileText"
                title="Collaborative Notes"
                description="Share interview feedback and notes with your hiring team in real-time."
              />
              <FeatureCard
                icon="BarChart"
                title="Analytics Dashboard"
                description="Get powerful insights into your hiring process with customizable reports and metrics."
              />
              <FeatureCard
                icon="MessageSquare"
                title="Candidate Communication"
                description="Maintain consistent communication with candidates through integrated messaging."
                highlighted={true}
              />
              <FeatureCard
                icon="Briefcase"
                title="Job Posting Management"
                description="Create, publish, and track job postings across multiple channels from one platform."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-10"></div>
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                  Ready to Transform Your Hiring Process?
                </h2>
                <p className="mx-auto max-w-[700px] text-white/80 md:text-xl">
                  Join thousands of companies that have streamlined their recruitment workflow with TalentTrack.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 TalentTrack. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
