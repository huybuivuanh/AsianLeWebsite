"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Shared dialog shell: overlay + click-outside-to-close + Escape-key-close.
 * Panel sizing/positioning varies a lot per use (centered detail modal, small
 * popup, image preview, side drawer) so callers own `panelClassName` in full;
 * `overlayClassName` defaults to the common centered-dialog case.
 */

const DEFAULT_OVERLAY_CLASSNAME =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  panelClassName: string;
  overlayClassName?: string;
  children: ReactNode;
};

export default function Modal({
  open,
  onClose,
  ariaLabel,
  panelClassName,
  overlayClassName = DEFAULT_OVERLAY_CLASSNAME,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={overlayClassName}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div className={panelClassName} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
