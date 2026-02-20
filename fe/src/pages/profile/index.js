import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import useProfileHook from "./useProfileHook";

/* ─── Helpers ─────────────────────────────────────────────────────── */
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

const fmtDuration = (seconds) => {
  if (!seconds || seconds <= 0) return "0 giây";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0 && m > 0) return `${h}g ${m}ph`;
  if (h > 0) return `${h}g`;
  if (m > 0 && s > 0) return `${m}ph ${s}g`;
  if (m > 0) return `${m}ph`;
  return `${s} giây`;
};

const localDateStr = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

/* ─── Avatar ──────────────────────────────────────────────────────── */
const Avatar = ({ name, avatarUrl }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return avatarUrl ? (
    <img
      src={avatarUrl}
      alt={name}
      className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg"
    />
  ) : (
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white dark:ring-gray-700 shadow-lg">
      {initial}
    </div>
  );
};

/* ─── Stat Card ───────────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-2xl flex-shrink-0 shadow-sm`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{label}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5 truncate">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{sub}</p>}
    </div>
  </div>
);

/* ─── Custom Bar Tooltip ──────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const minutes = payload[0].value;
  const secs = Math.round(minutes * 60);
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
      {secs > 0 ? (
        <p className="text-blue-600 dark:text-blue-400 font-bold">⏱ {fmtDuration(secs)}</p>
      ) : (
        <p className="text-gray-400 dark:text-gray-500">Chưa có phiên học</p>
      )}
    </div>
  );
};

/* ─── Study Time Bar Chart ────────────────────────────────────────── */
const StudyTimeChart = ({ stats, statsDays, onChangeDays }) => {
  const todayStr = localDateStr();

  const dayOptions = [
    { label: "7 ngày",  value: 7  },
    { label: "14 ngày", value: 14 },
    { label: "30 ngày", value: 30 },
  ];

  // Prepare chart data – convert seconds → minutes (float) for finer scale
  const chartData = stats.map((s) => {
    const dateLabel = s.date
      ? new Date(s.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
      : "—";
    const mins = s.durationSeconds ? +(s.durationSeconds / 60).toFixed(1) : 0;
    const isToday = s.date && (s.date === todayStr || s.date.startsWith(todayStr));
    return { date: dateLabel, minutes: mins, isToday, hasLearned: s.hasLearned ?? false };
  });

  const totalSeconds = stats.reduce((a, s) => a + (s.durationSeconds ?? 0), 0);
  const learnedDays  = stats.filter((s) => s.hasLearned).length;
  const todayEntry   = stats.find((s) => s.date && (s.date === todayStr || s.date.startsWith(todayStr)));
  const todaySec     = todayEntry?.durationSeconds ?? 0;
  const hasDuration  = totalSeconds > 0;

  // Y-axis formatter
  const yTickFmt = (v) => (v === 0 ? "0" : v >= 60 ? `${Math.floor(v / 60)}g` : `${v}ph`);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Thời gian học theo ngày</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Học <span className="font-semibold text-green-600 dark:text-green-400">{learnedDays}/{statsDays}</span> ngày
            {hasDuration && (
              <>
                {" · Tổng "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">{fmtDuration(totalSeconds)}</span>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {dayOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChangeDays(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statsDays === opt.value
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Today callout */}
      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-2.5 mb-5">
        <span className="text-lg">🕐</span>
        <span className="text-sm text-gray-700 dark:text-gray-200">
          <span className="font-semibold">Hôm nay —{" "}</span>
          {hasDuration
            ? todaySec > 0
              ? <span className="text-blue-600 dark:text-blue-400 font-bold">Đã học {fmtDuration(todaySec)}</span>
              : <span className="text-gray-400">Chưa có phiên học nào</span>
            : <span className="text-gray-400">Chưa ghi nhận thời gian học</span>
          }
        </span>
        {todaySec > 0 && <span className="ml-auto">✅</span>}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
          barCategoryGap={statsDays > 14 ? "15%" : "25%"}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            interval={statsDays > 14 ? Math.ceil(statsDays / 10) - 1 : 0}
          />
          <YAxis
            tickFormatter={yTickFmt}
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
          <Bar dataKey="minutes" radius={[5, 5, 0, 0]} maxBarSize={36} minPointSize={2}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.isToday
                    ? "#3b82f6"          // blue – today
                    : entry.minutes >= 60
                    ? "#10b981"          // emerald – ≥1h
                    : entry.minutes >= 30
                    ? "#34d399"          // green – 30–60 ph
                    : entry.minutes >= 10
                    ? "#6ee7b7"          // light-green – 10–30 ph
                    : entry.minutes > 0
                    ? "#a7f3d0"          // pale-green – < 10 ph
                    : "#e5e7eb"          // gray – no study
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-xs text-gray-500 dark:text-gray-400">
        {[
          { color: "bg-gray-200 dark:bg-gray-600",  label: "Không học"  },
          { color: "bg-[#a7f3d0]",                   label: "< 10ph"    },
          { color: "bg-[#6ee7b7]",                   label: "10–30ph"   },
          { color: "bg-[#34d399]",                   label: "30–60ph"   },
          { color: "bg-[#10b981]",                   label: "≥ 1 giờ"   },
          { color: "bg-blue-500",                    label: "Hôm nay"   },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────────── */
const ProfilePage = () => {
  const {
    userInfo,
    gamification,
    studyStats,
    statsDays,
    totalStudiedDays,
    loading,
    statsLoading,
    error,
    changeStatsDays,
  } = useProfileHook();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 mb-4" />
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Đang tải hồ sơ…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
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

  const todayStr2  = localDateStr();
  const todayEntry2 = studyStats.find((s) => s.date && (s.date === todayStr2 || s.date.startsWith(todayStr2)));
  const todaySec2  = todayEntry2?.durationSeconds ?? 0;
  const totalSec2  = studyStats.reduce((a, s) => a + (s.durationSeconds ?? 0), 0);
  const hasDur     = totalSec2 > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* ── Profile Header ─────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
              <div className="flex items-end gap-4">
                <Avatar name={fullName} avatarUrl={userInfo?.avatarUrl ?? userInfo?.avatar} />
                <div className="mb-1">
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{fullName}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{userInfo?.username}</p>
                </div>
              </div>
              <span className="self-end sm:self-auto mb-1 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow">
                {userInfo?.roles?.[0]?.name ?? userInfo?.role?.name ?? "USER"}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
              {userInfo?.email && (
                <span className="flex items-center gap-1.5"><span>✉️</span>{userInfo.email}</span>
              )}
              {userInfo?.phone && (
                <span className="flex items-center gap-1.5"><span>📞</span>{userInfo.phone}</span>
              )}
              {userInfo?.dob && (
                <span className="flex items-center gap-1.5"><span>🎂</span>{fmtDate(userInfo.dob)}</span>
              )}
              {userInfo?.createdAt && (
                <span className="flex items-center gap-1.5"><span>📅</span>Tham gia: {fmtDate(userInfo.createdAt)}</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats Cards ────────────────────────────────── */}
        {gamification && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              🏆 Thành tích học tập
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatCard
                icon={gamification.isLearnedToday ? "✅" : "📖"}
                label="Trạng thái hôm nay"
                value={ "Đã học"}
                sub={gamification.lastLearnDate ? `Gần nhất: ${fmtDate(gamification.lastLearnDate)}` : "—"}
                color={gamification.isLearnedToday ? "bg-green-100 dark:bg-green-900/40" : "bg-gray-100 dark:bg-gray-700"}
              />
              <StatCard
                icon="🔥"
                label="Streak hiện tại"
                value={`${gamification.currentStreak ?? 0} ngày`}
                sub="Chuỗi học liên tiếp"
                color="bg-orange-100 dark:bg-orange-900/40"
              />
              <StatCard
                icon="🏅"
                label="Streak dài nhất"
                value={`${gamification.longestStreak ?? 0} ngày`}
                sub="Kỷ lục cá nhân"
                color="bg-purple-100 dark:bg-purple-900/40"
              />
              <StatCard
                icon="📅"
                label="Ngày học"
                value={`${totalStudiedDays}/${statsDays}`}
                sub={`Trong ${statsDays} ngày gần nhất`}
                color="bg-teal-100 dark:bg-teal-900/40"
              />
              <StatCard
                icon="⏱"
                label="Hôm nay học"
                value={hasDur ? fmtDuration(todaySec2) : "—"}
                sub={todaySec2 > 0 ? "Thời gian hôm nay" : "Chưa có phiên học"}
                color={todaySec2 > 0 ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-100 dark:bg-gray-700"}
              />
              <StatCard
                icon="🕰"
                label={`Tổng ${statsDays} ngày`}
                value={hasDur ? fmtDuration(totalSec2) : "—"}
                sub="Thời gian học tích lũy"
                color="bg-pink-100 dark:bg-pink-900/40"
              />
            </div>
          </section>
        )}

        {/* ── Study Time Chart ───────────────────────────── */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            📊 Biểu đồ thời gian học
          </h2>
          {statsLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600" />
            </div>
          ) : studyStats.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <span className="text-5xl mb-3">📭</span>
              <p className="font-medium">Chưa có dữ liệu học tập</p>
            </div>
          ) : (
            <StudyTimeChart
              stats={studyStats}
              statsDays={statsDays}
              onChangeDays={changeStatsDays}
            />
          )}
        </section>

      </div>
    </div>
  );
};

export default ProfilePage;