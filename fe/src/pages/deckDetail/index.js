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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{deck?.title || `Deck #${id}`}</h1>
            {deck?.description && (
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">{deck.description}</p>
            )}
            <div className="mt-3 flex items-center gap-3 text-sm">
              {typeof deck?.isPublic === 'boolean' && (
                <span className={`px-3 py-1.5 rounded-full font-medium ${deck.isPublic ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                  {deck.isPublic ? '🌍 Công khai' : '🔒 Riêng tư'}
                </span>
              )}
              <span className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium">
                📚 {(typeof deck?.totalFlashcards === 'number' ? deck.totalFlashcards : (Array.isArray(deck?.flashcardsList) ? deck.flashcardsList.length : 0))} thẻ
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/flashcards" className="px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200 dark:border-gray-700 transition-all">← Quay lại</Link>
            <button onClick={refresh} className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg transition-all">🔄 Làm mới</button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-xl shadow-md">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">⏳ Đang tải...</p>
          </div>
      ) : (
        <div>
          {current ? (
            <div className="max-w-4xl mx-auto">
              <div className="flip-card">
                <div className={`flip-card-inner ${flipped ? 'flipped' : ''} rounded-3xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700`}>
                  <div className="flip-card-front relative p-8 md:p-12 flex flex-col items-center justify-center cursor-pointer min-h-[450px]" onClick={() => setFlipped(true)}>
                    <span className="absolute top-6 right-6 text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow-lg">Từ mới</span>
                    
                    <div className="text-center space-y-6">
                      <h2 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white">{current.term}</h2>
                      
                      {current.pronunciation && (
                        <div className="text-2xl text-gray-500 dark:text-gray-400">
                          (adj.) / {current.pronunciation}/
                        </div>
                      )}
                      
                      {audioUrl && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); playAudio(); }} 
                          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>

                  <div className="flip-card-back absolute inset-0 p-6 md:p-8 flex flex-col min-h-[450px]">
                    <span className="absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold shadow-lg">Từ mới</span>
                    
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">{current.term}</h2>

                    <div className="flex-1 space-y-3 cursor-pointer overflow-y-auto pr-2" onClick={() => setFlipped(false)}>
                      <div className="bg-gray-700/50 dark:bg-gray-700/80 rounded-xl p-4 border-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
                        <div className="text-xs font-semibold text-purple-400 mb-2">📚 Nghĩa</div>
                        <p className="text-sm text-white leading-relaxed whitespace-pre-line">
                          {current.definition || '—'}
                        </p>
                      </div>
                      
                      <div className="bg-gray-700/50 dark:bg-gray-700/80 rounded-xl p-4 border-2 border-pink-500/30 hover:border-pink-500/50 transition-colors">
                        <div className="text-xs font-semibold text-pink-400 mb-2">📝 Ví dụ</div>
                        <p className="text-sm text-gray-200 italic leading-relaxed whitespace-pre-line">
                          {current.example || '—'}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 text-center pt-1">👆 Bấm để lật lại</p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      <button className="px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium shadow-lg transition-all">😊 Dễ</button>
                      <button className="px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium shadow-lg transition-all">🤔 TB</button>
                      <button className="px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-xs font-medium shadow-lg transition-all">😰 Khó</button>
                      <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-lg transition-all">✅ Biết</button>
                    </div>
                  </div>
                </div>

                <div className="px-8 md:px-12 py-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-3xl flex items-center justify-between">
                  <button onClick={prev} disabled={index === 0} className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all">← Trước</button>
                  <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold shadow-md">{index + 1} / {flashcards.length}</div>
                  <button onClick={next} disabled={index === flashcards.length - 1} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">Tiếp →</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">Chưa có thẻ nào trong bộ này</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default DeckDetail;
