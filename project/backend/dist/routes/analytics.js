import { Router } from 'express';
import { logger } from '../utils/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getUserAnalytics, generateAnalyticsInsights } from '../services/analyticsService.js';
import { supabase } from '../config/database.js';
const router = Router();
router.get('/dashboard', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    logger.debug(`Fetching analytics dashboard for user: ${userId}`);
    const analyticsData = await getUserAnalytics(userId);
    const insights = await generateAnalyticsInsights(userId);
    res.json({
        message: 'Analytics dashboard data retrieved successfully',
        data: {
            ...analyticsData,
            insights,
        },
        timestamp: new Date().toISOString(),
    });
}));
router.get('/trends', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { period = '30d', metric = 'ats_score' } = req.query;
    let dateFilter = new Date();
    switch (period) {
        case '7d':
            dateFilter.setDate(dateFilter.getDate() - 7);
            break;
        case '30d':
            dateFilter.setDate(dateFilter.getDate() - 30);
            break;
        case '90d':
            dateFilter.setDate(dateFilter.getDate() - 90);
            break;
        case '1y':
            dateFilter.setFullYear(dateFilter.getFullYear() - 1);
            break;
        default:
            dateFilter.setDate(dateFilter.getDate() - 30);
    }
    const { data: trends, error } = await supabase
        .from('analytics_trends')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', dateFilter.toISOString())
        .order('timestamp', { ascending: true });
    if (error) {
        logger.error('Error fetching analytics trends:', error);
        throw new Error('Failed to fetch analytics trends');
    }
    const formattedTrends = trends?.map(trend => ({
        timestamp: trend.timestamp,
        value: trend[metric] || 0,
        ats_score: trend.ats_score,
        overall_score: trend.overall_score,
        readability_score: trend.readability_score,
        keyword_density: trend.keyword_density,
        skills_match: trend.skills_match,
    })) || [];
    res.json({
        message: 'Analytics trends retrieved successfully',
        data: {
            trends: formattedTrends,
            period,
            metric,
            summary: {
                total: formattedTrends.length,
                average: formattedTrends.reduce((sum, t) => sum + t.value, 0) / (formattedTrends.length || 1),
                highest: Math.max(...formattedTrends.map(t => t.value), 0),
                lowest: Math.min(...formattedTrends.map(t => t.value), 0),
            }
        },
    });
}));
router.get('/benchmark', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { industry } = req.query;
    const { analytics } = await getUserAnalytics(userId);
    const industryBenchmarks = {
        'technology': {
            averageAtsScore: 78,
            topPercentile: 92,
            commonSkills: ['JavaScript', 'Python', 'Cloud Computing', 'DevOps'],
            salaryRange: { min: 70000, max: 150000 }
        },
        'healthcare': {
            averageAtsScore: 75,
            topPercentile: 89,
            commonSkills: ['Patient Care', 'Medical Terminology', 'HIPAA Compliance'],
            salaryRange: { min: 50000, max: 120000 }
        },
        'finance': {
            averageAtsScore: 80,
            topPercentile: 94,
            commonSkills: ['Financial Analysis', 'Excel', 'Risk Management'],
            salaryRange: { min: 60000, max: 140000 }
        },
        'marketing': {
            averageAtsScore: 73,
            topPercentile: 87,
            commonSkills: ['Digital Marketing', 'SEO', 'Content Creation'],
            salaryRange: { min: 45000, max: 100000 }
        },
        'general': {
            averageAtsScore: 72,
            topPercentile: 85,
            commonSkills: ['Communication', 'Leadership', 'Problem Solving'],
            salaryRange: { min: 40000, max: 80000 }
        }
    };
    const benchmark = industryBenchmarks[industry] || industryBenchmarks.general;
    const comparison = {
        user: {
            atsScore: analytics.ats_score,
            overallScore: analytics.overall_score,
        },
        industry: industry || 'general',
        benchmark: {
            averageAtsScore: benchmark.averageAtsScore,
            topPercentile: benchmark.topPercentile,
            commonSkills: benchmark.commonSkills,
            salaryRange: benchmark.salaryRange,
        },
        analysis: {
            percentileRank: Math.round((analytics.ats_score / benchmark.topPercentile) * 100),
            aboveAverage: analytics.ats_score > benchmark.averageAtsScore,
            scoreGap: Math.max(0, benchmark.topPercentile - analytics.ats_score),
            recommendations: analytics.ats_score < benchmark.averageAtsScore
                ? ['Focus on industry-specific keywords', 'Improve technical skills section', 'Add quantifiable achievements']
                : ['Maintain current quality', 'Consider leadership examples', 'Update with latest industry trends']
        }
    };
    res.json({
        message: 'Industry benchmark comparison retrieved successfully',
        data: comparison,
    });
}));
router.get('/export', asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { format = 'json', startDate, endDate } = req.query;
    let dateFilter = {};
    if (startDate) {
        dateFilter.gte = { timestamp: startDate };
    }
    if (endDate) {
        dateFilter.lte = { timestamp: endDate };
    }
    const [analyticsResult, trendsResult, analysesResult] = await Promise.all([
        supabase
            .from('user_analytics')
            .select('*').eq('user_id', userId)
            .single(),
        (async () => {
            let trendsQuery = supabase
                .from('analytics_trends')
                .select('*')
                .eq('user_id', userId);
            if (startDate)
                trendsQuery = trendsQuery.gte('timestamp', startDate);
            if (endDate)
                trendsQuery = trendsQuery.lte('timestamp', endDate);
            return trendsQuery.order('timestamp');
        })(),
        (async () => {
            let analysesQuery = supabase
                .from('resume_analyses')
                .select(`
          id,
          job_role,
          analysis_type,
          file_name,
          ats_score,
          overall_score,
          created_at
        `)
                .eq('user_id', userId);
            if (startDate)
                analysesQuery = analysesQuery.gte('created_at', startDate);
            if (endDate)
                analysesQuery = analysesQuery.lte('created_at', endDate);
            return analysesQuery.order('created_at');
        })()
    ]);
    const exportData = {
        user_id: userId,
        export_date: new Date().toISOString(),
        analytics: analyticsResult.data,
        trends: trendsResult.data || [],
        analyses: analysesResult.data || [],
        summary: {
            total_analyses: analysesResult.data?.length || 0,
            date_range: {
                start: startDate || 'all',
                end: endDate || 'all'
            }
        }
    };
    if (format === 'csv') {
        const csvData = convertToCSV(exportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="analytics-${userId}-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csvData);
    }
    else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="analytics-${userId}-${new Date().toISOString().split('T')[0]}.json"`);
        res.json(exportData);
    }
}));
router.get('/admin/summary', asyncHandler(async (req, res) => {
    const { data: totalUsers } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });
    const { data: totalAnalyses } = await supabase
        .from('resume_analyses')
        .select('id', { count: 'exact' });
    const { data: avgAtsScore } = await supabase
        .from('user_analytics')
        .select('ats_score');
    const averageScore = avgAtsScore && avgAtsScore.length > 0
        ? avgAtsScore.reduce((sum, record) => sum + record.ats_score, 0) / avgAtsScore.length
        : 0;
    res.json({
        message: 'Admin analytics summary retrieved successfully',
        data: {
            totalUsers: totalUsers?.length || 0,
            totalAnalyses: totalAnalyses?.length || 0,
            averageAtsScore: Math.round(averageScore || 0),
            systemHealth: 'good'
        },
    });
}));
function convertToCSV(data) {
    const trends = data.trends || [];
    if (trends.length === 0) {
        return 'No data available for CSV export';
    }
    const headers = Object.keys(trends[0]).join(',');
    const rows = trends.map((trend) => Object.values(trend).join(','));
    return [headers, ...rows].join('\n');
}
export default router;
