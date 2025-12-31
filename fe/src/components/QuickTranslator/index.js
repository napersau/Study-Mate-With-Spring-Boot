import React, { useState, useEffect, useRef } from 'react';
import { Languages, X, Loader } from 'lucide-react';
import aiService from '../../service/aiService';

const QuickTranslator = ({ children }) => {
    const [selectedText, setSelectedText] = useState('');
    const [translation, setTranslation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [showButton, setShowButton] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const popupRef = useRef(null);

    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text.length > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();

                setSelectedText(text);
                setButtonPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10
                });
                setShowButton(true);
                setShowPopup(false);
                setTranslation('');
            } else {
                setShowButton(false);
                setShowPopup(false);
            }
        };

        document.addEventListener('mouseup', handleSelection);
        document.addEventListener('touchend', handleSelection);

        return () => {
            document.removeEventListener('mouseup', handleSelection);
            document.removeEventListener('touchend', handleSelection);
        };
    }, []);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
                setShowButton(false);
                window.getSelection().removeAllRanges();
            }
        };

        if (showPopup || showButton) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup, showButton]);

    const handleTranslate = async () => {
        if (!selectedText) return;

        setIsLoading(true);
        setShowButton(false);
        setShowPopup(true);
        
        // Position popup near the button
        setPopupPosition({
            x: buttonPosition.x,
            y: buttonPosition.y
        });

        try {
            console.log('Translating text:', selectedText);
            const response = await aiService.translateText(selectedText);
            console.log('Translation response:', response);
            setTranslation(response.result || 'Không thể dịch văn bản này.');
        } catch (error) {
            console.error('Error translating:', error);
            console.error('Error details:', error.response || error.message);
            setTranslation(`Lỗi: ${error.response?.data?.message || error.message || 'Không thể kết nối với AI.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setShowPopup(false);
        setShowButton(false);
        setTranslation('');
        window.getSelection().removeAllRanges();
    };

    return (
        <>
            {children}

            {/* Translate Button */}
            {showButton && (
                <div
                    ref={popupRef}
                    style={{
                        position: 'fixed',
                        left: `${buttonPosition.x}px`,
                        top: `${buttonPosition.y}px`,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 1000,
                    }}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                    <button
                        onClick={handleTranslate}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold text-sm hover:scale-105"
                    >
                        <Languages className="w-4 h-4" />
                        <span>Dịch</span>
                    </button>
                </div>
            )}

            {/* Translation Popup */}
            {showPopup && (
                <div
                    ref={popupRef}
                    style={{
                        position: 'fixed',
                        left: `${popupPosition.x}px`,
                        top: `${popupPosition.y}px`,
                        transform: 'translate(-50%, calc(-100% - 10px))',
                        zIndex: 1000,
                    }}
                    className="animate-in fade-in slide-in-from-bottom-5 duration-300"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-600 w-96 max-w-[90vw]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Languages className="w-5 h-5 text-white" />
                                <h3 className="text-white font-bold">Bản dịch</h3>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 max-h-80 overflow-y-auto">
                            {/* Original Text */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                                    Văn bản gốc
                                </p>
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-3">
                                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                                        {selectedText}
                                    </p>
                                </div>
                            </div>

                            {/* Translation */}
                            <div>
                                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2 uppercase">
                                    Bản dịch
                                </p>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader className="w-6 h-6 animate-spin text-purple-600" />
                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Đang dịch...</span>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border-l-4 border-purple-600">
                                        <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                                            {translation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickTranslator;
