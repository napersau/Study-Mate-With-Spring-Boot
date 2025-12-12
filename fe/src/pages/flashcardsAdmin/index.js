import React from 'react';
import useFlashcardsAdminHook from './useFlashcardsAdminHook';

const FlashcardsAdmin = () => {
  const {
    flashcards,
    loading,
    showModal,
    editingFlashcard,
    flashcardForm,
    uploadingMedia,
    selectedImage,
    selectedAudio,
    notification,
    updateFormField,
    handleCreateFlashcard,
    handleUpdateFlashcard,
    handleDeleteFlashcard,
    openEditModal,
    openCreateModal,
    closeModal,
    handleImageChange,
    handleAudioChange
  } = useFlashcardsAdminHook();

  return (
    <div>
      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-4 rounded-lg ${
          notification.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
        } animate-fade-in`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Add Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Danh sách Flashcards
          </h2>
          <button
            onClick={openCreateModal}
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Thêm Flashcard</span>
          </button>
        </div>

        {/* Flashcards Grid */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((flashcard) => (
              <div key={flashcard.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow">
                {/* Term */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {flashcard.term}
                  </h3>
                  {flashcard.pronunciation && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      {flashcard.pronunciation}
                    </p>
                  )}
                </div>

                {/* Definition */}
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Định nghĩa:</h4>
                  <p className="text-sm text-gray-900 dark:text-white">{flashcard.definition}</p>
                </div>

                {/* Example */}
                {flashcard.example && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Ví dụ:</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">{flashcard.example}</p>
                  </div>
                )}

                {/* Media */}
                {flashcard.mediaList && flashcard.mediaList.length > 0 && (
                  <div className="mb-3 flex gap-2">
                    {flashcard.mediaList.some(m => m.type === 'IMAGE') && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Ảnh
                      </span>
                    )}
                    {flashcard.mediaList.some(m => m.type === 'AUDIO') && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        Âm thanh
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => openEditModal(flashcard)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteFlashcard(flashcard.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && flashcards.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Chưa có flashcard nào. Hãy thêm flashcard mới!
          </div>
        )}
      </div>

      {/* Flashcard Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 animate-fade-in my-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingFlashcard ? 'Chỉnh sửa Flashcard' : 'Thêm Flashcard Mới'}
            </h3>
            <form onSubmit={editingFlashcard ? handleUpdateFlashcard : handleCreateFlashcard} className="space-y-4">
              {/* Term Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thuật ngữ (Term) *
                </label>
                <input
                  type="text"
                  value={flashcardForm.term}
                  onChange={(e) => updateFormField('term', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  placeholder="Ví dụ: Hello"
                />
              </div>

              {/* Definition Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Định nghĩa (Definition) *
                </label>
                <textarea
                  value={flashcardForm.definition}
                  onChange={(e) => updateFormField('definition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="3"
                  required
                  placeholder="Ví dụ: Xin chào, lời chào thân thiện"
                />
              </div>

              {/* Pronunciation Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phát âm (Pronunciation)
                </label>
                <input
                  type="text"
                  value={flashcardForm.pronunciation}
                  onChange={(e) => updateFormField('pronunciation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ví dụ: /həˈloʊ/"
                />
              </div>

              {/* Example Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ví dụ (Example)
                </label>
                <textarea
                  value={flashcardForm.example}
                  onChange={(e) => updateFormField('example', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="2"
                  placeholder="Ví dụ: Hello, how are you today?"
                />
              </div>

              {/* Media Upload Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Media (Ảnh & Âm thanh)
                </h4>
                
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ảnh minh họa
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {selectedImage && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      ✓ Đã chọn: {selectedImage.name}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Tối đa 5MB. Định dạng: JPG, PNG, GIF
                  </p>
                </div>

                {/* Audio Upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    File âm thanh
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {selectedAudio && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      ✓ Đã chọn: {selectedAudio.name}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Tối đa 10MB. Định dạng: MP3, WAV, OGG
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={uploadingMedia}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                  disabled={uploadingMedia}
                >
                  {uploadingMedia ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>{editingFlashcard ? 'Cập nhật' : 'Thêm mới'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsAdmin;
