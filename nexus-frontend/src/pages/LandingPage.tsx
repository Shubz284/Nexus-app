import { useNavigate } from "react-router";
import {
  Brain,
  Share2,
  Tag,
  Search,
  Youtube,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { TwitterIcon } from "@/icons/TwitterIcon";
import { InstagramIcon } from "@/icons/InstagramIcon";
import { FacebookIcon } from "@/icons/FacebookIcon";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Your Second Brain",
      description:
        "Capture and organize knowledge from across the web in one beautiful place.",
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "Share Your Knowledge",
      description:
        "Create shareable links to your curated collections and inspire others.",
    },
    {
      icon: <Tag className="h-8 w-8" />,
      title: "Smart Organization",
      description:
        "Tag and categorize your content for instant retrieval when you need it.",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Powerful Search",
      description:
        "Find anything instantly with intelligent search across titles and tags.",
    },
  ];

  const platforms = [
    {
      icon: <Youtube className="h-6 w-6" />,
      name: "YouTube",
      color: "text-red-600",
    },
    { icon: <TwitterIcon />, name: "Twitter", color: "text-blue-400" },
    { icon: <InstagramIcon />, name: "Instagram", color: "text-pink-600" },
    { icon: <FacebookIcon />, name: "Facebook", color: "text-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 p-2">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Nexus</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/auth/login")}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white pt-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzg4OCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-40"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
              <Sparkles className="h-4 w-4" />
              Your Personal Knowledge Hub
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 text-5xl leading-tight font-extrabold text-gray-900 sm:text-6xl lg:text-7xl">
              Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Second Brain
              </span>
              <br />
              for the Digital Age
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600 sm:text-2xl">
              Capture, organize, and share your favorite content from across the
              web. Build your personal knowledge collection and inspire others.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/auth/signup")}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                Start Building Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => navigate("/auth/login")}
                className="inline-flex items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
              >
                Sign In
              </button>
            </div>

            {/* Platform Icons */}
            <div className="mt-12 flex items-center justify-center gap-2">
              <p className="text-sm text-gray-500">Save content from:</p>
              <div className="flex items-center gap-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className={`${platform.color} transition-transform hover:scale-110`}
                  >
                    {platform.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 -left-20 h-64 w-64 rounded-full bg-purple-300 opacity-20 blur-3xl"></div>
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-pink-300 opacity-20 blur-3xl"></div>
      </section>
      {/* Dashboard Preview Section */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
              <Sparkles className="h-4 w-4" />
              See It In Action
            </div>
            <h2 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Your Dashboard,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Beautifully Organized
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              A clean, intuitive interface designed for focus and productivity
            </p>
          </div>

          {/* Dashboard Screenshot */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-2xl">
              <img
                src="/dashboard.png"
                alt="Nexus Dashboard - Your personal knowledge management system"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Redesigned */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-purple-100">
              Three simple steps to build your knowledge empire
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-0 left-1/2 hidden h-full w-1 -translate-x-1/2 lg:block">
              <div className="h-full w-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
            </div>

            <div className="space-y-16 lg:space-y-24">
              {/* Step 1 */}
              <div className="relative">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                  <div className="order-2 lg:order-1 lg:text-right">
                    <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                      STEP 01
                    </div>
                    <h3 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                      Capture Everything
                    </h3>
                    <p className="mb-6 text-lg text-purple-100">
                      Save content from YouTube, Twitter, Instagram, and
                      Facebook with a single click. Never lose track of valuable
                      content again.
                    </p>
                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      {platforms.map((platform) => (
                        <div
                          key={platform.name}
                          className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm"
                        >
                          <div className="text-white">{platform.icon}</div>
                          <span className="text-sm font-medium text-white">
                            {platform.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src="/capture.png"
                        alt="Capture content from any platform"
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                  <div className="order-2">
                    <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                      STEP 02
                    </div>
                    <h3 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                      Organize Smartly
                    </h3>
                    <p className="mb-6 text-lg text-purple-100">
                      Add tags, categorize by platform, and use our powerful
                      search to find anything instantly. Your content, your way.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                        <Tag className="h-6 w-6 text-white" />
                      </div>
                      <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                        <Search className="h-6 w-6 text-white" />
                      </div>
                      <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="order-1">
                    <div className="overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src="/organize.png"
                        alt="Organize with tags and smart categorization"
                        className="mx-auto h-auto w-full max-w-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                  <div className="order-2 lg:order-1 lg:text-right">
                    <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                      STEP 03
                    </div>
                    <h3 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
                      Share & Inspire
                    </h3>
                    <p className="mb-6 text-lg text-purple-100">
                      Create beautiful shareable links to your curated
                      collections. Inspire others with your knowledge and become
                      a thought leader.
                    </p>
                    <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-purple-600 transition-transform hover:scale-105">
                      <Share2 className="h-5 w-5" />
                      Try Sharing Now
                    </button>
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src="/share.png"
                        alt="Share your collections with beautiful links"
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 -left-20 h-96 w-96 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-pink-300 opacity-20 blur-3xl"></div>
      </section>
      {/* Features Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Organize Knowledge
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Powerful features designed to help you build and share your
              personal knowledge collection
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-purple-300 hover:shadow-xl"
              >
                <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-3 text-purple-600 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Nexus?
                </span>
              </h2>
              <p className="mb-8 text-xl text-gray-600">
                Join thousands of learners, creators, and knowledge workers who
                trust Nexus to organize their digital lives.
              </p>
              <div className="space-y-4">
                {[
                  "Save unlimited content from multiple platforms",
                  "Organize with intelligent tagging system",
                  "Share your knowledge with beautiful links",
                  "Fast, powerful search across all content",
                  "Clean, distraction-free interface",
                  "Access anywhere, anytime",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-500" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-8">
                <div className="space-y-4">
                  {/* Mock Content Cards */}
                  <div className="rounded-lg border-2 border-purple-200 bg-white p-4 shadow-lg">
                    <div className="mb-2 flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-600" />
                      <span className="font-semibold">
                        Web Development Tutorial
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                        #coding
                      </span>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                        #webdev
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border-2 border-pink-200 bg-white p-4 shadow-lg">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="scale-75">
                        <TwitterIcon />
                      </div>
                      <span className="font-semibold">Design Inspiration</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs text-pink-700">
                        #design
                      </span>
                      <span className="rounded-full bg-pink-100 px-3 py-1 text-xs text-pink-700">
                        #UI
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white shadow-lg">
                    <Share2 className="h-5 w-5" />
                    <span className="font-semibold">Share Your Brain</span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-purple-300 opacity-20 blur-2xl"></div>
              <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-pink-300 opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
            <Zap className="h-4 w-4" />
            Free to Start
          </div>
          <h2 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
            Start Building Your
            <br />
            Second Brain Today
          </h2>
          <p className="mb-10 text-xl text-purple-100">
            Join thousands of users organizing their knowledge with Nexus
          </p>
          <button
            onClick={() => navigate("/auth/signup")}
            className="hover:shadow-3xl inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-purple-600 shadow-2xl transition-all hover:scale-105"
          >
            Get Started Free
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 p-2">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Nexus</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 Nexus. Built for knowledge seekers.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-600 transition-colors hover:text-purple-600"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 transition-colors hover:text-purple-600"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 transition-colors hover:text-purple-600"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
