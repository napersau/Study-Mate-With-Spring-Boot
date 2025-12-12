import { useState, useEffect } from 'react';
import { createFlashcard, getAllFlashcards, updateFlashcard, deleteFlashcard } from '../../service/flashcardsService';

const useFlashcardsAdminHook = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [flashcardForm, setFlashcardForm] = useState({
    term: '',
    definition: '',
    pronunciation: '',
    example: '',
    mediaList: []
  });
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  
  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    setLoading(true);
    
    try {
      const response = await getAllFlashcards();
      console.log(response)
      if (response.code === 1000) {
        setFlashcards(response.result || []);
      }
    } catch (error) {
      showNotification('Lỗi khi tải danh sách flashcard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    setUploadingMedia(true);
    
    try {
      // TODO: Upload media files và lấy URLs
      const flashcardData = {
        ...flashcardForm,
      };
      
      const response = await createFlashcard(flashcardData);
      if (response.code === 1000) {
        showNotification('Tạo flashcard thành công', 'success');
        setShowModal(false);
        resetForm();
        fetchFlashcards();
      }
    } catch (error) {
      showNotification('Lỗi khi tạo flashcard: ' + (error.message || ''), 'error');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleUpdateFlashcard = async (e) => {
    e.preventDefault();
    setUploadingMedia(true);
    
    try {
      const flashcardData = {
        ...flashcardForm,
        id: editingFlashcard.id,
      };
      
      const response = await updateFlashcard(editingFlashcard.id, flashcardData);
      if (response.code === 1000) {
        showNotification('Cập nhật flashcard thành công', 'success');
        setShowModal(false);
        setEditingFlashcard(null);
        resetForm();
        fetchFlashcards();
      }
    } catch (error) {
      showNotification('Lỗi khi cập nhật flashcard: ' + (error.message || ''), 'error');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteFlashcard = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa flashcard này?')) {
      try {
        const response = await deleteFlashcard(id);
        if (response.code === 1000) {
          showNotification('Xóa flashcard thành công', 'success');
          fetchFlashcards();
        }
      } catch (error) {
        showNotification('Lỗi khi xóa flashcard', 'error');
      }
    }
  };

  const openEditModal = (flashcard) => {
    setEditingFlashcard(flashcard);
    setFlashcardForm({
      term: flashcard.term || '',
      definition: flashcard.definition || '',
      pronunciation: flashcard.pronunciation || '',
      example: flashcard.example || '',
      mediaList: flashcard.mediaList || []
    });
    setSelectedImage(null);
    setSelectedAudio(null);
    setShowModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFlashcard(null);
    resetForm();
  };

  const resetForm = () => {
    setFlashcardForm({ 
      term: '', 
      definition: '', 
      pronunciation: '', 
      example: '', 
      mediaList: [] 
    });
    setEditingFlashcard(null);
    setSelectedImage(null);
    setSelectedAudio(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Kích thước ảnh không được vượt quá 5MB', 'error');
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showNotification('Kích thước âm thanh không được vượt quá 10MB', 'error');
        return;
      }
      setSelectedAudio(file);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const updateFormField = (field, value) => {
    setFlashcardForm({ ...flashcardForm, [field]: value });
  };

  return {
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
  };
};

export default useFlashcardsAdminHook;
