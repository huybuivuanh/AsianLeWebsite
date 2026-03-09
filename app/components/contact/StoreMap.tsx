type StoreMapProps = {
  embedSrc: string;
  title?: string;
  className?: string;
  /** "4/3" | "video" | "responsive" (4/3 on mobile, video on lg+) */
  aspect?: "4/3" | "video" | "responsive";
};

const aspectClasses: Record<NonNullable<StoreMapProps["aspect"]>, string> = {
  "4/3": "aspect-[4/3]",
  video: "aspect-video",
  responsive: "aspect-[4/3] lg:aspect-video",
};

export default function StoreMap({
  embedSrc,
  title = "Asian Le Restaurant location",
  className = "",
  aspect = "4/3",
}: StoreMapProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100 ${aspectClasses[aspect]} ${className}`}
    >
      <iframe
        src={embedSrc}
        width="600"
        height="450"
        style={{ border: "0" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
