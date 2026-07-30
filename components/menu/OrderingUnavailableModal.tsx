"use client";

import Modal from "@/components/ui/Modal";

type OrderingUnavailableModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function OrderingUnavailableModal({
  open,
  onClose,
}: OrderingUnavailableModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel="Online ordering unavailable"
      panelClassName="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
    >
      <h4 className="text-lg font-bold text-stone-900">
        Online ordering currently unavailable
      </h4>
      <p className="mt-2 text-sm text-stone-600">
        We&apos;re not accepting online orders right now. Please check back
        during our store hours.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      >
        Close
      </button>
    </Modal>
  );
}
