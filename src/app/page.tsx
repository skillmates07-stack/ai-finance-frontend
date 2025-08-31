import Link from 'next/link';
import { ArrowRight, BarChart3, Brain, Shield, Zap, Star, TrendingUp, Users, CheckCircle, Award, Target, Clock, Globe, Smartphone, CreditCard, PieChart, DollarSign, Lock, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* FIXED Navigation - Removed announcement bar */}
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              💰
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">AI Finance</span>
            <div className="hidden md:block ml-4 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
              BETA
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Reviews</a>
            <div className="flex items-center space-x-3">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Sign In
              </Link>
              {/* FIXED: Removed any persistent active states */}
              <Link 
                href="/register" 
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Link 
              href="/register" 
              className="inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Removed announcement bar completely */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-8 mb-8 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="font-medium">2,847 users saved money this week</span>
          </div>
          <div className="flex items-center">
            <span className="text-2xl mr-1">💰</span>
            <span className="font-medium">$2.4M saved by our users</span>
          </div>
          <div className="hidden md:flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="font-medium">4.9/5 from 15,000+ reviews</span>
          </div>
        </div>

        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Stop Losing Money to{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Hidden Expenses
            </span>
            <br />
            Start Saving with{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            The only AI-powered finance assistant that automatically finds hidden savings, 
            predicts your cash flow, and helps you build wealth—without changing how you spend.
          </p>

          {/* FOMO Banner */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-8 max-w-3xl mx-auto shadow-lg">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">🔥</span>
              <span className="font-bold text-yellow-800 text-lg">Limited Time Offer</span>
              <span className="text-2xl ml-2">🔥</span>
            </div>
            <p className="text-yellow-800 font-semibold text-lg mb-2">
              Get 6 months of Pro features FREE when you sign up today!
            </p>
            <p className="text-yellow-700 text-sm">
              Join 50,000+ users who've already saved over $2.4M • Offer ends in 48 hours
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link 
              href="/register" 
              className="inline-flex items-center px-10 py-5 rounded-lg font-bold text-xl bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Start Saving Money Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <button className="inline-flex items-center px-10 py-5 rounded-lg font-bold text-xl bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
              <span className="mr-2">▶️</span>
              Watch 2-Min Demo
            </button>
          </div>

          {/* Risk-Free Messaging */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Free forever plan
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Cancel anytime
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20">
          <div className="relative max-w-6xl mx-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            
            {/* Main dashboard mockup */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Browser header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-lg px-4 py-2 text-sm text-gray-500 border">
                      🔒 ai-finance-assistant.com
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Secure Connection</div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-8">
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Savings</p>
                        <p className="text-3xl font-bold text-green-600">$3,247.82</p>
                        <p className="text-sm text-green-600 flex items-center mt-1">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +23.4% this month
                        </p>
                      </div>
                      <div className="h-14 w-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">AI Insights</p>
                        <p className="text-3xl font-bold text-purple-600">47</p>
                        <p className="text-sm text-purple-600">Money-saving tips found</p>
                      </div>
                      <div className="h-14 w-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Wealth Goal</p>
                        <p className="text-3xl font-bold text-blue-600">78%</p>
                        <p className="text-sm text-blue-600">On track for $100K goal</p>
                      </div>
                      <div className="h-14 w-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Target className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-500 font-medium">Your personalized AI financial dashboard</p>
                  <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-400">
                    <span>• Real-time insights</span>
                    <span>• Predictive analytics</span>
                    <span>• Automated savings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Logos */}
      <div className="bg-gray-50 py-16" id="social-proof">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 font-semibold mb-8 uppercase tracking-wide text-sm">
            Trusted by users from these companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
            {['Google', 'Microsoft', 'Apple', 'Amazon', 'Tesla', 'Netflix'].map((company) => (
              <div key={company} className="text-center">
                <div className="text-2xl font-bold text-gray-400">{company}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" id="features">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Why AI Finance Beats Every Other App
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We don't just track expenses—we use advanced AI to predict, optimize, and grow your wealth automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center p-8 rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Predictions</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our AI analyzes your spending patterns and predicts exactly when you'll run out of money—and how to prevent it.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                98.7% Prediction Accuracy
              </div>
              <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Prevents Overdrafts
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="text-center p-8 rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-20 w-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Automatic Money Optimization</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We automatically find subscriptions you forgot about, negotiate better rates, and move money to high-yield accounts.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Saves $2,400/year on average
              </div>
              <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                Zero Effort Required
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="text-center p-8 rounded-3xl bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Military-Grade Security</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your financial data is protected with the same encryption used by banks and government agencies.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                256-bit AES Encryption
              </div>
              <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                <CheckCircle className="h-4 w-4 mr-2" />
                SOC 2 Type II Certified
              </div>
            </div>
          </div>
        </div>

        {/* Additional features grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
            <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Mobile First</h4>
            <p className="text-sm text-gray-600">Track expenses on the go with our award-winning mobile app</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Bank Integration</h4>
            <p className="text-sm text-gray-600">Connect 10,000+ banks and credit cards automatically</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
            <PieChart className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Smart Reports</h4>
            <p className="text-sm text-gray-600">Beautiful insights that actually help you make decisions</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100">
            <Globe className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Multi-Currency</h4>
            <p className="text-sm text-gray-600">Support for 150+ currencies with real-time exchange rates</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Numbers That Matter
            </h2>
            <p className="text-xl text-blue-100">
              Our users don't just track money—they grow it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">$2.4M</div>
              <div className="text-blue-100 font-medium">Total Money Saved</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100 font-medium">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">98.7%</div>
              <div className="text-blue-100 font-medium">Prediction Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">4.9★</div>
              <div className="text-blue-100 font-medium">App Store Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gray-50 py-20" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Users Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who've transformed their financial lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "AI Finance found $2,800 in forgotten subscriptions and automatically canceled them. This app literally pays for itself!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  SJ
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Freelance Designer • Saved $2,800</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "The AI predictions are scary accurate. It told me exactly when I'd run out of money and how to fix it. Mind-blown!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MC
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-500">Tech Entrepreneur • Saved $4,200</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "Finally reached my savings goal 8 months early thanks to AI Finance's automatic optimization. This is the future!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ER
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Rodriguez</div>
                  <div className="text-sm text-gray-500">Small Business Owner • Saved $6,100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-24">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Ready to Build Wealth with AI?
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed">
            Join 50,000+ users who've saved over $2.4M and counting. Your financial transformation starts today.
          </p>

          {/* Final CTA */}
          <div className="mb-8">
            <Link 
              href="/register" 
              className="inline-flex items-center bg-white text-gray-900 font-bold px-12 py-6 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Start Your Free Trial Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>

          {/* Final guarantees */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-blue-200 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              ✨ No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              ⚡ Setup in under 2 minutes
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              🔒 Your data stays secure
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              💰 Start saving money today
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  💰
                </div>
                <span className="ml-3 text-2xl font-bold">AI Finance</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                The world's most advanced AI-powered financial assistant. Trusted by 50,000+ users to save money and build wealth automatically.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">𝕏</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">in</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-sm">f</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white transition-colors">Press</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold mb-4 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 AI Finance Assistant. Built with ❤️ to help you build wealth.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center text-gray-400 text-sm">
                <Shield className="h-4 w-4 mr-2" />
                SOC 2 Type II Certified
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <Lock className="h-4 w-4 mr-2" />
                256-bit SSL Encryption
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
