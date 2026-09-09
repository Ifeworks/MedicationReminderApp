import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "./Icon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  showCloseButton?: boolean;
}

const MAX_WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "lg",
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(43, 28, 20, 0.65)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className={`bg-card w-full ${MAX_WIDTHS[maxWidth]} rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[85vh] flex flex-col my-auto`}
        onClick={e => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4 flex-shrink-0 bg-background/50">
            <div>
              {title && (
                <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  {subtitle}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                style={{ color: "var(--brown)" }}
                aria-label="Close modal"
              >
                <Icon name="close" size={18} />
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;