"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ModalType = "success" | "error" | "warning" | "info" | "confirm";

interface ModalConfig {
    type: ModalType;
    title: string;
    message: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCloseButton?: boolean;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    isDestructive?: boolean;
    isLoading?: boolean;
    children?: ReactNode;
}

interface ModalContextType {
    openModal: (config: ModalConfig) => void;
    closeModal: () => void;
    isOpen: boolean;
    modalConfig: ModalConfig | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

interface ModalProviderProps {
    children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

    const openModal = (config: ModalConfig) => {
        setModalConfig(config);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setTimeout(() => {
            setModalConfig(null);
        }, 300);
    };

    return <ModalContext.Provider value={{ openModal, closeModal, isOpen, modalConfig }}>{children}</ModalContext.Provider>;
};
