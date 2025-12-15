import React from 'react';
import { Link } from 'react-router-dom';
import useFlashcardsHook from './useFlashcardsHook';

const Flashcards = () => {
  const { decks, loading, error, refresh } = useFlashcardsHook();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bộ thẻ (Decks)</h1>
        <button
          onClick={refresh}
          className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        >
          Làm mới
        </button>
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
        decks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Chưa có bộ thẻ nào</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <Link to={`/decks/${deck.id}`} key={deck.id} className="group block rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {deck.title || `Deck #${deck.id}`}
                      </h2>
                      {deck.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{deck.description}</p>
                      )}
                    </div>
                    {typeof deck.isPublic === 'boolean' && (
                      <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${deck.isPublic ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'}`}>
                        {deck.isPublic ? 'Từ mới' : 'Riêng tư'}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
                        {(typeof deck.totalFlashcards === 'number' ? deck.totalFlashcards : (Array.isArray(deck.flashcardsList) ? deck.flashcardsList.length : 0))} thẻ
                      </span>
                    </div>
                    <span className="text-primary-600 dark:text-primary-400 text-sm">Học ngay →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Flashcards;
