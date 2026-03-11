import {
  PhoneIcon,
  EmailIcon,
  FacebookIcon,
  SkipTheDishesIcon,
  TripAdvisorIcon,
  RestaurantGuruIcon,
} from "./ContactIcons";
import StoreHours from "./StoreHours";

export type ContactData = {
  address: { line1: string; city: string };
  phone: string;
  email: string;
  hours: readonly { days: string; time: string }[];
};

export type SocialLinks = {
  facebook: string;
  skipthedishes: string;
  tripadvisor: string;
  restaurantguru: string;
};

type ContactDetailsProps = {
  contact: ContactData;
  socialLinks: SocialLinks;
  googleMapsLink: string;
};

export default function ContactDetails({
  contact,
  socialLinks,
  googleMapsLink,
}: ContactDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          Address
        </p>
        <address className="mt-3 not-italic leading-relaxed text-stone-700">
          {contact.address.line1}
          <br />
          {contact.address.city}
        </address>
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-amber-700 underline-offset-4 hover:text-amber-800 hover:underline"
        >
          Open in Google Maps →
        </a>
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          Contact
        </p>
        <div className="mt-4 space-y-3">
          <a
            href={`tel:${contact.phone.replace(/\D/g, "")}`}
            className="flex items-center gap-3 text-stone-900 hover:text-amber-700"
          >
            <PhoneIcon className="h-5 w-5 shrink-0" />
            <span className="font-medium">{contact.phone}</span>
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 text-stone-900 hover:text-amber-700"
          >
            <EmailIcon className="h-5 w-5 shrink-0" />
            <span className="font-medium">{contact.email}</span>
          </a>
          <a
            href={socialLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-stone-900 hover:text-[#1877F2]"
          >
            <FacebookIcon className="h-5 w-5 shrink-0" />
            <span className="font-medium">Facebook</span>
          </a>
          <a
            href={socialLinks.skipthedishes}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-stone-900 hover:text-amber-700"
          >
            <SkipTheDishesIcon className="h-5 w-5 shrink-0" />
            <span className="font-medium">Skip the Dishes</span>
          </a>
          <a
            href={socialLinks.tripadvisor}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-stone-900 hover:text-emerald-600"
          >
            <TripAdvisorIcon className="h-5 w-5 shrink-0" />
            <span className="font-medium">TripAdvisor</span>
          </a>
          <a
            href={socialLinks.restaurantguru}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-stone-900 hover:text-amber-700"
          >
            <RestaurantGuruIcon className="h-5 w-5 shrink-0" />
            <span className="font-medium">Restaurant Guru</span>
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          Hours
        </p>
        <div className="mt-3">
          <StoreHours hours={contact.hours} />
        </div>
      </div>

      <a
        href={`tel:${contact.phone.replace(/\D/g, "")}`}
        className="inline-block w-full rounded-lg bg-amber-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-amber-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-50"
      >
        Call Us
      </a>
    </div>
  );
}
