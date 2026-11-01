"use client";

import Modal from "@/components/ui/Modal";

type OrderingUnavailableModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function OrderingUnavailableModal({ open, onClose }: OrderingUnavailableModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel="Online ordering unavailable"
      panelClassName="w-full max-w-sm rounded-3xl bg-ivory p-7 text-center text-ink shadow-2xl"
    >
      <h4 className="text-lg font-extrabold">Online ordering currently unavailable</h4>
      <p className="mt-2 text-sm text-body">
        We&apos;re not accepting online orders right now. Please check back during our store
        hours.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 min-h-11 w-full rounded-full bg-ink px-5 text-sm font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        Close
      </button>
    </Modal>
  );
}
