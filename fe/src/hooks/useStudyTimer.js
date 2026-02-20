import { useEffect, useRef, useCallback } from 'react';
import { recordStudyTime } from '../service/analyticsService';
import { getToken } from '../service/localStorageService';
import { CONFIG } from '../config/configuration';

/** Bỏ qua phiên học dưới 5 giây (tránh ghi nhận vô tình) */
const MIN_STUDY_SECONDS = 5;

/**
 * useStudyTimer
 *
 * Hook theo dõi thời gian học và gửi lên backend khi người dùng rời trang.
 *
 * Cách hoạt động:
 *  - Bắt đầu tính giờ ngay khi component mount.
 *  - Khi component unmount (chuyển trang), tự động gửi số giây đã học.
 *  - Khi đóng/làm mới tab trình duyệt, dùng fetch keepalive để đảm bảo request được gửi.
 *  - Dùng `submittedRef` để tránh ghi nhận 2 lần.
 *
 * @returns {{ stopAndSubmit: () => Promise<void> }}
 *   stopAndSubmit – gọi thủ công trước một sự kiện nào đó (VD: nộp bài thi)
 *   để submit ngay lập tức, tránh submit lần 2 lúc unmount.
 *
 * @example
 * // Trong trang học bình thường (tự động submit khi rời trang)
 * function DocumentDetail() {
 *   useStudyTimer();
 *   // ...
 * }
 *
 * @example
 * // Trong trang thi (submit thủ công khi nộp bài)
 * function ExamDetail() {
 *   const { stopAndSubmit } = useStudyTimer();
 *
 *   const handleSubmitExam = async () => {
 *     await stopAndSubmit();
 *     setShowResults(true);
 *   };
 * }
 */
export default function useStudyTimer() {
  const startTimeRef = useRef(null);
  const submittedRef = useRef(false);

  /**
   * Tính số giây đã học và gọi API recordStudyTime.
   * Hàm này an toàn khi gọi nhiều lần – chỉ thực sự gửi 1 lần.
   */
  const submit = useCallback(async () => {
    if (submittedRef.current || !startTimeRef.current) return;
    submittedRef.current = true;

    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    if (elapsed < MIN_STUDY_SECONDS) return;

    try {
      await recordStudyTime(elapsed);
    } catch (e) {
      console.error('[useStudyTimer] Không thể lưu thời gian học:', e);
    }
  }, []);

  useEffect(() => {
    // Khởi động lại mỗi khi hook được kích hoạt
    startTimeRef.current = Date.now();
    submittedRef.current = false;

    /**
     * Xử lý đóng tab / làm mới trang.
     * Dùng fetch với keepalive: true vì axios bị huỷ trong quá trình unload.
     */
    const handleBeforeUnload = () => {
      if (submittedRef.current || !startTimeRef.current) return;
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (elapsed < MIN_STUDY_SECONDS) return;

      const token = getToken();
      if (!token) return;

      submittedRef.current = true;

      fetch(`${CONFIG.API_GATEWAY}/analytics/study-time`, {
        method: 'POST',
        keepalive: true, // Giữ request sống kể cả khi trang đang đóng
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ seconds: elapsed }),
      }).catch(() => {});
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Gửi thời gian học khi component unmount (điều hướng sang trang khác)
      submit();
    };
  }, [submit]);

  return { stopAndSubmit: submit };
}
