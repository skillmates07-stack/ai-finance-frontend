import Link from 'next/link';
import { ArrowRight, BarChart3, Brain, Shield, Zap, Star, TrendingUp, Users, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              💰
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">AI Finance</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              50,000+ Users
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 mr-1 text-yellow-500" />
              4.9/5 Rating
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-1 text-green-500" />
              Bank-Level Security
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            Personal CFO
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your financial life with intelligent expense tracking, smart categorization, 
            and AI-driven insights that help you make better money decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              <span className="mr-2">▶️</span>
              Watch Demo
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-4 text-sm text-gray-500">ai-finance-assistant.com</span>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Balance</p>
                        <p className="text-2xl font-bold text-gray-900">$12,450.75</p>
                        <p className="text-sm text-green-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12.3% vs last month
                        </p>
                      </div>
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">AI Insights</p>
                        <p className="text-2xl font-bold text-gray-900">23</p>
                        <p className="text-sm text-purple-600">New recommendations</p>
                      </div>
                      <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Savings Goal</p>
                        <p className="text-2xl font-bold text-gray-900">68%</p>
                        <p className="text-sm text-green-600">On track for target</p>
                      </div>
                      <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Beautiful, intelligent financial dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to master your finances
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed to simplify your financial life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Insights</h3>
            <p className="text-gray-600 mb-4">
              Get personalized recommendations and insights powered by advanced AI to optimize your spending.
            </p>
            <div className="flex items-center justify-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              95% Accuracy Rate
            </div>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Categorization</h3>
            <p className="text-gray-600 mb-4">
              Automatically categorize your expenses with 95% accuracy using machine learning algorithms.
            </p>
            <div className="flex items-center justify-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              Instant Processing
            </div>
          </div>
          <div className="text-center p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Bank-Level Security</h3>
            <p className="text-gray-600 mb-4">
              Your financial data is protected with enterprise-grade encryption and security measures.
            </p>
            <div className="flex items-center justify-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              256-bit Encryption
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by thousands of users worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "AI Finance has completely transformed how I manage my money. The AI insights are incredibly accurate!"
              </p>
              <div className="text-sm text-gray-500">
                <strong>Sarah Johnson</strong> • Freelancer
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Finally, a finance app that actually understands my spending patterns. Highly recommended!"
              </p>
              <div className="text-sm text-gray-500">
                <strong>Michael Chen</strong> • Entrepreneur
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The automatic categorization saves me hours every week. This app is a game-changer!"
              </p>
              <div className="text-sm text-gray-500">
                <strong>Emily Rodriguez</strong> • Small Business Owner
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have taken control of their financial future with AI Finance.
          </p>
          <Link href="/register" className="inline-flex items-center bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-lg">
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            ✨ No credit card required • ⚡ Setup in under 2 minutes • 🔒 Your data stays secure
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  💰
                </div>
                <span className="ml-3 text-lg font-bold">AI Finance</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Transform your financial life with AI-powered expense tracking and intelligent insights.
              </p>
              <div className="text-gray-400 text-sm">
                © 2025 AI Finance Assistant. Built with ❤️ for your financial success.
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
