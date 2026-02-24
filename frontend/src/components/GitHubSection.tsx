'use client';

import { motion } from 'framer-motion';
import { Github, Zap, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';
import { useGitHubContributions } from '@/hooks/usePortfolioAPI';

export default function GitHubSection() {
  const { data, isLoading, error } = useGitHubContributions();

  // Convert contribution days to GitHub-style grid (7 rows x weeks columns)
  const generateHeatmapData = () => {
    if (!data?.contributions || data.contributions.length === 0) {
      return { monthLabels: [], weekGrid: [] as Array<Array<{ count: number; level: number; date: string } | null>> };
    }

    // Create a map of date -> contribution data for quick lookup
    const contributionMap = new Map<string, { count: number; level: number }>();
    data.contributions.forEach((day) => {
      contributionMap.set(day.date, {
        count: day.count || 0,
        level: day.level || 0,
      });
    });

    // Get start and end dates
    const dates = data.contributions.map((d) => new Date(d.date + 'T00:00:00'));
    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    // Adjust start to the beginning of the week (Sunday)
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(adjustedStart.getDate() - adjustedStart.getDay());

    // Build the grid: 7 rows (days of week) x N columns (weeks)
    const weekGrid: Array<Array<{ count: number; level: number; date: string } | null>> = Array.from({ length: 7 }).map(() => []);
    const monthLabels: { month: string; weekIndex: number }[] = [];
    let lastMonth = '';
    let weekIndex = 0;

    const currentDate = new Date(adjustedStart);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const dateStr = currentDate.toISOString().split('T')[0];
      const monthName = currentDate.toLocaleDateString('en-US', { month: 'short' });

      // Add month label at the start of each month
      if (monthName !== lastMonth && dayOfWeek === 0) {
        monthLabels.push({ month: monthName, weekIndex });
        lastMonth = monthName;
      }

      const dayData = contributionMap.get(dateStr);
      weekGrid[dayOfWeek][weekIndex] = {
        count: dayData?.count || 0,
        level: dayData?.level || 0,
        date: dateStr,
      };

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);

      // Increment week on Sunday
      if (currentDate.getDay() === 0) {
        weekIndex++;
      }
    }

    return { monthLabels, weekGrid };
  };

  const { monthLabels, weekGrid } = useMemo(() => generateHeatmapData(), [data, generateHeatmapData]);

  const getColorIntensity = (value: number) => {
    if (value === 0) return 'bg-white/5';
    if (value === 1) return 'bg-green-900/40';
    if (value === 2) return 'bg-green-700/60';
    if (value === 3) return 'bg-green-500/80';
    return 'bg-green-400';
  };

  if (isLoading) {
    return (
      <section className="relative px-4 py-20 sm:py-32" aria-label="GitHub activity section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Featured
            </p>
            <h2 className="flex items-center gap-3 text-3xl font-bold sm:text-4xl">
              <Github className="w-8 h-8" aria-hidden="true" />
              GitHub Activity
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="p-8 glass-card"
          >
            <div className="flex items-center justify-center gap-3 py-12">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Loading your GitHub contributions...</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="relative px-4 py-20 sm:py-32" aria-label="GitHub activity section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase">
              Featured
            </p>
            <h2 className="flex items-center gap-3 text-3xl font-bold sm:text-4xl">
              <Github className="w-8 h-8" aria-hidden="true" />
              GitHub Activity
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="p-8 border glass-card border-red-500/20 bg-red-500/5"
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Unable to load GitHub data</p>
                <p className="mt-1 text-sm text-red-300">Make sure your GitHub token is valid and configured.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-4 py-20 sm:py-32" aria-label="GitHub activity and projects section">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase">
            Featured
          </p>
          <h2 className="flex items-center gap-3 text-3xl font-bold sm:text-4xl">
            <Github className="w-8 h-8" aria-hidden="true" />
            GitHub Activity
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="p-8 mb-8 glass-card"
        >
          <div className="mb-8">
            <p className="text-2xl font-bold">
              Total: <span className="text-green-400">{data.totalContributions?.toLocaleString() || 0}</span> contributions
            </p>
            {data.stats && (
              <>
                <p className="mt-2 text-sm text-gray-500">
                  <Zap className="inline w-4 h-4 mr-1 text-yellow-400" aria-hidden="true" />
                  Last 7 days: <span className="text-green-400">{data.stats.last7Days}</span> contributions
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Last 30 days: <span className="text-green-400">{data.stats.last30Days}</span> contributions
                </p>
              </>
            )}
          </div>

          {/* Contribution Heatmap */}
          <div className="overflow-x-auto" role="region" aria-label="GitHub contribution heatmap">
            <div className="inline-block p-4">
              {/* Day labels and heatmap container */}
              <div className="flex gap-2">
                {/* Day labels column */}
                <div className="flex flex-col gap-0.5">
                  <div className="h-5"></div>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-end w-6 h-4 pr-1 text-xs font-medium text-gray-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Heatmap grid column */}
                <div>
                  {/* Month labels row */}
                  <div className="flex gap-0.5 mb-1 pl-0.5">
                    {monthLabels.map((item, idx) => {
                      const startWeek = idx > 0 ? monthLabels[idx - 1].weekIndex : 0;
                      const endWeek = item.weekIndex;
                      const weeksSpan = endWeek - startWeek;
                      const width = (weeksSpan * 20) - 2;
                      
                      return (
                        <div
                          key={idx}
                          className="text-xs font-medium text-gray-500"
                          style={{ width: `${Math.max(width, 30)}px` }}
                        >
                          {item.month}
                        </div>
                      );
                    })}
                  </div>

                  {/* Contribution squares grid */}
                  <div className="flex gap-0.5">
                    {weekGrid[0] && weekGrid[0].length > 0 ? (
                      Array.from({ length: weekGrid[0].length }).map((_, weekIdx) => (
                        <div key={weekIdx} className="flex flex-col gap-0.5">
                          {weekGrid.map((dayColumn, dayIdx) => {
                            const dayData = dayColumn[weekIdx];
                            return (
                              <motion.div
                                key={`${weekIdx}-${dayIdx}`}
                                whileHover={{ scale: 1.2 }}
                                className={`h-4 w-4 rounded-sm border border-white/10 ${
                                  dayData ? getColorIntensity(dayData.level) : 'bg-white/5'
                                } transition-all hover:border-white/30 cursor-pointer`}
                                title={
                                  dayData && dayData.count > 0
                                    ? `${dayData.count} contributions on ${dayData.date}`
                                    : dayData
                                    ? `No contributions on ${dayData.date}`
                                    : 'No data'
                                }
                                role="img"
                                aria-label={
                                  dayData && dayData.count > 0
                                    ? `${dayData.count} contributions on ${dayData.date}`
                                    : 'No contributions'
                                }
                              />
                            );
                          })}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No contribution data available</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 mt-6 text-xs text-gray-500">
                <span className="font-medium">Contributions:</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Less</span>
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-3 w-3 rounded-sm border border-white/10 ${getColorIntensity(i)}`}
                        aria-label={`Intensity level ${i}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">More</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
