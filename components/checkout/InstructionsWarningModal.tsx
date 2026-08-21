import Modal from "@/components/ui/Modal";

type InstructionsWarningModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** One extra confirmation step before placing the order — mainly to flag that free-text
 * special instructions (substitutions, extras) aren't priced anywhere in this flow, so any
 * extra charge they need gets added at pickup instead of showing in this total. */
export default function InstructionsWarningModal({
  open,
  onConfirm,
  onCancel,
}: InstructionsWarningModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      ariaLabel="Confirm your order"
      panelClassName="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
    >
      <h3 className="text-lg font-bold text-stone-900">Before you place this order</h3>
      <p className="mt-2 text-sm text-stone-600">
        If you added any special instructions (substitutions, extras, etc.), note that
        those aren&apos;t priced online — if one needs an extra charge, the restaurant will
        add it to your total when you pay at pickup.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border-2 border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        >
          Confirm and place order
        </button>
      </div>
    </Modal>
  );
}
