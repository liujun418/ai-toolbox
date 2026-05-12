"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminDashboardStats } from "@/lib/api";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (error) return <div className="text-red-500 text-sm">Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* User stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Users</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total Users" value={stats.total_users} />
          <StatCard label="Today" value={stats.new_users_today} />
          <StatCard label="This Week" value={stats.new_users_this_week} />
          <StatCard label="This Month" value={stats.new_users_this_month} />
        </div>
      </div>

      {/* Revenue stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Revenue</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Total Revenue" value={`$${stats.total_revenue.toFixed(2)}`} />
          <StatCard label="Credits Sold" value={stats.total_credits_sold.toFixed(0)} sub="Total purchased" />
          <StatCard label="Credits Consumed" value={stats.total_credits_consumed.toFixed(0)} sub="Total used by tools" />
        </div>
      </div>

      {/* Task stats */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Tasks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Completed Today" value={stats.tasks_today} />
          <StatCard label="Completed This Week" value={stats.tasks_this_week} />
          <StatCard label="Failed" value={stats.failed_tasks} sub="Total failed tasks" />
        </div>
      </div>

      {/* Top tools & top users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Top Tools</h2>
          {stats.top_tools.length === 0 ? (
            <div className="text-sm text-gray-400">No tasks yet</div>
          ) : (
            <div className="space-y-2">
              {stats.top_tools.map((tool, i) => (
                <div key={tool.tool_type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{tool.tool_type}</span>
                  </div>
                  <span className="text-gray-500">{tool.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Top Users by Credits</h2>
          {stats.top_users.length === 0 ? (
            <div className="text-sm text-gray-400">No users yet</div>
          ) : (
            <div className="space-y-2">
              {stats.top_users.map((u, i) => (
                <div key={u.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 truncate max-w-[180px]">{u.email}</span>
                  </div>
                  <span className="text-indigo-600 font-medium">{u.credits.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
