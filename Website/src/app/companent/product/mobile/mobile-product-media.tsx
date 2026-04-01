import Image from "next/image";

type MobileProductMediaProps = {
  image: string;
  title: string;
};

export default function MobileProductMedia({
  image,
  title,
}: MobileProductMediaProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-[24px] bg-[#f8f1f4]">
      <Image
        src={image}
        alt={title}
        width={640}
        height={520}
        className="h-[clamp(236px,33svh,310px)] w-full object-cover object-center"
        priority={false}
        unoptimized
      />
    </div>
  );
}
