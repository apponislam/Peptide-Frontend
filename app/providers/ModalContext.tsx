// "use client";

// import React, { createContext, useContext, useState, ReactNode } from "react";

// export type ModalType = "success" | "error" | "warning" | "info" | "confirm";

// interface ModalConfig {
//     type: ModalType;
//     title: string;
//     message: string;
//     onConfirm?: () => void | Promise<void>;
//     onCancel?: () => void;
//     confirmText?: string;
//     cancelText?: string;
//     showCloseButton?: boolean;
//     showConfirmButton?: boolean;
//     showCancelButton?: boolean;
//     isDestructive?: boolean;
//     isLoading?: boolean;
//     children?: ReactNode;
// }

// interface ModalContextType {
//     openModal: (config: ModalConfig) => void;
//     closeModal: () => void;
//     isOpen: boolean;
//     modalConfig: ModalConfig | null;
// }

// const ModalContext = createContext<ModalContextType | undefined>(undefined);

// export const useModal = () => {
//     const context = useContext(ModalContext);
//     if (!context) {
//         throw new Error("useModal must be used within a ModalProvider");
//     }
//     return context;
// };

// interface ModalProviderProps {
//     children: ReactNode;
// }

// export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

//     const openModal = (config: ModalConfig) => {
//         setModalConfig(config);
//         setIsOpen(true);
//     };

//     const closeModal = () => {
//         setIsOpen(false);
//         setTimeout(() => {
//             setModalConfig(null);
//         }, 300);
//     };

//     return <ModalContext.Provider value={{ openModal, closeModal, isOpen, modalConfig }}>{children}</ModalContext.Provider>;
// };

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ModalType = "success" | "error" | "warning" | "info" | "confirm";

interface ModalConfig {
    type: ModalType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
    children?: ReactNode;
}

interface ModalContextType {
    showModal: (config: ModalConfig) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within a ModalProvider");
    return context;
};

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const showModal = (config: ModalConfig) => {
        setModalConfig(config);
        return new Promise<boolean>((resolve) => setResolvePromise(() => resolve));
    };

    const handleConfirm = () => {
        resolvePromise?.(true);
        setModalConfig(null);
        setResolvePromise(null);
    };

    const handleCancel = () => {
        resolvePromise?.(false);
        setModalConfig(null);
        setResolvePromise(null);
    };

    if (!modalConfig) return <ModalContext.Provider value={{ showModal }}>{children}</ModalContext.Provider>;

    const { type, title, message, confirmText = "OK", cancelText = "Cancel", isDestructive = false, children: customChildren } = modalConfig;

    const typeStyles = {
        success: { bg: "bg-green-900/20", border: "border-green-500/30", icon: "✅", button: "bg-green-600 hover:bg-green-700", title: "text-green-400" },
        error: { bg: "bg-red-900/20", border: "border-red-500/30", icon: "❌", button: "bg-red-600 hover:bg-red-700", title: "text-red-400" },
        warning: { bg: "bg-yellow-900/20", border: "border-yellow-500/30", icon: "⚠️", button: "bg-yellow-600 hover:bg-yellow-700", title: "text-yellow-400" },
        info: { bg: "bg-blue-900/20", border: "border-blue-500/30", icon: "ℹ️", button: "bg-blue-600 hover:bg-blue-700", title: "text-blue-400" },
        confirm: {
            bg: isDestructive ? "bg-red-900/20" : "bg-blue-900/20",
            border: isDestructive ? "border-red-500/30" : "border-blue-500/30",
            icon: isDestructive ? "🗑️" : "❓",
            button: isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700",
            title: isDestructive ? "text-red-400" : "text-blue-400",
        },
    };

    const styles = typeStyles[type];

    return (
        <ModalContext.Provider value={{ showModal }}>
            {children}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className={`w-full max-w-md mx-4 ${styles.bg} border ${styles.border} rounded-xl shadow-2xl transform transition-all duration-300 scale-100 opacity-100`}>
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{styles.icon}</span>
                                <h3 className={`text-xl font-bold ${styles.title}`}>{title}</h3>
                            </div>
                        </div>

                        {/* Message */}
                        <p className="text-gray-300 mb-6 whitespace-pre-line">{message}</p>

                        {/* Custom Children */}
                        {customChildren && <div className="mb-6">{customChildren}</div>}

                        {/* Buttons */}
                        <div className="flex justify-end gap-3">
                            {type === "confirm" && (
                                <button onClick={handleCancel} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors">
                                    {cancelText}
                                </button>
                            )}
                            <button onClick={handleConfirm} className={`px-4 py-2 ${styles.button} text-white rounded-lg font-medium flex items-center gap-2 transition-colors`}>
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ModalContext.Provider>
    );
};
