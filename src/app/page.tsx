'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Shield, TrendingUp, Building2, User, Sparkles, Check, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-bold text-gray-900">AI Finance</span>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">Trusted by 10M+ users</span>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
              AI-Powered Financial
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Intelligence Platform
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your financial future with enterprise-grade AI that learns, predicts, and optimizes. 
              Whether managing personal finances or running a billion-dollar business, our platform delivers 
              intelligent insights and automation that Fortune 500 companies trust.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/login"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <User className="h-5 w-5 mr-3" />
                Personal Finance
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/login"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Building2 className="h-5 w-5 mr-3" />
                Business Finance
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span>Enterprise-Grade</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Billion-Dollar Companies Choose AI Finance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join Fortune 500 companies and millions of individuals who trust our platform 
              for their most critical financial decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI-Powered Insights */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Intelligence</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Advanced machine learning algorithms analyze your financial patterns, predict trends, 
                and provide personalized recommendations that have helped users save an average of $3,200 annually.
              </p>
              <div className="space-y-2">
                {[
                  'Smart expense categorization',
                  'Predictive budget alerts',
                  'Investment optimization',
                  'Fraud detection & prevention'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enterprise Security */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200">
              <div className="h-16 w-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Security</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your financial data is protected with the same security standards used by major banks, 
                including 256-bit encryption, multi-factor authentication, and SOC 2 Type II compliance.
              </p>
              <div className="space-y-2">
                {[
                  'Bank-level 256-bit encryption',
                  'Multi-factor authentication',
                  'SOC 2 Type II certified',
                  '24/7 security monitoring'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scalable Growth */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Growth</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Whether building personal wealth or scaling a business, our AI identifies opportunities 
                to optimize finances and accelerate growth. Users typically see 40% faster goal achievement.
              </p>
              <div className="space-y-2">
                {[
                  'Goal-based financial planning',
                  'Investment opportunity detection',
                  'Cash flow optimization',
                  'Tax minimization strategies'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h3>
              <p className="text-gray-600">Join thousands of businesses and millions of individuals</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              {/* Placeholder for company logos */}
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">Fortune 500</span>
              </div>
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">Startups</span>
              </div>
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">SMBs</span>
              </div>
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-semibold">Individuals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join millions who've already upgraded their financial future with AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
