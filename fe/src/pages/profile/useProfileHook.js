import { useState, useEffect, useCallback } from "react";
import { getMyInfo } from "../../service/userService";
import { getUserGamification, getStudyStats } from "../../service/analyticsService";

const useProfileHook = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [gamification, setGamification] = useState(null);
  const [studyStats, setStudyStats] = useState([]);
  const [statsDays, setStatsDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user info + gamification on mount
  useEffect(() => {
    const fetchCore = async () => {
      setLoading(true);
      setError(null);
      try {
        const [infoRes, gamRes] = await Promise.all([
          getMyInfo(),
          getUserGamification(),
        ]);
        setUserInfo(infoRes?.result ?? infoRes);
        setGamification(gamRes);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchCore();
  }, []);

  // Fetch study stats whenever statsDays changes
  const fetchStudyStats = useCallback(async (days) => {
    setStatsLoading(true);
    try {
      const data = await getStudyStats(days);
      setStudyStats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Study stats fetch error:", err);
      setStudyStats([]);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudyStats(statsDays);
  }, [statsDays, fetchStudyStats]);

  const changeStatsDays = (days) => {
    setStatsDays(days);
  };

  return {
    userInfo,
    gamification,
    studyStats,
    statsDays,
    loading,
    statsLoading,
    error,
    changeStatsDays,
    refreshStats: () => fetchStudyStats(statsDays),
  };
};

export default useProfileHook;
