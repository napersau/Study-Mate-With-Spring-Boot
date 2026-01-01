import React, { useState, useRef, useEffect } from 'react';
import { Languages, X, ArrowRight, Copy, Check } from 'lucide-react';
import aiService from '../../service/aiService';

const TranslateWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef(null);

    // Auto focus when opened
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    // Reset copied state after 2 seconds
    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    const handleTranslate = async () => {
        if (!sourceText.trim() || isTranslating) return;

        setIsTranslating(true);
        try {
            const response = await aiService.translateText(sourceText);
            setTranslatedText(response);
        } catch (error) {
            console.error('Translation error:', error);
            setTranslatedText('Xin lỗi, đã có lỗi xảy ra khi dịch văn bản.');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleCopy = () => {
        if (translatedText) {
            navigator.clipboard.writeText(translatedText);
            setCopied(true);
        }
    };

    const handleClear = () => {
        setSourceText('');
        setTranslatedText('');
        setCopied(false);
    };

    return (
        <div className="fixed bottom-28 right-6 z-50">
            {/* Translate Box */}
            {isOpen && (
                <div className="mb-4 w-[480px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Languages className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">Dịch nhanh</h3>
                                <p className="text-white/80 text-xs">Dịch sang tiếng Việt</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Source Text */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <span>Văn bản gốc</span>
                                {sourceText && (
                                    <button
                                        onClick={handleClear}
                                        className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        Xóa
                                    </button>
                                )}
                            </label>
                            <textarea
                                ref={textareaRef}
                                value={sourceText}
                                onChange={(e) => setSourceText(e.target.value)}
                                placeholder="Nhập văn bản cần dịch..."
                                rows="4"
                                className="w-full p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:border-green-500 dark:bg-gray-700 dark:text-white transition-colors"
                            />
                        </div>

                        {/* Translate Button */}
                        <button
                            onClick={handleTranslate}
                            disabled={!sourceText.trim() || isTranslating}
                            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isTranslating ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Đang dịch...</span>
                                </>
                            ) : (
                                <>
                                    <Languages className="w-5 h-5" />
                                    <span>Dịch ngay</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Translated Text */}
                        {translatedText && (
                            <div className="space-y-2 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Bản dịch
                                    </label>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>Đã sao chép!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>Sao chép</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 border-2 border-green-200 dark:border-green-800 rounded-xl">
                                    <p className="text-sm text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap">
                                        {translatedText}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white w-[72px] h-[72px] rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
                    title="Dịch nhanh"
                >
                    <Languages className="w-7 h-7 group-hover:scale-110 transition-transform" />
                </button>
            )}
        </div>
    );
};

export default TranslateWidget;
