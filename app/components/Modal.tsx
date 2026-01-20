"use client";

import React from "react";
import { useModal } from "../providers/ModalContext";

const Modal: React.FC = () => {
    const { isOpen, modalConfig, closeModal } = useModal();

    if (!isOpen || !modalConfig) return null;

    const { type = "info", title, message, onConfirm, onCancel, confirmText = "OK", cancelText = "Cancel", showCloseButton = true, showConfirmButton = true, showCancelButton = false, isDestructive = false, isLoading = false, children } = modalConfig;

    const typeStyles = {
        success: {
            bg: "bg-green-900/20",
            border: "border-green-500/30",
            icon: "✅",
            button: "bg-green-600 hover:bg-green-700",
            title: "text-green-400",
        },
        error: {
            bg: "bg-red-900/20",
            border: "border-red-500/30",
            icon: "❌",
            button: "bg-red-600 hover:bg-red-700",
            title: "text-red-400",
        },
        warning: {
            bg: "bg-yellow-900/20",
            border: "border-yellow-500/30",
            icon: "⚠️",
            button: "bg-yellow-600 hover:bg-yellow-700",
            title: "text-yellow-400",
        },
        info: {
            bg: "bg-blue-900/20",
            border: "border-blue-500/30",
            icon: "ℹ️",
            button: "bg-blue-600 hover:bg-blue-700",
            title: "text-blue-400",
        },
        confirm: {
            bg: isDestructive ? "bg-red-900/20" : "bg-blue-900/20",
            border: isDestructive ? "border-red-500/30" : "border-blue-500/30",
            icon: isDestructive ? "🗑️" : "❓",
            button: isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700",
            title: isDestructive ? "text-red-400" : "text-blue-400",
        },
    };

    const styles = typeStyles[type];

    const shouldShowCancel = type === "confirm" || showCancelButton;
    const shouldShowConfirm = showConfirmButton;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
            onCancel?.();
        }
    };

    const handleConfirm = async () => {
        if (onConfirm) {
            try {
                await onConfirm();
            } catch (error) {
                console.error("Modal confirmation error:", error);
            }
        }
        closeModal();
    };

    const handleCancel = () => {
        closeModal();
        onCancel?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleBackdropClick}>
            <div className={`w-full max-w-md mx-4 ${styles.bg} border ${styles.border} rounded-xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100`} onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{styles.icon}</span>
                            <h3 className={`text-xl font-bold ${styles.title}`}>{title}</h3>
                        </div>
                        {showCloseButton && (
                            <button onClick={handleCancel} className="text-gray-400 hover:text-white text-2xl leading-none" disabled={isLoading}>
                                &times;
                            </button>
                        )}
                    </div>

                    {/* Message */}
                    <p className="text-gray-300 mb-6 whitespace-pre-line">{message}</p>

                    {/* Custom Children Content */}
                    {children && <div className="mb-6">{children}</div>}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        {shouldShowCancel && (
                            <button onClick={handleCancel} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors" disabled={isLoading}>
                                {cancelText}
                            </button>
                        )}
                        {shouldShowConfirm && (
                            <button onClick={handleConfirm} className={`px-4 py-2 ${styles.button} text-white rounded-lg font-medium flex items-center gap-2 transition-colors`} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
