"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminApi, type AdminUser, type AdminTask, type AdminTransaction } from "@/lib/api";

type Tab = "tasks" | "transactions";

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<AdminUser | null>(null);
  const [recentTasks, setRecentTasks] = useState<AdminTask[]>([]);
  const [recentTxns, setRecentTxns] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("tasks");

  // Credit adjustment dialog
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  // Role change
  const [roleLoading, setRoleLoading] = useState(false);

  const fetchUser = useCallback(() => {
    setLoading(true);
    adminApi
      .getUserDetail(userId)
      .then((res) => {
        setUser(res.user);
        setRecentTasks(res.recent_tasks);
        setRecentTxns(res.recent_transactions);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleAdjust = async () => {
    setAdjustError(null);
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount === 0) {
      setAdjustError("Please enter a non-zero amount.");
      return;
    }
    if (!adjustReason.trim()) {
      setAdjustError("Please enter a reason.");
      return;
    }
    setAdjustLoading(true);
    try {
      const res = await adminApi.adjustCredits(userId, amount, adjustReason);
      setUser((prev) => (prev ? { ...prev, credits: res.new_balance } : null));
      setShowAdjust(false);
      setAdjustAmount("");
      setAdjustReason("");
      fetchUser(); // refresh recent transactions
    } catch (e: any) {
      setAdjustError(e.message || "Failed to adjust credits");
    } finally {
      setAdjustLoading(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    setRoleLoading(true);
    try {
      await adminApi.setUserRole(userId, newRole);
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
    } catch (e: any) {
      console.error(e);
    } finally {
      setRoleLoading(false);
    }
  };

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (!user) return <div className="text-red-500 text-sm">User not found</div>;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <button
        onClick={() => router.push("/admin/users")}
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Back to Users
      </button>

      {/* User info card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Avatar placeholder */}
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">
            {user.email[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-gray-900">{user.email}</h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {user.role}
              </span>
              {user.email_verified && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
              )}
            </div>
            {user.name && <p className="text-sm text-gray-500 mt-0.5">{user.name}</p>}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Credits: <strong className="text-gray-800">{user.credits.toFixed(0)}</strong></span>
              <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowAdjust(true)}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
                transition-colors font-medium"
            >
              Adjust Credits
            </button>
            {user.role !== "admin" && (
              <button
                onClick={() => handleRoleChange("admin")}
                disabled={roleLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50
                  transition-colors disabled:opacity-40"
              >
                Make Admin
              </button>
            )}
            {user.role === "admin" && (
              <button
                onClick={() => handleRoleChange("user")}
                disabled={roleLoading}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50
                  transition-colors disabled:opacity-40"
              >
                Remove Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Credit adjustment dialog */}
      {showAdjust && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowAdjust(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-900 mb-4">Adjust Credits</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Amount</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Positive to add, negative to deduct"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Reason</label>
                <input
                  type="text"
                  placeholder="Reason for adjustment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>
              {adjustError && <div className="text-sm text-red-500">{adjustError}</div>}
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowAdjust(false)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50
                  transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjust}
                disabled={adjustLoading}
                className="flex-1 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
                  transition-colors disabled:opacity-40"
              >
                {adjustLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setTab("tasks")}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "tasks"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Recent Tasks ({recentTasks.length})
          </button>
          <button
            onClick={() => setTab("transactions")}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === "transactions"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Recent Transactions ({recentTxns.length})
          </button>
        </div>

        <div className="p-4">
          {tab === "tasks" && (
            recentTasks.length === 0 ? (
              <div className="text-sm text-gray-400 text-center py-6">No tasks yet</div>
            ) : (
              <div className="space-y-2">
                {recentTasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                    <div>
                      <span className="font-medium text-gray-800">{t.tool_type}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                        t.status === "completed" ? "bg-green-100 text-green-700"
                        : t.status === "failed" ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                      }`}>{t.status}</span>
                      {t.error_message && (
                        <div className="text-xs text-red-400 mt-0.5 truncate max-w-xs">{t.error_message}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-gray-500">{t.credits_cost.toFixed(0)} pts</div>
                      <div className="text-xs text-gray-400">{new Date(t.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
          {tab === "transactions" && (
            recentTxns.length === 0 ? (
              <div className="text-sm text-gray-400 text-center py-6">No transactions yet</div>
            ) : (
              <div className="space-y-2">
                {recentTxns.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                    <div>
                      <span className={`font-medium ${
                        t.type === "purchase" ? "text-green-700"
                        : t.type === "deduction" ? "text-orange-700"
                        : "text-gray-700"
                      }`}>{t.type}</span>
                      {t.description && (
                        <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{t.description}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        t.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {t.amount > 0 ? "+" : ""}{t.amount.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-400">{new Date(t.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
