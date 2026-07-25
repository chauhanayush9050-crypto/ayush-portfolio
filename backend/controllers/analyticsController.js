// =====================================================
// Analytics controller
//
// Public: a single endpoint to record an anonymous, non-sensitive
// event (section view, project view, resume download, social
// click, contact CTA click).
//
// Admin (protected): dashboard totals, time-series charts, and
// per-project view analytics — all computed via aggregation
// queries against the AnalyticsEvent collection (no maintained
// counters, so there's nothing to drift out of sync).
// =====================================================

import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import AnalyticsEvent from "../models/AnalyticsEvent.js";
import Project from "../models/Project.js";
import Message from "../models/Message.js";
import { getAnalyticsContext } from "../utils/analyticsHelper.js";

const PUBLICLY_TRACKABLE_TYPES = [
  "pageview",
  "project_view",
  "resume_download",
  "github_click",
  "linkedin_click",
  "contact_click",
];

// @desc    Record a single anonymous analytics event
// @route   POST /api/analytics/track
// @access  Public
const trackEvent = asyncHandler(async (req, res) => {
  const { type, page, projectId, visitorId } = req.body;

  if (!PUBLICLY_TRACKABLE_TYPES.includes(type)) {
    res.status(400);
    throw new Error("Invalid event type");
  }

  if (!visitorId || typeof visitorId !== "string") {
    res.status(400);
    throw new Error("Missing visitorId");
  }

  if (type === "project_view") {
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Invalid or missing projectId for project_view event");
    }
  }

  const context = getAnalyticsContext(req);

  await AnalyticsEvent.create({
    type,
    page: type === "pageview" ? page || "" : "",
    project: type === "project_view" ? projectId : null,
    visitorId,
    ...context,
  });

  // 201 with no body needed — the visitor's browser doesn't do
  // anything with the response, this just acknowledges receipt.
  res.status(201).json({ success: true });
});

// @desc    Dashboard summary stats
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // "Visitors" = home-page arrivals (this is a single-page app, so a
  // "visit" is counted as a pageview event on the home section).
  const homeFilter = { type: "pageview", page: "home" };

  const [
    totalVisitors,
    uniqueVisitorIds,
    totalPageViews,
    todayVisitors,
    weekVisitors,
    monthVisitors,
    totalResumeDownloads,
    totalGithubClicks,
    totalLinkedinClicks,
    totalContactMessages,
    mostViewedProjectAgg,
    mostViewedPageAgg,
  ] = await Promise.all([
    AnalyticsEvent.countDocuments(homeFilter),
    AnalyticsEvent.distinct("visitorId"),
    AnalyticsEvent.countDocuments({ type: "pageview" }),
    AnalyticsEvent.countDocuments({ ...homeFilter, createdAt: { $gte: startOfToday } }),
    AnalyticsEvent.countDocuments({ ...homeFilter, createdAt: { $gte: startOfWeek } }),
    AnalyticsEvent.countDocuments({ ...homeFilter, createdAt: { $gte: startOfMonth } }),
    AnalyticsEvent.countDocuments({ type: "resume_download" }),
    AnalyticsEvent.countDocuments({ type: "github_click" }),
    AnalyticsEvent.countDocuments({ type: "linkedin_click" }),
    Message.countDocuments(),
    AnalyticsEvent.aggregate([
      { $match: { type: "project_view" } },
      { $group: { _id: "$project", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 1 },
      {
        $lookup: { from: "projects", localField: "_id", foreignField: "_id", as: "project" },
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { type: "pageview" } },
      { $group: { _id: "$page", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 1 },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalVisitors,
      uniqueVisitors: uniqueVisitorIds.length,
      totalPageViews,
      todayVisitors,
      weekVisitors,
      monthVisitors,
      totalResumeDownloads,
      totalGithubClicks,
      totalLinkedinClicks,
      totalContactMessages,
      mostViewedProject: mostViewedProjectAgg[0]
        ? { title: mostViewedProjectAgg[0].project?.title || "Unknown", views: mostViewedProjectAgg[0].views }
        : null,
      mostViewedPage: mostViewedPageAgg[0]
        ? { page: mostViewedPageAgg[0]._id, views: mostViewedPageAgg[0].views }
        : null,
    },
  });
});

// @desc    Time-series and breakdown data for charts
// @route   GET /api/analytics/charts
// @access  Private/Admin
const getCharts = asyncHandler(async (req, res) => {
  const now = new Date();
  const homeFilter = { type: "pageview", page: "home" };

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  const twelveWeeksAgo = new Date(now);
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 7 * 11);

  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [daily, weekly, monthly, deviceDistribution, trafficSources] = await Promise.all([
    AnalyticsEvent.aggregate([
      { $match: { ...homeFilter, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { ...homeFilter, createdAt: { $gte: twelveWeeksAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%G-W%V", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { ...homeFilter, createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { type: "pageview" } },
      { $group: { _id: "$deviceType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    AnalyticsEvent.aggregate([
      { $match: { type: "pageview" } },
      { $group: { _id: "$referrerSource", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      daily: daily.map((d) => ({ date: d._id, count: d.count })),
      weekly: weekly.map((d) => ({ week: d._id, count: d.count })),
      monthly: monthly.map((d) => ({ month: d._id, count: d.count })),
      deviceDistribution: deviceDistribution.map((d) => ({ device: d._id, count: d.count })),
      trafficSources: trafficSources.map((d) => ({ source: d._id, count: d.count })),
    },
  });
});

// @desc    Per-project view analytics (most/least viewed, total views per project)
// @route   GET /api/analytics/projects
// @access  Private/Admin
const getProjectAnalytics = asyncHandler(async (req, res) => {
  const [projects, viewCounts] = await Promise.all([
    Project.find().select("title isPublished"),
    AnalyticsEvent.aggregate([
      { $match: { type: "project_view" } },
      { $group: { _id: "$project", views: { $sum: 1 } } },
    ]),
  ]);

  const viewsByProjectId = new Map(viewCounts.map((v) => [String(v._id), v.views]));

  const projectViews = projects
    .map((p) => ({
      projectId: p._id,
      title: p.title,
      isPublished: p.isPublished,
      views: viewsByProjectId.get(String(p._id)) || 0,
    }))
    .sort((a, b) => b.views - a.views);

  res.json({
    success: true,
    data: {
      projectViews,
      mostViewed: projectViews.slice(0, 5),
      leastViewed: [...projectViews].reverse().slice(0, 5),
    },
  });
});

export { trackEvent, getDashboardStats, getCharts, getProjectAnalytics };
