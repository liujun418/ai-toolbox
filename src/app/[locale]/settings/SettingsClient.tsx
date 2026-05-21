"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/lib/api";
import type { TaskItem, TransactionItem } from "@/lib/api";
import { getLocaleFromPathname } from "@/lib/locale";

type Tab = "profile" | "password" | "usage" | "transactions";

export default function SettingsClient({ dict }: { dict?: Record<string, unknown> }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const { user, loading: authLoading, refresh } = useAuth();

  const [tab, setTab] = useState<Tab>("profile");

  const t = (dict as any)?.settings || {};
  const toolLabelMap: Record<string, string> = {
    "background-remover": "Background Remover",
    "watermark-remover": "Watermark Remover",
    "photo-restorer": "Photo Restorer",
    "avatar-generator": "Avatar Generator",
    "pdf-to-word": "PDF to Word",
    "image-upscaler": "Image Upscaler",
    "style-transfer": "Style Transfer",
    "text-polish": "Text Polish",
    "ai-image-generator": "AI Image Generator",
    "article-generator": "Article Generator",
    "text-to-speech": "Text to Speech",
    "image-description": "Image Describer",
    "colorizer": "B&W Colorizer",
    "object-remover": "Object Remover",
    "face-blur": "Face Blur",
  };

  // Profile
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  // Usage
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksTotal, setTasksTotal] = useState(0);

  // Transactions
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsTotal, setTransactionsTotal] = useState(0);

  // Redirect if not logged in
  if (!authLoading && !user) {
    router.push(`/${locale}/login`);
    return null;
  }

  // Auth guard
  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-zinc-500">{t.loading || "Loading..."}</p>
      </div>
    );
  }

  async function loadTasks(page: number) {
    setTasksLoading(true);
    try {
      const res = await authApi.getTasks(page, 20);
      setTasks(res.tasks);
      setTasksTotal(res.total);
      setTasksPage(page);
    } catch {
    } finally {
      setTasksLoading(false);
    }
  }

  async function loadTransactions(page: number) {
    setTransactionsLoading(true);
    try {
      const res = await authApi.getTransactions(page, 20);
      setTransactions(res.transactions);
      setTransactionsTotal(res.total);
      setTransactionsPage(page);
    } catch {
    } finally {
      setTransactionsLoading(false);
    }
  }

  // Load data when tab changes
  if (tab === "usage" && tasks.length === 0 && !tasksLoading) loadTasks(1);
  if (tab === "transactions" && transactions.length === 0 && !transactionsLoading) loadTransactions(1);

  async function handleProfileSave() {
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await authApi.updateProfile(
        profileName || undefined,
        profileEmail !== user?.email ? profileEmail : undefined,
      );
      setProfileMsg(t.profileUpdated || "Profile updated successfully");
      await refresh();
      if (res.email !== user?.email) {
        setProfileMsg(t.profileUpdatedVerify || "Profile updated. Check your email for verification.");
      }
    } catch (err) {
      setProfileMsg(err instanceof Error ? err.message : (t.updateFailed || "Update failed"));
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSave() {
    setPasswordSaving(true);
    setPasswordMsg("");
    if (newPassword !== confirmPassword) {
      setPasswordMsg(t.passwordsDontMatch || "Passwords don't match");
      setPasswordSaving(false);
      return;
    }
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setPasswordMsg(t.passwordUpdated || "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg(err instanceof Error ? err.message : (t.updateFailed || "Update failed"));
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleSendVerification() {
    try {
      await authApi.sendVerification();
      setProfileMsg(t.verificationSent || "Verification email sent");
    } catch (err) {
      setProfileMsg(err instanceof Error ? err.message : (t.verificationFailed || "Failed to send"));
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: t.profile || "Profile" },
    { key: "password", label: t.password || "Password" },
    { key: "usage", label: t.usageHistory || "Usage History" },
    { key: "transactions", label: t.transactions || "Transactions" },
  ];

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      completed: t.completed || "completed",
      failed: t.failed || "failed",
      processing: t.processing || "processing",
    };
    return map[s] || s;
  };

  const typeLabel = (tp: string) => {
    const map: Record<string, string> = {
      purchase: t.purchase || "purchase",
      deduction: t.deduction || "deduction",
    };
    return map[tp] || tp;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6" dir={locale === "ar" ? "rtl" : "ltr"}>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {t.title || "Account Settings"}
      </h1>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-zinc-200 pb-px dark:border-zinc-800">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === tabItem.key
                ? "border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="mt-6 space-y-4">
          {profileMsg && (
            <p className={`text-sm ${profileMsg.includes(t.profileUpdated?.[0] || "P") || profileMsg.includes(t.verificationSent?.[0] || "V") ? "text-green-600" : "text-red-600"}`}>
              {profileMsg}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.name || "Name"}</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              placeholder={t.namePlaceholder || "Your name"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.email || "Email"}</label>
            <div className="mt-1 flex gap-2">
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
                placeholder={t.emailPlaceholder || "you@example.com"}
              />
              {user?.email_verified ? (
                <span className="self-center text-xs text-green-600">{t.verified || "Verified"}</span>
              ) : (
                <button
                  onClick={handleSendVerification}
                  className="self-center text-xs text-blue-600 hover:text-blue-500 whitespace-nowrap"
                >
                  {t.verify || "Verify"}
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleProfileSave}
            disabled={profileSaving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            {profileSaving ? (t.saving || "Saving...") : (t.saveChanges || "Save Changes")}
          </button>
        </div>
      )}

      {/* Password Tab */}
      {tab === "password" && (
        <div className="mt-6 space-y-4">
          {passwordMsg && (
            <p className={`text-sm ${passwordMsg.includes(t.passwordUpdated?.[0] || "P") ? "text-green-600" : "text-red-600"}`}>
              {passwordMsg}
            </p>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.currentPassword || "Current Password"}</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              placeholder={t.passwordPlaceholder || "••••••••"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.newPassword || "New Password"}</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              placeholder={t.passwordPlaceholder || "••••••••"}
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.confirmNewPassword || "Confirm New Password"}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              placeholder={t.passwordPlaceholder || "••••••••"}
              minLength={6}
            />
          </div>
          <button
            onClick={handlePasswordSave}
            disabled={passwordSaving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            {passwordSaving ? (t.updating || "Updating...") : (t.updatePassword || "Update Password")}
          </button>
        </div>
      )}

      {/* Usage History Tab */}
      {tab === "usage" && (
        <div className="mt-6">
          {tasksLoading ? (
            <p className="text-sm text-zinc-500">{t.loading || "Loading..."}</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-zinc-500">{t.noUsageHistory || "No usage history yet."}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="py-2 text-left font-medium text-zinc-500">{t.tool || "Tool"}</th>
                      <th className="py-2 text-left font-medium text-zinc-500">{t.status || "Status"}</th>
                      <th className="py-2 text-right font-medium text-zinc-500">{t.credits || "Credits"}</th>
                      <th className="py-2 text-right font-medium text-zinc-500">{t.date || "Date"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-2">{toolLabelMap[task.tool_type] || task.tool_type}</td>
                        <td className="py-2">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : task.status === "failed"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {statusLabel(task.status)}
                          </span>
                        </td>
                        <td className="py-2 text-right">{task.credits_cost}</td>
                        <td className="py-2 text-right text-zinc-500">
                          {new Date(task.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : locale === "es" ? "es-ES" : "en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-zinc-500">
                  {tasksTotal} {t.total || "total"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadTasks(tasksPage - 1)}
                    disabled={tasksPage <= 1}
                    className="rounded border border-zinc-300 px-3 py-1 disabled:opacity-40 dark:border-zinc-700"
                  >
                    {t.prev || "Prev"}
                  </button>
                  <button
                    onClick={() => loadTasks(tasksPage + 1)}
                    disabled={tasksPage * 20 >= tasksTotal}
                    className="rounded border border-zinc-300 px-3 py-1 disabled:opacity-40 dark:border-zinc-700"
                  >
                    {t.next || "Next"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Transactions Tab */}
      {tab === "transactions" && (
        <div className="mt-6">
          {transactionsLoading ? (
            <p className="text-sm text-zinc-500">{t.loading || "Loading..."}</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-zinc-500">{t.noTransactions || "No transactions yet."}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="py-2 text-left font-medium text-zinc-500">{t.type || "Type"}</th>
                      <th className="py-2 text-right font-medium text-zinc-500">{t.amount || "Amount"}</th>
                      <th className="py-2 text-left font-medium text-zinc-500">{t.description || "Description"}</th>
                      <th className="py-2 text-right font-medium text-zinc-500">{t.date || "Date"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-2">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                              tx.type === "purchase"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {typeLabel(tx.type)}
                          </span>
                        </td>
                        <td className="py-2 text-right font-medium">
                          {tx.amount > 0 ? "+" : ""}{tx.amount} {t.credits || "credits"}
                        </td>
                        <td className="py-2 text-zinc-500">{tx.description || "—"}</td>
                        <td className="py-2 text-right text-zinc-500">
                          {new Date(tx.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : locale === "es" ? "es-ES" : "en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-zinc-500">{transactionsTotal} {t.total || "total"}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadTransactions(transactionsPage - 1)}
                    disabled={transactionsPage <= 1}
                    className="rounded border border-zinc-300 px-3 py-1 disabled:opacity-40 dark:border-zinc-700"
                  >
                    {t.prev || "Prev"}
                  </button>
                  <button
                    onClick={() => loadTransactions(transactionsPage + 1)}
                    disabled={transactionsPage * 20 >= transactionsTotal}
                    className="rounded border border-zinc-300 px-3 py-1 disabled:opacity-40 dark:border-zinc-700"
                  >
                    {t.next || "Next"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
