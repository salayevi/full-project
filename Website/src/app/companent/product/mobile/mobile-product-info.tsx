type MobileProductInfoProps = {
  title: string;
  eyebrow: string;
  promo?: string;
  description: string;
  textColor: string;
  subtextColor: string;
  accentColor: string;
};

export default function MobileProductInfo({
  title,
  eyebrow,
  promo,
  description,
  textColor,
  subtextColor,
  accentColor,
}: MobileProductInfoProps) {
  return (
    <div className="space-y-3 text-left">
      <h3
        className="text-[clamp(28px,8vw,40px)] font-semibold leading-[0.96] tracking-[-0.045em]"
        style={{ color: textColor }}
      >
        {title}
      </h3>

      {eyebrow ? (
        <p
          className="text-[clamp(14px,4vw,18px)] font-medium leading-[1.25]"
          style={{ color: subtextColor }}
        >
          {eyebrow}
        </p>
      ) : null}

      {promo ? (
        <p
          className="text-[clamp(12px,3.6vw,14px)] font-semibold tracking-[0.01em]"
          style={{ color: accentColor }}
        >
          {promo}
        </p>
      ) : null}

      <p
        className="max-w-[30ch] text-[clamp(15px,4.2vw,18px)] leading-[1.45]"
        style={{ color: textColor }}
      >
        {description}
      </p>
    </div>
  );
}