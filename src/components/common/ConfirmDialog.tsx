import React from "react";
import Modal from "./Modal";
import Icon from "./Icon";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
      <div className="text-center py-2">
        <div
          className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4"
          style={{
            background: isDestructive ? "rgba(181, 71, 31, 0.12)" : "var(--secondary)",
            color: isDestructive ? "var(--primary)" : "var(--brown)",
          }}
        >
          <Icon name={isDestructive ? "alert" : "badgeCheck"} size={26} />
        </div>
        <h3 className="font-serif text-xl font-bold" style={{ color: "var(--brown)" }}>
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {message}
        </p>

        <div className="mt-6 flex items-center gap-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-full border border-border text-sm font-semibold hover:bg-muted transition-colors"
            style={{ color: "var(--brown)" }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-full text-sm font-semibold shadow-sm transition-transform hover:scale-[1.02]"
            style={{
              background: isDestructive ? "#b5471f" : "var(--primary)",
              color: "#fff",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
