import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import useProfileHook from "./useProfileHook";

/* ─── helpers ─────────────────────────────────────────────── */
const fmtDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const fmtStatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  } catch {
    return dateStr;
  }
};

const Avatar = ({ name, avatarUrl, size = "lg" }) => {
  const sizeMap = {
    lg: "w-24 h-24 text-4xl",
    md: "w-12 h-12 text-xl",
  };
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      className={`${sizeMap[size]} rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg`}
    />
  ) : (
    <div
      className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold ring-4 ring-white dark:ring-gray-700 shadow-lg`}
    >
      {initial}
    </div>
  );
};

const StatCard = ({ icon, label, value, color = "blue" }) => {
  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-amber-600",
    purple: "from-purple-500 to-violet-600",
    pink: "from-pink-500 to-rose-600",
    teal: "from-teal-500 to-cyan-600",
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md border border-gray-100 dark:border-gray-700 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
};

const XpBar = ({ current, max, level }) => {
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Cấp độ hiện tại
          </p>
          <p className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text mt-1">
            Cấp {level ?? 1}
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {level ?? 1}
        </div>
      </div>
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>XP: {current ?? 0}</span>
          <span>Cần: {max ?? 0} XP</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-400 dark:text-gray-500 mt-1">
          {pct}%
        </p>
      </div>
    </div>
  );
};

/* ─── Custom Tooltip for Chart ──────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ─── Main Page ─────────────────────────────────────────────── */
const ProfilePage = () => {
  const {
    userInfo,
    gamification,
    studyStats,
    statsDays,
    loading,
    statsLoading,
    error,
    changeStatsDays,
  } = useProfileHook();

  // Prepare chart data
  const chartData = (studyStats || []).map((s) => ({
    date: fmtStatDate(s.date ?? s.studyDate),
    "Phút học": s.studyMinutes ?? s.totalStudyMinutes ?? 0,
    "Thẻ ôn": s.flashcardsStudied ?? s.flashcardsReviewed ?? 0,
    "Tài liệu": s.documentsRead ?? s.documentsViewed ?? 0,
  }));

  const dayOptions = [
    { label: "7 ngày", value: 7 },
    { label: "14 ngày", value: 14 },
    { label: "30 ngày", value: 30 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-600 mb-4" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">Đang tải hồ sơ…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl text-center max-w-md">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không thể tải hồ sơ</h2>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const fullName =
    [userInfo?.firstName, userInfo?.lastName].filter(Boolean).join(" ") ||
    userInfo?.username ||
    "Người dùng";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ── Profile Header ─────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <Avatar name={fullName} avatarUrl={userInfo?.avatarUrl ?? userInfo?.avatar} />
                <div className="mb-1">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{fullName}</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">@{userInfo?.username}</p>
                </div>
              </div>
              <span className="self-end sm:self-auto mb-1 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-primary-500 to-purple-500 text-white shadow">
                {userInfo?.roles?.[0]?.name ?? userInfo?.role?.name ?? "USER"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-300">
              {userInfo?.email && (
                <div className="flex items-center gap-2">
                  <span className="text-primary-500">✉️</span>
                  <span className="truncate">{userInfo.email}</span>
                </div>
              )}
              {userInfo?.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-green-500">📞</span>
                  <span>{userInfo.phone}</span>
                </div>
              )}
              {userInfo?.dob && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-500">🎂</span>
                  <span>{fmtDate(userInfo.dob)}</span>
                </div>
              )}
              {userInfo?.createdAt && (
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">📅</span>
                  <span>Tham gia: {fmtDate(userInfo.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Gamification ───────────────────────────────── */}
        {gamification && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🏆 Thành tích &amp; Gamification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* XP Bar */}
              <div className="md:col-span-1">
                <XpBar
                  current={gamification.currentXp ?? gamification.xp ?? gamification.points ?? 0}
                  max={gamification.xpToNextLevel ?? gamification.nextLevelXp ?? 100}
                  level={gamification.level ?? gamification.currentLevel}
                />
              </div>

              {/* Stat cards */}
              <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard
                  icon="🔥"
                  label="Streak"
                  value={`${gamification.streakDays ?? gamification.currentStreak ?? 0} ngày`}
                  color="orange"
                />
                <StatCard
                  icon="📅"
                  label="Ngày học"
                  value={`${gamification.totalStudyDays ?? gamification.studyDays ?? 0}`}
                  color="blue"
                />
                <StatCard
                  icon="⏱️"
                  label="Tổng thời gian"
                  value={`${gamification.totalStudyMinutes ?? gamification.studyMinutes ?? 0} phút`}
                  color="teal"
                />
                <StatCard
                  icon="🃏"
                  label="Thẻ đã học"
                  value={gamification.totalFlashcardsStudied ?? gamification.flashcardsStudied ?? 0}
                  color="purple"
                />
                <StatCard
                  icon="📄"
                  label="Tài liệu đọc"
                  value={gamification.totalDocumentsRead ?? gamification.documentsRead ?? 0}
                  color="green"
                />
                <StatCard
                  icon="✏️"
                  label="Bài thi"
                  value={gamification.totalExamsTaken ?? gamification.examsTaken ?? 0}
                  color="pink"
                />
              </div>
            </div>

            {/* Badges */}
            {Array.isArray(gamification.badges) && gamification.badges.length > 0 && (
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">🎖️ Huy hiệu</h3>
                <div className="flex flex-wrap gap-3">
                  {gamification.badges.map((badge, i) => (
                    <div
                      key={badge.id ?? i}
                      title={badge.description}
                      className="flex flex-col items-center gap-1 p-3 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700 min-w-[70px]"
                    >
                      <span className="text-2xl">{badge.icon ?? "🏅"}</span>
                      <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 text-center leading-tight">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Study Stats Chart ───────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              📊 Thống kê học tập
            </h2>
            <div className="flex gap-2">
              {dayOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => changeStatsDays(opt.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    statsDays === opt.value
                      ? "bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
            {statsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <span className="text-5xl mb-3">📭</span>
                <p className="font-medium">Chưa có dữ liệu học tập trong {statsDays} ngày qua</p>
              </div>
            ) : (
              <>
                {/* Area chart – study minutes */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Phút học mỗi ngày
                  </p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="Phút học"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#studyGrad)"
                        dot={{ r: 3, fill: "#6366f1" }}
                        activeDot={{ r: 5 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Bar chart – flashcards + documents */}
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                    Hoạt động khác
                  </p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="Thẻ ôn" fill="#a855f7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Tài liệu" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
