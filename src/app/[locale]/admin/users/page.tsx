"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { adminApi, type AdminUser } from "@/lib/api";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const size = 20;

  const fetchUsers = useCallback(() => {
    setLoading(true);
    adminApi
      .listUsers({ page, size, search: search || undefined, sort_by: sortBy, sort_order: sortOrder })
      .then((res) => {
        setUsers(res.users);
        setTotal(res.total);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalPages = Math.ceil(total / size);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const SortArrow = ({ col }: { col: string }) => {
    if (sortBy !== col) return <span className="text-gray-300 ml-1">↕</span>;
    return <span className="text-indigo-500 ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by email or name..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium
            hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setPage(1);
            }}
            className="px-3 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {/* User table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="text-left px-4 py-2.5 font-medium text-gray-500 cursor-pointer select-none"
                  onClick={() => handleSort("email")}
                >
                  Email <SortArrow col="email" />
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500 hidden sm:table-cell">Name</th>
                <th
                  className="text-left px-4 py-2.5 font-medium text-gray-500 cursor-pointer select-none"
                  onClick={() => handleSort("credits")}
                >
                  Credits <SortArrow col="credits" />
                </th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500 hidden md:table-cell">Role</th>
                <th className="text-left px-4 py-2.5 font-medium text-gray-500 hidden lg:table-cell">Verified</th>
                <th
                  className="text-left px-4 py-2.5 font-medium text-gray-500 cursor-pointer select-none hidden lg:table-cell"
                  onClick={() => handleSort("created_at")}
                >
                  Created <SortArrow col="created_at" />
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/users/${u.id}`)}
                  >
                    <td className="px-4 py-2.5 text-gray-800">{u.email}</td>
                    <td className="px-4 py-2.5 text-gray-500 hidden sm:table-cell">{u.name || "-"}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`font-medium ${u.credits > 0 ? "text-green-600" : "text-gray-400"}`}
                      >
                        {u.credits.toFixed(0)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 hidden md:table-cell">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 hidden lg:table-cell">
                      {u.email_verified ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-gray-300">✗</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              {total} total · Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40
                  hover:bg-gray-50 transition-colors"
              >
                Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-40
                  hover:bg-gray-50 transition-colors"
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
