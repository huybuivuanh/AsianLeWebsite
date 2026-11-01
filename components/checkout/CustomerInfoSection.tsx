import {
  extractTenDigitPhone,
  extractTenDigitPhoneFromPaste,
  formatPhoneInput,
} from "@/lib/utils";

type CustomerInfoSectionProps = {
  name: string;
  setName: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-sand-line bg-ivory/40 px-4 py-3 text-base font-normal text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10";

/** Name / phone / email — shared by checkout and reservations. */
export default function CustomerInfoSection({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
}: CustomerInfoSectionProps) {
  return (
    <fieldset className="rounded-3xl border border-sand-line bg-white p-6 sm:p-8">
      <legend className="sr-only">Your info</legend>
      <p aria-hidden className="text-xl font-extrabold">
        Your info
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-bold">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-bold">
          Phone
          <input
            value={formatPhoneInput(phone)}
            onChange={(e) => setPhone(extractTenDigitPhone(e.target.value))}
            onPaste={(e) => {
              e.preventDefault();
              setPhone(extractTenDigitPhoneFromPaste(e.clipboardData.getData("text")));
            }}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="+1 (000) 000-0000"
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-bold sm:col-span-2">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            autoComplete="email"
            className={inputClass}
          />
        </label>
      </div>
    </fieldset>
  );
}
