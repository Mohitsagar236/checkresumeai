import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, BarChart3, TrendingUp, Users, Download, Star,
  FileText, Globe, Brain, DollarSign, Award, Target,
  Calendar, Activity, PieChart, ArrowUpRight, Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { AnimatedProgressBar } from '../ui/AnimatedProgressBar';

interface PremiumDashboardProps {
  className?: string;
}

export function PremiumDashboard({ className = '' }: PremiumDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock premium analytics data
  const analyticsData = {
    totalAnalyses: 45,
    improvementScore: 87,
    industryRanking: 23,
    atsOptimization: 94,
    skillsMatched: 85,
    interviewsLanded: 12,
    profileViews: 234,
    connectionGrowth: 18
  };

  const recentActivities = [
    { type: 'analysis', title: 'Senior Software Engineer Resume Analysis', score: 92, date: '2 hours ago' },
    { type: 'optimization', title: 'LinkedIn Profile Optimization', improvement: '+15%', date: '1 day ago' },
    { type: 'comparison', title: 'Resume Comparison with Industry Leaders', ranking: 'Top 20%', date: '2 days ago' },
    { type: 'insight', title: 'Salary Insights for Data Scientist', value: '$125k-$145k', date: '3 days ago' }
  ];

  const skillTrends = [
    { skill: 'React.js', trend: '+12%', demand: 'High', color: 'text-green-600' },
    { skill: 'Python', trend: '+8%', demand: 'Very High', color: 'text-green-600' },
    { skill: 'Machine Learning', trend: '+24%', demand: 'Critical', color: 'text-blue-600' },
    { skill: 'Cloud Computing', trend: '+18%', demand: 'High', color: 'text-green-600' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Premium Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Crown className="w-8 h-8 mr-3 text-yellow-300" />
                Premium Dashboard
              </h1>
              <p className="text-blue-100 mt-2">
                Your comprehensive career optimization command center
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="text-yellow-300 font-semibold">Premium Member</div>
                <div className="text-sm text-blue-100">Active until Dec 2024</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Analyses</p>
                <p className="text-3xl font-bold text-blue-700">{analyticsData.totalAnalyses}</p>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +23% this month
                </p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Improvement Score</p>
                <p className="text-3xl font-bold text-green-700">{analyticsData.improvementScore}%</p>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% vs baseline
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Industry Ranking</p>
                <p className="text-3xl font-bold text-purple-700">Top {analyticsData.industryRanking}%</p>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  Up 5 positions
                </p>
              </div>
              <Award className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">ATS Optimization</p>
                <p className="text-3xl font-bold text-orange-700">{analyticsData.atsOptimization}%</p>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  Excellent score
                </p>
              </div>
              <Target className="w-10 h-10 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Features Overview */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Recent Premium Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                  <div className="text-right">
                    {activity.score && (
                      <span className="font-bold text-green-600">{activity.score}%</span>
                    )}
                    {activity.improvement && (
                      <span className="font-bold text-blue-600">{activity.improvement}</span>
                    )}
                    {activity.ranking && (
                      <span className="font-bold text-purple-600">{activity.ranking}</span>
                    )}
                    {activity.value && (
                      <span className="font-bold text-orange-600">{activity.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-500" />
              Skill Trends Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillTrends.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{skill.skill}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${skill.color}`}>{skill.trend}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        {skill.demand}
                      </span>
                    </div>
                  </div>
                  <AnimatedProgressBar 
                    progress={Math.random() * 100} 
                    colorClass="blue" 
                    height={2} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Tools Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Cover Letter Generator */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cover Letter Generator</h3>
              <p className="text-gray-600 text-sm mb-4">
                Create tailored cover letters using AI
              </p>
              <Button className="w-full">Generate Cover Letter</Button>
            </div>
          </CardContent>
        </Card>

        {/* LinkedIn Optimizer */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">LinkedIn Optimizer</h3>
              <p className="text-gray-600 text-sm mb-4">
                Optimize your LinkedIn profile for visibility
              </p>
              <Button className="w-full">Optimize Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Salary Insights */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Salary Insights</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get market salary data and negotiation tips
              </p>
              <Button className="w-full">View Insights</Button>
            </div>
          </CardContent>
        </Card>

        {/* Resume Comparison */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Resume Comparison</h3>
              <p className="text-gray-600 text-sm mb-4">
                Compare resumes and track improvements
              </p>
              <Button className="w-full">Compare Resumes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Export Tools */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="bg-indigo-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Download className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Export Tools</h3>
              <p className="text-gray-600 text-sm mb-4">
                Export optimized resumes in multiple formats
              </p>
              <Button className="w-full">Export Resume</Button>
            </div>
          </CardContent>
        </Card>

        {/* Career Path */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Career Path</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get personalized career recommendations
              </p>
              <Button className="w-full">Explore Paths</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium Support */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-gold-50 to-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-yellow-600" />
                  Premium Support
                </h3>
                <p className="text-gray-600">
                  Get priority support from our career experts. Available 24/7 for premium members.
                </p>
              </div>
              <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default PremiumDashboard;
