import React from 'react';
import { Link } from 'react-router-dom';
import useFlashcardsHook from './useFlashcardsHook';

const Flashcards = () => {
  const { decks, loading, error, refresh } = useFlashcardsHook();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">📚 Bộ thẻ của tôi</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Khám phá và học tập với flashcards</p>
          </div>
          <button
            onClick={refresh}
            className="px-5 py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg transition-all transform hover:scale-105"
          >
            🔄 Làm mới
          </button>
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
          decks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">Chưa có bộ thẻ nào</p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">Tạo bộ thẻ đầu tiên để bắt đầu học!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.map((deck) => (
                <Link to={`/decks/${deck.id}`} key={deck.id} className="group block rounded-2xl bg-white dark:bg-gray-800 overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                  <div className="h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                          {deck.title || `Deck #${deck.id}`}
                        </h2>
                        {deck.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-2">{deck.description}</p>
                        )}
                      </div>
                      {typeof deck.isPublic === 'boolean' && (
                        <span className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap ml-2 ${deck.isPublic ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'}`}>
                          {deck.isPublic ? '🌍 Công khai' : '🔒 Riêng tư'}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                          <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                        </div>
                        <span>{(typeof deck.totalFlashcards === 'number' ? deck.totalFlashcards : (Array.isArray(deck.flashcardsList) ? deck.flashcardsList.length : 0))} thẻ</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-2 transition-all">
                        Học ngay 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Flashcards;
