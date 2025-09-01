'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Users, CreditCard, BarChart3, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function BusinessAdminPage() {
  const { user, hasFeature } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            <Building2 className="h-10 w-10 mr-3 text-blue-600" />
            Business Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome back, {user?.name}! Managing {user?.companyName}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full uppercase">
            {user?.plan} Plan
          </span>
          {hasFeature('PRIORITY_SUPPORT') && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              VIP Support
            </span>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Monthly Expenses</p>
              <p className="text-3xl font-bold text-gray-900">$25,750</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-semibold text-green-600">-8.2%</span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white">
              <CreditCard className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">25</p>
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-semibold text-blue-600">3 pending invites</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Pending Approvals</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-semibold text-yellow-600">Needs attention</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white">
              <AlertTriangle className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Monthly Budget</p>
              <p className="text-3xl font-bold text-gray-900">$75,000</p>
              <div className="flex items-center mt-2">
                <span className="text-sm font-semibold text-green-600">65% used</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="max-w-md mx-auto">
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {hasFeature('TEAM_MANAGEMENT') ? 'Business Features Active' : 'Business Features Coming Soon'}
          </h3>
          <p className="text-gray-600 mb-6">
            {hasFeature('TEAM_MANAGEMENT') 
              ? 'Your enterprise features are ready! Manage your team, set up approval workflows, and access advanced reporting.'
              : 'Team management, expense approvals, advanced reporting, and integrations are being built for your enterprise needs.'
            }
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className={`px-3 py-2 rounded-lg ${hasFeature('TEAM_MANAGEMENT') ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
              Team Management {hasFeature('TEAM_MANAGEMENT') && '✓'}
            </div>
            <div className={`px-3 py-2 rounded-lg ${hasFeature('APPROVAL_WORKFLOWS') ? 'bg-green-50 text-green-700' : 'bg-green-50 text-green-700'}`}>
              Expense Approvals {hasFeature('APPROVAL_WORKFLOWS') && '✓'}
            </div>
            <div className={`px-3 py-2 rounded-lg ${hasFeature('ADVANCED_REPORTING') ? 'bg-green-50 text-green-700' : 'bg-purple-50 text-purple-700'}`}>
              Advanced Reports {hasFeature('ADVANCED_REPORTING') && '✓'}
            </div>
            <div className={`px-3 py-2 rounded-lg ${hasFeature('QUICKBOOKS_SYNC') ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
              QuickBooks Sync {hasFeature('QUICKBOOKS_SYNC') && '✓'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
