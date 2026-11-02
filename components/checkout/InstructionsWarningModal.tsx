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
      panelClassName="w-full max-w-md rounded-3xl bg-ivory p-7 text-ink shadow-2xl"
    >
      <h3 className="text-xl font-extrabold">Before you place this order</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">
        If you added any special instructions (substitutions, extras, etc.), note that
        those aren&apos;t priced online — if one needs an extra charge, the restaurant will
        add it to your total when you pay at pickup.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 rounded-full border border-sand-line bg-white px-5 text-sm font-bold text-ink transition hover:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="min-h-11 rounded-full bg-ink px-5 text-sm font-bold text-on-ink transition hover:bg-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
        >
          Confirm and place order
        </button>
      </div>
    </Modal>
  );
}
