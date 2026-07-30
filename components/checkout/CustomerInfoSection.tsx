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

export default function CustomerInfoSection({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
}: CustomerInfoSectionProps) {
  return (
    <fieldset className="rounded-xl border border-stone-200 p-5">
      <legend className="px-1 font-semibold text-stone-900">Your info</legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm text-stone-700 sm:col-span-1">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
          />
        </label>
        <label className="block text-sm text-stone-700 sm:col-span-1">
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
            placeholder="+1 (000) 000-0000"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
          />
        </label>
        <label className="block text-sm text-stone-700 sm:col-span-2">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900"
          />
        </label>
      </div>
    </fieldset>
  );
}
