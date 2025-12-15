import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useDeckDetail from './useDeckDetail';

const DeckDetail = () => {
  const { id } = useParams();
  const { deck, loading, error, refresh } = useDeckDetail(id);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const flashcards = deck?.flashcardsList || [];
  const current = flashcards[index] || null;

  const audioUrl = useMemo(() => {
    const list = deck?.mediaList || [];
    const audioItem = list.find(m => (m?.type || m?.mediaType)?.toString().toUpperCase() === 'AUDIO');
    return audioItem?.url || audioItem?.mediaUrl || null;
  }, [deck]);

  const playAudio = () => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(() => {});
  };

  const next = () => {
    setFlipped(false);
    setIndex((prev) => (prev + 1 < flashcards.length ? prev + 1 : prev));
  };

  const prev = () => {
    setFlipped(false);
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{deck?.title || `Deck #${id}`}</h1>
          {deck?.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-1">{deck.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-sm">
            {typeof deck?.isPublic === 'boolean' && (
              <span className={`px-2 py-1 rounded-full border ${deck.isPublic ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'}`}>
                {deck.isPublic ? 'Công khai' : 'Riêng tư'}
              </span>
            )}
            <span className="text-gray-500 dark:text-gray-400">
              {(typeof deck?.totalFlashcards === 'number' ? deck.totalFlashcards : (Array.isArray(deck?.flashcardsList) ? deck.flashcardsList.length : 0))} thẻ
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/flashcards" className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">Quay lại</Link>
          <button onClick={refresh} className="px-3 py-2 text-sm rounded-md bg-primary-600 hover:bg-primary-700 text-white">Làm mới</button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      ) : (
        <div>
          {current ? (
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <div className="p-6 md:p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{current.term}</h2>
                      {current.pronunciation && (
                        <p className="mt-2 text-base text-gray-500 dark:text-gray-400 italic">{current.pronunciation}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {audioUrl && (
                        <button onClick={playAudio} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM4 6h7v12H4a2 2 0 01-2-2V8a2 2 0 012-2z"/></svg>
                          Âm thanh
                        </button>
                      )}
                      <span className="text-xs px-2 py-1 rounded-full border bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800">Từ mới</span>
                    </div>
                  </div>

                  <div className="relative">
                    {!flipped ? (
                      <div className="text-lg text-gray-900 dark:text-white">
                        {(current.definition) || '—'}
                      </div>
                    ) : (
                      <div className="text-base text-gray-700 dark:text-gray-300 italic">
                        {(current.example) || '—'}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <button onClick={() => setFlipped((f) => !f)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 19A7 7 0 0019 5"/></svg>
                      Lật thẻ
                    </button>
                    <div className="flex items-center gap-3">
                      <button className="px-4 py-2 rounded-md border bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">Dễ</button>
                      <button className="px-4 py-2 rounded-md border bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">Trung bình</button>
                      <button className="px-4 py-2 rounded-md border bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">Khó</button>
                      <button className="px-4 py-2 rounded-md border bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800">Đã biết</button>
                    </div>
                  </div>
                </div>

                <div className="px-6 md:px-10 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <button onClick={prev} className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">Quay lại</button>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{index + 1} / {flashcards.length}</div>
                  <button onClick={next} className="px-3 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white">Tiếp theo</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Chưa có thẻ nào trong bộ này</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeckDetail;
