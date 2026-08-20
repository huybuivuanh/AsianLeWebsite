"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const noopSubscribe = () => () => {};
/** True only once mounted on the client — lets us defer portal rendering past SSR/hydration
 * without a setState-in-effect (document.body doesn't exist on the server). */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Shared dialog shell: overlay + click-outside-to-close + Escape-key-close.
 * Panel sizing/positioning varies a lot per use (centered detail modal, small
 * popup, image preview, side drawer) so callers own `panelClassName` in full;
 * `overlayClassName` defaults to the common centered-dialog case.
 *
 * Rendered via a portal to document.body — some callers (e.g. the FloatingOrderBar,
 * which uses backdrop-blur) establish a new containing block for fixed-position
 * descendants, which would otherwise scope this modal's `fixed inset-0` overlay to
 * that ancestor instead of the viewport.
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
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
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
    </div>,
    document.body,
  );
}
