import { useCallback, useEffect, useState } from 'react';
import { getDeckById } from '../../service/decksService';

export default function useDeckDetail(id) {
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDeck = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await getDeckById(id);
      if (res?.code === 1000) {
        setDeck(res.result || null);
      } else if (res && !res.code) {
        setDeck(res);
      } else if (res?.data) {
        setDeck(res.data);
      } else {
        setError(res?.message || 'Không tải được bộ thẻ');
        setDeck(null);
      }
    } catch (e) {
      setError('Lỗi khi tải bộ thẻ');
      setDeck(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  return { deck, loading, error, refresh: fetchDeck };
}
