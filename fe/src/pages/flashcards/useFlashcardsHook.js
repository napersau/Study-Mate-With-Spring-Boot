import { useCallback, useEffect, useState } from 'react';
import { getAllDecks } from '../../service/decksService';

// Hook: fetch decks (DecksResponse[]) and expose state + refresh
export default function useFlashcardsHook() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDecks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllDecks();
      // Accept both wrapped { code, result } and raw arrays
      if (res?.code === 1000) {
        setDecks(Array.isArray(res.result) ? res.result : []);
      } else if (Array.isArray(res)) {
        setDecks(res);
      } else if (Array.isArray(res?.data)) {
        setDecks(res.data);
      } else {
        setError(res?.message || 'Không tải được danh sách bộ thẻ');
        setDecks([]);
      }
    } catch (e) {
      setError('Lỗi khi tải danh sách bộ thẻ');
      setDecks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  return { decks, loading, error, refresh: fetchDecks };
}
