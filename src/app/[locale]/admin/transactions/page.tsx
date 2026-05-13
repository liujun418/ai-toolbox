"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminApi, type AdminTransaction } from "@/lib/api";

export default function AdminTransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterType, setFilterType] = useState("");
  const [filterUserId, setFilterUserId] = useState("");
  const size = 20;

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    adminApi
      .listTransactions({
        page,
        size,
        type: filterType || undefined,
        user_id: filterUserId || undefined,
      })
      .then((res) => {
        setTransactions(res.transactions);
        setTotal(res.total);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [page, filterType, filterUserId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const totalPages = Math.ceil(total / size);

  const clearFilters = () => {
    setFilterType("");
    setFilterUserId("");
    setPage(1);
  };

  const hasFilters = filterType || filterUserId;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Type</label>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          >
            <option value="">All</option>
            <option value="purchase">Purchase</option>
            <option value="deduction">Deduction</option>
            <option value="refund">Refund</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">User</label>
          <input
            type="text"
            placeholder="User ID"
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={filterUserId}
            onChange={(e) => { setFilterUserId(e.target.value); setPage(1); }}
          />
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {/* Transaction table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500">ID</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500">User</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500">Type</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500 hidden md:table-cell">Description</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500 hidden lg:table-cell">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No transactions found</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/users/${t.user_id}`)}
                  >
                    <td className="px-4 py-2.5 text-gray-400 text-xs font-mono">{t.id.slice(0, 8)}</td>
                    <td className="px-4 py-2.5 text-gray-700">{t.user_email}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        t.type === "purchase" ? "bg-green-100 text-green-700"
                        : t.type === "deduction" ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>{t.type}</span>
                    </td>
                    <td className={`px-4 py-2.5 font-medium ${
                      t.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {t.amount > 0 ? "+" : ""}{t.amount.toFixed(0)}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs truncate max-w-[200px] hidden md:table-cell">
                      {t.description || "-"}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span className="text-xs text-gray-500">{total} total · Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
